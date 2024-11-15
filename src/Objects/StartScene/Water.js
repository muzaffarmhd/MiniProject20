import * as THREE from 'three';
import { Water } from 'three/examples/objects/Water.js';
import { Sky } from 'three/examples/objects/Sky.js';
let water, sun, mesh;
sun = new THREE.Vector3();
const waterGeometry = new THREE.PlaneGeometry( 1000, 1000 );
water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( './static/Micellaneous/waternormals.jpg', function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        } ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 1.7,
    }
);
water.rotation.x = - Math.PI / 2;
const sky = new Sky();
sky.scale.setScalar(10000);
const skyUniforms = sky.material.uniforms;

// Adjust for a darker, stormy atmosphere
skyUniforms['turbidity'].value = 15; // Increase for more atmospheric density (cloudiness)
skyUniforms['rayleigh'].value = 0.1; // Lower for less scattering, making the sky darker
skyUniforms['mieCoefficient'].value = 0.005; // Increase for more light scattering (thickness of the atmosphere)
skyUniforms['mieDirectionalG'].value = 0.999999; // Adjust for directional light scattering

// Elevation and azimuth to position the sun or light
const parameters = {
    elevation: 5, // Lower elevation to simulate a late afternoon or stormy condition
    azimuth: 180  // Keep azimuth as desired (sun direction)
};
let renderTarget;
function updateSun(scene, renderer) {
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    const sceneEnv = new THREE.Scene();

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    sceneEnv.add( sky );
    renderTarget = pmremGenerator.fromScene( sceneEnv );
    scene.add( sky );

    scene.environment = renderTarget.texture;
    water.position.y = 0.1;
    scene.add( water );
    scene.add( sky );
}




export { water, updateSun };