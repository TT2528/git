# -*- coding: utf-8 -*-
"""把作品场引用的图压成 WebP + 生成模糊预览 + 预渲染背景。原文件不动。"""
import re, os
from PIL import Image, ImageFilter
import numpy as np

ROOT = os.path.dirname(os.path.abspath(__file__))
FIELD_JS = os.path.join(ROOT, "js", "field.js")
OUT_FULL = os.path.join(ROOT, "assets", "images", "field-webp")
OUT_TINY = os.path.join(OUT_FULL, "tiny")
os.makedirs(OUT_FULL, exist_ok=True)
os.makedirs(OUT_TINY, exist_ok=True)

Image.MAX_IMAGE_PIXELS = None  # 44MB 大图可能超大

# ---- 从 field.js 抽取作品图路径 ----
src = open(FIELD_JS, encoding="utf-8").read()
paths = re.findall(r'img:"([^"]+)"', src)
paths = [p for p in paths if p.startswith("assets/images/")]
print("找到作品图 %d 张" % len(paths))

def has_alpha(im):
    return im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)

def to_rgba(im):
    return im.convert("RGBA") if has_alpha(im) else im.convert("RGB")

MAX_FULL = 1200
MAX_TINY = 48

for p in paths:
    base = os.path.splitext(os.path.basename(p))[0]
    im = Image.open(os.path.join(ROOT, p))
    im.load()
    w, h = im.size
    print("  %-40s %dx%d mode=%s" % (base[:38], w, h, im.mode))

    # full（最大 1200px，保留透明）
    s = min(1.0, MAX_FULL / max(w, h))
    fw, fh = max(1, int(w * s)), max(1, int(h * s))
    full = to_rgba(im.resize((fw, fh), Image.LANCZOS))
    full.save(os.path.join(OUT_FULL, base + ".webp"), "WEBP", quality=82, method=4)

    # tiny（48px，用于 blur-up 垫底，极小）
    ts = min(1.0, MAX_TINY / max(w, h))
    tw, th = max(1, int(w * ts)), max(1, int(h * ts))
    tiny = to_rgba(im.resize((tw, th), Image.BILINEAR))
    tiny.save(os.path.join(OUT_TINY, base + ".webp"), "WEBP", quality=38, method=2)

print("作品图压缩完成 ->", OUT_FULL)

# ---- 预渲染模糊背景（替代每帧 filter:blur(26px) + 漂移动画）----
W, H = 1280, 800
img = np.zeros((H, W, 4), dtype=np.float64)
img[:, :, :3] = (11, 9, 18)   # #0b0912
img[:, :, 3] = 255
yy, xx = np.mgrid[0:H, 0:W]
# (中心x%,中心y%, 半径x%,半径y%, R,G,B,A)
centers = [
    (0.18, 0.22, 0.38, 0.38, 94,  54, 132, 0.55),
    (0.82, 0.28, 0.36, 0.36, 28,  74, 108, 0.52),
    (0.80, 0.80, 0.40, 0.40, 120, 38, 52,  0.50),
    (0.20, 0.82, 0.38, 0.38, 30,  86, 62,  0.48),
    (0.50, 0.52, 0.50, 0.50, 52,  44, 92,  0.42),
]
for cx, cy, rx, ry, r, g, b, a in centers:
    cxp, cyp = cx * W, cy * H
    rxp, ryp = rx * W, ry * H
    d = ((xx - cxp) / rxp) ** 2 + ((yy - cyp) / ryp) ** 2
    m = np.clip(1 - d, 0, 1) ** 1.5
    for c, val in enumerate((r, g, b)):
        img[:, :, c] += m * (val - img[:, :, c])
# 轻微提亮暗部，避免死黑
img[:, :, :3] = np.clip(img[:, :, :3], 0, 255)
pil = Image.fromarray(img.astype(np.uint8), "RGBA")
pil = pil.filter(ImageFilter.GaussianBlur(34))
pil.save(os.path.join(OUT_FULL, "field-bg.webp"), "WEBP", quality=80, method=4)
print("背景图生成 ->", os.path.join(OUT_FULL, "field-bg.webp"))

# 汇报体积对比
def dir_size(d):
    return sum(os.path.getsize(os.path.join(d, f)) for f in os.listdir(d) if os.path.isfile(os.path.join(d, f)))
orig = sum(os.path.getsize(os.path.join(ROOT, p)) for p in paths)
print("\n原始 %d 张总计: %.1f MB" % (len(paths), orig / 1048576))
print("WebP full 总计: %.2f MB" % (dir_size(OUT_FULL) / 1048576))
print("WebP tiny 总计: %.1f KB" % (dir_size(OUT_TINY) / 1024))
