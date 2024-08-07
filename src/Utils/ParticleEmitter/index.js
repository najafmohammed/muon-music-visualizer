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
        ? beatScalerFactor * 0.2
        : beatScalerFactor;
  } else {
    beatScaler = 0.2;
  }
  deltaBeatScaler = (beatScaler - deltaBeatScaler) % 0.1;
  // var velocityMultiplier = 0.1;

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
    const breakpoint = particle.lifespan / params.lifespan;
    const freqDataNormalized = freqDataArray[i] / 255;

    particle.size =
      particle.size *
        ((particle.lifespan * beatScaler) /
          (particle.lifespan * beatScaler + 1)) +
      0.01;

    let angle =
      Math.PI *
      params.divisions *
      (i % 2 == 0 ? i / maxEmittedParticles : 1 - i / maxEmittedParticles);

    var velocityMultiplier =
      0.1 +
      beatScaler *
        5 *
        abs(sin(angle * beatScaler) * cos(angle * beatScaler)) *
        freqDataNormalized *
        0.7;

    radius = 5 + beatScaler * 15;
    if (breakpoint > 0.5) {
      angle += 0.1;
      radius += 0.1;
    }
    if (i % 2 == 0) {
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

      curlVelocity.set(
        curl.x *
          params.noiseForce *
          sin(angle * distanceFromOrigin) *
          velocityMultiplier *
          1.7,
        curl.y *
          params.noiseForce *
          cos(angle * distanceFromOrigin) *
          velocityMultiplier *
          1.7,
        0
      );

      curlVelocity.x && curlVelocity.y && particle.position.add(curlVelocity);
    }
    particle.alpha = abs(sin(breakpoint));
    alpha[i] = Math.min(particle.alpha, 1);

    const _radius =
      freqDataNormalized * 0.03 +
      breakpoint * 0.04 +
      sin(beatScaler * 5 + deltaBeatScaler) * deltaBeatScaler +
      deltaBeatScaler * 4 +
      // freqDataNormalized * 0.04 +
      0.01;

    let _uAngle = angle;

    particle.velocity.set(
      sin(_uAngle) * _radius * velocityMultiplier,
      cos(_uAngle) * _radius * velocityMultiplier,
      freqDataNormalized * 0.7 * velocityMultiplier
    );
    particle.position.add(particle.velocity);

    // Update attributes arrays
    particle.position.toArray(positionsArray, i * 3);
    sizesArray[i] = particle.size;
    if (params.enableMonoColor) {
      const c = params.monoColor;
      if (i > maxEmittedParticles * 0.77) {
        color.setHSL((c.h + 30) / 360, c.s, c.v);
      } else if (i > maxEmittedParticles * 0.33) {
        color.setHSL(c.h / 360, c.s, c.v);
      } else {
        color.setHSL((c.h - 30) / 360, c.s, c.v);
      }
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
      const amplitude = 0.05;
      const frequency = 16;
      particle.position.set(
        (sin(angle) + amplitude * sin(time + angle * frequency)) * radius,
        (cos(angle) + amplitude * cos(time + angle * frequency)) * radius,
        sin(beatScaler * i) + 5
      );
      particle.size = freqDataNormalized * 2 + 20 + (beatScaler <= 0.1 ? 2 : 0);
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
