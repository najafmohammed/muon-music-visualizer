import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CoreControls } from "../CoreControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import materials from "./materials";
import { generateParticlesSpiral } from "./geometries";

// optimise code to use shaders more, time factor integraded into it.
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
export const Objects = {
  initParticles: (maxPoints) => {
    return new THREE.Points(
      generateParticlesSpiral(maxPoints),
      materials.particleMaterial
    );
  },
  initCamera: () => {
    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);
    return camera;
  },
  initOrbitControls: (camera, canvas) => {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
  },
  initRenderer: (canvas) => {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      powerPreference: "high-performance",
      antialias: false,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return renderer;
  },

  initComposer: (renderer, scene, camera) => {
    const bloomPass = CoreControls.BloomPass;
    const composer = new EffectComposer(renderer);
    const renderScene = new RenderPass(scene, camera);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    return composer;
  },
  initResize: (camera, renderer, composer) => {
    window.addEventListener("resize", () => {
      // // Update sizes
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      composer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  },
};
