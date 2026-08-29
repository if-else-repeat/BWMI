import re

with open('/data/data/com.termux/files/home/bwmi/src/components/epfo/EPFOPortalViews.jsx', 'r') as f:
    content = f.read()

# 1. Add useNetwork import
if "useNetwork" not in content:
    content = content.replace('import { t } from "./i18n";', 'import { t } from "./i18n";\nimport { useNetwork } from "../../context/NetworkContext";')

# 2. Add local state inside component
state_insertion = """const EPFOPortalViews = ({ view, activeUser, lang, onNavigate }) => {
  const { addToast } = useNetwork();
  const [localNominationFiled, setLocalNominationFiled] = useState(false);
  const [localKycAdded, setLocalKycAdded] = useState(false);
  const isRamesh = activeUser?.name?.includes("Ramesh");"""
content = re.sub(r'const EPFOPortalViews = \(\{ view, activeUser, lang, onNavigate \}\) => \{\n\s*const isRamesh = activeUser\?\.name\?\.includes\("Ramesh"\);', state_insertion, content)

# 3. Update E-Nomination to use state
nom_regex = r'const renderNomination = \(\) => \{\n\s*const isCompleted = activeUser\.eNominationStatus === "COMPLETED";'
nom_replacement = """const renderNomination = () => {
    const isCompleted = activeUser.eNominationStatus === "COMPLETED" || localNominationFiled;
    
    const handleSaveNomination = () => {
      addToast({ type: "success", title: "E-NOMINATION FILED", message: "Successfully signed and saved to digital locker." });
      setLocalNominationFiled(true);
    };"""
content = re.sub(nom_regex, nom_replacement, content)

# 4. Update E-Nomination submit button - SAFELY
content = content.replace('alert(\n                  "e-Nomination saved successfully. Redirecting to e-Sign...",\n                )', 'handleSaveNomination()')
content = content.replace('alert("e-Nomination saved successfully. Redirecting to e-Sign...")', 'handleSaveNomination()')

# 5. Update KYC
kyc_regex = r'(const renderKyc = \(\) => \(\n\s*<div className="space-y-6 animate-fade-in">\n\s*<h3.*?>\n\s*KYC Details\n\s*</h3>)'
kyc_replacement = """const renderKyc = () => {
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
        <div className="bg-yellow-50 p-4 border border-yellow-300 rounded mb-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-yellow-800">Bank Account (Ending in 4021)</span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-bold">PENDING EMPLOYER APPROVAL</span>
          </div>
        </div>
      )}
"""
content = re.sub(kyc_regex, kyc_replacement, content)

content = re.sub(r'Verified with Income Tax CBDT\n\s*</p>\n\s*</div>\n\s*</div>\n\s*</div>\n\s*</div>\n\s*</div>\n\s*\);', 
                 'Verified with Income Tax CBDT\n              </p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}', content)

with open('/data/data/com.termux/files/home/bwmi/src/components/epfo/EPFOPortalViews.jsx', 'w') as f:
    f.write(content)
