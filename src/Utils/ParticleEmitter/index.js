import * as THREE from "three";
import glsl from "glslify";
import fragmentShader from "../../Shaders/particleEmitterFragmentShader.glsl";
import vertexShader from "../../Shaders/particleEmitterVertexShader.glsl";
import { Operations } from "../operations";
import { freqData } from "../../CoreControls/wave";

class Particle {
  constructor(index) {
    this.velocity = new THREE.Vector3();
    this.position = new THREE.Vector3(Math.sin(index), Math.cos(index), 0);
    this.lifespan = 1;
    this.color = new THREE.Color();
    this.size = 1;
    this.freqDataValue = [];
  }
}

const texture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/circle.png"
);

const Uniforms = {
  color: { value: new THREE.Color(0xffffff) },
  pointTexture: {
    value: texture,
  },
  lifespan: { value: 1 },
};

const particles = [];
const maxEmittedParticles = 500;

const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(maxEmittedParticles * 3); // x, y, z
const colors = new Float32Array(maxEmittedParticles * 3); // r, g, b
const sizes = new Float32Array(maxEmittedParticles); // Particle sizes
const freqDataValue = new Float32Array(maxEmittedParticles); // Particle freq

// Emit new particle
export const emitParticle = (
  exponentialBassScaler,
  exponentialTrebleScaler,
  time,
  dataArray,
  isPlaying
) => {
  if (particles.length < maxEmittedParticles) {
    const particle = new Particle();
    particles.push(particle);
    updateParticleAttributes(
      exponentialBassScaler,
      exponentialTrebleScaler,
      time,
      dataArray,
      isPlaying
    );
  }
};
// Update particle attributes
export const updateParticleAttributes = (
  exponentialBassScaler,
  exponentialTrebleScaler,
  time,
  dataArray,
  isPlaying
) => {
  const positionsArray = particleGeometry.attributes.position.array;
  const colorsArray = particleGeometry.attributes.colors.array;
  const sizesArray = particleGeometry.attributes.size.array;
  const freqDataArray = particleGeometry.attributes.freqDataValue.array;
  const color = new THREE.Color();

  const u_freqData = freqData(dataArray, maxEmittedParticles, isPlaying);
  const beatScalerFactor =
    exponentialTrebleScaler * 2.14 + exponentialBassScaler * 4.24 + 0.1;
  const beatScaler = beatScalerFactor < 0.1 ? 0.1 : beatScalerFactor;
  const rotation = beatScaler * 0.03;
  emittedParticleSystem.rotation.z -= rotation > 0.007 ? 0.007 : rotation;
  particles.forEach((particle, i) => {
    freqDataArray[i] = u_freqData[i] < 0.1 ? 0.1 : u_freqData[i];

    const distanceFromOrigin = Operations.distanceFromOrigin(
      positionsArray[i],
      positionsArray[i + 1]
    );
    const dto = distanceFromOrigin ? distanceFromOrigin : 1.0;

    const radius = (isPlaying ? 10 : 8) - beatScaler * 10;
    // Update particle properties
    particle.lifespan--;
    particle.size =
      particle.size *
        ((particle.lifespan * beatScaler) /
          (particle.lifespan * beatScaler + 1)) +
      0.2;
    const spiral = dto * 0.1 + dto * 0.01;
    const spiralCoeff = isPlaying ? spiral * 0.05 : spiral;
    const idleCoeff = isPlaying ? 0.75 : 3000.0;

    const divisions = 9;
    const split = i % divisions;
    const angle =
      Math.PI * 2 * (i / maxEmittedParticles + (1 / divisions) * split);
    const _radius = (freqDataArray[i] / 255) * beatScaler * idleCoeff;
    var radialVelocity = new THREE.Vector3(
      Math.sin(angle) * _radius,
      Math.cos(angle) * _radius,
      Math.sin(beatScaler * 0.3) * 2
    );

    particle.position.add(radialVelocity);
    // Update attributes arrays
    particle.position.toArray(positionsArray, i * 3);
    sizesArray[i] = particle.size;
    // color.setHSL(Math.atan2(x, y), 0.5, 0.5);
    color.setHSL(isPlaying ? freqDataArray[i] / 255 : 1 / split, 0.7, 0.5);
    color.toArray(colorsArray, i * 3);

    // Recycle particles whose lifespan has ended
    if (particle.lifespan <= 0) {
      particle.position.set(
        Math.sin(angle) * radius,
        Math.cos(angle) * radius,
        Math.sin(Math.random()) * 10 - 5
      ); // Reset position

      particle.size = Math.random() * 20;
      particle.lifespan =
        Math.random() * 100 + 20 - (isPlaying ? beatScaler * 10.0 : 0); // Random lifespan
    }
  });

  // Update attributes in the bufferGeometry
  particleGeometry.attributes.position.needsUpdate = true;
  particleGeometry.attributes.colors.needsUpdate = true;
  particleGeometry.attributes.size.needsUpdate = true;
};
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particleGeometry.setAttribute("colors", new THREE.BufferAttribute(colors, 3));
particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
particleGeometry.setAttribute(
  "freqDataValue",
  new THREE.BufferAttribute(freqDataValue, 1)
);

const particleMaterial = new THREE.ShaderMaterial({
  uniforms: Uniforms,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,
  vertexColors: true,
  alphaTest: 0.001,
  vertexShader: glsl(vertexShader),
  fragmentShader: glsl(fragmentShader),
});

export const emittedParticleSystem = new THREE.Points(
  particleGeometry,
  particleMaterial
);
