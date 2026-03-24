// ============================================
// 3D 可旋转电脑 - 完整代码（R键触发+前上方60度+音效+文字提示）
// ============================================
 
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
 
// ============================================
// 全局状态管理（新增）
// ============================================
const state = {
    isPanelVisible: false,
    isAnimating: false,
    panelTargetOpacity: 0,
    panelCurrentOpacity: 0,
    panelTargetScale: 0.1,
    panelCurrentScale: 0.1
};
 
// 存储需要动画的对象（新增）
let backPanel = null;
let backPanelMaterial = null;
let connectionLines = [];
let panelLight = null;
let rainTextSprite = null;  // "雨从未迟到"文字精灵

// 与电脑屏幕面保持一致的旋转（用于让贴图“与电脑面平行”）
// 注：createScreen 里屏幕 iframe 也使用同一角度
const SCREEN_ROT_X = -0.37;
 
// ============================================
// 第 1 步：获取容器
// ============================================
const container = document.getElementById('canvas-container');
 
// ============================================
// 第 2 步：创建场景（Scene）
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
 
const cssScene = new THREE.Scene();
 
// ============================================
// 第 3 步：创建相机（Camera）
// ============================================
const width = window.innerWidth;
const height = window.innerHeight;
 
const camera = new THREE.PerspectiveCamera(
    35,
    width / height,
    10,
    100000
);
camera.position.set(0, 0, 5000);
 
// ============================================
// 第 4 步：创建两个渲染器
// ============================================
 
// 4.1 WebGL 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '1';
container.appendChild(renderer.domElement);
 
// 4.2 CSS3D 渲染器
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(width, height);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
cssRenderer.domElement.style.zIndex = '2';
container.appendChild(cssRenderer.domElement);
 
// ============================================
// 第 4.5 步：添加灯光
// ============================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
 
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);
 
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-10, 10, -10);
scene.add(fillLight);
 
const bottomLight = new THREE.DirectionalLight(0xffffff, 0.3);
bottomLight.position.set(0, -10, 0);
scene.add(bottomLight);
 
// ============================================
// 第 5 步：创建轨道控制器
// ============================================
const controls = new OrbitControls(camera, cssRenderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
 
// ============================================
// 第 6 步：加载 3D 模型
// ============================================
const loader = new GLTFLoader();
const modelPath = './assets/models/laptop.glb';
 
// 存储电脑屏幕的四个角位置（用于连线）
let laptopScreenCorners = null;
let laptopFrontUpperPosition = null;  // 修改为前上方位置
 
loader.load(
    modelPath,
    function (gltf) {
        const model = gltf.scene;
        
        // 修复材质
        model.traverse((child) => {
            if (child.isMesh) {
                const oldMaterial = child.material;
                const newMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 0.5,
                    metalness: 0.1,
                });
                
                if (oldMaterial && oldMaterial.map) {
                    newMaterial.map = oldMaterial.map;
                    newMaterial.map.flipY = false;
                    newMaterial.map.colorSpace = THREE.SRGBColorSpace;
                }
                
                child.material = newMaterial;
            }
        });
        
        autoFitCamera(model);
        scene.add(model);
        
        // ========================================
        // 新增：计算电脑屏幕四角位置和前上方位置
        // ========================================
        calculateLaptopGeometry(model);
        
        // 创建前上方信息板（初始隐藏）
        createFrontUpperPanel();
        
        // 创建连接线（初始隐藏）
        createConnectionLines();
        
        // 创建"雨从未迟到"文字
        createRainText();
        
        // 创建屏幕网页
        createScreen();
        
        // ========================================
        // 新增：设置R键监听
        // ========================================
        setupRKeyListener();
        
        document.getElementById('loading').style.display = 'none';
    },
    function (progress) {
        const percent = (progress.loaded / progress.total * 100).toFixed(1);
        const mb = (progress.loaded / 1024 / 1024).toFixed(1);
        const totalMb = (progress.total / 1024 / 1024).toFixed(1);
        
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `加载模型中...<br>${percent}%<br>(${mb}MB / ${totalMb}MB)<br>这网页能处，有事它真加载`;
        }
    },
    function (error) {
        console.error('模型加载失败:', error);
        alert('我嘞个豆儿，妈妈又把网给恰了:(');
    }
);
 
// ============================================
// 第 6.5 步：计算电脑几何信息（修改：前上方60度）
// ============================================
 
function calculateLaptopGeometry(model) {
    // 创建包围盒获取电脑尺寸
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    
    console.log('电脑尺寸:', size);
    console.log('电脑中心:', center);
    
    // 估算屏幕位置
    const screenWidth = size.x * 0.9;
    const screenHeight = size.y * 0.6;
    
    // 屏幕中心位置
    const screenCenter = new THREE.Vector3(
        center.x,
        center.y + size.y * 0.1,
        center.z - size.z * 0.1
    );
    
    // 计算屏幕四角位置
    const halfWidth = screenWidth / 2;
    const halfHeight = screenHeight / 2;
    
    laptopScreenCorners = {
        frontTopLeft: new THREE.Vector3(
            screenCenter.x - halfWidth,
            screenCenter.y + halfHeight,
            screenCenter.z
        ),
        frontTopRight: new THREE.Vector3(
            screenCenter.x + halfWidth,
            screenCenter.y + halfHeight,
            screenCenter.z
        ),
        frontBottomLeft: new THREE.Vector3(
            screenCenter.x - halfWidth,
            screenCenter.y - halfHeight,
            screenCenter.z
        ),
        frontBottomRight: new THREE.Vector3(
            screenCenter.x + halfWidth,
            screenCenter.y - halfHeight,
            screenCenter.z
        ),
        center: screenCenter
    };
    
    // ========================================
    // 修改：电脑“背面的上前方”位置（60度角，距离400）
    // 约定：Z 轴正方向为“前方”，因此背面方向为 -Z
    // ========================================
    const distance = 400;
    const angle = Math.PI / 3; // 60度
    
    laptopFrontUpperPosition = new THREE.Vector3(
        screenCenter.x,
        screenCenter.y + distance * Math.sin(angle),  // 上方
        screenCenter.z - distance * Math.cos(angle)   // 背面（-Z）
    );
    
    console.log('屏幕四角:', laptopScreenCorners);
    console.log('前上方位置（60度）:', laptopFrontUpperPosition);
}
 
// ============================================
// 第 6.6 步：创建前上方信息板（修改：BasicMaterial避免偏色）
// ============================================
 
function createFrontUpperPanel() {
    if (!laptopFrontUpperPosition) return;
    
    // 加载贴图
    const textureLoader = new THREE.TextureLoader();
    const panelTexture = textureLoader.load('./assets/textures/laptop.jpg');
    
    // 设置颜色空间避免偏色
    panelTexture.colorSpace = THREE.SRGBColorSpace;
    
    const panelWidth = 400;
    const panelHeight = 300;
    
    const geometry = new THREE.PlaneGeometry(panelWidth, panelHeight);
    
    // ========================================
    // 修改：使用BasicMaterial避免灯光影响颜色
    // ========================================
    backPanelMaterial = new THREE.MeshBasicMaterial({
        map: panelTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0  // 初始完全透明
    });
    
    backPanel = new THREE.Mesh(geometry, backPanelMaterial);
    backPanel.position.copy(laptopFrontUpperPosition);

    // 让贴图与电脑面平行：不再 lookAt 电脑，而是使用与屏幕相同的倾角
    // 并保持正面朝向镜头侧（PlaneGeometry 默认正面朝 +Z）
    backPanel.rotation.set(SCREEN_ROT_X, 0, 0);
    
    // 初始缩放为0.1
    backPanel.scale.set(0.1, 0.1, 0.1);
    
    scene.add(backPanel);
    
    // 发光边框（初始隐藏）
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00ffff,
        transparent: true,
        opacity: 0
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    wireframe.name = 'wireframe';
    backPanel.add(wireframe);
    
    // 点光源（初始关闭）
    panelLight = new THREE.PointLight(0x00ffff, 0, 800);
    panelLight.position.set(0, 0, 50);
    backPanel.add(panelLight);
    
    console.log('前上方信息板已创建（按R键显示）');
}
 
// ============================================
// 新增：创建"雨从未迟到"文字精灵
// ============================================

function createRainText() {
    // 创建画布
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // 清除画布
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 设置文字样式
    ctx.font = 'bold 48px "Microsoft YaHei", "SimHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 发光效果
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('雨从未迟到', canvas.width / 2, canvas.height / 2);
    
    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // 创建精灵材质
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0  // 初始隐藏
    });
    
    // 创建精灵
    rainTextSprite = new THREE.Sprite(spriteMaterial);
    rainTextSprite.scale.set(200, 50, 1);
    
    // 位置在信息板上方
    if (laptopFrontUpperPosition) {
        rainTextSprite.position.copy(laptopFrontUpperPosition);
        rainTextSprite.position.y += 180;  // 信息板上方
    }
    
    scene.add(rainTextSprite);
    
    console.log('"雨从未迟到"文字已创建');
}
 
// ============================================
// 第 6.7 步：创建连接线（修改：连接到前上方）
// ============================================
 
function createConnectionLines() {
    if (!laptopScreenCorners || !laptopFrontUpperPosition) return;
    
    const corners = laptopScreenCorners;
    const frontPos = laptopFrontUpperPosition;
    
    const panelWidth = 400;
    const panelHeight = 300;
    const halfW = panelWidth / 2;
    const halfH = panelHeight / 2;
    
    // 计算信息板四角（考虑信息板旋转；忽略缩放，保持与原效果一致）
    const panelQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(SCREEN_ROT_X, 0, 0)
    );
    const localCorners = [
        new THREE.Vector3(-halfW, +halfH, 0),
        new THREE.Vector3(+halfW, +halfH, 0),
        new THREE.Vector3(-halfW, -halfH, 0),
        new THREE.Vector3(+halfW, -halfH, 0)
    ];
    const frontCorners = localCorners.map((v) => v.clone().applyQuaternion(panelQuat).add(frontPos));
    
    const screenCorners = [
        corners.frontTopLeft,
        corners.frontTopRight,
        corners.frontBottomLeft,
        corners.frontBottomRight
    ];
    
    // 创建四条连接线（初始隐藏）
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0
    });
    
    const tubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0
    });
    
    for (let i = 0; i < 4; i++) {
        const from = screenCorners[i];
        const to = frontCorners[i];
        
        // 创建上升曲线
        const midPoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
        midPoint.y += 80;  // 向上弯曲
        
        const curve = new THREE.QuadraticBezierCurve3(from, midPoint, to);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const line = new THREE.Line(geometry, lineMaterial.clone());
        line.name = `connectionLine_${i}`;
        scene.add(line);
        connectionLines.push(line);
        
        const tubeGeometry = new THREE.TubeGeometry(curve, 20, 2, 8, false);
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial.clone());
        tube.name = `connectionTube_${i}`;
        scene.add(tube);
        connectionLines.push(tube);
    }
    
    console.log('连接线已创建');
}

// ============================================
// 新增：R键监听
// ============================================

function setupRKeyListener() {
    console.log('⌨️ R键监听已启用');
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            console.log('🎯 R键被按下');
            
            if (!state.isPanelVisible && !state.isAnimating) {
                showPanel();
            } else if (state.isPanelVisible && !state.isAnimating) {
                hidePanel();
            }
        }
    });
}

// 显示信息板
function showPanel() {
    console.log('>>> 显示信息板');
    state.isAnimating = true;
    state.isPanelVisible = true;
    state.panelTargetOpacity = 1;
    state.panelTargetScale = 1;
    
    // 播放音效
    playRainSound();
}

// 隐藏信息板
function hidePanel() {
    console.log('>>> 隐藏信息板');
    state.isAnimating = true;
    state.isPanelVisible = false;
    state.panelTargetOpacity = 0;
    state.panelTargetScale = 0.1;
}

// ============================================
// 新增：音效（雨声+科技音）
// ============================================

function playRainSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        // 创建噪声（雨声）
        const bufferSize = ctx.sampleRate * 2; // 2秒
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1; // 雨噪声
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        // 噪声滤波（更像雨声）
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 800;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.05, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start();
        
        // 科技音效（和弦）
        const frequencies = [440, 554, 659]; // A大调和弦
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1 + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 1.5);
        });
        
    } catch (e) {
        console.log('音效播放失败', e);
    }
}

// ============================================
// 新增：动画更新
// ============================================

function updatePanelAnimation() {
    if (!backPanel || !backPanelMaterial) return;
    
    const dt = 0.016;
    const speed = 2.0;
    
    // 透明度渐变
    const opacityDiff = state.panelTargetOpacity - state.panelCurrentOpacity;
    if (Math.abs(opacityDiff) > 0.001) {
        state.panelCurrentOpacity += opacityDiff * speed * dt;
        backPanelMaterial.opacity = Math.max(0, Math.min(1, state.panelCurrentOpacity));
        
        // 文字同步淡入淡出
        if (rainTextSprite) {
            rainTextSprite.material.opacity = state.panelCurrentOpacity;
        }
    }
    
    // 缩放动画（弹性效果）
    const scaleDiff = state.panelTargetScale - state.panelCurrentScale;
    if (Math.abs(scaleDiff) > 0.001) {
        state.panelCurrentScale += scaleDiff * speed * dt;
        const scale = Math.max(0.1, state.panelCurrentScale);
        backPanel.scale.set(scale, scale, scale);
    }
    
    // 边框发光
    const wireframe = backPanel.getObjectByName('wireframe');
    if (wireframe && wireframe.material) {
        wireframe.material.opacity = state.panelCurrentOpacity * 0.8;
    }
    
    // 连接线延迟显示
    connectionLines.forEach((line, index) => {
        if (line.material) {
            const delay = index * 0.03;
            let effectiveOpacity;
            if (state.isPanelVisible) {
                effectiveOpacity = Math.max(0, state.panelCurrentOpacity - delay);
            } else {
                effectiveOpacity = state.panelCurrentOpacity;
            }
            line.material.opacity = effectiveOpacity * 0.6;
        }
    });
    
    // 点光源
    if (panelLight) {
        const targetIntensity = state.isPanelVisible ? 1.5 : 0;
        panelLight.intensity += (targetIntensity - panelLight.intensity) * speed * dt;
    }
    
    // 悬浮动画（显示后）
    if (state.isPanelVisible && state.panelCurrentOpacity > 0.95) {
        const time = Date.now() * 0.001;
        backPanel.position.y = laptopFrontUpperPosition.y + Math.sin(time) * 5;
        backPanel.rotation.z = Math.sin(time * 0.5) * 0.02;
        
        // 文字跟随浮动
        if (rainTextSprite) {
            rainTextSprite.position.y = laptopFrontUpperPosition.y + 180 + Math.sin(time) * 5;
        }
    }
    
    // 动画结束
    if (state.isAnimating) {
        const opacityDone = Math.abs(state.panelCurrentOpacity - state.panelTargetOpacity) < 0.01;
        const scaleDone = Math.abs(state.panelCurrentScale - state.panelTargetScale) < 0.01;
        
        if (opacityDone && scaleDone) {
            state.isAnimating = false;
            console.log(state.isPanelVisible ? '>>> 显示完成' : '>>> 隐藏完成');
        }
    }
}
 
// ============================================
// 第 7 步：自动对焦函数
// ============================================
function autoFitCamera(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 2.5;
    
    camera.position.set(
        center.x + maxDim * 0.5,
        center.y + maxDim * 0.3,
        center.z + cameraDistance
    );
    
    controls.target.copy(center);
    controls.update();
}
 
// ============================================
// 第 7.2 步：添加光影效果
// ============================================
const ambientLightExtra = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLightExtra);
 
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);
 
// ============================================
// 第 7.3 步：添加辅助线（保留！）
// ============================================
const gridHelper = new THREE.GridHelper(10000, 100);
scene.add(gridHelper);
 
const axesHelper = new THREE.AxesHelper(5000);
scene.add(axesHelper);
 
// ============================================
// 第 8 步：创建电脑屏幕（原有）
// ============================================
function createScreen() {
    // 使用一个容器承载 iframe + video，这样视频会和屏幕一起移动/旋转/缩放
    const screenWrap = document.createElement('div');
    screenWrap.style.width = '1480px';
    screenWrap.style.height = '1100px';
    screenWrap.style.position = 'relative';
    screenWrap.style.overflow = 'hidden';
    screenWrap.style.backgroundColor = 'black';

    // 1) 屏幕网页（默认显示）
    const iframe = document.createElement('iframe');
    iframe.src = 'https://rockosdev.github.io/';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'white';

    // 2) 屏幕视频（默认隐藏；懒加载：不设置 src，避免首屏加载慢）
    const video = document.createElement('video');
    video.dataset.src = './assets/textures/video.mp4';
    video.preload = 'none';
    video.playsInline = true;
    video.controls = true;
    video.controlsList = 'nodownload';
    video.loop = true; // 播完循环，直到按 V 返回
    video.style.position = 'absolute';
    video.style.inset = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
    video.style.background = '#000';
    video.style.display = 'none';

    // （可选）加载提示
    const loadingHint = document.createElement('div');
    loadingHint.textContent = '视频加载中...';
    loadingHint.style.position = 'absolute';
    loadingHint.style.left = '50%';
    loadingHint.style.top = '50%';
    loadingHint.style.transform = 'translate(-50%, -50%)';
    loadingHint.style.color = 'rgba(255,255,255,0.85)';
    loadingHint.style.fontFamily = 'Arial, sans-serif';
    loadingHint.style.fontSize = '18px';
    loadingHint.style.letterSpacing = '0.5px';
    loadingHint.style.pointerEvents = 'none';
    loadingHint.style.display = 'none';

    video.addEventListener('waiting', () => {
        if (video.style.display !== 'none') loadingHint.style.display = 'block';
    });
    video.addEventListener('playing', () => {
        loadingHint.style.display = 'none';
    });
    video.addEventListener('canplay', () => {
        loadingHint.style.display = 'none';
    });

    screenWrap.appendChild(iframe);
    screenWrap.appendChild(video);
    screenWrap.appendChild(loadingHint);

    const screenObject = new CSS3DObject(screenWrap);
    screenObject.position.set(0.00, 52.00, -8.00);
    screenObject.rotation.x = SCREEN_ROT_X;
    screenObject.scale.set(0.125, 0.112, 0.20);
    screenObject.element.style.backfaceVisibility = 'hidden';
    
    cssScene.add(screenObject);
    
    console.log('屏幕已创建');
    setupDebugControls(screenObject);

    // V 键切换屏幕内视频播放（懒加载，不影响首屏加载）
    setupVKeyToggleVideoOnScreen({ iframe, video, loadingHint });
}

// ============================================
// 新增：按 V 键在“电脑屏幕区域”播放视频，再按 V 返回网页
// 目标：不影响首屏加载（首次按 V 才设置 video.src）
// 行为：loop=true 循环播放；退出时 pause；再次进入继续从暂停位置播放
// ============================================

function setupVKeyToggleVideoOnScreen({ iframe, video, loadingHint }) {
    let isVideoMode = false;

    async function enterVideoMode() {
        if (isVideoMode) return;
        isVideoMode = true;

        iframe.style.display = 'none';
        video.style.display = 'block';

        // 懒加载：首次进入才赋值 src
        if (!video.getAttribute('src')) {
            loadingHint && (loadingHint.style.display = 'block');
            video.src = video.dataset.src;
        }

        const p = video.play();
        if (p && typeof p.catch === 'function') {
            p.catch(() => {
                // 某些浏览器可能需要用户交互才能播放；此处不抛错
            });
        }
    }

    function exitVideoMode() {
        if (!isVideoMode) return;
        isVideoMode = false;

        video.pause();
        // 不重置 currentTime：下次继续播放
        video.style.display = 'none';
        iframe.style.display = 'block';
        loadingHint && (loadingHint.style.display = 'none');
    }

    function toggle() {
        if (isVideoMode) exitVideoMode();
        else enterVideoMode();
    }

    window.addEventListener('keydown', (e) => {
        const isV = e.key === 'v' || e.key === 'V';
        if (!isV) return;

        // 避免在输入框内误触（虽然当前屏幕是 iframe，但依然做保护）
        const tag = (e.target && e.target.tagName) ? String(e.target.tagName).toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        e.preventDefault();
        toggle();
    });
}
 
// ============================================
// 第 9 步：键盘调试功能（保留原有+添加R键说明）
// ============================================
function setupDebugControls(screenObject) {
    console.log('=== 调试模式已开启 ===');
    console.log('R     : 触发/隐藏信息板映射');
    console.log('方向键 ↑↓←→ : 移动屏幕位置');
    console.log('W/S : 前后移动');
    console.log('Q/E : 旋转 X 轴');
    console.log('A/D : 旋转 Y 轴');
    console.log('Z/X : 旋转 Z 轴');
    console.log('+/- : 缩放');
    console.log('P : 打印当前坐标');
    
    const step = 2;
    const rotStep = 0.01;
    
    window.addEventListener('keydown', (e) => {
        // R键已在setupRKeyListener中处理，这里跳过
        if (e.key === 'r' || e.key === 'R') return;
        
        switch(e.key) {
            case 'ArrowUp': screenObject.position.y += step; break;
            case 'ArrowDown': screenObject.position.y -= step; break;
            case 'ArrowLeft': screenObject.position.x -= step; break;
            case 'ArrowRight': screenObject.position.x += step; break;
            case 'w': case 'W': screenObject.position.z -= step; break;
            case 's': case 'S': screenObject.position.z += step; break;
            case 'q': case 'Q': screenObject.rotation.x += rotStep; break;
            case 'e': case 'E': screenObject.rotation.x -= rotStep; break;
            case 'a': case 'A': screenObject.rotation.y += rotStep; break;
            case 'd': case 'D': screenObject.rotation.y -= rotStep; break;
            case 'z': case 'Z': screenObject.rotation.z += rotStep; break;
            case 'x': case 'X': screenObject.rotation.z -= rotStep; break;
            case '+': case '=': screenObject.scale.multiplyScalar(1.1); break;
            case '-': screenObject.scale.multiplyScalar(0.9); break;
            case 'p': case 'P':
                console.log('========== 当前坐标 ==========');
                console.log(`position.set(${screenObject.position.x.toFixed(2)}, ${screenObject.position.y.toFixed(2)}, ${screenObject.position.z.toFixed(2)})`);
                console.log(`rotation.set(${screenObject.rotation.x.toFixed(2)}, ${screenObject.rotation.y.toFixed(2)}, ${screenObject.rotation.z.toFixed(2)})`);
                console.log(`scale.set(${screenObject.scale.x.toFixed(2)}, ${screenObject.scale.y.toFixed(2)}, ${screenObject.scale.z.toFixed(2)})`);
                console.log('==============================');
                break;
        }
    });
}
 
// ============================================
// 第 10 步：渲染循环（添加动画更新）
// ============================================
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    // 新增：更新面板动画
    updatePanelAnimation();
    
    renderer.render(scene, camera);
    cssRenderer.render(cssScene, camera);
}
 
animate();
 
// ============================================
// 第 11 步：响应窗口大小变化
// ============================================
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
    cssRenderer.setSize(newWidth, newHeight);
});
 
console.log('3d-computer initialized');
console.log('这网页能处，有事它真加载');

// ============================================
// 追加功能：按 U 键恢复“刚进入电脑时”的视角位置
// 约束：只增加代码，不修改原有逻辑/效果。
// 还原内容：camera.position、controls.target、camera.zoom。
// ============================================

const __initialViewState = {
    saved: false,
    cameraPosition: new THREE.Vector3(),
    controlsTarget: new THREE.Vector3(),
    cameraZoom: 1
};

function __saveInitialViewStateOnce() {
    if (__initialViewState.saved) return;
    __initialViewState.cameraPosition.copy(camera.position);
    __initialViewState.controlsTarget.copy(controls.target);
    __initialViewState.cameraZoom = camera.zoom;
    __initialViewState.saved = true;
    console.log('✅ 已记录初始视角（按 U 可恢复）');
}

function __restoreInitialViewState() {
    if (!__initialViewState.saved) {
        console.warn('⚠️ 初始视角尚未记录，无法恢复');
        return;
    }
    camera.position.copy(__initialViewState.cameraPosition);
    controls.target.copy(__initialViewState.controlsTarget);
    camera.zoom = __initialViewState.cameraZoom;
    camera.updateProjectionMatrix();
    controls.update();
}

// 模型加载并 autoFitCamera 生效后，再记录“刚进入电脑时”的视角
(function __captureInitialViewWhenReady() {
    const loadingEl = document.getElementById('loading');
    const isLoaded = !loadingEl || loadingEl.style.display === 'none';
    if (isLoaded) {
        requestAnimationFrame(() => {
            __saveInitialViewStateOnce();
        });
        return;
    }
    requestAnimationFrame(__captureInitialViewWhenReady);
})();

// 监听 U 键
window.addEventListener('keydown', (e) => {
    if (e.key === 'u' || e.key === 'U') {
        __restoreInitialViewState();
    }
});
