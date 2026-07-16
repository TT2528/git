import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = r"C:\Users\HP\WorkBuddy\2026-06-20-19-07-27"
W, H = 1200, 630

# 底色 #0b0912
base = np.zeros((H, W, 3), np.float32)
base[:] = (11, 9, 18)

# 五彩流体光晕（呼应网站深色渐变）
blobs = [
    (0.18, 0.22, 0.42, (94, 54, 132), 0.55),
    (0.82, 0.28, 0.40, (28, 74, 108), 0.52),
    (0.80, 0.82, 0.44, (120, 38, 52), 0.50),
    (0.20, 0.82, 0.42, (30, 86, 62), 0.48),
    (0.50, 0.52, 0.55, (52, 44, 92), 0.42),
]
yy, xx = np.mgrid[0:H, 0:W]
for cx, cy, rad, (r, g, b), s in blobs:
    nx = (xx / W) - cx
    ny = (yy / H) - cy
    dist = np.sqrt(nx * nx + ny * ny)
    g = np.exp(-(dist / rad) ** 2)
    base[:, :, 0] += r * s * g
    base[:, :, 1] += g * s * g
    base[:, :, 2] += b * s * g

base = np.clip(base, 0, 255).astype(np.uint8)
img = Image.fromarray(base, "RGB").filter(ImageFilter.GaussianBlur(46))

# 暗角
vig = np.ones((H, W), np.float32)
yy2, xx2 = np.mgrid[0:H, 0:W]
cx, cy = W / 2, H / 2
d = np.sqrt(((xx2 - cx) / (W / 2)) ** 2 + ((yy2 - cy) / (H / 2)) ** 2)
vig = np.clip(1.0 - (d - 0.55) * 0.9, 0.35, 1.0)
img = Image.fromarray((np.array(img).astype(np.float32) * vig[..., None]).astype(np.uint8), "RGB")

d = ImageDraw.Draw(img)

def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

af = r"C:\Windows\Fonts\arial.ttf"
# 主视觉 999
f999 = font(af, 300)
d.text((W / 2, H / 2 - 30), "999", font=f999, fill=(242, 240, 234), anchor="mm")
# 顶部小标
ftop = font(af, 30)
d.text((W / 2, 96), "A PRACTICE IN FLUID ART", font=ftop, fill=(150, 150, 155), anchor="mm")
# 底部副题
fsub = font(af, 36)
d.text((W / 2, H / 2 + 158), "YAN  SHENG   —   FLUID  ART", font=fsub, fill=(205, 203, 198), anchor="mm")

out = f"{ROOT}/assets/images/share-cover.jpg"
img.save(out, "JPEG", quality=88)
print("saved", out, img.size)
