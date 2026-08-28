import re

with open('src/components/epfo/EPFOPortalViews.jsx', 'r') as f:
    content = f.read()

# Replacements
content = content.replace('activeUser.mobile', 'activeUser.phoneMasked')
content = content.replace('activeUser.aadhaar', 'activeUser.aadhaarMasked')
content = content.replace('activeUser.pan', 'activeUser.panMasked')
content = content.replace('activeUser.establishment', 'activeUser.establishmentName')
content = content.replace('activeUser.memberId', 'activeUser.epfNumber')
content = content.replace('activeUser.bankDetails.bankName', 'activeUser.bankAccount.bankName')
content = content.replace('activeUser.bankDetails.accountNo', 'activeUser.bankAccount.accountNumber')
content = content.replace('activeUser.bankDetails.ifsc', 'activeUser.bankAccount.ifsc')
content = content.replace('activeUser.bankDetails', 'activeUser.bankAccount')

# Replace hardcodings with activeUser fields
content = re.sub(r"isRamesh \? 'Suresh Kumar' : 'Arun Sharma'", "activeUser.fatherName", content)
content = re.sub(r"isRamesh \? '15-Aug-1985' : '22-Oct-1996'", "activeUser.dob", content)
content = re.sub(r"isRamesh \? 'Male' : 'Female'", "activeUser.gender", content)
content = re.sub(r"isRamesh \? 'r\.kumar\*\*\*@gmail\.com' : 'p\.sharma\*\*\*@gmail\.com'", "activeUser.email", content)
content = re.sub(r"isRamesh \? '01-Apr-2017' : '15-May-2025'", "activeUser.joiningDate", content)
content = re.sub(r"isRamesh \? '9 Years 4 Months' : '1 Year 2 Months'", "activeUser.serviceYears", content)

# Some specific formatting
content = content.replace('{activeUser.phoneMasked.slice(0,2)}XXXXXX{activeUser.phoneMasked.slice(-2)}', '{activeUser.phoneMasked}')
content = content.replace('+91 {activeUser.phoneMasked}', '{activeUser.phoneMasked}')
content = content.replace('XXXX XXXX {activeUser.aadhaarMasked.slice(-4)}', '{activeUser.aadhaarMasked}')
content = content.replace('XXXXX{activeUser.panMasked.slice(-4)}', '{activeUser.panMasked}')
content = content.replace('XXXX XXXX {activeUser.bankAccount.accountNumber.slice(-4)}', '{activeUser.bankAccount.accountNumber}')

with open('src/components/epfo/EPFOPortalViews.jsx', 'w') as f:
    f.write(content)
