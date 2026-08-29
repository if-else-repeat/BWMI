import re

with open('/data/data/com.termux/files/home/bwmi/src/components/epfo/EPFOPortalViews.jsx', 'r') as f:
    content = f.read()

kyc_old = """const renderKyc = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-[#1a3c3c] border-b-2 border-[#048282] pb-2 inline-block mb-4">
        KYC Details
      </h3>"""

kyc_new = """const renderKyc = () => {
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
            <span className="font-bold text-yellow-800 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Bank Account (Ending in 4021)</span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-bold">PENDING EMPLOYER APPROVAL</span>
          </div>
        </div>
      )}"""

content = content.replace(kyc_old, kyc_new)
content = content.replace('Verified with Income Tax CBDT\n              </p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );', 'Verified with Income Tax CBDT\n              </p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}')

with open('/data/data/com.termux/files/home/bwmi/src/components/epfo/EPFOPortalViews.jsx', 'w') as f:
    f.write(content)
