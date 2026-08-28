import usePersistentState from "../hooks/usePersistentState";
import React, { useState, useEffect } from "react";
import { useNetwork } from "../context/NetworkContext";
import {
  saveDraft,
  getDraft,
  clearDraft,
  enqueueOfflinePayload,
  logAuditEvent,
  SYNTHETIC_USERS,
  DEFAULT_USER_UAN,
} from "../db/dexie";
import {
  Building2,
  Car,
  FileSpreadsheet,
  ShoppingBag,
  CheckCircle2,
  Database,
  ShieldCheck,
  Wifi,
  WifiOff,
  ArrowRight,
  LogOut,
  Globe,
  Fingerprint,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";

const DEPARTMENTS = [
  {
    id: "INCOME_TAX",
    name: "Income Tax Department",
    ministry: "Central Board of Direct Taxes",
    color: "#1e3a8a", // Blue
    accent: "#3b82f6",
    icon: FileSpreadsheet,
    service: "e-Filing Grievance Redressal",
    code: "CBDT-GRV-01",
    fields: [
      {
        name: "pan",
        label: "Permanent Account Number (PAN)",
        placeholder: "ABCDE1234F",
        type: "text",
      },
      {
        name: "ay",
        label: "Assessment Year",
        placeholder: "2025-26",
        type: "text",
      },
      {
        name: "grievanceCategory",
        label: "Grievance Category",
        type: "select",
        options: [
          "Delayed Refund (> 90 Days)",
          "e-Verification Mismatch",
          "Rectification Request (u/s 154)",
          "Challan / Tax Credit Mismatch",
        ],
      },
      {
        name: "claimAmount",
        label: "Disputed Amount (₹)",
        placeholder: "24500",
        type: "number",
      },
    ],
  },
  {
    id: "PARIVAHAN",
    name: "Parivahan Sewa",
    ministry: "Ministry of Road Transport & Highways",
    color: "#0f766e", // Teal/Green
    accent: "#14b8a6",
    icon: Car,
    service: "Driving License Address Update",
    code: "MORTH-DL-04",
    fields: [
      {
        name: "dlNumber",
        label: "Driving License Number",
        placeholder: "KA-01-2018-0094821",
        type: "text",
      },
      {
        name: "rtoJurisdiction",
        label: "RTO Jurisdiction Code",
        placeholder: "KA-01 (Koramangala, Bengaluru)",
        type: "text",
      },
      {
        name: "newAddress",
        label: "New Permanent Residential Address",
        placeholder: "#42, 80 Feet Road, 4th Block, Koramangala",
        type: "text",
      },
      {
        name: "pincode",
        label: "Postal PIN Code",
        placeholder: "560034",
        type: "number",
      },
    ],
  },
  {
    id: "NFSA",
    name: "National Food Security",
    ministry: "Department of Food & Public Distribution",
    color: "#b45309", // Amber/Orange
    accent: "#f59e0b",
    icon: ShoppingBag,
    service: "Ration Card Beneficiary Addition",
    code: "NFSA-PDS-08",
    fields: [
      {
        name: "rationCardNo",
        label: "Digital Ration Card Number",
        placeholder: "RC-9928-1002-4910",
        type: "text",
      },
      {
        name: "headAadhaar",
        label: "Head of Family Aadhaar",
        placeholder: "XXXX-XXXX-8921",
        type: "text",
      },
      {
        name: "newMemberName",
        label: "New Beneficiary Full Name",
        placeholder: "Aarav Kumar",
        type: "text",
      },
      {
        name: "relationship",
        label: "Relationship to Family Head",
        type: "select",
        options: ["Son / Daughter", "Spouse", "Dependent Parent", "Other"],
      },
    ],
  },
];

export default function PrototypeGateway() {
  const { isOnline, toggleNetwork, addToast, pendingCount } = useNetwork();

  // App State
  const [activeDeptId, setActiveDeptId] = usePersistentState(
    "gw_dept",
    DEPARTMENTS[0].id,
  );
  const [formData, setFormData] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [offlineAlert, setOfflineAlert] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = usePersistentState(
    "gw_auth",
    false,
  );

  const activeUser = SYNTHETIC_USERS[DEFAULT_USER_UAN];
  const activeDept = DEPARTMENTS.find((d) => d.id === activeDeptId);

  // Draft loading
  useEffect(() => {
    async function loadServiceDraft() {
      if (!isAuthenticated) return;

      const draftKey = `GW_${activeDeptId}`;
      const draft = await getDraft(draftKey, activeUser.uan);
      if (draft && draft.formData) {
        setFormData(draft.formData);
        setLastSaved(new Date(draft.lastSavedAt).toLocaleTimeString());
      } else {
        const initial = {};
        activeDept.fields.forEach((f) => {
          // Pre-fill if we have mock data matching
          if (f.name === "pan") initial[f.name] = activeUser.panMasked;
          else if (f.name === "headAadhaar")
            initial[f.name] = activeUser.aadhaarMasked;
          else initial[f.name] = "";
        });
        setFormData(initial);
        setLastSaved(null);
      }
      setSubmissionSuccess(null);
      setOfflineAlert(null);
    }
    loadServiceDraft();
  }, [activeDeptId, isAuthenticated, activeUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const draftKey = `GW_${activeDeptId}`;
      saveDraft(draftKey, updated, 1, activeUser.uan);
      setLastSaved(new Date().toLocaleTimeString());
      return updated;
    });
  };

  const handlePasskeyLogin = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setIsAuthenticated(true);
    addToast({
      type: "success",
      title: "UMANG PASSKEY VERIFIED",
      message: `Citizen Profile: ${activeUser.name} synchronized securely.`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const draftKey = `GW_${activeDeptId}`;

    try {
      if (isOnline) {
        const ackNumber = `${activeDept.code}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        await clearDraft(draftKey, activeUser.uan);
        await logAuditEvent(
          "GATEWAY_SUBMIT_ONLINE",
          { dept: activeDept.id, ackNumber },
          "ONLINE",
        );

        setSubmissionSuccess(ackNumber);
        addToast({
          type: "success",
          title: "SUBMISSION SUCCESSFUL",
          message: `Acknowledgement ID: ${ackNumber}`,
        });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        const queueResult = await enqueueOfflinePayload(
          draftKey,
          formData,
          activeUser.uan,
        );
        await clearDraft(draftKey, activeUser.uan);

        setOfflineAlert(queueResult.referenceId);
        addToast({
          type: "warning",
          title: "NETWORK UNREACHABLE",
          message: "Payload queued to IndexedDB for background sync.",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // RENDER: LOGIN SCREEN
  // ---------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f4f0] flex flex-col items-center justify-center p-4 font-sans selection:bg-black selection:text-white">
        <div className="max-w-md w-full bg-white brutal-border brutal-shadow p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto brutal-border">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase">
              Unified Citizen Gateway
            </h1>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              One Nation, One Portal Architecture
            </p>
          </div>

          <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300">
            <p className="text-xs text-gray-500 mb-3 font-mono">
              TEST ENVIRONMENT (LOCAL STATE)
            </p>
            <button
              onClick={handlePasskeyLogin}
              className="w-full bg-[#2563eb] text-white py-3 font-bold brutal-border brutal-shadow-sm hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-5 h-5" />
              Sign in with Device Passkey
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: UNIFIED GATEWAY DASHBOARD
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-black text-white px-4 py-3 brutal-border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xl brutal-border">
              IN
            </div>
            <div>
              <h1 className="font-black uppercase tracking-wider text-sm md:text-base">
                Unified Citizen Gateway
              </h1>
              <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                Govt. of India Scalability Prototype
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono">
              <Database className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-gray-300">
                Autosave: {lastSaved || "Ready"}
              </span>
            </div>

            <button
              onClick={toggleNetwork}
              className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold brutal-border uppercase ${
                isOnline ? "bg-[#10b981] text-black" : "bg-[#e61919] text-white"
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">
                {isOnline ? "Online Mode" : "Offline Mode"}
              </span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 bg-white brutal-border-r p-4 md:min-h-[calc(100vh-65px)] flex flex-col gap-2">
          <div className="p-4 bg-gray-50 brutal-border mb-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Active Citizen
            </div>
            <div className="font-black text-sm uppercase">
              {activeUser.name}
            </div>
            <div className="font-mono text-xs text-gray-600 mt-0.5">
              ID: {activeUser.aadhaarMasked}
            </div>
          </div>

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1 mt-2">
            Department Services
          </div>

          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            const isActive = activeDeptId === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveDeptId(dept.id)}
                className={`flex items-center gap-3 p-3 text-left transition-colors font-bold text-sm ${
                  isActive
                    ? "bg-black text-white brutal-border brutal-shadow-sm"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : ""}`}
                  style={{ color: isActive ? "#fff" : dept.color }}
                />
                <span>{dept.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8">
          {/* Dynamic Department Header */}
          <div
            className="p-6 md:p-8 brutal-border brutal-shadow mb-8 text-white relative overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: activeDept.color }}
          >
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-2">
                  {activeDept.name}
                </h2>
                <p className="text-sm font-medium opacity-90 uppercase tracking-wide">
                  {activeDept.ministry}
                </p>
              </div>
              <div className="bg-white text-black px-4 py-1.5 brutal-border font-bold text-sm flex items-center gap-2">
                <activeDept.icon className="w-4 h-4" />
                {activeDept.code}
              </div>
            </div>
            {/* Decorative background element */}
            <activeDept.icon className="absolute -bottom-8 -right-8 w-48 h-48 opacity-10 transform -rotate-12 pointer-events-none" />
          </div>

          {/* Service Form Container */}
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-2">
              <h3 className="text-xl font-black uppercase">
                {activeDept.service}
              </h3>
              <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase">
                Form Entry
              </span>
            </div>

            {submissionSuccess ? (
              <div className="bg-white p-8 brutal-border brutal-shadow border-t-8 border-t-[#10b981] animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-4 mb-6">
                  <CheckCircle2 className="w-12 h-12 text-[#10b981]" />
                  <div>
                    <h3 className="text-2xl font-black uppercase">
                      Service Request Filed
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {activeDept.service}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 brutal-border">
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">
                    Acknowledgement Number
                  </div>
                  <div className="text-xl font-mono font-black">
                    {submissionSuccess}
                  </div>
                </div>
                <button
                  onClick={() => setSubmissionSuccess(null)}
                  className="mt-6 bg-black text-white px-6 py-2.5 font-bold brutal-btn flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> File Another Request
                </button>
              </div>
            ) : offlineAlert ? (
              <div className="bg-white p-8 brutal-border brutal-shadow border-t-8 border-t-[#f59e0b] animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-4 mb-6">
                  <AlertTriangle className="w-12 h-12 text-[#f59e0b]" />
                  <div>
                    <h3 className="text-2xl font-black uppercase">
                      Offline Queue Active
                    </h3>
                    <p className="text-gray-600 font-medium">
                      Server Unreachable (Simulated 504)
                    </p>
                  </div>
                </div>
                <p className="mb-6 font-medium text-gray-700 leading-relaxed">
                  Your form data has been securely saved to the local IndexedDB.
                  It will automatically sync to the {activeDept.name} servers
                  when connection is restored.
                </p>
                <div className="bg-amber-50 p-4 brutal-border border-amber-200">
                  <div className="text-xs text-amber-700 font-bold uppercase mb-1">
                    Local Reference ID
                  </div>
                  <div className="text-lg font-mono font-black text-amber-900">
                    {offlineAlert}
                  </div>
                </div>
                <button
                  onClick={() => setOfflineAlert(null)}
                  className="mt-6 bg-black text-white px-6 py-2.5 font-bold brutal-btn flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Return to Dashboard
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 md:p-8 brutal-border brutal-shadow space-y-6 animate-in fade-in slide-in-from-bottom-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeDept.fields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          required
                          className="w-full p-3 brutal-border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none font-medium appearance-none"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 1rem center",
                            backgroundSize: "1em",
                          }}
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                          className={`w-full p-3 brutal-border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none font-medium ${field.type === "number" || field.name === "pan" || field.name === "dlNumber" ? "font-mono" : ""}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200 text-xs text-gray-600 font-medium">
                  By submitting this form, I solemnly declare that the
                  information provided is true to the best of my knowledge, and
                  I understand this data is persisted securely on my device
                  before transmission.
                </div>

                <div className="pt-4 border-t-2 border-black flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                    Client-Side Validated
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white px-8 py-3 font-bold brutal-btn flex items-center gap-2 hover:bg-gray-800 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        {isOnline
                          ? "Submit to Govt Gateway"
                          : "Queue to Local IndexedDB"}
                        {isOnline ? (
                          <ArrowRight className="w-4 h-4" />
                        ) : (
                          <Database className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
