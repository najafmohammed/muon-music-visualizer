import * as THREE from "three";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const params = {
  bloomStrength: 2.5,
  bloomThreshold: 0.02,
  bloomRadius: 0.9,
};

export const BloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  params.bloomStrength,
  params.bloomRadius,
  params.bloomThreshold
);

export const AfterImage = new AfterimagePass();
AfterImage.uniforms["damp"].value = 0.9;
