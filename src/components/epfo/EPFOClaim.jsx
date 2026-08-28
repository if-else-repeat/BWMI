import React, { useState, useEffect } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { db, saveDraft, getDraft, clearDraft, enqueueOfflinePayload, logAuditEvent } from '../../db/dexie';
import { t } from './i18n';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Fingerprint, RefreshCw, WifiOff, Wifi, CreditCard, FileText, RotateCcw, Printer, Zap } from 'lucide-react';
import PrintReceiptModal from '../PrintReceiptModal';

const ADVANCE_REASONS = [
  { id: '68J_MEDICAL', label: 'Illness / Medical Treatment (Para 68J)', maxLimit: 75000, eligibility: 'No minimum service • Self-declaration', fastTrack: true },
  { id: '68B_HOUSING', label: 'Purchase/Construction of House (Para 68B)', maxLimit: 125000, eligibility: '5+ years service • Up to 90% balance', fastTrack: false },
  { id: '68K_EDUCATION', label: 'Higher Education of Children (Para 68K)', maxLimit: 49200, eligibility: '7+ years service • Up to 50% employee share', fastTrack: false },
  { id: 'SPECIAL_RELIEF', label: 'Special Calamity / Non-Refundable Advance', maxLimit: 73800, eligibility: 'Zero documentation • 48-hr credit', fastTrack: true }
];

export default function EPFOClaim({ activeUser, lang, currentUan }) {
  const { isOnline, addToast } = useNetwork();
  
  const [formData, setFormData] = useState({
    uan: currentUan || '',
    name: activeUser?.name || '',
    memberId: activeUser?.epfNumber || '',
    reason: '',
    amount: '',
    bankAccountNumber: activeUser?.bankAccount?.accountNumber || '',
    ifsc: activeUser?.bankAccount?.ifsc || '',
    agreeDeclaration: false
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [offlineAlert, setOfflineAlert] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  const empShare = activeUser?.employeeShare || 0;
  const employerShare = activeUser?.employerShare || 0;
  const totalBalance = activeUser?.totalPfBalance || (empShare + employerShare);

  useEffect(() => {
    async function loadDraft() {
      try {
        const draft = await getDraft('EPFO_FORM_31', currentUan);
        if (draft && draft.formData) {
          setFormData(draft.formData);
          setCurrentStep(draft.step || 1);
        }
      } catch (err) {
        console.error("Failed to load draft:", err);
      }
    }
    if (currentUan) {
      loadDraft();
    }
  }, [currentUan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: val };
      saveDraft('EPFO_FORM_31', updated, currentStep, currentUan);
      setLastSavedTime(new Date().toLocaleTimeString());
      return updated;
    });
    setValidationError('');
  };

  const handleNext = () => {
    setCurrentStep(prev => {
      const nextStep = prev + 1;
      saveDraft('EPFO_FORM_31', formData, nextStep, currentUan);
      setLastSavedTime(new Date().toLocaleTimeString());
      return nextStep;
    });
    setValidationError('');
  };

  const handleBack = () => {
    setCurrentStep(prev => {
      const nextStep = prev - 1;
      saveDraft('EPFO_FORM_31', formData, nextStep, currentUan);
      setLastSavedTime(new Date().toLocaleTimeString());
      return nextStep;
    });
    setValidationError('');
  };

  const handleSubmit = async () => {
    setValidationError('');
    
    // Validation
    const amountVal = parseFloat(formData.amount);
    if (!formData.reason) {
      setValidationError('Please select an advance reason.');
      return;
    }
    if (isNaN(amountVal) || amountVal <= 0) {
      setValidationError('Please enter a valid amount.');
      return;
    }
    
    const selectedReason = ADVANCE_REASONS.find(r => r.id === formData.reason);
    if (selectedReason && amountVal > selectedReason.maxLimit) {
      setValidationError(`Amount exceeds the maximum limit for this reason (₹${selectedReason.maxLimit}).`);
      return;
    }
    if (amountVal > totalBalance) {
      setValidationError('Amount exceeds available balance.');
      return;
    }
    if (!formData.agreeDeclaration) {
      setValidationError('You must agree to the self-declaration.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isOnline) {
        // ONLINE SUBMISSION
        const ackNumber = `EPFO-2026-PF-${Math.floor(100000 + Math.random() * 900000)}`;
        const receiptHash = `SHA256-${Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        
        const record = {
          id: Date.now().toString(),
          type: 'EPFO_FORM_31',
          uan: currentUan,
          payload: formData,
          status: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          ackNumber,
          receiptHash
        };
        
        await db.submissions.add(record);
        await clearDraft('EPFO_FORM_31', currentUan);
        await logAuditEvent('CLAIM_SUBMITTED_ONLINE', { ackNumber, amount: formData.amount, userUan: currentUan }, 'ONLINE');
        
        setSubmissionSuccess(record);
        addToast({ type: 'success', title: 'CLAIM SUBMITTED', message: `Acknowledgement: ${ackNumber}` });
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        
      } else {
        // OFFLINE SUBMISSION
        const queueResult = await enqueueOfflinePayload('EPFO_FORM_31', formData, currentUan);
        
        setOfflineAlert({ referenceId: queueResult.referenceId });
        addToast({ type: 'warning', title: 'SERVER UNREACHABLE', message: 'Claim queued to IndexedDB. Will auto-sync when online.' });
      }
    } catch (err) {
      console.error(err);
      setValidationError('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      uan: currentUan || '',
      name: activeUser?.name || '',
      memberId: activeUser?.epfNumber || '',
      reason: '',
      amount: '',
      bankAccountNumber: activeUser?.bankAccount?.accountNumber || '',
      ifsc: activeUser?.bankAccount?.ifsc || '',
      agreeDeclaration: false
    });
    setCurrentStep(1);
    setSubmissionSuccess(null);
    setOfflineAlert(null);
    setLastSavedTime(null);
    clearDraft('EPFO_FORM_31', currentUan);
  };

  if (submissionSuccess) {
    return (
      <div className="brutal-card bg-white p-6 md:p-8 brutal-border-l-4 border-l-green-600">
        <div className="flex items-center gap-4 mb-6 text-green-700">
          <CheckCircle2 className="h-12 w-12" />
          <div>
            <h2 className="text-2xl font-bold font-serif text-gray-900">Claim Submitted Successfully</h2>
            <p className="text-sm opacity-90 mt-1">Form 31 Advance Claim</p>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 border border-green-200 brutal-border mb-6">
          <p className="text-sm text-gray-600 mb-1">Acknowledgement Tracking ID:</p>
          <p className="text-xl font-mono font-bold text-gray-900">{submissionSuccess.ackNumber}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Claim Amount</p>
            <p className="font-bold text-lg">₹{parseFloat(formData.amount).toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Bank Account</p>
            <p className="font-bold text-lg">XXXXX{String(formData.bankAccountNumber).slice(-4)}</p>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Verification Method</p>
            <p className="font-bold text-lg flex items-center gap-2"><Fingerprint className="h-4 w-4" /> WebAuthn Passkey</p>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Est. Settlement Time</p>
            <p className="font-bold text-lg text-teal-700">48-72 Hours</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => setShowPrintModal(true)} className="brutal-btn bg-teal-700 text-white flex items-center justify-center gap-2">
            <Printer className="h-5 w-5" /> View & Print Receipt
          </button>
          <button onClick={resetForm} className="brutal-btn bg-gray-200 text-gray-800 flex items-center justify-center gap-2">
            <RotateCcw className="h-5 w-5" /> File Another Claim
          </button>
        </div>
        
        {showPrintModal && (
          <PrintReceiptModal 
            record={submissionSuccess} 
            onClose={() => setShowPrintModal(false)} 
          />
        )}
      </div>
    );
  }

  if (offlineAlert) {
    return (
      <div className="brutal-card bg-amber-50 p-6 md:p-8 brutal-border-l-4 border-l-amber-600">
        <div className="flex items-start gap-4 mb-4">
          <AlertTriangle className="h-8 w-8 text-amber-600 shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Network Disconnected: Claim Queued</h2>
            <p className="text-gray-700 mb-4">
              Your device is currently offline or the server is unreachable (simulating a 504 Gateway Timeout).
              Your Form 31 claim has been securely saved in IndexedDB and will be submitted automatically when the network is restored.
            </p>
            
            <div className="bg-white p-4 border border-amber-200 brutal-border inline-block">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Local Reference ID</p>
              <p className="font-mono font-bold text-gray-900">{offlineAlert.referenceId}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-amber-200">
          <button onClick={resetForm} className="text-amber-800 font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const selectedReasonData = ADVANCE_REASONS.find(r => r.id === formData.reason);

  return (
    <div className="brutal-card bg-white brutal-shadow">
      {/* Header and Step Indicator */}
      <div className="border-b-2 border-gray-900">
        <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#048282]">Online Claim (Form 31)</h1>
            <p className="text-sm text-gray-600 mt-1">PF Advance / Non-Refundable Withdrawal</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center text-xs text-gray-500 bg-white px-3 py-1.5 border border-gray-300">
            {lastSavedTime ? (
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Draft saved at {lastSavedTime}</span>
            ) : (
              <span className="flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Auto-saving...</span>
            )}
          </div>
        </div>
        
        <div className="flex text-sm font-semibold divide-x-2 divide-gray-900 border-t-2 border-gray-900">
          <div className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${currentStep === 1 ? 'bg-gray-900 text-white' : currentStep > 1 ? 'bg-green-50 text-green-700' : 'bg-white text-gray-500'}`}>
            <span className="hidden sm:inline">STEP</span> 01 {currentStep > 1 && <CheckCircle2 className="h-4 w-4 ml-1" />}
          </div>
          <div className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${currentStep === 2 ? 'bg-gray-900 text-white' : currentStep > 2 ? 'bg-green-50 text-green-700' : 'bg-white text-gray-500'}`}>
            <span className="hidden sm:inline">STEP</span> 02 {currentStep > 2 && <CheckCircle2 className="h-4 w-4 ml-1" />}
          </div>
          <div className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${currentStep === 3 ? 'bg-gray-900 text-white' : 'bg-white text-gray-500'}`}>
            <span className="hidden sm:inline">STEP</span> 03
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8">
        
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4 text-[#C1622D]">Member Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">UAN</label>
                <div className="font-mono bg-gray-50 p-2 border border-gray-200">{formData.uan}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Member Name</label>
                <div className="bg-gray-50 p-2 border border-gray-200">{formData.name}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">Father's / Husband's Name</label>
                <div className="bg-gray-50 p-2 border border-gray-200">{activeUser?.fatherName || 'Not Available'}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-semibold mb-1">DOB & Gender</label>
                <div className="bg-gray-50 p-2 border border-gray-200">{activeUser?.dob || '01-01-1990'} • {activeUser?.gender || 'M'}</div>
              </div>
            </div>

            <h2 className="text-lg font-bold border-b border-gray-200 pb-2 mt-8 mb-4 text-[#C1622D]">Service & Balance Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Employee Share</p>
                <p className="text-xl font-bold font-mono">₹{empShare.toLocaleString('en-IN')}</p>
              </div>
              <div className="border border-gray-200 p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Employer Share</p>
                <p className="text-xl font-bold font-mono">₹{employerShare.toLocaleString('en-IN')}</p>
              </div>
              <div className="border border-teal-200 p-4 bg-teal-50 brutal-shadow">
                <p className="text-xs text-teal-800 font-semibold mb-1">Total Available Balance</p>
                <p className="text-2xl font-bold font-mono text-teal-900">₹{totalBalance.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button onClick={handleNext} className="brutal-btn bg-teal-700 text-white flex items-center gap-2">
                Proceed <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4 text-[#C1622D]">Purpose of Advance</h2>
            
            <div className="space-y-3">
              {ADVANCE_REASONS.map(reason => (
                <label key={reason.id} className={`flex items-start p-4 border-2 cursor-pointer transition-colors ${formData.reason === reason.id ? 'border-teal-700 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={formData.reason === reason.id}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="font-bold text-gray-900">{reason.label}</span>
                      {reason.fastTrack && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-300 w-max">
                          <Zap className="h-3 w-3" /> Auto-Settlement
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600">{reason.eligibility}</span>
                      <span className="text-gray-400 hidden sm:inline">•</span>
                      <span className="font-semibold text-teal-800">Max Limit: ₹{reason.maxLimit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {formData.reason && (
              <div className="mt-8 p-6 bg-gray-50 border border-gray-200">
                <label className="block text-sm font-bold text-gray-900 mb-2">Advance Amount Required (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="w-full p-3 border-2 border-gray-400 focus:border-teal-700 focus:ring-0 font-mono text-lg"
                />
                <p className="mt-2 text-xs text-gray-600">
                  Must not exceed Max Limit (₹{selectedReasonData?.maxLimit.toLocaleString('en-IN')}) or Total Balance (₹{totalBalance.toLocaleString('en-IN')}).
                </p>
              </div>
            )}

            <h2 className="text-lg font-bold border-b border-gray-200 pb-2 mt-8 mb-4 text-[#C1622D]">Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Account Number</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-400 focus:border-teal-700 focus:ring-0 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">IFSC</label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-gray-400 focus:border-teal-700 focus:ring-0 font-mono uppercase"
                />
              </div>
            </div>
            
            {validationError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold mt-4">
                {validationError}
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button onClick={handleBack} className="brutal-btn bg-white border-2 border-gray-900 text-gray-900 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button 
                onClick={handleNext} 
                disabled={!formData.reason || !formData.amount}
                className="brutal-btn bg-teal-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Claim <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-gray-200 pb-2 mb-4 text-[#C1622D]">Review Claim Summary</h2>
            
            <div className="bg-white border-2 border-gray-900 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <th className="py-3 px-4 bg-gray-50 text-sm font-semibold text-gray-600 w-1/3 border-r border-gray-200">UAN</th>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{formData.uan}</td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 bg-gray-50 text-sm font-semibold text-gray-600 border-r border-gray-200">Advance Reason</th>
                    <td className="py-3 px-4 font-bold text-gray-900">{selectedReasonData?.label}</td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 bg-gray-50 text-sm font-semibold text-gray-600 border-r border-gray-200">Amount Requested</th>
                    <td className="py-3 px-4 font-mono font-bold text-teal-800 text-lg">₹{parseFloat(formData.amount || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 bg-gray-50 text-sm font-semibold text-gray-600 border-r border-gray-200">Bank Account</th>
                    <td className="py-3 px-4 font-mono text-gray-900">{formData.bankAccountNumber} (IFSC: {formData.ifsc})</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 p-4 border border-green-200 flex items-center gap-3 mt-4">
              <div className="bg-white p-2 rounded-full shadow-sm"><Fingerprint className="h-5 w-5 text-green-700" /></div>
              <div>
                <p className="font-bold text-green-800 text-sm">Passkey Device Verification</p>
                <p className="text-xs text-green-700">Authenticated via WebAuthn on this device.</p>
              </div>
            </div>

            <label className="flex items-start gap-3 mt-6 p-4 border border-gray-200 bg-gray-50 cursor-pointer">
              <input 
                type="checkbox" 
                name="agreeDeclaration"
                checked={formData.agreeDeclaration}
                onChange={handleChange}
                className="mt-1 h-5 w-5 text-teal-700 border-gray-400 focus:ring-teal-700"
              />
              <span className="text-sm text-gray-800 leading-relaxed">
                I hereby declare that the particulars given above are true and correct. I consent to seed my Aadhaar for e-KYC authentication. 
                I understand that submitting false information may attract penal action.
              </span>
            </label>
            
            {validationError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold">
                {validationError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-4">
              <button onClick={handleBack} className="brutal-btn bg-white border-2 border-gray-900 text-gray-900 flex items-center gap-2 w-full sm:w-auto justify-center">
                <ArrowLeft className="h-4 w-4" /> Edit Details
              </button>
              
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className={`brutal-btn flex items-center gap-2 w-full sm:w-auto justify-center text-white ${isOnline ? 'bg-green-700 hover:bg-green-800' : 'bg-amber-600 hover:bg-amber-700'} ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : isOnline ? (
                  <><CheckCircle2 className="h-5 w-5" /> Submit Claim (Online)</>
                ) : (
                  <><WifiOff className="h-5 w-5" /> Submit (Queue to IndexedDB)</>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
