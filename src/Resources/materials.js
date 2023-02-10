import * as THREE from "three";
import {
  ParticleScaleFragmentshader,
  ParticleScaleVertexshader,
} from "../Shaders";
import { Unifoms } from "../CoreControls/wave";
export default {
  particleMaterial: new THREE.ShaderMaterial({
    uniforms: Unifoms,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: THREE.VertexColors,
    vertexShader: ParticleScaleVertexshader,
    fragmentShader: ParticleScaleFragmentshader,
  }),
};
