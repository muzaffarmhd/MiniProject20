import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class SpaceSkybox {
    constructor(scene, world, gltfLoader, textureLoader) {
        this.scene = scene;
        this.world = world;
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.portal = null;
        this.mixer = null;
    }
    initialize(path, position, scale=null) {
        this.gltfLoader.load(path, (gltf) => {
            this.portal = gltf.scene;
            this.portal.position.copy(position);
            this.portal.scale.set(0.001,0.001,0.001)
            //log the bounding box
            if (scale){
                this.portal.scale.set(scale.x, scale.y, scale.z);
            }
            const box = new THREE.Box3().setFromObject(this.portal);
            console.log(box.min, box.max, box.getSize());
            this.scene.add(this.portal);
        });
    }
    update(mainCharacter) {
        this.portal.position.copy(mainCharacter.character.position);
    }
}

export default SpaceSkybox;