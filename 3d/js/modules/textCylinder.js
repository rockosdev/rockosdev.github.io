import * as THREE from 'three';

const FONT_FAMILY = '"KaiTi", "楷体", "STKaiti", "FangSong", serif';
const TEXT_COLOR = '#FFD700';
const TEXT_STROKE_COLOR = 'rgba(218, 165, 32, 0.5)';
const GLOW_COLOR = 'rgba(255, 200, 50, 0.35)';
const BASE_FONT_SIZE = 32;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

function createVerticalTextCanvas(text, fontSize) {
    const chars = Array.from(text);
    if (chars.length === 0) return null;

    const scaledSize = fontSize * DPR;
    const charSpacing = scaledSize * 0.3;
    const charHeight = scaledSize + charSpacing;
    const padding = scaledSize * 0.25;

    const canvasWidth = Math.ceil(scaledSize + padding * 2);
    const canvasHeight = Math.ceil(chars.length * charHeight + padding * 2);

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.shadowColor = GLOW_COLOR;
    ctx.shadowBlur = 6 * DPR;

    ctx.font = `${scaledSize}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = TEXT_STROKE_COLOR;
    ctx.lineWidth = 1.2 * DPR;
    ctx.lineJoin = 'round';

    chars.forEach((char, i) => {
        const x = canvasWidth / 2;
        const y = padding + charHeight / 2 + i * charHeight;
        ctx.strokeText(char, x, y);
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(char, x, y);
    });

    return canvas;
}

export function createTextCylinderSystem({
    scene,
    getOrbitInfo,
    getPenguinPosition
}) {
    let group = null;
    let columns = [];
    let visible = false;
    let built = false;

    async function build() {
        try {
            const response = await fetch('./assets/texts/zh.txt');
            const text = await response.text();
            const lines = text.split('\n').filter(l => l.trim().length > 0);

            if (lines.length === 0) return;

            const { orbitCenter, orbitRadius } = getOrbitInfo();
            if (orbitRadius <= 0) return;

            group = new THREE.Group();
            columns = [];

            const count = lines.length;
            const angleStep = (Math.PI * 2) / count;

            const worldCharWidth = orbitRadius * 0.012;
            const worldCharHeight = worldCharWidth * 1.35;

            lines.forEach((line, index) => {
                const chars = Array.from(line);
                if (chars.length === 0) return;

                const canvas = createVerticalTextCanvas(line, BASE_FONT_SIZE);
                if (!canvas) return;

                const texture = new THREE.CanvasTexture(canvas);
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = false;

                const planeWidth = worldCharWidth;
                const planeHeight = chars.length * worldCharHeight;

                const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                    opacity: 0.88
                });

                const mesh = new THREE.Mesh(geometry, material);
                const angle = index * angleStep;

                mesh.position.set(
                    orbitCenter.x + Math.cos(angle) * orbitRadius,
                    orbitCenter.y,
                    orbitCenter.z + Math.sin(angle) * orbitRadius
                );

                mesh.lookAt(orbitCenter.x, mesh.position.y, orbitCenter.z);

                group.add(mesh);
                columns.push({
                    mesh,
                    baseAngle: angle,
                    speedY: 0.15 + Math.random() * 0.5,
                    phaseY: Math.random() * Math.PI * 2,
                    amplitudeY: orbitRadius * 0.02 + Math.random() * orbitRadius * 0.04,
                    currentPush: 0,
                    currentOpacity: 0.88
                });
            });

            group.visible = visible;
            scene.add(group);
            built = true;
        } catch (error) {
            console.warn('文字圆柱构建失败:', error);
        }
    }

    function normalizeAngle(a) {
        while (a > Math.PI) a -= Math.PI * 2;
        while (a < -Math.PI) a += Math.PI * 2;
        return a;
    }

    function update() {
        if (!group || !visible || !built) return;

        const time = Date.now() * 0.001;
        const { orbitCenter, orbitRadius } = getOrbitInfo();

        const globalYOffset = Math.sin(time * 0.3) * orbitRadius * 0.04;

        const penguinPosition = getPenguinPosition();

        let penguinAngle = 0;
        let avoidArcHalf = 0;
        const avoidPushMax = orbitRadius * 0.25;

        if (penguinPosition) {
            penguinAngle = Math.atan2(
                penguinPosition.z - orbitCenter.z,
                penguinPosition.x - orbitCenter.x
            );
            avoidArcHalf = THREE.MathUtils.degToRad(8);
        }

        columns.forEach(col => {
            const yOffset = Math.sin(time * col.speedY + col.phaseY) * col.amplitudeY;

            let targetPush = 0;
            let targetOpacity = 0.88;

            if (penguinPosition) {
                const angleDiff = Math.abs(normalizeAngle(col.baseAngle - penguinAngle));

                if (angleDiff < avoidArcHalf) {
                    const factor = 1 - angleDiff / avoidArcHalf;
                    targetPush = factor * avoidPushMax;
                    targetOpacity = 0.88 * (1 - factor * 0.4);
                }
            }

            col.currentPush += (targetPush - col.currentPush) * 0.08;
            col.currentOpacity += (targetOpacity - col.currentOpacity) * 0.08;

            const currentRadius = orbitRadius + col.currentPush;
            const posX = orbitCenter.x + Math.cos(col.baseAngle) * currentRadius;
            const posZ = orbitCenter.z + Math.sin(col.baseAngle) * currentRadius;

            col.mesh.position.set(posX, orbitCenter.y + globalYOffset + yOffset, posZ);
            col.mesh.material.opacity = col.currentOpacity;
            col.mesh.lookAt(orbitCenter.x, col.mesh.position.y, orbitCenter.z);
        });
    }

    function toggle() {
        visible = !visible;
        if (group) {
            group.visible = visible;
        }
        return visible;
    }

    return { build, update, toggle, get visible() { return visible; } };
}
