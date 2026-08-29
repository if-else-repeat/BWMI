import React, { useState } from "react";
import {
  User,
  CreditCard,
  Printer,
  QrCode,
  FileCheck,
  Shield,
  Building,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  Download,
  BadgeCheck,
  Edit,
  Landmark,
  FileSpreadsheet,
  Activity,
  Key,
  CheckCircle,
  Info,
} from "lucide-react";
import { t } from "./i18n";
import { useNetwork } from "../../context/NetworkContext";

const generatePassbookEntries = (entries) => {
  if (entries && entries.length >= 12) return entries;

  const generated = [];
  const baseWage = 15000;

  // Starting from July 2026 and going backwards
  const months = [
    "JUL",
    "JUN",
    "MAY",
    "APR",
    "MAR",
    "FEB",
    "JAN",
    "DEC",
    "NOV",
    "OCT",
    "SEP",
    "AUG",
  ];
  const years = [
    2026, 2026, 2026, 2026, 2026, 2026, 2026, 2025, 2025, 2025, 2025, 2025,
  ];

  for (let i = 0; i < 12; i++) {
    const isLatest = i < (entries ? entries.length : 0);
    if (isLatest && entries) {
      generated.push(entries[i]);
    } else {
      generated.push({
        month: `${months[i]} ${years[i]}`,
        epfWage: baseWage,
        employeeShare: Math.round(baseWage * 0.12),
        employerShare: Math.round(baseWage * 0.0367),
        pensionFund: Math.round(baseWage * 0.0833),
      });
    }
  }
  return generated;
};

const EPFOPortalViews = ({ view, activeUser, lang, onNavigate }) => {
  const { addToast } = useNetwork();
  const [localNominationFiled, setLocalNominationFiled] = useState(false);
  const [localKycAdded, setLocalKycAdded] = useState(false);
  const isRamesh = activeUser?.name?.includes("Ramesh");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderHome = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-[#048282] rounded-full flex items-center justify-center text-white text-2xl font-bold brutal-border">
              {activeUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeUser.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-gray-600">
                  UAN: {activeUser.uan}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold border border-green-300">
                  {t("Service Active", lang).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {t("Service Duration", lang)}
            </div>
            <div className="text-xl font-bold text-[#048282]">
              {activeUser.serviceYears}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-gray-50 rounded brutal-border-b">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {t("Father's Name", lang)}
            </div>
            <div className="font-semibold">{activeUser.fatherName}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded brutal-border-b">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {t("Date of Birth", lang)}
            </div>
            <div className="font-semibold">{activeUser.dob}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded brutal-border-b">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {t("Aadhaar Number", lang)}
            </div>
            <div className="font-mono font-semibold flex items-center gap-2">
              {activeUser.aadhaarMasked}
              <BadgeCheck className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded brutal-border-b">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {t("PAN Number", lang)}
            </div>
            <div className="font-mono font-semibold flex items-center gap-2">
              {activeUser.panMasked}
              <BadgeCheck className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <div className="text-sm text-teal-800 font-semibold mb-1">
              Employee Share (EE)
            </div>
            <div className="text-2xl font-bold text-teal-900">
              {formatCurrency(activeUser.employeeShare)}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800 font-semibold mb-1">
              Employer Share (ER)
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(activeUser.employerShare)}
            </div>
          </div>
          <div className="bg-[#1a3c3c] p-4 rounded-lg text-white">
            <div className="text-sm text-teal-200 font-semibold mb-1">
              Total PF Balance
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(activeUser.totalPfBalance)}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate("claim")}
            className="flex-1 brutal-btn bg-[#C1622D] text-white py-3 px-4 rounded font-bold flex items-center justify-center gap-2 hover:bg-[#a04f22] transition-colors"
          >
            <FileText className="w-5 h-5" />
            File Online Claim (Form 31)
          </button>
          <button
            onClick={() => onNavigate("passbook")}
            className="flex-1 brutal-btn bg-[#048282] text-white py-3 px-4 rounded font-bold flex items-center justify-center gap-2 hover:bg-[#036a6a] transition-colors"
          >
            <FileSpreadsheet className="w-5 h-5" />
            View Passbook
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
        {t("Member Profile", lang)}
      </h3>

      <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#048282]" /> Personal Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Member Name</div>
            <div className="font-semibold text-gray-900">{activeUser.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              Father's/Husband's Name
            </div>
            <div className="font-semibold text-gray-900">
              {activeUser.fatherName}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {t("Date of Birth", lang)}
            </div>
            <div className="font-semibold text-gray-900">{activeUser.dob}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {t("Gender", lang)}
            </div>
            <div className="font-semibold text-gray-900">
              {activeUser.gender}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Mobile Number</div>
            <div className="font-semibold text-gray-900">
              {activeUser.phoneMasked}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Email ID</div>
            <div className="font-semibold text-gray-900">
              {activeUser.email}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {t("Aadhaar Number", lang)}
            </div>
            <div className="font-mono font-semibold text-gray-900 flex items-center gap-1">
              {activeUser.aadhaarMasked}
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {t("PAN Number", lang)}
            </div>
            <div className="font-mono font-semibold text-gray-900 flex items-center gap-1">
              {activeUser.panMasked}
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-[#048282]" /> Employment Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Establishment Name</div>
            <div className="font-semibold text-gray-900">
              {activeUser.establishmentName}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Member ID</div>
            <div className="font-mono font-semibold text-gray-900">
              {activeUser.epfNumber}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {t("Date of Joining", lang)}
            </div>
            <div className="font-semibold text-gray-900">
              {activeUser.joiningDate}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {t("Service Duration", lang)}
            </div>
            <div className="font-semibold text-gray-900">
              {activeUser.serviceYears}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#048282]" /> Bank Account Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Bank Name</div>
            <div className="font-semibold text-gray-900">
              {activeUser.bankAccount.bankName}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Account Number</div>
            <div className="font-mono font-semibold text-gray-900">
              {activeUser.bankAccount.accountNumber}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">IFSC Code</div>
            <div className="font-mono font-semibold text-gray-900">
              {activeUser.bankAccount.ifsc}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Branch</div>
            <div className="font-semibold text-gray-900">
              {activeUser.bankAccount.branch}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPassbook = () => {
    const entries = generatePassbookEntries(activeUser.passbookEntries);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2">
            Member Passbook
          </h3>
          <button
            className="brutal-btn bg-white text-[#048282] border-2 border-[#048282] px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-teal-50"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" /> Print Ledger
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg brutal-border shadow-sm border-t-4 border-t-teal-500">
            <div className="text-sm text-gray-600 font-semibold mb-1">
              Employee Share
            </div>
            <div className="text-2xl font-bold text-teal-700">
              {formatCurrency(activeUser.employeeShare)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg brutal-border shadow-sm border-t-4 border-t-blue-500">
            <div className="text-sm text-gray-600 font-semibold mb-1">
              Employer Share
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(activeUser.employerShare)}
            </div>
          </div>
          <div className="bg-[#1a3c3c] p-4 rounded-lg text-white border-t-4 border-t-[#C1622D]">
            <div className="text-sm text-teal-200 font-semibold mb-1">
              Total Balance
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(activeUser.totalPfBalance)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg brutal-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b-2 border-gray-300">
                  <th className="p-3 font-semibold text-sm">
                    {t("Wage Month", lang)}
                  </th>
                  <th className="p-3 font-semibold text-sm text-right">
                    {t("EPF Wage", lang)}
                  </th>
                  <th className="p-3 font-semibold text-sm text-right">
                    Employee (12%)
                  </th>
                  <th className="p-3 font-semibold text-sm text-right">
                    Employer (3.67%)
                  </th>
                  <th className="p-3 font-semibold text-sm text-right">
                    Pension (8.33%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {entry.month}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {formatCurrency(entry.epfWage)}
                    </td>
                    <td className="p-3 text-right font-mono text-teal-700 font-semibold">
                      {formatCurrency(entry.employeeShare)}
                    </td>
                    <td className="p-3 text-right font-mono text-blue-700 font-semibold">
                      {formatCurrency(entry.employerShare)}
                    </td>
                    <td className="p-3 text-right font-mono text-purple-700 font-semibold">
                      {formatCurrency(entry.pensionFund)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold border-t-2 border-gray-400">
                  <td className="p-3">TOTAL (Closing Balance)</td>
                  <td className="p-3 text-right">-</td>
                  <td className="p-3 text-right font-mono text-teal-800">
                    {formatCurrency(activeUser.employeeShare)}
                  </td>
                  <td className="p-3 text-right font-mono text-blue-800">
                    {formatCurrency(activeUser.employerShare)}
                  </td>
                  <td className="p-3 text-right font-mono text-purple-800">
                    {formatCurrency(activeUser.pensionShare)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceBook = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
        Electronic Service Book
      </h3>

      <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          CURRENT EMPLOYER
        </div>
        <h4 className="text-xl font-bold text-[#048282] mb-2">
          {activeUser.establishmentName}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-500 uppercase font-semibold">
              Member ID
            </div>
            <div className="font-mono font-bold mt-1 text-gray-800">
              {activeUser.epfNumber}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-500 uppercase font-semibold">
              {t("Date of Joining", lang)}
            </div>
            <div className="font-bold mt-1 text-gray-800">
              {activeUser.joiningDate}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-500 uppercase font-semibold">
              {t("Date of Exit", lang)}
            </div>
            <div className="font-bold mt-1 text-gray-500 text-sm">
              NOT APPLICABLE - ACTIVE
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="text-xs text-green-700 uppercase font-semibold">
              EPS Eligibility
            </div>
            <div className="font-bold mt-1 text-green-700 flex items-center gap-1">
              QUALIFIED <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <h4 className="text-lg font-bold text-gray-700 mb-3 mt-8 flex items-center gap-2">
        <Clock className="w-5 h-5" /> Previous Employment Records
      </h4>

      {isRamesh ? (
        <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow opacity-90">
          <h4 className="text-lg font-bold text-gray-700 mb-2">
            Tata Consultancy Services
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="p-3">
              <div className="text-xs text-gray-500 uppercase font-semibold">
                Member ID
              </div>
              <div className="font-mono font-medium mt-1">
                MH/BAN/82910/000/12948
              </div>
            </div>
            <div className="p-3">
              <div className="text-xs text-gray-500 uppercase font-semibold">
                {t("Date of Joining", lang)}
              </div>
              <div className="font-medium mt-1">10-Jun-2015</div>
            </div>
            <div className="p-3">
              <div className="text-xs text-gray-500 uppercase font-semibold">
                {t("Date of Exit", lang)}
              </div>
              <div className="font-medium mt-1">15-Mar-2017</div>
            </div>
            <div className="p-3">
              <div className="text-xs text-gray-500 uppercase font-semibold">
                Transfer Status
              </div>
              <div className="font-medium mt-1 text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> TRANSFERRED
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            No previous employment records found.
          </p>
        </div>
      )}
    </div>
  );

  const renderUanCard = () => (
    <div className="space-y-6 animate-fade-in flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4 max-w-2xl">
        <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2">
          Digital UAN Card
        </h3>
        <button className="brutal-btn bg-[#048282] text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-[#036a6a]">
          <Printer className="w-4 h-4" /> Print Card
        </button>
      </div>

      <div className="bg-white brutal-border brutal-shadow w-full max-w-md rounded-xl overflow-hidden mt-4">
        <div className="bg-[#048282] p-4 text-center text-white relative">
          <div className="absolute top-4 left-4">
            <Shield className="w-8 h-8 text-white opacity-80" />
          </div>
          <h2 className="font-bold text-lg leading-tight uppercase tracking-wide">
            Employees' Provident Fund Organisation
          </h2>
          <p className="text-xs text-teal-100 mt-1">
            Ministry of Labour & Employment, Govt. of India
          </p>
        </div>

        <div className="p-6 bg-[#fffaf5]">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Universal Account Number
                </div>
                <div className="text-2xl font-mono font-bold text-gray-900 tracking-widest">
                  {activeUser.uan}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Name
                </div>
                <div className="font-bold text-gray-800 text-lg">
                  {activeUser.name}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  {t("Father's Name", lang)}
                </div>
                <div className="font-semibold text-gray-700">
                  {activeUser.fatherName}
                </div>
              </div>

              <div className="flex gap-6">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    KYC
                  </div>
                  <div className="font-semibold text-green-700 text-sm">
                    YES
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                    Aadhaar
                  </div>
                  <div className="font-semibold text-gray-700 text-sm">
                    {activeUser.aadhaarMasked}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white p-2 brutal-border rounded-lg mb-2">
                <QrCode className="w-full h-full text-gray-800" />
              </div>
              <div className="text-[9px] text-gray-500 text-center max-w-[6rem]">
                Scan to verify digital signature
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a3c3c] py-2 px-4 text-center text-xs text-white">
          Valid across all establishments | Not a proof of identity
        </div>
      </div>
    </div>
  );

  const renderKyc = () => {
    const handleAddKyc = () => {
      addToast({
        type: "success",
        title: "KYC SEEDED",
        message: "Document saved. Pending approval from employer.",
      });
      setLocalKycAdded(true);
    };
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block">
            KYC Details
          </h3>
          <button
            onClick={handleAddKyc}
            disabled={localKycAdded}
            className="brutal-btn bg-white text-[#048282] border-2 border-[#048282] px-4 py-2 rounded font-bold hover:bg-teal-50 disabled:opacity-50"
          >
            {localKycAdded ? "Document Seeded" : "+ Seed New Document"}
          </button>
        </div>

        {localKycAdded && (
          <div className="bg-yellow-50 p-4 border border-yellow-300 rounded mb-4 brutal-shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-bold text-yellow-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Passport Document
              </span>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-bold">
                PENDING EMPLOYER APPROVAL
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg brutal-border brutal-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 text-xs font-bold rounded-bl-lg border-l border-b border-green-200 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> VERIFIED
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Aadhaar Card</h4>
                <div className="font-mono font-medium text-gray-600 mt-1">
                  {activeUser.aadhaarMasked}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Digitally authenticated with UIDAI
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg brutal-border brutal-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 text-xs font-bold rounded-bl-lg border-l border-b border-green-200 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> VERIFIED
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">PAN Card</h4>
                <div className="font-mono font-medium text-gray-600 mt-1">
                  {activeUser.panMasked}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Verified with Income Tax CBDT
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg brutal-border brutal-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 text-xs font-bold rounded-bl-lg border-l border-b border-green-200 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> DIGITALLY SEEDED
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Bank Account</h4>
                <div className="text-sm font-semibold text-gray-700 mt-1">
                  {activeUser.bankAccount.bankName}
                </div>
                <div className="font-mono text-sm text-gray-600">
                  {activeUser.bankAccount.accountNumber} |{" "}
                  {activeUser.bankAccount.ifsc}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg brutal-border relative overflow-hidden border-dashed">
            <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold rounded-bl-lg border-l border-b border-amber-200">
              OPTIONAL
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-200 text-gray-500 rounded-lg">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-600">Driving License</h4>
                <div className="font-medium text-gray-500 mt-1 italic">
                  Not Linked
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Link your DL for additional verification
                </p>
                <button className="mt-3 text-sm text-[#048282] font-semibold hover:underline flex items-center gap-1">
                  Add DL <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNomination = () => {
    const isCompleted =
      activeUser.eNominationStatus === "COMPLETED" || localNominationFiled;
    const handleSaveNomination = () => {
      addToast({
        type: "success",
        title: "E-NOMINATION FILED",
        message: "Successfully signed and saved to digital locker.",
      });
      setLocalNominationFiled(true);
    };

    if (isCompleted) {
      return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
            E-Nomination
          </h3>

          <div className="bg-green-50 border-2 border-green-500 p-6 rounded-lg brutal-shadow mb-6">
            <div className="flex items-center gap-3 mb-4 text-green-800">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <h4 className="font-bold text-lg">
                  E-Nomination Filed Successfully
                </h4>
                <div className="text-sm flex items-center gap-2">
                  <span className="bg-green-200 px-2 py-0.5 rounded text-xs font-bold border border-green-300">
                    e-Sign Verified
                  </span>
                  <span>Registered on: 12-Sep-2023</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded p-4 border border-green-200 mt-4">
              <h5 className="font-bold text-gray-700 mb-3 border-b pb-2">
                Nominee Details (100% Share)
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Name</div>
                  <div className="font-semibold">{activeUser.nomineeName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">
                    Relationship
                  </div>
                  <div className="font-semibold">Spouse</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Aadhaar</div>
                  <div className="font-mono">XXXX XXXX 8912</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Share %</div>
                  <div className="font-bold text-green-700">100%</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="brutal-btn bg-white border-2 border-green-600 text-green-700 px-4 py-2 rounded font-bold hover:bg-green-100">
                Update Nomination
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
          E-Nomination
        </h3>

        <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-lg flex items-start gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800 text-lg">
              E-Nomination Not Filed
            </h4>
            <p className="text-amber-700 text-sm mt-1">
              Filing of e-Nomination is mandatory for all EPF members to ensure
              social security for their family members. Please file your
              e-Nomination immediately.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow">
          <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">
            Add Family Member / Nominee
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Nominee Name *
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Relationship *
              </label>
              <select className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none">
                <option value="">Select Relationship</option>
                <option value="spouse">Spouse</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Nominee Aadhaar *
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="12-digit Aadhaar number"
                maxLength={12}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Share % *
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="100"
                defaultValue="100"
                max="100"
                min="1"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveNomination}
              className="brutal-btn bg-[#048282] text-white px-6 py-2 rounded font-bold hover:bg-[#036a6a]"
            >
              Save & Proceed to e-Sign
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContact = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
        Contact Details
      </h3>

      <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Phone className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-semibold uppercase">
                Mobile Number
              </div>
              <div className="text-lg font-bold text-gray-800">
                {activeUser.phoneMasked}
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-200 mt-1 inline-block">
                Aadhaar Linked
              </span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-semibold uppercase">
                Email ID
              </div>
              <div className="text-lg font-bold text-gray-800">
                {activeUser.email}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4 md:col-span-2">
            <div className="p-3 bg-gray-100 rounded-full">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-semibold uppercase">
                Communication Address
              </div>
              <div className="text-md font-medium text-gray-800 mt-1">
                {isRamesh
                  ? "A-102, Shanti Apartments, Andheri West, Mumbai, Maharashtra - 400053"
                  : "Flat 4B, Green Park, South Delhi, New Delhi - 110016"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5" /> Update Contact Details
        </h4>
        <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm mb-4 border border-blue-200 flex gap-2">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p>
            Any change in mobile number will require OTP verification from both
            the old and new mobile numbers, as well as Aadhaar authentication.
          </p>
        </div>

        <div className="space-y-4 max-w-lg">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              New Mobile Number
            </label>
            <div className="flex">
              <span className="bg-gray-200 border border-r-0 border-gray-300 px-3 py-2 rounded-l text-gray-600 font-semibold">
                +91
              </span>
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="10-digit number"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              New Email ID
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Email address"
            />
          </div>
          <button className="brutal-btn bg-[#048282] text-white px-4 py-2 rounded font-bold hover:bg-[#036a6a]">
            Get Authorization PIN
          </button>
        </div>
      </div>
    </div>
  );

  const renderTrackClaims = () => {
    if (!activeUser.claimsHistory || activeUser.claimsHistory.length === 0) {
      return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
            Track Claim Status
          </h3>
          <div className="bg-white p-10 rounded-lg brutal-border brutal-shadow text-center">
            <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-700 mb-2">
              No Past Claims on File
            </h4>
            <p className="text-gray-500 mb-6">
              You haven't filed any claims yet.
            </p>
            <button
              onClick={() => onNavigate("claim")}
              className="brutal-btn bg-[#C1622D] text-white px-6 py-2 rounded font-bold hover:bg-[#a04f22] inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> File First Claim
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
          Track Claim Status
        </h3>

        {activeUser.claimsHistory.map((claim, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg brutal-border brutal-shadow mb-6"
          >
            <div className="flex flex-col md:flex-row justify-between border-b pb-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-lg text-gray-800">
                    {claim.type}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold border ${claim.status === "SETTLED" ? "bg-green-100 text-green-800 border-green-300" : "bg-amber-100 text-amber-800 border-amber-300"}`}
                  >
                    {claim.status}
                  </span>
                </div>
                <div className="text-sm font-mono text-gray-600">
                  Tracking ID: {claim.id} | Filed on: {claim.date}
                </div>
              </div>
              <div className="mt-2 md:mt-0 text-left md:text-right">
                <div className="text-sm text-gray-500 uppercase font-semibold">
                  Claim Amount
                </div>
                <div className="text-xl font-bold text-[#048282]">
                  {formatCurrency(claim.amount)}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                <div className="flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold border-2 border-white shadow">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">FILED</div>
                    <div className="text-xs text-gray-500">{claim.date}</div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold border-2 border-white shadow">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      VERIFIED
                    </div>
                    <div className="text-xs text-gray-500">By Employer</div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow ${claim.status === "SETTLED" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                  >
                    {claim.status === "SETTLED" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      APPROVED
                    </div>
                    <div className="text-xs text-gray-500">By EPFO</div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow ${claim.status === "SETTLED" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                  >
                    {claim.status === "SETTLED" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Activity className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      DISBURSED
                    </div>
                    {claim.status === "SETTLED" && (
                      <div className="text-xs text-gray-500">To Bank A/c</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {claim.status === "SETTLED" && (
              <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Disbursement Note:
                  </span>{" "}
                  Amount credited to account ending in{" "}
                  {activeUser.bankAccount.accountNumber.slice(-4)} via NEFT.
                </div>
                <button
                  className="text-[#048282] font-semibold text-sm flex items-center gap-1 hover:underline"
                  onClick={() => alert("Download starting...")}
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTransfer = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
        Transfer Request (O.M.O.E.)
      </h3>

      <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg mb-6">
        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
          <Info className="w-5 h-5" /> One Member One EPF Account
        </h4>
        <p className="text-sm text-blue-900">
          Under the O.M.O.E initiative, you can transfer your PF accumulation
          from previous employers to your current active account. This ensures
          all your retirement savings are consolidated and earn compound
          interest efficiently.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg brutal-border brutal-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">
              Step 1: Current Employment (Receiving Account)
            </h4>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase">
                  Establishment
                </div>
                <div className="font-semibold">
                  {activeUser.establishmentName}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase">
                  Member ID
                </div>
                <div className="font-mono font-medium">
                  {activeUser.epfNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase">
                  UAN
                </div>
                <div className="font-mono font-medium">{activeUser.uan}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">
              Step 2: Previous Employment (Transferring Account)
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Previous Member ID / PF Account No. *
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                  placeholder="e.g. MH/BAN/0000000/000/0000000"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Previous Establishment Name *
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Attestation Through *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="attest"
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                      defaultChecked
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Previous Employer
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="attest"
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Present Employer
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() =>
              addToast({
                type: "success",
                title: "TRANSFER INITIATED",
                message:
                  "Request queued to digital locker. Pending previous employer attestation.",
              })
            }
            className="brutal-btn bg-[#048282] text-white px-6 py-2 rounded font-bold hover:bg-[#036a6a]"
          >
            Submit Transfer Request
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Note: Your previous and current accounts will be auto-merged upon
          successful verification by the selected employer and EPFO.
        </p>
      </div>
    </div>
  );

  const viewRenderers = {
    home: renderHome,
    profile: renderProfile,
    passbook: renderPassbook,
    service_book: renderServiceBook,
    uan_card: renderUanCard,
    kyc: renderKyc,
    nomination: renderNomination,
    contact: renderContact,
    track_claims: renderTrackClaims,
    transfer: renderTransfer,
  };

  const currentRenderer = viewRenderers[view] || renderHome;

  return <div className="epfo-view-container">{currentRenderer()}</div>;
};

export default EPFOPortalViews;
