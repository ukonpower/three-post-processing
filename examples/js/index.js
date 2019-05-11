import * as THREE from 'three';
window.THREE = THREE;

import TPP from '../../src';

class APP {
  constructor() {
    this.canvas = document.querySelector('#canvas');

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.5, 3);
    this.camera.lookAt(0, 0, 0);

    var boxGeo = new THREE.BoxGeometry(1, 1, 1);
    var boxMat = new THREE.MeshNormalMaterial();
    this.box = new THREE.Mesh(boxGeo, boxMat);
    this.scene.add(this.box);

    this.light = new THREE.DirectionalLight();
    this.light.position.y = 10;
    this.scene.add(this.light);

    this.uniforms = {
      time:{
        value: 0
      }
    }

    let pp1 = {
      fragmentShader: require('./post-processing1.glsl'),
      uniforms:this.uniforms
    };

    let pp2 = {
      fragmentShader: require('./post-processing2.glsl'),
      uniforms:this.uniforms,
    }

    this.pp_params = [pp1,pp2];
    
    this.tpp = new TPP(this.renderer,this.pp_params);

    this.animate();
  }

  animate() {
    this.box.rotateY(0.01);

    //update post-processing-uniforms
    this.uniforms.time.value += 0.01;
    
    //render scene with post-processing
    this.tpp.render(this.scene,this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }

}

window.addEventListener('load', () => {
  let app = new APP();
})