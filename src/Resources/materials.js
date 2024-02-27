import * as THREE from "three";
import {
  ParticleScaleFragmentshader,
  ParticleScaleVertexshader,
} from "../Shaders";
import circle5 from "../../static/textures/circle_05.png";

export default {
  particleMaterial: new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      pointTexture: {
        value: new THREE.TextureLoader().load(circle5),
      },
    },
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: THREE.VertexColors,
    vertexShader: ParticleScaleVertexshader,
    fragmentShader: ParticleScaleFragmentshader,
  }),
};
