import * as THREE from 'three';
import * as CANNON from 'cannon-es';

/* Importing Necessities */
import Camera from './Camera.js';
import { Lights } from './Lights.js';
import Floor from '../Objects/Floor.js';

import instruction from '../Handlers/Instructions.js';

/* Importing Object Classes */
import MainCharacter from '../Objects/MainCharacter.js';
import SpaceSkybox from '../Objects/SpaceSkybox.js';
import StaticObject from '../Objects/StaticObject.js';

class BaseScene {
    constructor(sceneManager, inputHandler, gltfLoader, textureLoader) {
        this.scene = new THREE.Scene();
        this.world = new CANNON.World();
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.cameraObject = new Camera(this.scene);
        this.gltfLoader = gltfLoader;
        this.textureLoader = textureLoader;
        this.sceneManager = sceneManager;
        this.inputHandler = inputHandler;

        this.objects = {
            cameraObject: new Camera(this.scene),
            lights: new Lights(this.scene),
            floor: new Floor(this.scene, this.world),
            mainCharacter: new MainCharacter(this.scene, this.world, this.gltfLoader, this.textureLoader),
            spaceSkybox: new SpaceSkybox(this.scene, this.world, this.gltfLoader, this.textureLoader),
            house: new StaticObject(this.scene, this.world, this.gltfLoader, this.textureLoader),
            mountain: new StaticObject(this.scene, this.world, this.gltfLoader, this.textureLoader),
            dinasour_mountain: new StaticObject(this.scene, this.world, this.gltfLoader, this.textureLoader)
        }
        instruction.show("Use WASD to move around the world!")
    }

    initialize() {
        this.objects.mainCharacter.initialize('./static/Character/Farmer.gltf', new THREE.Vector3(0, 0, 0));
        this.objects.spaceSkybox.initialize('./static/Skybox/skybox_skydays_3.glb', new THREE.Vector3(0, 0, 0));
        this.objects.lights.initialize(new THREE.Vector3(2, 3, 2));
        this.objects.cameraObject.initialize(new THREE.Vector3(0, 0, 3), new THREE.Vector3(0, 0, 0));
        this.objects.floor.initialize();
        this.objects.house.initialize('./static/Micellaneous/colony.glb', new THREE.Vector3(-10, 0, 0), new THREE.Vector3(2.5, 2.5, 2.5));
        // this.objects.mountain.initialize('./static/Micellaneous/hero_mountain.glb', new THREE.Vector3(100, -12, 100), new THREE.Vector3(100, 100, 100));
        this.objects.dinasour_mountain.initialize('./static/Micellaneous/forestglb.glb', new THREE.Vector3(100,0,100), new THREE.Vector3(1,1,1));
        this.world.gravity.set(0, -9.82, 0);
        // this.scene.fog = new THREE.Fog('#701fa3', 0, 130);

    }

    update(deltaTime) {
        if (this.objects.mainCharacter.character) {
            this.inputHandler.handleCharacter(this.objects.mainCharacter, this.objects.cameraObject.camera, deltaTime);
            this.objects.mainCharacter.syncCharacter(deltaTime);
            this.objects.cameraObject.updateMainCamera(this.objects.mainCharacter);
            if (this.objects.spaceSkybox.portal) {
                this.objects.spaceSkybox.update(this.objects.mainCharacter);
            }
            this.inputHandler.handleBullet(this.objects.mainCharacter, this.objects.cameraObject.camera);
            this.objects.mainCharacter.syncBullet();
        }
        this.world.step(1 / 60, deltaTime, 3);
    }
}

export default BaseScene;
