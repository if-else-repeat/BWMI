import re

with open('/data/data/com.termux/files/home/bwmi/src/pages/Home.jsx', 'r') as f:
    content = f.read()

# 1. Update the header text and icon
header_regex = r'<div className="bg-black text-white px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-50">.*?</div>\s*<div className="hidden sm:flex items-center gap-3">'
new_header = """<div className="bg-black text-white px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <img src="/favicon.svg" alt="BWMI" className="w-full h-full rounded" />
          </div>
          <h1 className="text-sm md:text-xl font-bold tracking-tight leading-tight">
            Build What Moves India <span className="font-normal opacity-70">| Varun Mayya x OpenAI</span>
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-3">"""
content = re.sub(header_regex, new_header, content, flags=re.DOTALL)

# 2. Update the Hero title <br />
hero_regex = r'Build What <br className="hidden md:block" />'
new_hero = """Build What <br />"""
content = content.replace(hero_regex, new_hero)

with open('/data/data/com.termux/files/home/bwmi/src/pages/Home.jsx', 'w') as f:
    f.write(content)
