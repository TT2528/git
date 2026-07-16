import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * 在指定容器内渲染「无名之手」点云装置。
 * 直接读取烘焙好的 POINTS 格式 GLB（含 position + 顶点色），
 * 不再运行时做网格表面采样，加载更快、体积更小。
 *
 * @param {HTMLElement} container
 * @param {Object} opts
 *   modelUrl    模型路径
 *   textSymbol  点贴图字符（默认 '9'）
 *   particleSize 点尺寸
 *   cameraZ     相机距离
 *   autoRotate  是否自动旋转
 *   onLoaded / onError 回调
 */
export function initPointCloud(container, opts = {}) {
  // WebGL 兜底：无 WebGL 时给出明确错误而非静默白屏
  let gl = null;
  try {
    const c = document.createElement('canvas');
    gl = c.getContext('webgl2') || c.getContext('webgl');
  } catch (_) {}
  if (!gl) {
    if (opts.onError) opts.onError(new Error('当前浏览器/环境不支持 WebGL'));
    return;
  }

  const {
    modelUrl = './assets/models/ys-installation.glb',
    textSymbol = '9',
    particleSize = 0.15,
    cameraZ = 18,
    autoRotate = true,
    minDistance = 8,
    maxDistance = 60,
    onLoaded,
    onError
  } = opts;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#000000');
  scene.fog = new THREE.Fog('#000000', 12, 120);

  let W = container.clientWidth || 1;
  let H = container.clientHeight || 1;

  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
  camera.position.set(0, 0, cameraZ);

  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);
  /* 防止 Lenis 平滑滚动拦截画布上的滚轮（滚轮留给 OrbitControls 缩放模型） */
  renderer.domElement.setAttribute('data-lenis-prevent', '');

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  /* 尊重系统"减少动态"设置：用户开启后默认不自动旋转（仍可手动拖拽） */
  controls.autoRotate = autoRotate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotateSpeed = 1.0;
  controls.enablePan = false;
  controls.minDistance = minDistance;
  controls.maxDistance = maxDistance;

  scene.add(new THREE.AmbientLight(0xffffff, 1));

  function createTextTexture(text) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d');
    x.fillStyle = 'rgba(0,0,0,0)';
    x.fillRect(0, 0, 128, 128);
    x.font = 'bold 80px Arial, "Microsoft YaHei"';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillStyle = 'white';
    x.fillText(text, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }

  let points = null;

  new GLTFLoader().load(
    modelUrl,
    (gltf) => {
      let src = null;
      gltf.scene.traverse((c) => { if (c.isPoints) src = c; });
      if (!src) gltf.scene.traverse((c) => { if (c.isMesh) src = c; });
      if (!src) { if (onError) onError(new Error('no geometry')); return; }

      const geo = src.geometry.clone();
      geo.computeBoundingBox();
      const center = geo.boundingBox.getCenter(new THREE.Vector3());
      const size = geo.boundingBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 10 / maxDim;
      geo.translate(-center.x, -center.y, -center.z);
      geo.scale(scale, scale, scale);

      const hasColor = !!geo.getAttribute('color');
      const material = new THREE.PointsMaterial({
        size: particleSize,
        map: createTextTexture(textSymbol),
        transparent: true,
        opacity: 0.9,
        vertexColors: hasColor,
        alphaTest: 0.01,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      points = new THREE.Points(geo, material);
      scene.add(points);
      if (onLoaded) onLoaded();
    },
    undefined,
    (e) => { console.error(e); if (onError) onError(e); }
  );

  function onResize() {
    W = container.clientWidth;
    H = container.clientHeight;
    if (!W || !H) return;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener('resize', onResize);
  // 容器尺寸变化（如字体/布局导致卡片尺寸变动）也同步修正画布，避免初始 0 尺寸白屏
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
  }

  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();
}
