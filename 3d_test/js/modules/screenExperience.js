export function createScreenExperience({
    cssScene,
    CSS3DObject,
    updateResponsiveScreenTransform,
    onScreenObjectCreated
}) {
    const screenWrap = document.createElement('div');
    screenWrap.style.width = '1480px';
    screenWrap.style.height = '1100px';
    screenWrap.style.position = 'relative';
    screenWrap.style.overflow = 'hidden';
    screenWrap.style.backgroundColor = 'black';

    const iframe = document.createElement('iframe');
    iframe.src = 'https://rockosdev.github.io/';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'white';

    const video = document.createElement('video');
    video.dataset.src = './assets/textures/video.mp4';
    video.preload = 'none';
    video.playsInline = true;
    video.controls = true;
    video.controlsList = 'nodownload';
    video.loop = true;
    video.style.position = 'absolute';
    video.style.inset = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
    video.style.background = '#000';
    video.style.display = 'none';

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
    updateResponsiveScreenTransform(screenObject);
    screenObject.element.style.backfaceVisibility = 'hidden';
    cssScene.add(screenObject);

    if (typeof onScreenObjectCreated === 'function') {
        onScreenObjectCreated(screenObject);
    }

    return { iframe, loadingHint, screenObject, video };
}

export function setupVideoToggleHotkey({ iframe, video, loadingHint }) {
    let isVideoMode = false;

    async function enterVideoMode() {
        if (isVideoMode) return;
        isVideoMode = true;

        iframe.style.display = 'none';
        video.style.display = 'block';

        if (!video.getAttribute('src')) {
            if (loadingHint) loadingHint.style.display = 'block';
            video.src = video.dataset.src;
        }

        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    }

    function exitVideoMode() {
        if (!isVideoMode) return;
        isVideoMode = false;

        video.pause();
        video.style.display = 'none';
        iframe.style.display = 'block';
        if (loadingHint) loadingHint.style.display = 'none';
    }

    window.addEventListener('keydown', (event) => {
        const isV = event.key === 'v' || event.key === 'V';
        if (!isV) return;

        const tag = event.target && event.target.tagName
            ? String(event.target.tagName).toLowerCase()
            : '';
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        event.preventDefault();
        if (isVideoMode) {
            exitVideoMode();
            return;
        }

        enterVideoMode();
    });
}

export function setupScreenDebugHotkeys(screenObject) {
    console.log('=== 调试模式已开启 ===');
    console.log('R     : 开关企鹅尾随旗帜 + 粒子束特效');
    console.log('方向键 ↑↓←→ : 移动屏幕位置');
    console.log('W/S : 前后移动');
    console.log('Q/E : 旋转 X 轴');
    console.log('A/D : 旋转 Y 轴');
    console.log('Z/X : 旋转 Z 轴');
    console.log('+/- : 缩放');
    console.log('P : 打印当前坐标');

    const step = 0.2;
    const rotStep = 0.01;

    window.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'R') return;

        switch (event.key) {
            case 'ArrowUp': screenObject.position.y += step; break;
            case 'ArrowDown': screenObject.position.y -= step; break;
            case 'ArrowLeft': screenObject.position.x -= step; break;
            case 'ArrowRight': screenObject.position.x += step; break;
            case 'w':
            case 'W': screenObject.position.z -= step; break;
            case 's':
            case 'S': screenObject.position.z += step; break;
            case 'q':
            case 'Q': screenObject.rotation.x += rotStep; break;
            case 'e':
            case 'E': screenObject.rotation.x -= rotStep; break;
            case 'a':
            case 'A': screenObject.rotation.y += rotStep; break;
            case 'd':
            case 'D': screenObject.rotation.y -= rotStep; break;
            case 'z':
            case 'Z': screenObject.rotation.z += rotStep; break;
            case 'x':
            case 'X': screenObject.rotation.z -= rotStep; break;
            case '+':
            case '=': screenObject.scale.multiplyScalar(1.1); break;
            case '-': screenObject.scale.multiplyScalar(0.9); break;
            case 'p':
            case 'P':
                console.log('========== 当前坐标 ==========');
                console.log(`position.set(${screenObject.position.x.toFixed(2)}, ${screenObject.position.y.toFixed(2)}, ${screenObject.position.z.toFixed(2)})`);
                console.log(`rotation.set(${screenObject.rotation.x.toFixed(2)}, ${screenObject.rotation.y.toFixed(2)}, ${screenObject.rotation.z.toFixed(2)})`);
                console.log(`scale.set(${screenObject.scale.x.toFixed(2)}, ${screenObject.scale.y.toFixed(2)}, ${screenObject.scale.z.toFixed(2)})`);
                console.log('==============================');
                break;
        }
    });
}
