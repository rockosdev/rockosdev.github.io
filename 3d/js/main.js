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
let earthCoreGroup = null;
let earthPulseMeshes = [];
let earthLatLonLines = [];
let earthGridShellMesh = null;
let earthGridRadius = 0;
let orbitRing = null;
let orbitTrackMesh = null;
let orbitPenguin = null;
let orbitRadius = 0;
let orbitCenter = new THREE.Vector3();
let orbitPenguinBaseY = 0;
let orbitTrackWidth = 0;
const ORBIT_PENGUIN_HEADING_OFFSET = Math.PI / 2;
let penguinFollowEffectEnabled = false;
let penguinFlagMesh = null;
let penguinFlagMaterial = null;
let penguinFlagBasePositions = null;
let penguinFlagSegmentsX = 0;
let penguinParticleBeam = null;
let penguinParticleBeamMaterial = null;
let penguinParticlePositions = null;
let penguinParticleData = [];
let penguinTrailLength = 0;
let penguinFlagPoleOffset = 0;
let penguinFlagHeightOffset = 0;
let penguinBeamGapOffset = 0;
let penguinFloatingTextSprite = null;
let penguinFloatingTextHeightOffset = 0;

function createPenguinFlagTexture(textureLoader) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0b1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.wrapS = THREE.RepeatWrapping;
    canvasTexture.wrapT = THREE.ClampToEdgeWrapping;
    canvasTexture.repeat.set(1, 1);
    canvasTexture.offset.set(0, 0);

    function drawTexture(image = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (image) {
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            ctx.restore();
        } else {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#07131c');
            gradient.addColorStop(1, '#163040');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        canvasTexture.needsUpdate = true;
    }

    drawTexture();

    textureLoader.load(
        './assets/textures/rain.jpg',
        (loadedTexture) => {
            const image = loadedTexture.image;
            if (image) drawTexture(image);
        },
        undefined,
        (error) => {
            console.warn('旗面贴图加载失败，已使用文字底图代替:', error);
        }
    );

    return canvasTexture;
}

function createPenguinFloatingTextSprite(flagWidth, flagHeight) {
    if (penguinFloatingTextSprite) {
        scene.remove(penguinFloatingTextSprite);
        if (penguinFloatingTextSprite.geometry) {
            penguinFloatingTextSprite.geometry.dispose();
        }
        if (penguinFloatingTextSprite.material.map) {
            penguinFloatingTextSprite.material.map.dispose();
        }
        penguinFloatingTextSprite.material.dispose();
        penguinFloatingTextSprite = null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const displayText = '(:雨从未迟到～～';
    const charSpacing = 22;

    function drawSpacedCenteredText(drawCtx, text, x, y, mode) {
        const chars = Array.from(text);
        const widths = chars.map((char) => drawCtx.measureText(char).width);
        const totalWidth = widths.reduce((sum, width) => sum + width, 0) + charSpacing * Math.max(0, chars.length - 1);
        let cursorX = x - totalWidth / 2;

        chars.forEach((char, index) => {
            const charWidth = widths[index];
            const drawX = cursorX + charWidth / 2;
            if (mode === 'stroke') {
                drawCtx.strokeText(char, drawX, y);
            } else {
                drawCtx.fillText(char, drawX, y);
            }
            cursorX += charWidth + charSpacing;
        });
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.font = '136px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 255, 255, 0.95)';
    ctx.shadowBlur = 12;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(40, 120, 120, 0.9)';
    drawSpacedCenteredText(ctx, displayText, canvas.width / 2, canvas.height / 2, 'stroke');
    ctx.fillStyle = 'rgba(120, 255, 255, 1)';
    drawSpacedCenteredText(ctx, displayText, canvas.width / 2, canvas.height / 2, 'fill');

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    const textGeometry = new THREE.PlaneGeometry(flagWidth * 1.75, flagHeight * 1.34);
    const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        opacity: 0.95
    });

    penguinFloatingTextSprite = new THREE.Mesh(textGeometry, textMaterial);
    penguinFloatingTextSprite.visible = false;
    scene.add(penguinFloatingTextSprite);
}

function moveCameraBackToFitRadius(targetCenter, fitRadius, padding = 1.15) {
    const direction = camera.position.clone().sub(targetCenter);
    if (direction.lengthSq() === 0) {
        direction.set(1, 0.35, 1);
    }
    direction.normalize();

    const fov = THREE.MathUtils.degToRad(camera.fov);
    const fitDistance = (fitRadius / Math.tan(fov / 2)) * padding;

    camera.position.copy(targetCenter).add(direction.multiplyScalar(fitDistance));
    controls.target.copy(targetCenter);
    camera.updateProjectionMatrix();
    controls.update();
}

function latLngToVector3(lat, lng, radius) {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lng + 180);

    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function latLngToCanvas(lat, lng, width, height) {
    return {
        x: ((lng + 180) / 360) * width,
        y: ((90 - lat) / 180) * height
    };
}

// 与电脑屏幕面保持一致的旋转（用于让贴图“与电脑面平行”）
// 注：createScreen 里屏幕 iframe 也使用同一角度
const SCREEN_ROT_X = -0.37;
 
// ============================================
// 第 1 步：获取容器
// ============================================
const container = document.getElementById('canvas-container');

// ============================================
// 加载 Overlay（3D 相册）DOM 引用（新增）
// 说明：只做“增添代码”，不影响原有 3D 电脑逻辑。
// - 加载中：显示相册 + 进度
// - 加载完成：显示“点击进入”按钮
// - 点击进入：淡出并移除 overlay
// ============================================

const albumOverlay = document.getElementById('album-loading');
const albumProgressEl = document.getElementById('progress');
const albumLoadingTextEl = document.getElementById('loading-text');
const albumEnterBtn = document.getElementById('enter-btn');

let __albumOverlayDismissed = false;

function __setAlbumProgress(text) {
    if (albumProgressEl) albumProgressEl.textContent = text;
}

function __setAlbumLoadingText(text) {
    if (albumLoadingTextEl) albumLoadingTextEl.textContent = text;
}

function __markAlbumReadyToEnter() {
    if (!albumOverlay) return;
    albumOverlay.classList.add('is-ready');
    __setAlbumLoadingText('模型已加载完成');
    __setAlbumProgress('');
}

function __dismissAlbumOverlay() {
    if (__albumOverlayDismissed) return;
    __albumOverlayDismissed = true;

    // 兼容：保持原 #loading 隐藏
    const legacyLoading = document.getElementById('loading');
    if (legacyLoading) legacyLoading.style.display = 'none';

    if (!albumOverlay) return;

    albumOverlay.classList.add('is-fading');
    window.setTimeout(() => {
        albumOverlay.remove();
    }, 480);
}

if (albumEnterBtn) {
    albumEnterBtn.addEventListener('click', () => {
        __dismissAlbumOverlay();
    });
}
 
// ============================================
// 第 2 步：创建场景（Scene）
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05010a);
 
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
        // 记录“刚进入电脑时”的视角（用于 U 键恢复）
        // 必须在 autoFitCamera + controls.target 更新之后保存，避免误记录默认视角。
        __saveInitialViewStateOnce();
        scene.add(model);
        
        // ========================================
        // 新增：计算电脑屏幕四角位置和前上方位置
        // ========================================
        calculateLaptopGeometry(model);
        createEarthCoreEnvironment(model);
        
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

        // 原逻辑：加载完成后隐藏 #loading。
        // 现在：不直接让用户“瞬间进入”，而是提示“点击进入”后再淡出相册 overlay。
        const legacyLoading = document.getElementById('loading');
        if (legacyLoading) legacyLoading.style.display = 'none';
        __markAlbumReadyToEnter();
    },
    function (progress) {
        const percent = (progress.loaded / progress.total * 100).toFixed(1);
        const mb = (progress.loaded / 1024 / 1024).toFixed(1);
        const totalMb = (progress.total / 1024 / 1024).toFixed(1);

        // 注意：不能再用 innerHTML 覆盖容器，否则会把相册 overlay 的 DOM 删掉。
        __setAlbumLoadingText('加载模型中...');
        __setAlbumProgress(`${percent}% (${mb}MB / ${totalMb}MB)`);
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
// 新增：创建“地心”氛围与地球经纬网
// 说明：只增强场景环境，不改变原有电脑交互、按键与面板功能。
// ============================================

function createEarthCoreEnvironment(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const baseRadius = Math.max(size.x, size.y, size.z) * 1.7;

    earthCoreGroup = new THREE.Group();
    earthCoreGroup.position.copy(center);
    scene.add(earthCoreGroup);

    const shellRadius = baseRadius * 3.1;
    earthGridRadius = shellRadius;
    orbitTrackWidth = Math.max(baseRadius * 0.22 * 5, baseRadius * 0.5);
    orbitRadius = earthGridRadius + orbitTrackWidth * 1.5;
    const shellColor = 0x9fefff;
    const latCount = 12;
    const lonCount = 18;

    const shellGeometry = new THREE.SphereGeometry(shellRadius, 48, 48);
    const shellMaterial = new THREE.MeshBasicMaterial({
        color: shellColor,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    earthGridShellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    earthCoreGroup.add(earthGridShellMesh);

    for (let i = 1; i < latCount; i++) {
        const v = i / latCount;
        const phi = -Math.PI / 2 + v * Math.PI;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);
        const points = [];

        for (let j = 0; j <= 180; j++) {
            const theta = (j / 180) * Math.PI * 2;
            points.push(new THREE.Vector3(
                shellRadius * cosPhi * Math.cos(theta),
                shellRadius * sinPhi,
                shellRadius * cosPhi * Math.sin(theta)
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: shellColor,
            transparent: true,
            opacity: 0.22
        });
        const line = new THREE.LineLoop(geometry, material);
        earthCoreGroup.add(line);
        earthLatLonLines.push(line);
    }

    for (let i = 0; i < lonCount; i++) {
        const theta = (i / lonCount) * Math.PI * 2;
        const points = [];

        for (let j = 0; j <= 180; j++) {
            const phi = -Math.PI / 2 + (j / 180) * Math.PI;
            const cosPhi = Math.cos(phi);
            const sinPhi = Math.sin(phi);
            points.push(new THREE.Vector3(
                shellRadius * cosPhi * Math.cos(theta),
                shellRadius * sinPhi,
                shellRadius * cosPhi * Math.sin(theta)
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: shellColor,
            transparent: true,
            opacity: 0.18
        });
        const line = new THREE.Line(geometry, material);
        earthCoreGroup.add(line);
        earthLatLonLines.push(line);
    }

    const innerCoreLight = new THREE.PointLight(0xff7a1a, 18, baseRadius * 7, 2);
    innerCoreLight.position.set(0, 0, 0);
    earthCoreGroup.add(innerCoreLight);

    const coolRimLight = new THREE.PointLight(0x3bc9ff, 6, baseRadius * 10, 2);
    coolRimLight.position.set(baseRadius * 0.8, baseRadius * 0.3, baseRadius * 1.4);
    earthCoreGroup.add(coolRimLight);

    const sceneFitRadius = orbitRadius + orbitTrackWidth * 0.5;
    moveCameraBackToFitRadius(center, sceneFitRadius, 1.2);

    createOrbitRingAndPenguin(center, baseRadius);

    console.log('🌍 地心经纬网环境已创建');
}

function createOrbitRingAndPenguin(center, baseRadius) {
    orbitCenter.set(center.x, 0, center.z);

    const penguinLoader = new GLTFLoader();
    penguinLoader.load(
        './assets/models/qq.glb',
        function (gltf) {
            orbitPenguin = gltf.scene;

            const penguinBox = new THREE.Box3().setFromObject(orbitPenguin);
            const penguinSize = new THREE.Vector3();
            penguinBox.getSize(penguinSize);
            const penguinMaxDim = Math.max(penguinSize.x, penguinSize.y, penguinSize.z) || 1;
            const targetSize = baseRadius * 0.22;
            const scale = targetSize / penguinMaxDim;
            orbitPenguin.scale.setScalar(scale);

            createPenguinFollowEffects(targetSize);

            createOrbitRingVisual();

            orbitPenguin.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

            orbitPenguinBaseY = orbitCenter.y + targetSize * 0.45;
            orbitPenguin.position.set(orbitCenter.x + orbitRadius, orbitPenguinBaseY, orbitCenter.z);
            scene.add(orbitPenguin);
        },
        undefined,
        function (error) {
            console.error('企鹅模型加载失败:', error);
        }
    );
}

function createOrbitRingVisual() {
    if (orbitTrackMesh) {
        scene.remove(orbitTrackMesh);
        orbitTrackMesh.geometry.dispose();
        orbitTrackMesh.material.dispose();
        orbitTrackMesh = null;
    }

    if (orbitRing) {
        scene.remove(orbitRing);
        orbitRing.geometry.dispose();
        orbitRing.material.dispose();
        orbitRing = null;
    }

    if (orbitRadius <= 0 || orbitTrackWidth <= 0) return;

    const innerRadius = Math.max(orbitRadius - orbitTrackWidth * 0.5, 10);
    const outerRadius = orbitRadius + orbitTrackWidth * 0.5;

    const trackGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 180);
    const trackMaterial = new THREE.MeshBasicMaterial({
        color: 0x8ffcff,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    orbitTrackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
    orbitTrackMesh.rotation.x = -Math.PI / 2;
    orbitTrackMesh.position.set(orbitCenter.x, orbitCenter.y + 2, orbitCenter.z);
    scene.add(orbitTrackMesh);

    const ringCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0);
    const ringPoints2D = ringCurve.getPoints(240);
    const ringPoints3D = ringPoints2D.map((point) => new THREE.Vector3(
        orbitCenter.x + point.x,
        orbitCenter.y + 5,
        orbitCenter.z + point.y
    ));

    const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringPoints3D);
    const ringMaterial = new THREE.LineBasicMaterial({
        color: 0xb8ffff,
        transparent: true,
        opacity: 0.85
    });
    orbitRing = new THREE.LineLoop(ringGeometry, ringMaterial);
    scene.add(orbitRing);
}

function updateEarthCoreEnvironment() {
    if (!earthCoreGroup) return;

    const time = Date.now() * 0.00025;
    earthCoreGroup.rotation.y += 0.0012;
    earthCoreGroup.rotation.z = Math.sin(time) * 0.05;

    if (earthGridRadius > 0) {
        const distanceToEarthCore = camera.position.distanceTo(earthCoreGroup.position);
        const shouldShowLatLon = distanceToEarthCore > earthGridRadius;
        if (earthGridShellMesh) {
            earthGridShellMesh.visible = shouldShowLatLon;
        }
        earthLatLonLines.forEach((line) => {
            line.visible = shouldShowLatLon;
        });
    }

    earthPulseMeshes.forEach((mesh, index) => {
        const pulse = 1 + Math.sin(time * 6 + index * 0.8) * 0.015;
        mesh.scale.setScalar(pulse);
        mesh.material.opacity = index === 0
            ? 0.1 + Math.sin(time * 7) * 0.018
            : 0.04 + Math.sin(time * 5 + 1.2) * 0.01;
    });

    updateOrbitPenguin(time);
}

function updateOrbitPenguin(time) {
    if (!orbitPenguin || orbitRadius <= 0) return;

    const orbitSpeed = -time * 1.8;
    const x = orbitCenter.x + Math.cos(orbitSpeed) * orbitRadius;
    const z = orbitCenter.z + Math.sin(orbitSpeed) * orbitRadius;
    const dirX = -Math.sin(orbitSpeed);
    const dirZ = Math.cos(orbitSpeed);
    const forwardDirection = new THREE.Vector3(dirX, 0, dirZ).normalize();
    const heading = Math.atan2(dirX, dirZ) + ORBIT_PENGUIN_HEADING_OFFSET;

    orbitPenguin.position.set(
        x,
        orbitPenguinBaseY + Math.sin(time * 10) * 8,
        z
    );
    orbitPenguin.rotation.set(0, heading, 0);

    updatePenguinFollowEffects(time, forwardDirection);
}

function createPenguinFollowEffects(targetSize) {
    const textureLoader = new THREE.TextureLoader();
    const flagTexture = createPenguinFlagTexture(textureLoader);

    const flagWidth = targetSize * 2.8;
    const flagHeight = targetSize * 1.55;
    penguinFlagSegmentsX = 24;
    const flagSegmentsY = 12;

    const flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight, penguinFlagSegmentsX, flagSegmentsY);
    flagGeometry.translate(flagWidth * 0.5, 0, 0);
    penguinFlagBasePositions = new Float32Array(flagGeometry.attributes.position.array);

    penguinFlagMaterial = new THREE.MeshBasicMaterial({
        map: flagTexture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    penguinFlagMesh = new THREE.Mesh(flagGeometry, penguinFlagMaterial);
    penguinFlagMesh.visible = false;
    scene.add(penguinFlagMesh);

    penguinTrailLength = targetSize * 8.5;
    penguinFlagPoleOffset = targetSize * 0.9;
    penguinFlagHeightOffset = targetSize * 0.75;
    penguinBeamGapOffset = targetSize * 2.7;
    penguinFloatingTextHeightOffset = targetSize * 2.7;

    createPenguinFloatingTextSprite(flagWidth, flagHeight);

    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    penguinParticlePositions = new Float32Array(particleCount * 3);
    penguinParticleData = [];

    for (let i = 0; i < particleCount; i++) {
        penguinParticleData.push(createPenguinBeamParticle(Math.random()));
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(penguinParticlePositions, 3));
    penguinParticleBeamMaterial = new THREE.PointsMaterial({
        color: 0x9fefff,
        size: targetSize * 0.18,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    penguinParticleBeam = new THREE.Points(particleGeometry, penguinParticleBeamMaterial);
    penguinParticleBeam.visible = false;
    scene.add(penguinParticleBeam);
}

function createPenguinBeamParticle(seed = 0) {
    return {
        progress: seed,
        speed: 0.008 + Math.random() * 0.018,
        spread: 84 + Math.random() * 192,
        swirl: Math.random() * Math.PI * 2,
        rise: (Math.random() - 0.5) * 108,
        drift: 0.6 + Math.random() * 1.8
    };
}

function togglePenguinFollowEffect() {
    penguinFollowEffectEnabled = !penguinFollowEffectEnabled;

    if (penguinFlagMesh) penguinFlagMesh.visible = penguinFollowEffectEnabled;
    if (penguinParticleBeam) penguinParticleBeam.visible = penguinFollowEffectEnabled;
    if (penguinFloatingTextSprite) penguinFloatingTextSprite.visible = penguinFollowEffectEnabled;

    console.log(penguinFollowEffectEnabled ? '🏁 已开启企鹅旗帜与粒子束特效' : '🏁 已关闭企鹅旗帜与粒子束特效');
}

function updatePenguinFollowEffects(time, forwardDirection) {
    if (!orbitPenguin || !penguinFlagMesh || !penguinParticleBeam || !penguinFlagBasePositions) return;
    if (!penguinFollowEffectEnabled) return;

    const backDirection = forwardDirection.clone().multiplyScalar(-1);
    const sideDirection = new THREE.Vector3().crossVectors(backDirection, new THREE.Vector3(0, 1, 0)).normalize();
    const upDirection = new THREE.Vector3().crossVectors(sideDirection, backDirection).normalize();
    const frontDirection = forwardDirection.clone();
    const frontFlagSideDirection = sideDirection.clone().multiplyScalar(-1);

    const flagAnchor = orbitPenguin.position.clone()
        .add(frontDirection.clone().multiplyScalar(penguinFlagPoleOffset))
        .add(upDirection.clone().multiplyScalar(penguinFlagHeightOffset));

    penguinFlagMesh.position.copy(flagAnchor);
    penguinFlagMesh.setRotationFromMatrix(
        new THREE.Matrix4().makeBasis(frontDirection, upDirection, frontFlagSideDirection)
    );

    if (penguinFloatingTextSprite) {
        penguinFloatingTextSprite.position.copy(orbitPenguin.position)
            .add(upDirection.clone().multiplyScalar(penguinFloatingTextHeightOffset))
            .add(frontDirection.clone().multiplyScalar(penguinFlagPoleOffset * 0.2));
        penguinFloatingTextSprite.setRotationFromMatrix(
            new THREE.Matrix4().makeBasis(frontDirection, upDirection, frontFlagSideDirection)
        );
        penguinFloatingTextSprite.rotateZ(Math.sin(time * 3) * 0.03);
    }

    const flagPositions = penguinFlagMesh.geometry.attributes.position;

    for (let i = 0; i < flagPositions.count; i++) {
        const ix = i * 3;
        const baseX = penguinFlagBasePositions[ix];
        const baseY = penguinFlagBasePositions[ix + 1];
        const normalizedX = Math.max(0, baseX / Math.max(1, penguinTrailLength * 0.33));
        const waveA = Math.sin(baseX * 0.045 + time * 18) * (4 + normalizedX * 10);
        const waveB = Math.cos(baseX * 0.025 + time * 11 + baseY * 0.03) * (2 + normalizedX * 5);
        const flutter = Math.sin(-time * 24 + (i % (penguinFlagSegmentsX + 1)) * 0.55) * normalizedX * 2.2;

        flagPositions.array[ix] = baseX;
        flagPositions.array[ix + 1] = baseY + flutter;
        flagPositions.array[ix + 2] = waveA + waveB;
    }
    flagPositions.needsUpdate = true;
    penguinFlagMesh.geometry.computeVertexNormals();

    const particleAttr = penguinParticleBeam.geometry.attributes.position;
    const beamStart = orbitPenguin.position.clone()
        .add(frontDirection.clone().multiplyScalar(penguinFlagPoleOffset + penguinBeamGapOffset + penguinTrailLength * 0.08))
        .add(upDirection.clone().multiplyScalar(penguinFlagHeightOffset * 0.2));

    for (let i = 0; i < penguinParticleData.length; i++) {
        const p = penguinParticleData[i];
        p.progress += p.speed;
        if (p.progress > 1) {
            penguinParticleData[i] = createPenguinBeamParticle(0);
            Object.assign(p, penguinParticleData[i]);
        }

        const distance = p.progress * penguinTrailLength;
        const swirl = p.swirl - time * p.drift - p.progress * 8;
        const radial = p.progress * p.spread;

        const pos = beamStart.clone()
            .add(frontDirection.clone().multiplyScalar(distance))
            .add(sideDirection.clone().multiplyScalar(Math.cos(swirl) * radial))
            .add(upDirection.clone().multiplyScalar(Math.sin(swirl) * radial + p.rise));

        particleAttr.array[i * 3] = pos.x;
        particleAttr.array[i * 3 + 1] = pos.y;
        particleAttr.array[i * 3 + 2] = pos.z;
    }

    particleAttr.needsUpdate = true;
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
    connectionLines.forEach((line) => {
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    });
    connectionLines = [];

    console.log('已移除电脑四角引出的连接线');
}

// ============================================
// 新增：R键监听
// ============================================

function setupRKeyListener() {
    console.log('⌨️ R键已设置为企鹅旗帜特效开关');

    window.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            togglePenguinFollowEffect();
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
    console.log('R     : 开关企鹅尾随旗帜 + 粒子束特效');
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
    updateEarthCoreEnvironment();
    
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

// 说明：初始视角的保存已经挪到 GLTF onLoad 里（autoFitCamera 之后），
// 不再通过 #loading 的 display 轮询判断，避免误判导致恢复视角错误。

// 监听 U 键
window.addEventListener('keydown', (e) => {
    if (e.key === 'u' || e.key === 'U') {
        __restoreInitialViewState();
    }
});