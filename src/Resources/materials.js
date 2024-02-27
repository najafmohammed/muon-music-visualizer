import * as THREE from "three";
import {
  ParticleScaleFragmentshader,
  ParticleScaleVertexshader,
} from "../Shaders";
import circle5 from "../../static/textures/circle_05.png";

export default {
  coreMaterial: new THREE.MeshBasicMaterial({
    color: 0x007dae,
    side: THREE.DoubleSide,
    wireframe: true,
  }),
  // particleMaterial: new THREE.ShaderMaterial({
  //   uniforms: {
  //     color: { value: new THREE.Color(0xffffff) },
  //   },
  //   blending: THREE.AdditiveBlending,
  //   depthTest: false,
  //   transparent: true,
  //   // blending: THREE.NoBlending,
  //   vertexColors: THREE.VertexColors,
  //   vertexShader: ParticleScaleVertexshader,
  //   fragmentShader: ParticleScaleFragmentshader,
  // }),
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
    // blending: THREE.NoBlending,
    vertexColors: THREE.VertexColors,
    vertexShader: ParticleScaleVertexshader,
    fragmentShader: ParticleScaleFragmentshader,
  }),
};
