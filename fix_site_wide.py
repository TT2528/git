import os, re, glob

ROOT = r"C:\Users\HP\WorkBuddy\2026-06-20-19-07-27"
htmls = sorted(glob.glob(os.path.join(ROOT, "*.html")))
updated = []
for f in htmls:
    s = open(f, encoding="utf-8").read()
    orig = s
    # 1) color-scheme meta — 阻止浏览器强制深色把亮图再压暗
    if 'name="color-scheme"' not in s:
        s = re.sub(r'(<meta name="viewport"[^>]*>)',
                   r'\1\n  <meta name="color-scheme" content="light">',
                   s, count=1)
    # 2) 在「作品集」后插入「模型展厅」链接
    if 'models.html">模型展厅' not in s and 'models.html">模型展示' not in s:
        s = re.sub(r'(?m)^(\s*)<li><a href="portfolio\.html">作品集</a></li>',
                   r'\1<li><a href="portfolio.html">作品集</a></li>\n\1<li><a href="models.html">模型展厅</a></li>',
                   s, count=1)
    if s != orig:
        open(f, "w", encoding="utf-8").write(s)
        updated.append(os.path.basename(f))

print("updated:", updated)
print("total html:", len(htmls))
