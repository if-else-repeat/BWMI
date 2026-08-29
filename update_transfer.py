import re

with open('src/components/epfo/EPFOPortalViews.jsx', 'r') as f:
    text = f.read()

btn_old = """onClick={() =>
              alert(
                "Transfer request submitted successfully. An OTP has been sent to your registered mobile number.",
              )
            }"""
btn_new = """onClick={() => addToast({ type: "success", title: "TRANSFER INITIATED", message: "Request queued to digital locker. Pending previous employer attestation." })}"""

text = text.replace(btn_old, btn_new)

with open('src/components/epfo/EPFOPortalViews.jsx', 'w') as f:
    f.write(text)
