import os
import re

path = r'c:\Users\Sonia\Downloads\MKAVS\Frontend\frontend\index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove the "Trustpilot" stats text block from the mobile layout.
# Note: I'll just remove the whole div because the user requested removing "4.2/5 Trustpilot Based on 5210 reviews"
trustpilot_pattern = r'<div class="flex items-center justify-center gap-2 mb-16">\s*<span class="text-gray-800 font-medium text-sm">4\.2/5</span>\s*<div class="flex items-center text-\[#00b67a\] text-lg">\s*<i class="fa-solid fa-star"></i>\s*</div>\s*<span class="font-black text-black text-lg tracking-tight">Trustpilot</span>\s*<span class="text-gray-500 text-xs font-medium ml-1">Based on 5210 reviews</span>\s*</div>'
html = re.sub(trustpilot_pattern, '', html)

# 2. Remove desktop profile photos (and their circular gray wrapper)
desktop_avatar_pattern = r'<div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">\s*<img src="https://i\.pravatar\.cc/[^>]+>\s*</div>'
html = re.sub(desktop_avatar_pattern, '', html)

# 3. Remove mobile profile photos
mobile_avatar_pattern = r'<img src="https://i\.pravatar\.cc/[^>]+class="w-10 h-10 rounded-full object-cover">'
html = re.sub(mobile_avatar_pattern, '', html)

with open(path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Removed Trustpilot block and profile photos from index.html")
