import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';
import SceneManager from './Handlers/SceneManager.js';
import { StateHandler } from './Handlers/StateHandler.js';

import BaseScene from './View/BaseScene.js';

const canvas = document.querySelector('.webgl');

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}
if (isMobile()) {
    document.getElementById('mobile-controls').style.display = 'block';
    canvas.addEventListener('click', () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        }

        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch((err) => {
                console.warn(`Error locking orientation to landscape: ${err.message}`);
            });
        }
    });
}

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    startGame();
});
function startGame() {
    const sceneManager = new SceneManager(canvas);
    const baseScene = new BaseScene(sceneManager, sceneManager.inputHandler, sceneManager.gltfLoader, sceneManager.textureLoader);
    sceneManager.setCurrentScene(baseScene);
    const stateHandler = new StateHandler(sceneManager.inputHandler, window);

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    window.onresize = () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        if (sceneManager.currentScene.objects.cameraObject.camera) {
            sceneManager.currentScene.objects.cameraObject.camera.aspect = sizes.width / sizes.height;
            sceneManager.currentScene.objects.cameraObject.camera.updateProjectionMatrix();
        }
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }


    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    const clock = new THREE.Clock();
    let oldElapsedTime = 0;
    const tick = () => {
        stats.begin();
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;
        if (sceneManager.currentScene) {
            sceneManager.update(deltaTime);
            renderer.render(sceneManager.currentScene.scene, sceneManager.currentScene.objects.cameraObject.camera);
        }
        stats.end();
        window.requestAnimationFrame(tick);
    }
    tick();
}