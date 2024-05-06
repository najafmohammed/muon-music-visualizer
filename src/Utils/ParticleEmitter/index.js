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
const maxEmittedParticles = 256 * 3;

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
let deltaBeatScaler = 0;
// Update particle attributes
let radius = 0;
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
  const u_freqData = freqData(
    dataArray,
    maxEmittedParticles,
    isPlaying,
    params.divisions
  );

  const beatScalerFactor =
    exponentialTrebleScaler * 1.14 + exponentialBassScaler * 3.24;
  let beatScaler = 0;
  if (isPlaying) {
    beatScaler =
      beatScalerFactor < 0.1
        ? 0.045
        : beatScalerFactor > 0.1 && beatScalerFactor < 0.4
        ? beatScalerFactor * 0.5
        : beatScalerFactor > 0.4
        ? beatScalerFactor * 0.3
        : beatScalerFactor;
  } else {
    beatScaler = 0.2;
  }
  deltaBeatScaler = (beatScaler - deltaBeatScaler) % 0.1;
  var velocityMultiplier = 1.0;

  particles.forEach((particle, i) => {
    const [x, y, z] = [
      positionsArray[i],
      positionsArray[i + 1],
      positionsArray[i + 2],
    ];
    freqDataArray[i] = u_freqData[i] < 0.1 ? 0.1 : u_freqData[i];

    const distanceFromOrigin = Operations.distanceFromOrigin(x, y) * 0.7;

    // Update particle properties
    particle.lifespan--;

    particle.alpha = Math.max(particle.lifespan * 0.1, 0);

    particle.size =
      particle.size *
        ((particle.lifespan * beatScaler) /
          (particle.lifespan * beatScaler + 1)) +
      0.05;

    const angle =
      Math.PI *
      params.divisions *
      (i % 2 == 0 ? i / maxEmittedParticles : 1 - i / maxEmittedParticles);

    const freqDataNormalized = freqDataArray[i] / 255;
    radius = beatScaler * 15 + 5;
    if (i % 8 == 0) radius += 2 + 2 * beatScaler;
    if (i % 2 == 0) {
      radius += 4 + 4 * beatScaler;
    }
    if (i % 4 == 0) {
      const noiseForceScaler = isPlaying
        ? beatScaler > 0.1
          ? beatScaler
          : 0
        : 0;

      params.noiseForce = Operations.map(
        noiseForceScaler + deltaBeatScaler,
        0,
        1,
        0,
        0.9
      );
      const curl = getCurl(
        x * params.noiseScale,
        y * params.noiseScale,
        time * params.timeMult
      );
      curlVelocity = new THREE.Vector3(
        curl.x *
          params.noiseForce *
          Math.sin(angle * distanceFromOrigin) *
          velocityMultiplier,
        curl.y *
          params.noiseForce *
          Math.cos(angle * distanceFromOrigin) *
          velocityMultiplier,
        0
      );

      curlVelocity.x && curlVelocity.y && particle.position.add(curlVelocity);
    }
    const breakpoint = particle.lifespan / params.lifespan;
    particle.alpha = Math.abs(Math.sin(breakpoint * 2));
    alpha[i] = Math.min(particle.alpha, 1);

    const _radius =
      (freqDataNormalized * 0.01 + breakpoint * 0.04) * 0.03 +
      Math.sin(beatScaler * 5 + deltaBeatScaler) * deltaBeatScaler +
      0.02 +
      deltaBeatScaler * 0.5;

    let _uAngle = angle;

    particle.velocity.set(
      Math.sin(_uAngle) * _radius * velocityMultiplier,
      Math.cos(_uAngle) * _radius * velocityMultiplier,
      Math.sin(beatScaler * 0.7) + freqDataNormalized * 0.2 * velocityMultiplier
    );
    particle.position.add(particle.velocity);

    // Update attributes arrays
    particle.position.toArray(positionsArray, i * 3);
    sizesArray[i] = particle.size;
    if (params.enableMonoColor) {
      const c = params.monoColor;
      color.setHSL(c.h / 360, c.s, c.v);
    } else {
      color.setHSL(
        isPlaying && freqDataNormalized
          ? freqDataNormalized
          : i / maxEmittedParticles,
        0.7,
        0.5
      );
    }
    color.toArray(colorsArray, i * 3);

    // Recycle particles whose lifespan has ended

    if (particle.lifespan <= 0) {
      particle.position.set(
        Math.sin(angle) * radius,
        Math.cos(angle) * radius,
        Math.sin(beatScaler * i)
        // 0
      ); // Reset Position
      particle.size = freqDataNormalized * 0.2 + 5 + (beatScaler < 0.1 ? 3 : 0);

      particle.lifespan = params.lifespan;
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
