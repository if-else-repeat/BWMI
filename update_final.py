import re

with open('src/components/epfo/EPFOPortalViews.jsx', 'r') as f:
    text = f.read()

# 1. Imports and State
text = text.replace('import { t } from "./i18n";', 'import { t } from "./i18n";\nimport { useNetwork } from "../../context/NetworkContext";')
text = text.replace('const EPFOPortalViews = ({ view, activeUser, lang, onNavigate }) => {', 'const EPFOPortalViews = ({ view, activeUser, lang, onNavigate }) => {\n  const { addToast } = useNetwork();\n  const [localNominationFiled, setLocalNominationFiled] = useState(false);\n  const [localKycAdded, setLocalKycAdded] = useState(false);')

# 2. renderKyc
text = text.replace('const renderKyc = () => (\n    <div className="space-y-6 animate-fade-in">\n      <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">\n        KYC Details\n      </h3>', 
"""const renderKyc = () => {
  const handleAddKyc = () => {
    addToast({ type: "success", title: "KYC SEEDED", message: "Document saved. Pending approval from employer." });
    setLocalKycAdded(true);
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block">
          KYC Details
        </h3>
        <button onClick={handleAddKyc} disabled={localKycAdded} className="brutal-btn bg-white text-[#048282] border-2 border-[#048282] px-4 py-2 rounded font-bold hover:bg-teal-50 disabled:opacity-50">
          {localKycAdded ? "Document Seeded" : "+ Seed New Document"}
        </button>
      </div>
      
      {localKycAdded && (
        <div className="bg-yellow-50 p-4 border border-yellow-300 rounded mb-4 brutal-shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-bold text-yellow-800 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Passport Document</span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-bold">PENDING EMPLOYER APPROVAL</span>
          </div>
        </div>
      )}""")
text = text.replace('  const renderNomination = () => {', '};\n\n  const renderNomination = () => {')

# 3. renderNomination
text = text.replace('const isCompleted = activeUser.eNominationStatus === "COMPLETED";', """const isCompleted = activeUser.eNominationStatus === "COMPLETED" || localNominationFiled;
    const handleSaveNomination = () => {
      addToast({ type: "success", title: "E-NOMINATION FILED", message: "Successfully signed and saved to digital locker." });
      setLocalNominationFiled(true);
    };""")

text = re.sub(r'onClick=\{\(\) =>\n\s*alert\(\n\s*"e-Nomination saved successfully\. Redirecting to e-Sign...",\n\s*\)\n\s*\}', 'onClick={handleSaveNomination}', text)
text = text.replace('onClick={() => alert("e-Nomination saved successfully. Redirecting to e-Sign...")}', 'onClick={handleSaveNomination}')


with open('src/components/epfo/EPFOPortalViews.jsx', 'w') as f:
    f.write(text)
