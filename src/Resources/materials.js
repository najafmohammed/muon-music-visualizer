import * as THREE from "three";
import glsl from "glslify";
import particleVertexShader from "../Shaders/particleVertexShader.glsl";
import particleFragmentShader from "../Shaders/particleFragmentShader.glsl";
import { Uniforms } from "../CoreControls/wave";

export default {
  particleMaterial: new THREE.ShaderMaterial({
    uniforms: Uniforms,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: THREE.VertexColors,
    vertexShader: glsl(particleVertexShader),
    fragmentShader: glsl(particleFragmentShader),
  }),
};
