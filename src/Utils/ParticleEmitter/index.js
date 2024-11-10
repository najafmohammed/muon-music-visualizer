import * as THREE from "three";
import glsl from "glslify";
import fragmentShader from "../../Shaders/particleEmitterFragmentShader.glsl";
import vertexShader from "../../Shaders/particleEmitterVertexShader.glsl";
import { Operations } from "../operations";
import { freqData } from "../../CoreControls/wave";
import { getCurl } from "../curl";

const sin = Math.sin;
const cos = Math.cos;
const abs = Math.abs;
class Particle {
  constructor(index) {
    this.velocity = new THREE.Vector3(1, 1, 1);
    this.position = new THREE.Vector3(sin(index), cos(index), 0);
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
const maxEmittedParticles = 300 * 2;

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
    if (beatScalerFactor < 0.1) {
      beatScaler = 0.045;
    } else if (beatScalerFactor > 0.1 && beatScalerFactor < 0.4) {
      beatScaler = beatScalerFactor * 0.5;
    } else if (beatScalerFactor > 0.4) {
      beatScaler = beatScalerFactor * 0.2;
    } else {
      beatScaler = beatScalerFactor;
    }
  } else {
    beatScaler = 0.2;
  }

  deltaBeatScaler = (beatScaler - deltaBeatScaler) % 0.1;

  particles.forEach((particle, i) => {
    const [x, y, z] = [
      positionsArray[i],
      positionsArray[i + 1],
      positionsArray[i + 2],
    ];
    freqDataArray[i] = u_freqData[i] < 0.1 ? 0.1 : u_freqData[i];

    // Update particle properties
    particle.lifespan--;

    particle.alpha = Math.max(particle.lifespan * 0.1, 0);
    const breakpoint = particle.lifespan / params.lifespan;
    const freqDataNormalized = freqDataArray[i] / 255;

    particle.size = sin(i) * beatScaler * 40;

    let angle = Math.PI * params.divisions * (i / maxEmittedParticles);

    var velocityMultiplier = !isPlaying
      ? 1
      : 0.05 + deltaBeatScaler + beatScaler * 2.7;

    radius = 6 + beatScaler * 10;
    if (breakpoint > 0.5) {
      angle += 0.1;
      radius += 0.1;
    }
    const noiseForceScaler = isPlaying
      ? beatScaler > 0.1
        ? beatScaler
        : 0
      : 0;

    params.noiseForce = Operations.map(
      noiseForceScaler + !isPlaying ? 0.3 : beatScaler * 100 + 2,
      0,
      1,
      0,
      0.07
    );
    const curl = getCurl(
      x * params.noiseScale,
      y * params.noiseScale,
      time * params.timeMult
    );

    curlVelocity.set(curl.x * params.noiseForce, curl.y * params.noiseForce, 0);

    curlVelocity.x && curlVelocity.y && particle.position.add(curlVelocity);
    particle.alpha = abs(sin(breakpoint));
    alpha[i] = Math.min(particle.alpha, 1);

    const _radius =
      breakpoint * 0.04 +
      sin(beatScaler * 5 + deltaBeatScaler) * deltaBeatScaler +
      deltaBeatScaler * 4 +
      0.01;

    let _uAngle = angle;

    particle.velocity.set(
      sin(_uAngle) * _radius * velocityMultiplier,
      cos(_uAngle) * _radius * velocityMultiplier,
      velocityMultiplier * beatScaler + 0.1
    );
    particle.position.add(particle.velocity);

    // Update attributes arrays
    particle.position.toArray(positionsArray, i * 3);
    sizesArray[i] = particle.size;
    const distanceFromOrigin = Operations.distanceFromOrigin(x, y);

    if (params.enableMonoColor) {
      const c = params.monoColor;
      color.setHSL(c.h / 360, c.s, c.v);
    } else {
      color.setHSL(
        Math.abs(0.1 * (i / maxEmittedParticles) * params.colorSpectrum),
        0.5,
        0.5
      );
    }
    color.toArray(colorsArray, i * 3);

    // Recycle particles whose lifespan has ended
    if (particle.lifespan <= 0) {
      const amplitudeFactor = 0.05;
      const frequency = 16;
      const amplitude = amplitudeFactor * sin(time + angle * frequency);
      const dynamicRadius = radius + (freqDataNormalized + 1);
      particle.position.set(
        sin(angle) * dynamicRadius + amplitude,
        cos(angle) * dynamicRadius + amplitude,
        sin(beatScaler * i) - 5.0
      );
      particle.size = 6;
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
