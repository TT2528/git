/* ============================================
   999 流体艺术作品集 - 交互逻辑
   MOTION_INTENSITY: 6
   ============================================ */

(function () {
  'use strict';

  /* --- 滚动双向淡进淡出 — 图片 + 文字 + 板块 --- */
  var revealTargets = document.querySelectorAll('.reveal, .reveal-img, .reveal-text, .reveal-section');

  if ('IntersectionObserver' in window && revealTargets.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            /* 图片保持双向淡进淡出；文字/板块只淡进不淡出 */
            if (entry.target.classList.contains('reveal') ||
                entry.target.classList.contains('reveal-img')) {
              entry.target.classList.remove('visible');
            }
          }
        });
      },
      {
        threshold: 0.10,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* 回退方案：仅淡进 */
    function handleReveal() {
      var windowH = window.innerHeight;
      revealTargets.forEach(function (el) {
        if (el.getBoundingClientRect().top < windowH * 0.88) {
          el.classList.add('visible');
        }
      });
    }
    window.addEventListener('scroll', handleReveal, { passive: true });
    window.addEventListener('load', handleReveal);
    handleReveal();
  }

  /* --- 导航高亮 --- */
  var navLinks = document.querySelectorAll('.nav-links a');
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* --- 移动端导航切换 --- */
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu   = document.querySelector('.nav-links');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  /* --- 表单提交：依赖 form 的 action 属性，不做无后端拦截 --- */
  var form = document.querySelector('.contact__form');
  if (form && !form.getAttribute('action')) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.form-submit');
      btn.textContent = '已收到';
      btn.style.background = 'var(--fg)';
      btn.style.color = 'var(--ink)';
      setTimeout(function () {
        btn.textContent = '发送留言';
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 2000);
    });
  }

  /* --- 作品卡片轻量视差 --- */
  var cards = document.querySelectorAll('.project-card, .grid-asymmetric .item');

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      var img = card.querySelector('img');
      if (img) {
        img.style.transform =
          'scale(1.04) translate(' + (x * 8) + 'px,' + (y * 8) + 'px)';
      }
    });

    card.addEventListener('mouseleave', function () {
      var img = card.querySelector('img');
      if (img) {
        img.style.transform = '';
      }
    });
  });

  /* --- 页面进入动画 --- */
  document.body.classList.add('page-enter');

  /* --- 图片加载完成：移除骨架屏动画 --- */
  var imageContainers = document.querySelectorAll('.work-item__img-wrap, .home-work__img, .wf-media, .work-card__img');
  imageContainers.forEach(function (container) {
    var img = container.querySelector('img');
    if (!img) { container.classList.add('loaded'); return; }
    if (img.complete && img.naturalHeight !== 0) {
      container.classList.add('loaded');
    } else {
      img.addEventListener('load', function () { container.classList.add('loaded'); });
      img.addEventListener('error', function () { container.classList.add('loaded'); });
    }
  });

  /* --- 灯箱 Lightbox --- */
  var lightbox = document.getElementById('lightbox');
  var portfolioImages = [];
  var currentIndex = 0;

  if (lightbox) {
    var lightboxImg = lightbox.querySelector('.lightbox__img');
    var lightboxTitle = lightbox.querySelector('.lightbox__title');
    var lightboxCounter = lightbox.querySelector('.lightbox__counter');
    var lightboxClose = lightbox.querySelector('.lightbox__close');
    var lightboxPrev = lightbox.querySelector('.lightbox__prev');
    var lightboxNext = lightbox.querySelector('.lightbox__next');

    var workItems = document.querySelectorAll('.work-item');
    workItems.forEach(function (item) {
      var img = item.querySelector('img');
      var title = item.querySelector('.work-item__name');
      if (img) {
        portfolioImages.push({
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt') || '',
          title: title ? title.textContent : ''
        });
      }
    });

    function openLightbox(index) {
      currentIndex = index;
      var data = portfolioImages[currentIndex];
      lightboxImg.setAttribute('src', data.src);
      lightboxImg.setAttribute('alt', data.alt);
      lightboxTitle.textContent = data.title;
      lightboxCounter.textContent = (currentIndex + 1) + ' / ' + portfolioImages.length;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % portfolioImages.length;
      openLightbox(currentIndex);
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + portfolioImages.length) % portfolioImages.length;
      openLightbox(currentIndex);
    }

    workItems.forEach(function (item, index) {
      var imgWrap = item.querySelector('.work-item__img-wrap');
      if (imgWrap) {
        imgWrap.style.cursor = 'zoom-in';
        imgWrap.addEventListener('click', function (e) {
          e.preventDefault();
          openLightbox(index);
        });
      }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

  /* --- 返回顶部 --- */
  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', '返回顶部');
  backToTop.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', function () {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* 首页 hero "Scroll" → 平滑跳转到作品场（#fieldSection） */
  var heroScrollLink = document.getElementById('heroScrollLink');
  if (heroScrollLink) {
    heroScrollLink.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById('fieldSection');
      if (!target) return;
      if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function toggleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  /* === 界面点击音效（v16 · D1 沉木）：全局统一、默认开启、无开关 === */
  (function initUiSound() {
    var ctx;
    function ac() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }

    /* D1 组成之一：低频正弦本体 */
    function tone(opt) {
      var c = ac(); if (!c) return;
      var t = c.currentTime, dur = opt.dur || 0.03, peak = opt.peak || 0.05,
          lp = opt.lp || 4500, type = opt.type || 'sine';
      var o = c.createOscillator(), g = c.createGain(), f2 = c.createBiquadFilter();
      o.type = type; o.frequency.setValueAtTime(opt.freq, t);
      if (opt.slideTo && opt.slideTo > 0) o.frequency.exponentialRampToValueAtTime(opt.slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      f2.type = 'lowpass'; f2.frequency.value = lp;
      o.connect(g); g.connect(f2); f2.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.03);
    }

    /* D1 组成之二：木质瞬态噪声 */
    function noise(opt) {
      var c = ac(); if (!c) return;
      var t = c.currentTime, dur = opt.dur || 0.05, peak = opt.peak || 0.04;
      var len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);
      var src = c.createBufferSource(); src.buffer = buf;
      var f = c.createBiquadFilter(); f.type = opt.filter || 'bandpass'; f.frequency.value = opt.freq || 1300; f.Q.value = opt.q || 1;
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(c.destination);
      src.start(t); src.stop(t + dur + 0.03);
    }

    /* D1「沉木·修订」——木头闷击：极低频本体 + 极闷低通 + 频率下沉余韵，去掉泡泡脆感 */
    function tap() {
      try {
        tone({ freq: 110, type: 'sine', dur: 0.13, peak: 0.09, lp: 360, slideTo: 72 });
        noise({ freq: 160, q: 0.5, dur: 0.012, peak: 0.018, filter: 'lowpass' });
      } catch (err) {}
    }

    var SEL = 'a, button, .nav-logo, .work-item__img-wrap, .back-to-top, .section-nav__link, [data-sound], label, input[type="submit"], input[type="button"]';
    document.addEventListener('click', function (e) {
      var el = e.target.closest(SEL);
      if (!el) return;
      tap();
      /* 站内普通链接：先播音效再跳转，避免页面卸载切断声音 */
      if (el.tagName === 'A') {
        var href = el.getAttribute('href') || '';
        var isExternal = el.getAttribute('target') === '_blank' ||
                         (/^https?:\/\//.test(href) && href.indexOf(location.hostname) === -1);
        var isSpecial = href.charAt(0) === '#' || /^mailto:|^tel:/.test(href);
        if (href && !isExternal && !isSpecial) {
          e.preventDefault();
          setTimeout(function () { window.location.href = el.href; }, 120);
        }
      }
    }, false);
  })();

  /* === 01 惯性平滑滚动（Lenis）===
     仅桌面/鼠标设备启用；移动端、触屏、prefers-reduced-motion 均走原生滚动。
     CDN 加载失败时优雅降级为原生滚动，不影响任何功能。 */
  (function initSmoothScroll() {
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js';
    s.async = true;
    s.onload = function () {
      if (!window.Lenis) return;
      var lenis = new window.Lenis({
        duration: 1.15,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      window.__lenis = lenis;
    };
    s.onerror = function () { /* 优雅降级：原生滚动 */ };
    document.head.appendChild(s);
  })();

  /* === 04 磁吸按钮 ===
     跳转类按钮随光标轻微吸附，增强"可被点击"的高级手感。
     同样仅桌面/鼠标设备；保留元素原有 transition（追加 transform，不覆盖 hover 动画）。 */
  (function initMagnetic() {
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    var SELS = '.home-bilingual__cta, .section-nav__link, .model-card__more, .nav-links a';
    var els = document.querySelectorAll(SELS);
    var strength = 0.32;
    els.forEach(function (el) {
      var cur = window.getComputedStyle(el).transition;
      el.style.transition = (cur && cur !== 'none' ? cur + ', ' : '') +
        'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  })();

})();
