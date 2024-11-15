import * as THREE from 'three';
import * as CANNON from 'cannon-es';

/* Importing Necessities */
import ShipCamera from './ShipCamera.js';
import Camera from './Camera.js';
import { Lights } from './Lights.js';
import Floor from '../Objects/Floor.js';
import { water, updateSun } from '../Objects/StartScene/Water.js';

import instruction from '../Handlers/Instructions.js';

/* Importing Object Classes */
// import MainCharacter from '../Objects/MainCharacter.js';
import Ship from '../Objects/StartScene/Ship.js';
import SpaceSkybox from '../Objects/SpaceSkybox.js';
import StaticObject from '../Objects/StaticObject.js';

class StartScene {
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
            cameraObject: new ShipCamera(this.scene),
            lights: new Lights(this.scene),
            floor: new Floor(this.scene, this.world),
            mainCharacter: new Ship(this.scene, this.world, this.gltfLoader, this.textureLoader),
            spaceSkybox: new SpaceSkybox(this.scene, this.world, this.gltfLoader, this.textureLoader),
            house: new StaticObject(this.scene, this.world, this.gltfLoader, this.textureLoader),
            mountain: new StaticObject(this.scene, this.world, this.gltfLoader, this.textureLoader),
            dinasour_mountain: new StaticObject(this.scene, this.world, this.gltfLoader, this.textureLoader)
        }
        this.instructions = [
            "Due to a heavy storm, your ship is damaged, we need a person to steer to the nearest Island",
            "Avoid hitting terrains, your ship health is already low.",
            "Follow the moonlight to reach the island",
            "The Storm was so heavy that it has caused a lot of damage to the ship",
            "The ship is not responding to the controls, you have to steer it manually",
            "Watch your altitude while flying",
            "Press SHIFT for a speed boost",
            "Explore the mountainous terrain",
            "Avoid hitting obstacles",
            "Press ESC to pause the game"
        ];
        this.currentStep = 0;
        this.lastInstructionTime = 0;
        this.instructionInterval = 5000; // 5 seconds
        this.hasCompletedCycle = false;

        // Show first instruction
        instruction.show(this.instructions[0]);
    }

    updateInstructions(currentTime) {
        if (currentTime - this.lastInstructionTime >= this.instructionInterval) {
            // Move to next instruction
            this.currentStep++;
            
            // If we've shown all instructions, start over
            if (this.currentStep >= this.instructions.length) {
                this.currentStep = 0;
                this.hasCompletedCycle = true;
            }

            // Show current instruction
            instruction.show(this.instructions[this.currentStep]);
            this.lastInstructionTime = currentTime;
        }
    }

    initialize(renderer=null) {
        this.objects.mainCharacter.initialize('./static/Ship/empty_shipglb.glb', new THREE.Vector3(0, 0, 0));
        // this.objects.spaceSkybox.initialize('./static/Skybox/cloudspace.glb', new THREE.Vector3(0, 0, 0), new THREE.Vector3(500,500,500));
        this.objects.lights.initialize(new THREE.Vector3(2, 3, 2));
        this.objects.cameraObject.initialize(new THREE.Vector3(0,3, 10), new THREE.Vector3(0, 1, 0));
        this.objects.floor.initialize(false);
        // this.objects.house.initialize('./static/Micellaneous/colony.glb', new THREE.Vector3(-10, 0, 0), new THREE.Vector3(2.5, 2.5, 2.5));
        // this.objects.mountain.initialize('./static/Micellaneous/hero_mountain.glb', new THREE.Vector3(100, -12, 100), new THREE.Vector3(100, 100, 100));
        this.objects.dinasour_mountain.initialize('./static/Micellaneous/forestglb.glb', new THREE.Vector3(100,0,100), new THREE.Vector3(1,1,1));
        this.world.gravity.set(0, -9.82, 0);
        updateSun(this.scene, renderer);
        // this.scene.fog = new THREE.Fog('#701fa3', 0, 130);

    }

    update(deltaTime) {
        // this.updateInstructions(performance.now());
        if (this.objects.mainCharacter.character) {
            this.inputHandler.handleShip(this.objects.mainCharacter, this.objects.cameraObject.camera, deltaTime);
            this.objects.mainCharacter.syncCharacter(deltaTime);
            this.objects.cameraObject.updateMainCamera(this.objects.mainCharacter);
            if (this.objects.spaceSkybox.portal) {
                this.objects.spaceSkybox.update(this.objects.mainCharacter);
            }
            this.inputHandler.handleBullet(this.objects.mainCharacter, this.objects.cameraObject.camera);
            this.objects.mainCharacter.syncBullet();
        }
        if (water){
            console.log("Water running!")
            water.material.uniforms[ 'time' ].value += 0.5 / 60.0;
        }
        this.world.step(1 / 60, deltaTime, 3);
    }
}

export default StartScene;