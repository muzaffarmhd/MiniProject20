import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class Floor {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        
        // Load texture maps
        const textureLoader = new THREE.TextureLoader();
        const textureBase = './static/FloorTexture/textures/brown_mud_leaves_01';
        
        // Load all texture maps
        const diffuseMap = textureLoader.load(`${textureBase}_diff_1k.jpg`);
        const normalMap = textureLoader.load(`${textureBase}_nor_gl_1k.jpg`);
        const aoMap = textureLoader.load(`${textureBase}_ao_1k.jpg`);
        const roughnessMap = textureLoader.load(`${textureBase}_rough_1k.jpg`);
        const displacementMap = textureLoader.load(`${textureBase}_disp_1k.jpg`);
        const armMap = textureLoader.load(`${textureBase}_arm_1k.jpg`);

        // Set texture properties
        [diffuseMap, normalMap, aoMap, roughnessMap, displacementMap, armMap].forEach(map => {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.repeat.set(1000, 1000); // Adjust the repeat value based on your needs
        });

        // Create geometry with more segments for better displacement
        this.geometry = new THREE.PlaneGeometry(10000, 10000, 256, 256);
        
        // Create material with textures
        this.material = new THREE.MeshStandardMaterial({
            map: diffuseMap,
            normalMap: normalMap,
            aoMap: aoMap,
            roughnessMap: roughnessMap,
            displacementMap: displacementMap,
            // displacementScale: 2 // Adjust based on desired effect
            // side: THREE.DoubleSide
        });

        this.floor = new THREE.Mesh(this.geometry, this.material);

        /* Physics */
        this.shape = new CANNON.Plane();
        this.body = new CANNON.Body({
            mass: 0,
            shape: this.shape
        });
        this.plastic = new CANNON.Material('plastic');
        this.contactMaterial = new CANNON.ContactMaterial(
            this.plastic, 
            this.plastic, 
            {
                friction: 0.1, 
                restitution: 0.3
            }
        );
    }

    initialize() {
        // Generate UV2 coordinates for aoMap
        this.geometry.setAttribute('uv2', new THREE.BufferAttribute(this.geometry.attributes.uv.array, 2));
        
        this.floor.receiveShadow = true;
        this.floor.position.y = 0;
        this.floor.rotation.x = -1 * (Math.PI / 2);
        
        this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        
        this.scene.add(this.floor);
        this.world.addBody(this.body);
        this.world.addContactMaterial(this.contactMaterial);
    }
}

export default Floor;