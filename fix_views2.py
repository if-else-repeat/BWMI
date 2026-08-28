import re

with open('src/components/epfo/EPFOPortalViews.jsx', 'r') as f:
    content = f.read()

content = re.sub(r"isRamesh \? 485200 : 45200", "activeUser.employeeShare", content)
content = re.sub(r"isRamesh \? 148500 : 13800", "activeUser.employerShare", content)
content = re.sub(r"isRamesh \? 633700 : 59000", "activeUser.totalPfBalance", content)
content = re.sub(r"isRamesh \? 336900 : 31300", "activeUser.pensionShare", content)
content = re.sub(r"isRamesh \? 'Mumbai Main Branch' : 'Delhi Connaught Place'", "activeUser.bankAccount.branch", content)

with open('src/components/epfo/EPFOPortalViews.jsx', 'w') as f:
    f.write(content)
