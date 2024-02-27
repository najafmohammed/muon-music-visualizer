import * as THREE from "three";
import { Operations } from "../Utils/operations";
export const AMOUNTX = 60,
  AMOUNTY = 60;
const roundTo3 = (n) => {
  if (n > 0) return Math.ceil(n / 3.0) * 3;
  else if (n < 0) return Math.floor(n / 3.0) * 3;
  else return 3;
};
//TODO smooth radiusMultipler
export const generateParticlesSpiral = (
  points,
  colorSpectrum,
  aperture = 1,
  dreamCatcher,
  radiusMultipler = 1,
  contracted = false,
  prevScales,
  isPlaying
) => {
  points = roundTo3(points);

  const positions = new Float32Array(points * 3);
  const scales = new Float32Array(points);
  const colors = [];
  const color = new THREE.Color();
  const angleFromOrigin = new Float32Array(points);

  // 360 full circle will be drawn clockwise
  let radius = 3;
  for (let j = 0, k = 0, pt = 0; j < (points / 360) * 3; j++) {
    dreamCatcher && (radius += 1);
    for (let i = 0; i <= 360 / 3; i++) {
      dreamCatcher && (radius += 0.015);

      !dreamCatcher && !contracted && (radius += 0.007);
      !dreamCatcher && (radius += Math.sin(k + aperture * 1.4));
      if (j % 3 === 0) radius += 0.012;
      const nxtRing = j * 360;
      positions[pt + nxtRing] =
        Math.sin(pt * radiusMultipler + nxtRing) * radius * 1.4;
      positions[pt + nxtRing + 1] =
        Math.cos(pt * radiusMultipler + nxtRing) * radius * 1.4;
      positions[pt + nxtRing + 2] = 1;
      scales[pt + nxtRing] = 1;

      positions[pt + nxtRing + 2] = 1;
      color.setHSL(
        Math.abs(0.01 + 0.1 * (k / points) * colorSpectrum),
        0.5,
        0.5
      );
      color.toArray(colors, k * 3);
      pt += 3;
      k++;
    }
  }
  for (let ix = 0; ix < points; ix += 3) {
    angleFromOrigin[ix] = Operations.angleFromOrigin(
      positions[ix],
      positions[ix + 1]
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "customColor",
    new THREE.Float32BufferAttribute(colors, 3)
  );
  geometry.setAttribute(
    "angleFromOrigin",
    new THREE.BufferAttribute(angleFromOrigin, 1)
  );
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute(
    "scale",
    new THREE.BufferAttribute(isPlaying ? prevScales : scales, 1)
  );
  return geometry;
};
export const generateParticles = (seperation) => {
  const numParticles = AMOUNTX * AMOUNTY;

  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);
  const colors = [];
  const color = new THREE.Color();
  let i = 0,
    j = 0;

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      positions[i] = ix * seperation - (AMOUNTX * seperation) / 2;
      positions[i + 1] = iy * seperation - (AMOUNTY * seperation) / 2;
      positions[i + 2] = 0;
      scales[j] = 1;
      color.setHSL(0.01 + 0.1 * iy * ix, 0.5, 0.5);
      color.toArray(colors, j * 3);
      i += 3;
      j++;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "customColor",
    new THREE.Float32BufferAttribute(colors, 3)
  );
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
  return geometry;
};

export default {
  coreGeometry: new THREE.TorusGeometry(18, 1, 20, 100),
  // coreGeometry: new THREE.SphereGeometry(15, 32, 16),
  generateParticlesSpiral: generateParticlesSpiral(),
  generateParticles: generateParticles(),
};
