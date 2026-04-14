import * as THREE from 'three';

export const MOBILE_OVERVIEW_CAMERA_COMPOSITION = {
    direction: new THREE.Vector3(0.03, 0.2, 1),
    padding: 2.02,
    focusOffset: new THREE.Vector3(0, -120, 0),
    targetNdc: new THREE.Vector2(0, 0.16),
    enableScreenSpaceCompensation: true
};

export function isMobileLayout() {
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|iPhone|iPod|Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const hasTouch = navigator.maxTouchPoints > 0;
    return isMobileUA && hasTouch;
}

export function getCurrentViewStateKey() {
    return isMobileLayout() ? 'mobile' : 'desktop';
}

export function collectMobileViewportDebug({ camera, controls, label = 'snapshot', onSnapshot }) {
    if (!isMobileLayout()) return null;

    const canvasContainer = document.getElementById('canvas-container');
    const albumLoading = document.getElementById('album-loading');
    const visualViewport = window.visualViewport;

    const snapshot = {
        label,
        timestamp: new Date().toISOString(),
        isMobileLayout: true,
        devicePixelRatio: window.devicePixelRatio,
        windowInner: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        visualViewport: visualViewport ? {
            width: visualViewport.width,
            height: visualViewport.height,
            offsetTop: visualViewport.offsetTop,
            offsetLeft: visualViewport.offsetLeft,
            scale: visualViewport.scale
        } : null,
        page: {
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            scrollHeight: document.documentElement.scrollHeight,
            clientHeight: document.documentElement.clientHeight
        },
        canvasContainerRect: canvasContainer ? canvasContainer.getBoundingClientRect().toJSON() : null,
        albumLoadingRect: albumLoading ? albumLoading.getBoundingClientRect().toJSON() : null,
        mobileCameraComposition: {
            direction: MOBILE_OVERVIEW_CAMERA_COMPOSITION.direction.toArray(),
            padding: MOBILE_OVERVIEW_CAMERA_COMPOSITION.padding,
            focusOffset: MOBILE_OVERVIEW_CAMERA_COMPOSITION.focusOffset.toArray(),
            targetNdc: MOBILE_OVERVIEW_CAMERA_COMPOSITION.targetNdc.toArray()
        },
        camera: {
            position: camera.position.toArray(),
            controlsTarget: controls.target.toArray(),
            zoom: camera.zoom
        }
    };

    if (typeof onSnapshot === 'function') {
        onSnapshot(snapshot);
    }

    window.__mobileViewportDebug = snapshot;
    console.log('[mobile-viewport-debug]', snapshot);
    return snapshot;
}

export function updateResponsiveControlsBehavior(controls) {
    controls.enablePan = true;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
}
