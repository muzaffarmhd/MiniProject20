import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class StaticObject {
    constructor(scene, world, gltfLoader, textureLoader) {
        this.scene = scene;
        this.world = world;
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.portal = null;
        this.mixer = null;
    }
    initialize(path, position, scale) {
        this.gltfLoader.load(path, (gltf) => {
            this.portal = gltf.scene;
            this.portal.position.copy(position);
            this.portal.scale.copy(scale);
            const box = new THREE.Box3().setFromObject(this.portal);
            console.log(box.min, box.max, box.getSize());
            this.scene.add(this.portal);
        });
    }
}

export default StaticObject;