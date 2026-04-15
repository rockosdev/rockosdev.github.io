import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ORBIT_PENGUIN_HEADING_OFFSET = Math.PI / 2;

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
            if (loadedTexture.image) drawTexture(loadedTexture.image);
        },
        undefined,
        (error) => {
            console.warn('旗面贴图加载失败，已使用文字底图代替:', error);
        }
    );

    return canvasTexture;
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

export function createEarthOrbitSystem({
    scene,
    camera,
    isMobileLayout,
    applyResponsiveCameraFit,
    rebuildMobileOverviewState,
    collectMobileViewportDebug,
    saveInitialViewState,
    getLoadedModel
}) {
    let earthCoreGroup = null;
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
            const particle = penguinParticleData[i];
            particle.progress += particle.speed;
            if (particle.progress > 1) {
                penguinParticleData[i] = createPenguinBeamParticle(0);
                Object.assign(particle, penguinParticleData[i]);
            }

            const distance = particle.progress * penguinTrailLength;
            const swirl = particle.swirl - time * particle.drift - particle.progress * 8;
            const radial = particle.progress * particle.spread;

            const pos = beamStart.clone()
                .add(frontDirection.clone().multiplyScalar(distance))
                .add(sideDirection.clone().multiplyScalar(Math.cos(swirl) * radial))
                .add(upDirection.clone().multiplyScalar(Math.sin(swirl) * radial + particle.rise));

            particleAttr.array[i * 3] = pos.x;
            particleAttr.array[i * 3 + 1] = pos.y;
            particleAttr.array[i * 3 + 2] = pos.z;
        }

        particleAttr.needsUpdate = true;
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

        orbitPenguin.position.set(x, orbitPenguinBaseY + Math.sin(time * 10) * 8, z);
        orbitPenguin.rotation.set(0, heading, 0);

        updatePenguinFollowEffects(time, forwardDirection);
    }

    function loadOrbitPenguin(baseRadius) {
        const penguinLoader = new GLTFLoader();
        penguinLoader.load(
            './assets/models/qq.glb',
            (gltf) => {
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

                const loadedModel = getLoadedModel();
                if (!loadedModel) return;

                const modelBounds = new THREE.Box3().setFromObject(loadedModel);
                const shellRadius = earthGridRadius;
                const orbitVerticalReach = Math.max(targetSize * 1.45 + 8, baseRadius * 0.5);
                rebuildMobileOverviewState(modelBounds, shellRadius, orbitVerticalReach, {
                    center: orbitCenter,
                    radius: orbitRadius,
                    penguinPosition: orbitPenguin.position
                });

                if (isMobileLayout() && document.getElementById('album-loading')) {
                    applyResponsiveCameraFit();
                    saveInitialViewState('mobile', true);
                    collectMobileViewportDebug('penguin-loaded-mobile-refit');
                }
            },
            undefined,
            (error) => {
                console.error('企鹅模型加载失败:', error);
            }
        );
    }

    function createEnvironment(model, { onSceneFitComputed } = {}) {
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
        orbitCenter.set(center.x, 0, center.z);
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
        const orbitVerticalReach = Math.max(baseRadius * 0.22 * 1.45 + 8, baseRadius * 0.5);

        if (typeof onSceneFitComputed === 'function') {
            onSceneFitComputed({
                center,
                sceneFitRadius
            });
        }

        rebuildMobileOverviewState(box, shellRadius, orbitVerticalReach, {
            focusCenter: center,
            center: orbitCenter,
            radius: orbitRadius
        });
        applyResponsiveCameraFit();
        loadOrbitPenguin(baseRadius);

        console.log('🌍 地心经纬网环境已创建');
    }

    function update() {
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

        updateOrbitPenguin(time);
    }

    function toggleFollowEffect() {
        penguinFollowEffectEnabled = !penguinFollowEffectEnabled;

        if (penguinFlagMesh) penguinFlagMesh.visible = penguinFollowEffectEnabled;
        if (penguinParticleBeam) penguinParticleBeam.visible = penguinFollowEffectEnabled;
        if (penguinFloatingTextSprite) penguinFloatingTextSprite.visible = penguinFollowEffectEnabled;

        console.log(penguinFollowEffectEnabled ? '🏁 已开启企鹅旗帜与粒子束特效' : '🏁 已关闭企鹅旗帜与粒子束特效');
    }

    function setupToggleHotkey() {
        console.log('⌨️ R键已设置为企鹅旗帜特效开关');

        window.addEventListener('keydown', (event) => {
            if (event.key === 'r' || event.key === 'R') {
                toggleFollowEffect();
            }
        });
    }

    return {
        createEnvironment,
        setupToggleHotkey,
        update,
        getOrbitInfo: () => ({ orbitCenter: orbitCenter.clone(), orbitRadius }),
        getPenguinPosition: () => orbitPenguin ? orbitPenguin.position.clone() : null
    };
}
