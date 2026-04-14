import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function applyStandardMaterials(model) {
    model.traverse((child) => {
        if (!child.isMesh) return;

        const oldMaterial = child.material;
        const newMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.1
        });

        if (oldMaterial && oldMaterial.map) {
            newMaterial.map = oldMaterial.map;
            newMaterial.map.flipY = false;
            newMaterial.map.colorSpace = THREE.SRGBColorSpace;
        }

        child.material = newMaterial;
    });
}

export function loadLaptopModel({ modelPath, onLoad, onProgress, onError }) {
    const loader = new GLTFLoader();

    loader.load(
        modelPath,
        (gltf) => {
            const model = gltf.scene;
            applyStandardMaterials(model);
            onLoad(model);
        },
        onProgress,
        onError
    );
}
