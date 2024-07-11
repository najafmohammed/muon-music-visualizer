import * as THREE from "three";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
const params = {
  bloomStrength: 0.5,
  bloomThreshold: 0.35,
  bloomRadius: 0.66,
};

export const BloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  params.bloomStrength,
  params.bloomRadius,
  params.bloomThreshold
);

export const AfterImage = new AfterimagePass();
AfterImage.uniforms["damp"].value = 0.83;
