/* ============================================================
   作品场 · 首页嵌入版（星图总览）
   - 20 件作品（除无名之手）同屏错落、羽化重叠、零死黑
   - 呼吸式浮动 + 越靠前越强的鼠标视差
   - 点击：丝滑聚焦交换（升最前 / 最近退远景）+ 复用原站详情
   - 可拖拽改位置（Apple 式弹性）
   - 性能：懒加载（仅进场前才下）+ blur-up 极小预览垫底 + layout 去抖
   ============================================================ */
(function(){
  "use strict";

  const SERIES = {
    1:{name:"01 — 百合花白马系列", color:"#c9a24b"},
    2:{name:"02 — 身体研究与手的变体", color:"#b5453f"},
    3:{name:"03 — 流体肖像与解构人像", color:"#8f6fb0"},
    4:{name:"04 — 抽象流体绘画", color:"#3f9aa6"},
    5:{name:"05 — 抽象3D与建筑空间", color:"#c0703f"},
    6:{name:"06 — 电影感与长卷肖像", color:"#9aa6b0"},
    7:{name:"07 — 感知边界实验", color:"#5aa06a"}
  };

  const WORKS = [
    {s:1,tier:"heavy",img:"assets/images/百合花白马最新800MM焦距png亮面丝绸(1).png",title:"百合花白马 · 亮面丝绸（主版）",desc:"核心作品。以3D建模塑造一匹通体银白、表面如亮面丝绸般反光的白马，鬃毛处绽放一朵鎏金质感的百合花。马身侧面融入克林姆特式的金色螺旋与几何装饰纹样，脚下铺设红蓝交织的透视网格地面，一枚正红球体悬浮于画面右侧，形成冷暖对撞的视觉锚点。"},
    {s:1,tier:"mid",img:"assets/images/百合花白马最新800MM焦距png反转色.png",title:"百合花白马 · 反转色变体",desc:"同一构图的负片/反转色版本。移除了红色球体，整体色调偏青蓝冷调，金色纹样转为暗沉的青铜质感。通过色彩反转探索同一形态在不同光谱下的存在方式。"},
    {s:1,tier:"light",img:"assets/images/IMG_20260405_190808.jpg",title:"百合花白马 · 唱片封套",desc:"将主版构图重新编排为黑胶唱片封面的形式语言：圆形裁切区域展示核心图像，下方留白并附以模拟音乐播放器的UI控件（进度条、播放按钮等）。控件为纯视觉装饰元素，探讨数字艺术在模拟媒介中的再语境化可能。"},
    {s:1,tier:"light",img:"assets/images/retouch_2025110112445302.jpg",title:"百合花白马 · 六格变体矩阵",desc:"以2×3矩阵展示同一白马+百合构图在不同后期处理下的六种面貌：金色原版、高对比暗调、灰阶反转、低饱和冷色、故障艺术色偏、以及红蓝双色调分离。每一格都是同一“物”在不同感知滤镜下的分身。"},

    {s:2,tier:"heavy",img:"assets/images/MEITU_20251231_172505115.jpg",title:"Bàn tay · Chín cách nhìn",desc:"同一只手，九种视觉语法并行：<br>一、红宝石质地——水沿着指节滴落。<br>二、红外暗涌——余温在掌纹中呼吸。<br>三、X 光——青紫色骨骼静默。<br>四、热成像——橙黄渐层如将熄的脉息。<br>五、水雾——轮廓半透，正在逃逸。<br>六、点阵——肌理分解为离散的星群。<br>七、光影——分身叠印出平行时空。<br>八、液态——银白从指隙间流亡。<br>九、紫外——旧伤泛起幽蓝月相。"},
    {s:2,tier:"heavy",img:"assets/images/retouch_2025110112454483.jpg",title:"手 · 3D材质雕刻",desc:"将手的形态通过3D雕刻赋予多种矛盾的物质属性：上排左起——风化石质（粗糙肌理）、玻璃态（半透明折射）、文字点阵构成（信息即物质）；下排中央——RGB通道分离的彩色故障态；其余为金属铜绿与冰霜结晶版本。以ZBrush数字黏土完成的材质实验，探索同一形态如何在异质材料中保持身份。"},
    {s:2,tier:"heavy",img:"assets/images/MEITU_20251231_192537304.jpg",title:"Manus Multiplex",desc:"雾中红丝绒宝石掌——为肉身本源。多格分列不同物质维度的手：热成像的灼热温度、透光的光刻肌理、字符堆砌的数字虚拟躯体、撞色霓虹的感知轮廓。血肉实体、情绪体温、数字分身被拆解重组。手是人与万物的触点，不同材质对应我们和世界相处的无数种形态——虚实不分，肉身与代码共生。"},
    {s:2,tier:"light",img:"assets/images/IMG_1861.jpg",title:"指纹里流淌的二进制河",desc:"回车键长出甲骨文的裂纹，光缆在指节间织网时，所有代码突然生出脊椎骨。<br><br>作品以 Cinema 4D 完成主体形态与材质参数化设计，通过 MoGraph 驱动字符粒子沿手指轮廓流动，输出端用 Octane 渲染玻璃质感与光晕。属于“动态设计 / 视觉 / 3D / 参数化设计”四线交织的一次实验——当最古老的指纹纹路与最当代的代码流并行于同一只手，身体便不再只是肉身，而成为所有媒介的母体。"},

    {s:3,tier:"heavy",img:"assets/images/菩萨.png",title:"菩萨 · 流体解构",desc:"人物以纯黑色剪影呈现，轮廓清晰而面容模糊，身上覆盖大面积的红蓝流体颜料泼溅与渗洇效果。背景是白色基底上叠加的淡雅水彩纹理（似古典建筑的残影）。“菩萨”之名在此并非宗教指涉，而是借用神圣意象来反衬数字时代肖像的破碎与重组。"},
    {s:3,tier:"light",img:"assets/images/Screenshot_2025-10-18-20-24-08-95_99c04817c0de5652397fc8b56c3b3817.jpg",title:"无题 · 头巾波纹",desc:"红色的圆形光环笼罩着人物头部，蓝色的衣袍布满水波般的扭曲纹理，边缘带有明显的数字故障/扫描线效果。面部表情平静到近乎空洞，在强烈的红蓝色彩冲突中保持着一种奇异的疏离感。黑色背景使整个人物悬浮于虚空之中，如同一个来自未知频道的信号碎片。"},
    {s:3,tier:"mid",img:"assets/images/retouch_2025081414350095.jpg",title:"无题 · 蓝发晶体",desc:"一位苍白到近乎瓷质的人物侧影，长发呈深蓝色如水流般倾泻而下。半透明的薄纱覆在面上，使五官若隐若现。下颌与颈侧生长出红色的多面晶体结构——既像矿物结晶，又像某种寄生的技术器官；肩下迸发出锋利的蓝色冰晶碎块。一条细红线横贯眼部附近：是手术切口？地平线？或者两者皆是。冷蓝主调中被零星的红色不断刺穿，3D渲染与数字绘画在此交汇为一个疏离而精确的在场。"},
    {s:3,tier:"light",img:"assets/images/新.jpg",title:"无题 · 红色熔炉",desc:"整个画面被浸入单色的红色之中——不是平静的红，而是炽热的、几乎具有温度的熔岩红。多个面孔在红色的浑浊中浮现又淹没：中央一张清晰的脸孔向上凝视，左侧一张侧脸在边缘处崩解，右下角另一张面容正从液态中艰难挣脱。表面布满龟裂纹路——如干涸的河床，或冷却中的岩浆——深色流体从每一处裂隙中向下滴落。多个自我在同一片红色场域中共存、消融、再生。"},

    {s:4,tier:"mid",img:"assets/images/蓝色流体植物.png",title:"无题 · 蓝色植物",desc:"群青色深处，纵向笔触如帘幕垂落——似雨，亦似光穿透深水。中央一株白青色的形态向上舒展，状如棕榈，又如某种深海植物的荧光躯体。笔触厚实而富有方向感，白色形体在幽暗中自行发光。它似乎正从蓝色场域中升起，也随时可能被重新吸收。接近丙烯倾倒（acrylic pour）的技法逻辑——让颜料自己决定去向，作者只在临界处施加微弱的意志。一件关于“沉浸”的作品。"},
    {s:4,tier:"light",img:"assets/images/retouch_2024032121030193.jpg",title:"无题 · 流体飞鸟",desc:"一只蜂鸟（或某种更小的飞禽），通体呈现青蓝-绿松石的液态金属光泽，悬停于画面中央。它的周围是粉、珊瑚橙、乳白、淡蓝交织而成的流体漩涡——如油彩浮于水面，如大理石纹理自行演化。鸟身本身由与其环境相同的物质构成，这意味着“图形”与“背景”共享同一种存在状态，所谓的“鸟”不过是永恒流动中一次短暂的凝聚。如同屏住呼吸的那个瞬间。"},

    {s:5,tier:"mid",img:"assets/images/IMG_20260405_190358.png",title:"五联 · 抽象流体雕塑",desc:"五幅3D渲染的抽象流体形态组合：左上为冰蓝色半透明有机体、右上为银白金属质感雕塑（红底）、左下为黑白高对比版本、右中为线框结构图、右下为浅色柔和版。一条贯穿画面的红色斜线像伤口一样切开所有形态，暗示破坏性力量在完美造物中的必然在场。"},
    {s:5,tier:"heavy",img:"assets/images/IMG_20260210_090302.jpg",title:"无题 · 哥特的余烬",desc:"一个哥特式教堂内部的空间叙事：天使雕像高举火炬立于穹顶之下，两侧科林斯柱支撑着拱券，前景是一座华丽的巴洛克钟柜。整个场景浸透在大面积红色光晕之中，如同一场永不熄灭的火灾，或某种仪式性的血光照明。空间本身成为情绪的容器。"},

    {s:6,tier:"mid",img:"assets/images/MEITU_20260307_192450919.jpg",title:"KINO · 冬之枯木与白发",desc:"一位黑皮肤、白发的女性侧影，置身于雨雪交织的灰蓝色调中。画面下方和肩部生长出白色的枯枝状结构——如同冬天里冻僵的树干从身体内部穿透而出，又似某种共生关系：人即树，树即人。整体笼罩在电影海报式的排版语言中（“A FILM BY MEITU / KINO”），虚构了一部关于寒冷、枯萎与静默生存的电影剧照。氛围感极强——不是悲伤，而是一种近乎植物性的忍耐。"},
    {s:6,tier:"light",img:"assets/images/MEITU_20260307_191145286.jpg",title:"L'Arborescence sous la Neige",desc:"一片以覆雪枯木为基底的冬日剧场。纵向长卷中，繁复交错的无叶枝影互相渗透，在灰白雾气中渐渐化为人形——仿佛人即树影，树影即人，不可分辨的边界是这场雪最沉默的语法。银白色长发顺着画幅倾泻而下，仿如正在堆积的雪层。远景的几只飞鸟、近处一两朵素白小花，是这片严寒秩序中唯一温热的呼吸。整幅画面以黑、白、灰的克制色阶构筑，在荒芜的底色之上包裹着一层柔和霜雪——关于孤寂，也关于寒冬里仅存的自愈。"},

    {s:7,tier:"light",img:"assets/images/羊羊眼www.png",title:"羊羊眼 · 彩色线条凝视",desc:"对一只眼睛的极端放大与线描重构。眼球被分解为数千条纤细的彩色线条——红、橙、黄、绿、青、蓝——每一根线条都是一次单独的描摹轨迹，共同编织出虹膜与睫毛建立的复杂拓扑结构。眉弓处的线条则呈弧形扫过，如同水流冲刷河床的痕迹。观看的对象反过来凝视着观看者。"},
    {s:7,tier:"heavy",img:"assets/images/重修8.png",title:"无题 · 红框解构",desc:"一只青蓝色的线描眼球，虹膜的每一道褶皱与睫毛的每一根走向都被忠实还原，瞳孔深处却嵌套着无数层叠的小眼——仿佛凝视之中还有凝视。眼眶四周被大小不一的红色矩形选框框定，顶部、左侧、下方分别注以“活着”“囚困”“是他还是我”等字样，顶端散落着堆叠的问号。框与字与眼共同构成一个精神困境的闭环：主体被视线、评判、生存压力层层裹挟，红与蓝对冲的线条外化心头翻涌不息的躁意。临床的“观看工具”语言与极度私密的注视对象之间形成根本张力——当我们试图用框架去理解所见之物，我们究竟是在看清它，还是在囚禁它？"}
  ];

  // 路径转 WebP（full 用于展示/详情，tiny 用于 blur-up 垫底）
  WORKS.forEach(w=>{
    const base = w.img.replace(/^assets\/images\//, "").replace(/\.(png|jpe?g)$/i, "");
    w.tiny = "assets/images/field-webp/tiny/" + base + ".webp";
    w.img  = "assets/images/field-webp/" + base + ".webp";
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TIER = {
    heavy:{fac:1.72, blur:0,   bright:1.00, z:30, depth:1.00},
    mid:  {fac:1.36, blur:0,   bright:0.94, z:18, depth:0.60},
    light:{fac:1.10, blur:0.6, bright:0.88, z:8,  depth:0.35}
  };
  function seeded(i){ const x=Math.sin(i*127.1+311.7)*43758.5453; return x-Math.floor(x); }

  const field = document.getElementById("field");
  if(!field) return;
  const tiles = [];

  // layout 去抖：多张 tiny 陆续解码时，合并成一次 rAF 重排
  let layoutQueued = false;
  function scheduleLayout(){
    if(layoutQueued) return;
    layoutQueued = true;
    requestAnimationFrame(()=>{ layoutQueued = false; layout(); });
  }

  WORKS.forEach((w,i)=>{
    const el = document.createElement("div");
    el.className = "tile";
    const ph = document.createElement("div");
    ph.className = "tile__ph";
    ph.style.backgroundImage = `url("${w.tiny}")`;
    const img = document.createElement("img");
    img.alt = w.title; img.draggable = false; img.decoding = "async";
    img.addEventListener("load", ()=>img.classList.add("is-loaded"));
    const cap = document.createElement("div");
    cap.className = "tile__cap";
    cap.innerHTML = `<div class="tile__capbg"></div><div class="tile__name">${w.title}</div>`;
    el.appendChild(ph);
    el.appendChild(img);
    el.appendChild(cap);
    field.appendChild(el);

    const t = {
      el, img, ph, work:w, i,
      natW:0, natH:0, dispW:0, dispH:0,
      anchorX:0, anchorY:0,
      curX:0, curY:0,
      dragX:0, dragY:0, targetX:0, targetY:0,
      dragging:false, moved:0, downX:0, downY:0, grabDX:0, grabDY:0,
      phase: seeded(i)*Math.PI*2,
      period: 15 + seeded(i+50)*8,
      amp: 9 + seeded(i+99)*9,
      lift:1, boost:1, eBlur:0, eBright:1, eZ:0,
      tBoost:1, tEBlur:0, tEBright:1, tEZ:0,
      _lastFilter:null, _lastZ:null,
      fullLoaded:false, fullLoading:false
    };
    tiles.push(t);

    // 极小预览图即时解码 → 取宽高比，立刻布局（不依赖大图）
    const probe = new Image();
    probe.onload = ()=>{
      t.natW = probe.naturalWidth || 400;
      t.natH = probe.naturalHeight || 400;
      scheduleLayout();
    };
    probe.src = w.tiny;

    // 懒加载大图（仅当作品场临近视口时触发，错峰避免 20 张同时解码）
    t.loadFull = function(){
      if(t.fullLoaded || t.fullLoading) return;
      t.fullLoading = true;
      const pre = new Image();
      pre.decoding = "async";
      pre.onload = ()=>{ img.src = w.img; t.fullLoaded = true; };
      pre.onerror = ()=>{ t.fullLoading = false; };
      pre.src = w.img;
    };

    el.addEventListener("pointerdown", e=>{
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      t.dragging = true; t.moved = 0;
      t.downX = e.clientX; t.downY = e.clientY;
      t.grabDX = e.clientX - t.curX;
      t.grabDY = e.clientY - t.curY;
      el.classList.add("dragging");
    });
    el.addEventListener("pointermove", e=>{
      if(!t.dragging) return;
      const dx = e.clientX - t.downX, dy = e.clientY - t.downY;
      t.moved = Math.max(t.moved, Math.hypot(dx,dy));
      t.targetX = (e.clientX - t.grabDX) - t.anchorX;
      t.targetY = (e.clientY - t.grabDY) - t.anchorY;
    });
    const endDrag = ()=>{
      if(!t.dragging) return;
      t.dragging = false;
      el.classList.remove("dragging");
      if(t.moved < 6){ focusSwap(t); openDetail(t.work); }
      else { t.anchorX += t.targetX; t.anchorY += t.targetY; t.targetX=0; t.targetY=0; }
    };
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
  });

  function focusSwap(active){
    let nearest=null, best=Infinity;
    for(const o of tiles){
      if(o===active) continue;
      const d = Math.hypot(o.anchorX-active.anchorX, o.anchorY-active.anchorY);
      if(d<best){ best=d; nearest=o; }
    }
    for(const o of tiles){
      o.tBoost=1; o.tEBlur=0; o.tEBright=1; o.tEZ=0;
    }
    active.tBoost=1.16; active.tEBlur=0;   active.tEBright=1.0; active.tEZ=60;
    if(nearest){ nearest.tBoost=0.84; nearest.tEBlur=1.5; nearest.tEBright=0.72; nearest.tEZ=-6; }
  }

  function layout(){
    const vw = field.clientWidth || window.innerWidth;
    const vh = field.clientHeight || window.innerHeight;
    const cols = vw < 760 ? 3 : 5;
    const rows = Math.ceil(WORKS.length / cols);
    const cellW = vw/cols, cellH = vh/rows;
    const minCell = Math.min(cellW, cellH);
    WORKS.forEach((w,idx)=>{
      const t = tiles[idx];
      const col = idx % cols, row = Math.floor(idx/cols);
      const jx = (seeded(idx*2+1)-0.5) * cellW * 0.34;
      const jy = (seeded(idx*2+2)-0.5) * cellH * 0.34;
      t.anchorX = cellW*(col+0.5) + jx;
      t.anchorY = cellH*(row+0.5) + jy;
      const fac = TIER[w.tier].fac;
      const base = fac * minCell;
      const sc = base / Math.max(t.natW, t.natH);
      t.dispW = Math.max(80, t.natW*sc);
      t.dispH = Math.max(80, t.natH*sc);
      t.img.style.width = t.dispW + "px";
      t.img.style.height = t.dispH + "px";
      t.ph.style.width = t.dispW + "px";
      t.ph.style.height = t.dispH + "px";
      if(!t.dragging) t.el.style.zIndex = TIER[w.tier].z + (t.eZ|0);
      if(t.curX===0 && t.curY===0){ t.curX = t.anchorX; t.curY = t.anchorY; }
    });
  }
  window.addEventListener("resize", layout);

  let mx = 0, my = 0, rafId = null;
  if(!reduceMotion){
    window.addEventListener("pointermove", e=>{
      mx = (e.clientX/window.innerWidth - 0.5);
      my = (e.clientY/window.innerHeight - 0.5);
    });
  }
  function frame(ts){
    const time = ts/1000;
    for(const t of tiles){
      const T = TIER[t.work.tier];
      const liftTarget = t.dragging ? 1.07 : 1;
      t.lift   += (liftTarget - t.lift) * 0.22;
      t.boost  += (t.tBoost  - t.boost ) * 0.12;
      t.eBlur  += (t.tEBlur  - t.eBlur ) * 0.12;
      t.eBright+= (t.tEBright- t.eBright) * 0.12;
      t.eZ     += (t.tEZ     - t.eZ    ) * 0.12;

      let x, y;
      if(t.dragging){
        t.dragX += (t.targetX - t.dragX)*0.25;
        t.dragY += (t.targetY - t.dragY)*0.25;
        x = t.anchorX + t.dragX;
        y = t.anchorY + t.dragY;
      } else {
        t.dragX += (0 - t.dragX)*0.08;
        t.dragY += (0 - t.dragY)*0.08;
        const bx = reduceMotion ? 0 : Math.sin(time/t.period*Math.PI*2 + t.phase) * t.amp;
        const by = reduceMotion ? 0 : Math.cos(time/t.period*1.6*Math.PI*2 + t.phase) * t.amp*0.7;
        const px = reduceMotion ? 0 : mx * T.depth * 20;
        const py = reduceMotion ? 0 : my * T.depth * 20;
        x = t.anchorX + t.dragX + bx + px;
        y = t.anchorY + t.dragY + by + py;
      }
      t.curX = x; t.curY = y;

      const scale = t.lift * t.boost;
      // transform 每帧写（浮动/视差必需），用 translate3d 走 GPU 合成
      t.el.style.transform =
        `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%) scale(${scale.toFixed(4)})`;

      // filter / zIndex 脏检查：值没变化就不碰 DOM（省掉每帧的模糊重算）
      const blur = Math.max(0, T.blur + t.eBlur);
      const bright = Math.min(1.1, Math.max(0.4, T.bright * t.eBright));
      let fStr;
      if(blur < 0.05){
        fStr = (Math.abs(bright-1) < 0.005) ? "none" : `brightness(${bright.toFixed(3)})`;
      } else {
        fStr = `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(3)})`;
      }
      if(fStr !== t._lastFilter){ t.img.style.filter = fStr; t._lastFilter = fStr; }
      const z = T.z + Math.round(t.eZ);
      if(z !== t._lastZ){ t.el.style.zIndex = z; t._lastZ = z; }
    }
    rafId = requestAnimationFrame(frame);
  }
  function startLoop(){ if(rafId === null) rafId = requestAnimationFrame(frame); }
  function stopLoop(){ if(rafId !== null){ cancelAnimationFrame(rafId); rafId = null; } }

  // 只在作品场临近视口时才运行动画 + 懒加载大图，滚离即暂停，避免拖累整页
  const section = field.closest(".field-section") || field;
  let fullLoadStarted = false;
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(entries=>{
      for(const e of entries){
        if(e.isIntersecting){
          startLoop();
          if(!fullLoadStarted){
            fullLoadStarted = true;
            tiles.forEach((t,i)=> setTimeout(()=>t.loadFull(), i*40));
          }
        } else {
          stopLoop();
        }
      }
    }, {threshold:0, rootMargin:"600px"});
    io.observe(section);
  } else {
    startLoop();
    tiles.forEach((t)=>t.loadFull());
  }

  /* ---------- 详情浮层（复用原站「图+标题+描述」） ---------- */
  const detail = document.getElementById("fieldDetail");
  const dImg = document.getElementById("fieldDetailImg");
  const dSeries = document.getElementById("fieldDetailSeries");
  const dTitle = document.getElementById("fieldDetailTitle");
  const dDesc = document.getElementById("fieldDetailDesc");

  function clickSound(){
    try{
      const AC = window.AudioContext || window.webkitAudioContext;
      const ac = new AC();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type="sine";
      o.frequency.setValueAtTime(132, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(80, ac.currentTime+0.12);
      g.gain.setValueAtTime(0.06, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+0.16);
      o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+0.18);
    }catch(e){}
  }
  function openDetail(w){
    clickSound();
    dImg.src = w.img; dImg.alt = w.title;
    dSeries.textContent = SERIES[w.s].name;
    dTitle.textContent = w.title;
    dDesc.innerHTML = w.desc;
    detail.classList.add("open");
    detail.setAttribute("aria-hidden","false");
  }
  function closeDetail(){
    detail.classList.remove("open");
    detail.setAttribute("aria-hidden","true");
  }
  detail.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click", closeDetail));
  window.addEventListener("keydown", e=>{ if(e.key==="Escape") closeDetail(); });
})();
