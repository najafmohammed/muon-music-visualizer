import * as THREE from "three";
import glsl from "glslify";
import fragmentShader from "../../Shaders/particleEmitterFragmentShader.glsl";
import vertexShader from "../../Shaders/particleEmitterVertexShader.glsl";
import { Operations } from "../operations";
import { freqData } from "../../CoreControls/wave";
import { getCurl } from "../curl";

class Particle {
  constructor(index) {
    this.velocity = new THREE.Vector3(1, 1, 1);
    this.position = new THREE.Vector3(Math.sin(index), Math.cos(index), 0);
    this.lifespan = 1;
    this.color = new THREE.Color();
    this.size = 1;
    this.freqDataValue = [];
    this.alpha = 0.1;
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
const maxEmittedParticles = 256;
var batchSize = 3;
var curlVelocity = new THREE.Vector3();

const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(maxEmittedParticles * 3); // x, y, z
const colors = new Float32Array(maxEmittedParticles * 3); // r, g, b
const alphas = new Float32Array(maxEmittedParticles); // Particle alpha channel
const sizes = new Float32Array(maxEmittedParticles); // Particle sizes
const freqDataValue = new Float32Array(maxEmittedParticles); // Particle freq

// Emit new particle
export const emitParticle = (
  exponentialBassScaler,
  exponentialTrebleScaler,
  time,
  dataArray,
  isPlaying,
  params
) => {
  if (particles.length < maxEmittedParticles) {
    const particle = new Particle();
    particles.push(particle);
    updateParticleAttributes(
      exponentialBassScaler,
      exponentialTrebleScaler,
      time,
      dataArray,
      isPlaying,
      params
    );
  }
};
// Update particle attributes
export const updateParticleAttributes = (
  exponentialBassScaler,
  exponentialTrebleScaler,
  time,
  dataArray,
  isPlaying,
  params
) => {
  const positionsArray = particleGeometry.attributes.position.array;
  const alpha = particleGeometry.attributes.alpha.array;
  const colorsArray = particleGeometry.attributes.colors.array;
  const sizesArray = particleGeometry.attributes.size.array;
  const freqDataArray = particleGeometry.attributes.freqDataValue.array;
  const color = new THREE.Color();
  const u_freqData = freqData(dataArray, maxEmittedParticles, isPlaying);

  const beatScalerFactor =
    exponentialTrebleScaler * 1.14 + exponentialBassScaler * 3.24;

  const beatScaler =
    beatScalerFactor < 0.1
      ? 0.1
      : beatScalerFactor > 0.5
      ? beatScalerFactor * 0.4
      : beatScalerFactor;

  const rotation = beatScaler * 0.01;
  emittedParticleSystem.rotation.z -= rotation > 0.01 ? 0.01 : rotation;

  particles.forEach((particle, i) => {
    const [x, y, z] = [
      positionsArray[i],
      positionsArray[i + 1],
      positionsArray[i + 2],
    ];
    freqDataArray[i] = u_freqData[i] < 0.1 ? 0.1 : u_freqData[i];

    const distanceFromOrigin = Operations.distanceFromOrigin(x, y);
    const dto = distanceFromOrigin ? distanceFromOrigin : 1.0;

    let radius =
      (isPlaying ? (beatScalerFactor > 0.5 ? 15 : 10) : 8) - beatScaler * 10;
    // Update particle properties
    particle.lifespan--;
    particle.alpha = 1.0;

    if (particle.lifespan <= 10) {
      particle.alpha = Math.max(particle.lifespan * 0.1, 0);
    } else {
      particle.alpha = 1.0;
    }
    alpha[i] = Math.min(particle.alpha, 1);

    particle.size =
      particle.size *
        ((particle.lifespan * beatScaler) /
          (particle.lifespan * beatScaler + 1)) +
      0.2;
    const idleCoeff = isPlaying ? 1 : 3000.0;
    const intensity = 2.2 - dto * 0.07;
    const split = i % params.divisions;
    const angle =
      Math.PI * 2 * (i / maxEmittedParticles + (1 / params.divisions) * split);

    if (batchSize < 0) {
      const curl = getCurl(
        x * params.noiseScale,
        y * params.noiseScale,
        time * params.timeMult
      );
      curlVelocity = new THREE.Vector3(
        curl.x * params.noiseForce * Math.sin(angle),
        curl.y * params.noiseForce * Math.cos(angle),
        0
      );
      batchSize = params.batchDivision;
    } else {
      batchSize--;
    }
    if (particle.lifespan < params.lifespan * 0.8) {
      curlVelocity.x && curlVelocity.y && particle.position.add(curlVelocity);
    }
    const spiral = 1.4;
    const _radius =
      // (freqDataArray[i] / 256) * idleCoeff *
      Math.sin(intensity) * beatScaler;

    particle.velocity.set(
      Math.sin(angle + spiral) * _radius,
      Math.cos(angle + spiral) * _radius,
      Math.sin(beatScaler * 0.7) * 1.17
    );
    particle.position.add(particle.velocity);

    // Update attributes arrays
    particle.position.toArray(positionsArray, i * 3);
    sizesArray[i] = particle.size;
    if (params.enableMonoColor) {
      const c = params.monoColor;
      color.setHSL(c.h / 360, c.s, c.v);
      // console.log(params.monoColor.h);
    } else {
      color.setHSL(isPlaying ? freqDataArray[i] / 255 : 1 / split, 0.7, 0.5);
    }
    color.toArray(colorsArray, i * 3);

    // Recycle particles whose lifespan has ended

    if (particle.lifespan <= 0) {
      particle.position.set(
        Math.sin(angle) * radius,
        Math.cos(angle) * radius,
        Math.sin(radius) + 1
      ); // Reset Position
      particle.size = Math.random() * 10;
      particle.lifespan = Math.abs(
        Math.random() * (isPlaying ? params.lifespan : params.lifespan * 2) +
          40 -
          (isPlaying ? beatScaler * 5.0 : 0)
      ); // Random lifespan
      particle.alpha = 1;
    }
  });

  // Update attributes in the bufferGeometry
  particleGeometry.attributes.position.needsUpdate = true;
  particleGeometry.attributes.alpha.needsUpdate = true;
  particleGeometry.attributes.colors.needsUpdate = true;
  particleGeometry.attributes.size.needsUpdate = true;
};
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particleGeometry.setAttribute("colors", new THREE.BufferAttribute(colors, 3));
particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
particleGeometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
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
