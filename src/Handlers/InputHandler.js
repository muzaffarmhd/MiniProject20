import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class InputHandler{
    constructor(forward=false,backward=false,left=false,right=false,shift=false, reset=false){
        this.forward = forward;
        this.backward = backward;
        this.left = left;
        this.right = right;
        this.shift = shift;
        this.direction = new THREE.Vector3(0,0,0);
        this.reset = reset;
        this.space = false;
        this.fire = false;
    }
    handleCharacter(characterObject, camera, deltaTime){
        if(this.forward && this.shift && this.left) {
            characterObject.UpdateState('Run');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'left', this, true);
        } else if (this.forward && this.shift && this.right){
            characterObject.UpdateState('Run');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'right', this, true);
        } else if (this.forward && this.shift){
            characterObject.UpdateState('Run');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'forward', this, true);
        } else if (this.forward && this.left){
            characterObject.UpdateState('Walk');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'left',this);
        } else if (this.forward && this.right){
            characterObject.UpdateState('Walk');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'right',this);
        } else if (this.forward){
            characterObject.UpdateState('Walk');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'forward',this);
        } else if (this.backward && this.left){
            characterObject.UpdateState('Walk');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'left',this);
        } else if (this.backward && this.right){
            characterObject.UpdateState('Walk');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'right',this);
        } else if (this.backward){
            characterObject.UpdateState('Walk');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'backward',this);
        } else if (this.left){
            characterObject.UpdateState('Walk');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'left',this);
        } else if (this.right){
            characterObject.UpdateState('Walk');
            characterObject.moveCharacter(this.direction, camera, deltaTime, 'right',this);
        } else {
            characterObject.UpdateState('Idle');
        }
    }
    handleCubePyramid(pyramid){
        if (this.reset){
            pyramid.resetCubes();
            this.reset = false;
        }
    }
    handleBullet(characterObject, camera){
        if (this.fire){
            characterObject.shoot(this.direction,camera);
            this.fire = false;
        }
    }
}

export { InputHandler };