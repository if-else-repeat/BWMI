import re

with open('/data/data/com.termux/files/home/bwmi/src/components/epfo/EPFOPortalViews.jsx', 'r') as f:
    content = f.read()

old_str = 'const isCompleted = activeUser.eNominationStatus === "COMPLETED";'
new_str = """const isCompleted = activeUser.eNominationStatus === "COMPLETED" || localNominationFiled;
    const handleSaveNomination = () => {
      addToast({ type: "success", title: "E-NOMINATION FILED", message: "Successfully signed and saved to digital locker." });
      setLocalNominationFiled(true);
    };"""

content = content.replace(old_str, new_str)

# And the button
btn_old = """onClick={() =>
                alert(
                  "e-Nomination saved successfully. Redirecting to e-Sign...",
                )
              }"""
btn_new = """onClick={handleSaveNomination}"""

content = content.replace(btn_old, btn_new)

with open('/data/data/com.termux/files/home/bwmi/src/components/epfo/EPFOPortalViews.jsx', 'w') as f:
    f.write(content)
