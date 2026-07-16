/**
 * 999 Hero — 液体形变文字效果
 * 鼠标移动时，文字产生流体扭曲/形变
 */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  let W, H;
  let mouse = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5 };
  let points = [];
  const TEXT = '999';
  let fontSize, textWidth, textHeight;

  /* ---- 网格点，用于形变 ---- */
  class Point {
    constructor(x, y) {
      this.originX = x;
      this.originY = y;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
    }
    update(mx, my, sw, sh) {
      const dx = this.originX - mx * sw;
      const dy = this.originY - my * sh;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 180;
      if (dist < radius) {
        const force = (1 - dist / radius) * 40;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
      }
      this.vx *= 0.9;
      this.vy *= 0.9;
      this.x = this.originX + this.vx;
      this.y = this.originY + this.vy;
    }
  }

  function resize() {
    const hero = canvas.parentElement;
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    fontSize = Math.min(W * 0.18, H * 0.35, 280);
    ctx.font = `100 ${fontSize}px Inter, "Noto Sans SC", sans-serif`;
    textWidth = ctx.measureText(TEXT).width;
    textHeight = fontSize;

    initPoints();
  }

  function initPoints() {
    points = [];
    const cols = 30;
    const rows = 12;
    const startX = (W - textWidth) / 2;
    const startY = (H + textHeight * 0.7) / 2;
    const stepX = textWidth / cols;
    const stepY = textHeight / rows;

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const x = startX + c * stepX;
        const y = startY - r * stepY;
        // 仅保留文字轮廓附近的点 —— 用 getImageData 判断
        points.push(new Point(x, y));
      }
    }
  }

  /* 用离屏 canvas 判断某点是否在文字内 */
  let textMask = null;
  function buildTextMask() {
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const oc = off.getContext('2d');
    oc.fillStyle = '#000';
    oc.font = `100 ${fontSize}px Inter, "Noto Sans SC", sans-serif`;
    oc.textBaseline = 'middle';
    oc.fillText(TEXT, (W - textWidth) / 2, H / 2);
    textMask = oc.getImageData(0, 0, W, H).data;
  }

  function isInText(x, y) {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || py < 0 || px >= W || py >= H) return false;
    const i = (py * W + px) * 4;
    return textMask && textMask[i + 3] > 0;
  }

  /* ---- 绘制 ---- */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 背景：用作品图作为文字的填充
    const bgImg = document.querySelector('.hero-bg img');
    if (bgImg && bgImg.complete) {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.filter = 'blur(2px)';
      ctx.drawImage(bgImg, 0, 0, W, H);
      ctx.restore();
    }

    // 绘制点阵
    ctx.fillStyle = 'rgba(196, 181, 160, 0.85)';
    for (const p of points) {
      if (isInText(p.x, p.y)) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 连接邻近点 —— 仅限文字内部
    ctx.strokeStyle = 'rgba(196, 181, 160, 0.25)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (!isInText(p.x, p.y)) continue;
      if (i + 1 < points.length && isInText(points[i + 1].x, points[i + 1].y)) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  function updatePoints() {
    for (const p of points) {
      p.update(mouse.x, mouse.y, W, H);
    }
    requestAnimationFrame(updatePoints);
  }

  /* ---- 事件 ---- */
  canvas.addEventListener('mousemove', (e) => {
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = e.clientX / W;
    mouse.y = e.clientY / H;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = 0.5;
    mouse.y = 0.5;
  });

  /* ---- 启动 ---- */
  window.addEventListener('resize', () => {
    resize();
    buildTextMask();
  });

  // 等字体加载
  document.fonts.ready.then(() => {
    resize();
    buildTextMask();
    draw();
    updatePoints();
  });
})();
