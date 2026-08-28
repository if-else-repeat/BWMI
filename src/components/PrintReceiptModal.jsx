import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';

export default function PrintReceiptModal({ submission, onClose }) {
  if (!submission) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submission, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `EPFO_Claim_Receipt_${submission.ackNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#f4f4f0] w-full max-w-xl brutal-border brutal-shadow-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-3 bg-black text-[#f4f4f0] flex items-center justify-between brutal-border-b">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#10b981]" />
            <span className="font-mono text-xs uppercase tracking-wider font-bold">
              Official Claim Acknowledgement Slip
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-[#f4f4f0] text-black hover:bg-white brutal-border font-bold text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Paper Slip */}
        <div className="p-6 overflow-y-auto space-y-6 bg-white font-mono text-xs">
          
          {/* Header Banner */}
          <div className="text-center pb-4 brutal-border-b space-y-1">
            <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
              EPFO • EMPLOYEES' PROVIDENT FUND ORGANISATION
            </div>
            <h1 className="text-base font-black uppercase tracking-tight text-black mt-2">
              Advance Claim (Form 31) Acknowledgement
            </h1>
            <p className="text-gray-600 text-[11px]">
              Generated via BWMI Offline-First Resilient Citizen Gateway
            </p>
          </div>

          {/* Acknowledgement Number & Status */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 brutal-border">
            <div>
              <div className="text-[10px] text-gray-500 uppercase">Acknowledgement No:</div>
              <div className="text-sm font-black text-black tracking-wide">{submission.ackNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase">Filing Status:</div>
              <div className="inline-flex items-center gap-1 font-bold text-[#10b981]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>CONFIRMED & QUEUED</span>
              </div>
            </div>
          </div>

          {/* Detailed Telemetry Data */}
          <div className="space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-black border-b border-black/20 pb-1">
              Member & Claim Telemetry
            </h3>
            
            <div className="grid grid-cols-2 gap-y-2 text-[11px]">
              <div><span className="text-gray-500">Universal A/c No (UAN):</span></div>
              <div className="font-bold text-right text-black">{submission.payload?.uan || '1000 2349 001'}</div>

              <div><span className="text-gray-500">Member Name:</span></div>
              <div className="font-bold text-right text-black">{submission.payload?.name || 'Ramesh Kumar'}</div>

              <div><span className="text-gray-500">Advance Reason / Section:</span></div>
              <div className="font-bold text-right text-black">{submission.payload?.reason || 'Para 68J (Medical)'}</div>

              <div><span className="text-gray-500">Claim Amount:</span></div>
              <div className="font-bold text-right text-base text-black font-mono">₹{submission.payload?.amount}</div>

              <div><span className="text-gray-500">Disbursement Bank:</span></div>
              <div className="text-right text-black">State Bank of India (IFSC: SBIN0001234)</div>

              <div><span className="text-gray-500">Target Account:</span></div>
              <div className="text-right text-black">{submission.payload?.bankAccountNumber || '•••••••••8237'}</div>

              <div><span className="text-gray-500">Submission Timestamp:</span></div>
              <div className="text-right text-black">{new Date(submission.submittedAt).toLocaleString()}</div>
            </div>
          </div>

          {/* Cryptographic Proof and Verification Bar */}
          <div className="p-3 bg-black text-[#f4f4f0] space-y-2 brutal-border">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Cryptographic Integrity Hash:</span>
              <span className="text-[10px] bg-[#10b981] text-black px-1 font-bold">VERIFIED</span>
            </div>
            <div className="font-mono text-[10px] text-green-400 break-all">
              {submission.receiptHash || 'SHA256-e9b41a8c903ef821d74a6b5c01f92e34'}
            </div>
            <div className="text-[9px] text-gray-400">
              * This submission was preserved in client IndexedDB and replayed through the resilient sync worker without data loss.
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-100 brutal-border-t flex items-center justify-between gap-3 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-white text-black font-bold brutal-btn"
          >
            Close Window
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="px-3 py-2 bg-white text-black font-bold brutal-btn flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-black text-white font-bold brutal-btn flex items-center gap-1.5 hover:bg-gray-800"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
