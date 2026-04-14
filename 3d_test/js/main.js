// ============================================
// 3D 可旋转电脑
// 功能：加载相册、在电脑屏幕显示网页、按 V 切换视频、按 U 恢复目标视角、按 R 切换企鹅旗帜与粒子束特效
// ============================================
 
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createEarthOrbitSystem } from './modules/earthOrbitSystem.js';
import { loadLaptopModel } from './modules/modelLoader.js';
import {
    MOBILE_OVERVIEW_CAMERA_COMPOSITION,
    collectMobileViewportDebug,
    getCurrentViewStateKey,
    isMobileLayout,
    updateResponsiveControlsBehavior
} from './modules/viewport.js';
import { createAlbumOverlayController } from './modules/albumOverlay.js';
import {
    createScreenExperience,
    setupScreenDebugHotkeys,
    setupVideoToggleHotkey
} from './modules/screenExperience.js';
 
// ============================================
// 场景级状态
// ============================================
let __loadedModel = null;
let __sceneFocusTarget = new THREE.Vector3();
let __mobileSceneFocusTarget = new THREE.Vector3();
let __sceneFitRadius = 0;
let __mobileSceneFitRadius = 0;
let __mobileOverviewSamplePoints = [];
let __screenObject = null;
let __desktopInitialViewCaptured = false;
let __mobileInitialViewCaptured = false;
let __mobileViewportDebug = {};

const __screenWorldPosition = new THREE.Vector3();
const __screenWorldQuaternion = new THREE.Quaternion();
const __screenForward = new THREE.Vector3();
const __screenToCamera = new THREE.Vector3();

function moveCameraBackToFitRadius(targetCenter, fitRadius, padding = 1.15) {
    const direction = camera.position.clone().sub(targetCenter);
    if (direction.lengthSq() === 0) {
        direction.set(1, 0.35, 1);
    }
    direction.normalize();

    const fitDistance = getCameraFitDistance(fitRadius, padding);

    camera.position.copy(targetCenter).add(direction.multiplyScalar(fitDistance));
    controls.target.copy(targetCenter);
    camera.updateProjectionMatrix();
    controls.update();
}

function getCameraFitDistance(fitRadius, padding = 1) {
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    const limitingFov = Math.min(verticalFov, horizontalFov);
    return (fitRadius / Math.tan(limitingFov / 2)) * padding;
}

function applyResponsiveCameraFit() {
    if (__sceneFitRadius <= 0) return;

    const targetCenter = isMobileLayout()
        ? __mobileSceneFocusTarget.clone()
        : __sceneFocusTarget.clone();
    const fitRadius = isMobileLayout() && __mobileSceneFitRadius > 0
        ? __mobileSceneFitRadius
        : __sceneFitRadius;

    if (isMobileLayout()) {
        const mobileTargetCenter = targetCenter.clone().add(MOBILE_OVERVIEW_CAMERA_COMPOSITION.focusOffset);
        const direction = MOBILE_OVERVIEW_CAMERA_COMPOSITION.direction.clone().normalize();
        const fitDistance = getCameraFitDistance(fitRadius, MOBILE_OVERVIEW_CAMERA_COMPOSITION.padding);

        camera.position.copy(mobileTargetCenter).add(direction.multiplyScalar(fitDistance));
        controls.target.copy(mobileTargetCenter);
        camera.updateProjectionMatrix();
        controls.update();
        if (MOBILE_OVERVIEW_CAMERA_COMPOSITION.enableScreenSpaceCompensation) {
            applyMobileScreenSpaceCompensation();
        }
        return;
    }

    moveCameraBackToFitRadius(targetCenter, fitRadius, 1.2);
}

function rebuildMobileOverviewState(modelBounds, shellRadius, orbitVerticalReach, orbitBounds = {}) {
    const focusCenter = orbitBounds.focusCenter || __sceneFocusTarget;
    const activeOrbitCenter = orbitBounds.center || focusCenter;
    const activeOrbitRadius = orbitBounds.radius || 0;
    const mobileOverviewBounds = new THREE.Box3();
    const sphereMin = focusCenter.clone().addScalar(-shellRadius);
    const sphereMax = focusCenter.clone().addScalar(shellRadius);

    mobileOverviewBounds.expandByPoint(sphereMin);
    mobileOverviewBounds.expandByPoint(sphereMax);
    mobileOverviewBounds.expandByPoint(new THREE.Vector3(
        activeOrbitCenter.x - activeOrbitRadius,
        activeOrbitCenter.y - orbitVerticalReach,
        activeOrbitCenter.z - activeOrbitRadius
    ));
    mobileOverviewBounds.expandByPoint(new THREE.Vector3(
        activeOrbitCenter.x + activeOrbitRadius,
        activeOrbitCenter.y + orbitVerticalReach,
        activeOrbitCenter.z + activeOrbitRadius
    ));
    mobileOverviewBounds.expandByPoint(modelBounds.min);
    mobileOverviewBounds.expandByPoint(modelBounds.max);

    const mobileSphere = new THREE.Sphere();
    mobileOverviewBounds.getBoundingSphere(mobileSphere);
    __mobileSceneFocusTarget.copy(focusCenter);
    __mobileSceneFitRadius = mobileSphere.radius;

    const boundsMin = mobileOverviewBounds.min.clone();
    const boundsMax = mobileOverviewBounds.max.clone();
    const boundsCenter = mobileOverviewBounds.getCenter(new THREE.Vector3());

    __mobileOverviewSamplePoints = [
        boundsCenter.clone(),
        new THREE.Vector3(boundsMin.x, boundsMin.y, boundsMin.z),
        new THREE.Vector3(boundsMin.x, boundsMin.y, boundsMax.z),
        new THREE.Vector3(boundsMin.x, boundsMax.y, boundsMin.z),
        new THREE.Vector3(boundsMin.x, boundsMax.y, boundsMax.z),
        new THREE.Vector3(boundsMax.x, boundsMin.y, boundsMin.z),
        new THREE.Vector3(boundsMax.x, boundsMin.y, boundsMax.z),
        new THREE.Vector3(boundsMax.x, boundsMax.y, boundsMin.z),
        new THREE.Vector3(boundsMax.x, boundsMax.y, boundsMax.z),
        new THREE.Vector3(focusCenter.x, focusCenter.y + shellRadius, focusCenter.z),
        new THREE.Vector3(focusCenter.x, focusCenter.y - shellRadius, focusCenter.z),
        modelBounds.getCenter(new THREE.Vector3()),
        modelBounds.min.clone(),
        modelBounds.max.clone()
    ];

    if (orbitBounds.penguinPosition) {
        __mobileOverviewSamplePoints.push(orbitBounds.penguinPosition.clone());
    }
}

function applyMobileScreenSpaceCompensation() {
    if (!isMobileLayout() || __mobileOverviewSamplePoints.length === 0) return;

    const desiredNdc = MOBILE_OVERVIEW_CAMERA_COMPOSITION.targetNdc;

    for (let i = 0; i < 2; i++) {
        let sumX = 0;
        let sumY = 0;
        let count = 0;

        __mobileOverviewSamplePoints.forEach((point) => {
            const projected = point.clone().project(camera);
            if (Number.isFinite(projected.x) && Number.isFinite(projected.y) && Number.isFinite(projected.z)) {
                sumX += projected.x;
                sumY += projected.y;
                count += 1;
            }
        });

        if (!count) return;

        const currentNdcX = sumX / count;
        const currentNdcY = sumY / count;
        const deltaX = desiredNdc.x - currentNdcX;
        const deltaY = desiredNdc.y - currentNdcY;

        if (Math.abs(deltaX) < 0.01 && Math.abs(deltaY) < 0.01) return;

        const distanceToTarget = camera.position.distanceTo(controls.target);
        const visibleHeight = 2 * distanceToTarget * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
        const visibleWidth = visibleHeight * camera.aspect;

        const forward = camera.getWorldDirection(new THREE.Vector3()).normalize();
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
        const up = new THREE.Vector3().crossVectors(right, forward).normalize();

        const offset = new THREE.Vector3()
            .add(right.multiplyScalar(-deltaX * visibleWidth * 0.5))
            .add(up.multiplyScalar(-deltaY * visibleHeight * 0.5));

        camera.position.add(offset);
        controls.target.add(offset);
        camera.updateProjectionMatrix();
        controls.update();
    }
}

// 与电脑屏幕保持一致的 X 轴倾角。
const SCREEN_ROT_X = -0.37;

// 电脑屏幕默认变换（桌面端基准值）
const SCREEN_BASE_TRANSFORM = {
    // 仅做贴屏幕处理：把网页收进电脑黑色边框内部。
    position: { x: 0.12, y: 51.20, z: -7.15 },
    scale: { x: 0.1218, y: 0.1085, z: 0.20 }
};

function updateResponsiveScreenTransform(screenObject) {
    if (!screenObject) return;

    screenObject.rotation.x = SCREEN_ROT_X;
    screenObject.position.set(
        SCREEN_BASE_TRANSFORM.position.x,
        SCREEN_BASE_TRANSFORM.position.y,
        SCREEN_BASE_TRANSFORM.position.z
    );
    screenObject.scale.set(
        SCREEN_BASE_TRANSFORM.scale.x,
        SCREEN_BASE_TRANSFORM.scale.y,
        SCREEN_BASE_TRANSFORM.scale.z
    );
}

function updateScreenFacingVisibility() {
    if (!__screenObject) return;

    __screenObject.getWorldPosition(__screenWorldPosition);
    __screenObject.getWorldQuaternion(__screenWorldQuaternion);

    __screenForward.set(0, 0, 1).applyQuaternion(__screenWorldQuaternion).normalize();
    __screenToCamera.copy(camera.position).sub(__screenWorldPosition).normalize();

    const facingDot = __screenForward.dot(__screenToCamera);
    const shouldShowScreen = facingDot > 0.18;

    __screenObject.visible = shouldShowScreen;
    __screenObject.element.style.pointerEvents = shouldShowScreen ? 'auto' : 'none';
}

function collectMobileViewportDebugWithContext(label = 'snapshot') {
    return collectMobileViewportDebug({
        camera,
        controls,
        label,
        onSnapshot: (snapshot) => {
            __mobileViewportDebug = snapshot;
        }
    });
}
 
// ============================================
// 第 1 步：获取容器
// ============================================
const container = document.getElementById('canvas-container');

// ============================================
// 加载遮罩与进入流程
// 加载中显示相册和进度；加载完成后提示点击进入
// ============================================

const albumOverlayController = createAlbumOverlayController({
    onBeforeDismiss: () => {
        collectMobileViewportDebugWithContext('before-overlay-remove');
    },
    onAfterDismiss: () => {
        collectMobileViewportDebugWithContext('after-overlay-remove');
    }
});
 
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
updateResponsiveControlsBehavior(controls);

const earthOrbitSystem = createEarthOrbitSystem({
    scene,
    camera,
    isMobileLayout,
    applyResponsiveCameraFit,
    rebuildMobileOverviewState,
    collectMobileViewportDebug: collectMobileViewportDebugWithContext,
    saveInitialViewState: (viewKey, force = false) => {
        __saveInitialViewState(viewKey, force);
        if (viewKey === 'mobile') {
            __mobileInitialViewCaptured = true;
        }
    },
    getLoadedModel: () => __loadedModel
});
 
// ============================================
// 第 6 步：加载 3D 模型
// ============================================
const modelPath = './assets/models/laptop.glb';

loadLaptopModel({
    modelPath,
    onLoad: (model) => {
        __loadedModel = model;

        autoFitCamera(model);
        scene.add(model);

        if (!__desktopInitialViewCaptured) {
            __saveInitialViewState('desktop');
            __desktopInitialViewCaptured = true;
        }

        earthOrbitSystem.createEnvironment(model, {
            onSceneFitComputed: ({ center, sceneFitRadius }) => {
                __sceneFocusTarget.copy(center);
                __sceneFitRadius = sceneFitRadius;
            }
        });

        if (isMobileLayout() && !__mobileInitialViewCaptured) {
            __saveInitialViewState('mobile');
            __mobileInitialViewCaptured = true;
        }

        createScreen();
        earthOrbitSystem.setupToggleHotkey();

        const legacyLoading = document.getElementById('loading');
        if (legacyLoading) legacyLoading.style.display = 'none';
        albumOverlayController.markReadyToEnter();
    },
    onProgress: (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(1);
        const mb = (progress.loaded / 1024 / 1024).toFixed(1);
        const totalMb = (progress.total / 1024 / 1024).toFixed(1);

        albumOverlayController.setLoadingText('加载模型中...');
        albumOverlayController.setProgress(`${percent}% (${mb}MB / ${totalMb}MB)`);
    },
    onError: (error) => {
        console.error('模型加载失败:', error);
        alert('我嘞个豆儿，妈妈又把网给恰了:(');
    }
});
 
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
    const cameraDistance = getCameraFitDistance(maxDim * 0.5, 2.5);

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
// 第 7.3 步：添加网格辅助线与坐标轴辅助线
// ============================================
const gridHelper = new THREE.GridHelper(10000, 100);
scene.add(gridHelper);
 
const axesHelper = new THREE.AxesHelper(5000);
scene.add(axesHelper);
 
// ============================================
// 电脑屏幕内容
// 使用 CSS3DObject 承载网页和视频，两者共享同一块屏幕位置
// ============================================
function createScreen() {
    const { iframe, loadingHint, screenObject, video } = createScreenExperience({
        cssScene,
        CSS3DObject,
        updateResponsiveScreenTransform,
        onScreenObjectCreated: (createdScreenObject) => {
            __screenObject = createdScreenObject;
        }
    });

    console.log('屏幕已创建');
    setupScreenDebugHotkeys(screenObject);
    setupVideoToggleHotkey({ iframe, video, loadingHint });
}

// ============================================
// 渲染循环
// 持续更新控制器、地心环境和 CSS3D / WebGL 场景
// ============================================
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    earthOrbitSystem.update();
    updateScreenFacingVisibility();

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

    updateResponsiveControlsBehavior(controls);

    // 移动端在 resize 时重新套用总览构图，桌面端不强制改动当前相机位置。
    if (isMobileLayout()) {
        applyResponsiveCameraFit();
        collectMobileViewportDebugWithContext('resize');
    }

    cssScene.traverse((object) => {
        if (object instanceof CSS3DObject) {
            updateResponsiveScreenTransform(object);
        }
    });
});

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        collectMobileViewportDebugWithContext('visualViewport-resize');
    });
    window.visualViewport.addEventListener('scroll', () => {
        collectMobileViewportDebugWithContext('visualViewport-scroll');
    });
}
 
console.log('3d-computer initialized');
console.log('这网页能处，有事它真加载');

// ============================================
// U 键恢复目标视角
// 桌面端恢复到电脑前方视角，移动端恢复到移动端总览视角
// ============================================

const __initialViewState = {
    desktop: {
        saved: false,
        cameraPosition: new THREE.Vector3(),
        controlsTarget: new THREE.Vector3(),
        cameraZoom: 1
    },
    mobile: {
        saved: false,
        cameraPosition: new THREE.Vector3(),
        controlsTarget: new THREE.Vector3(),
        cameraZoom: 1
    }
};

function __saveInitialViewState(viewKey = getCurrentViewStateKey(), force = false) {
    const targetState = __initialViewState[viewKey];
    if (!targetState || (targetState.saved && !force)) return;

    targetState.cameraPosition.copy(camera.position);
    targetState.controlsTarget.copy(controls.target);
    targetState.cameraZoom = camera.zoom;
    targetState.saved = true;
    console.log(`✅ 已记录 ${viewKey} 初始视角（按 U 可恢复）`);
}

function __restoreInitialViewState() {
    const viewKey = getCurrentViewStateKey();
    const targetState = __initialViewState[viewKey];

    if (!targetState || !targetState.saved) {
        console.warn('⚠️ 初始视角尚未记录，无法恢复');
        return;
    }

    camera.position.copy(targetState.cameraPosition);
    controls.target.copy(targetState.controlsTarget);
    camera.zoom = targetState.cameraZoom;
    camera.updateProjectionMatrix();
    controls.update();
}

// 桌面端在自动对焦后先记录“电脑前方视角”，随后再切到总览；
// 移动端记录的是移动端总览视角。

// 监听 U 键
window.addEventListener('keydown', (e) => {
    if (e.key === 'u' || e.key === 'U') {
        __restoreInitialViewState();
    }
});
