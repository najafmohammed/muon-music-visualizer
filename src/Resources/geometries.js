import * as THREE from "three";
import { Operations } from "../Utils/operations";
export const AMOUNTX = 60,
  AMOUNTY = 60;

export const generateParticlesSpiral = (
  points,
  colorSpectrum,
  aperture = 1,
  dreamCatcher,
  radiusMultiplier = 1,
  contracted = false,
  prevScales,
  isPlaying
) => {
  points = Operations.roundTo3(points);
  const positions = new Float32Array(points * 3);
  const scales = new Float32Array(points);
  const colors = new Float32Array(points * 3);
  const radii = new Float32Array(points);
  const color = new THREE.Color();
  const angleFromOrigin = new Float32Array(points);
  const distFromOrigin = new Float32Array(points * 3);
  let radius = 3.14;
  for (let ix = 0, pt = 0; ix < points; ix++, pt += 3) {
    dreamCatcher && (radius += 0.015);
    !dreamCatcher && !contracted && (radius += 0.007);
    !dreamCatcher && (radius += Math.sin(ix + aperture * 1.4));
    ix % 3 === 0 && (radius += 0.02);
    positions[pt] = Math.sin(ix * radiusMultiplier) * radius;
    positions[pt + 1] = Math.cos(ix * radiusMultiplier) * radius;
    positions[pt + 2] = 1;
    radii[ix] = radius;
    scales[ix] = 1;

    const { x, y } = { x: positions[pt], y: positions[pt + 1] };
    angleFromOrigin[ix] = Operations.angleFromOrigin(x, y);
    distFromOrigin[ix] = Operations.distanceFromOrigin(x, y);
    color.setHSL(
      Math.abs(0.01 + 0.1 * (ix / points) * colorSpectrum),
      0.5,
      0.5
    );
    color.toArray(colors, ix * 3);
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
  geometry.setAttribute("radii", new THREE.BufferAttribute(radii, 1));
  geometry.setAttribute(
    "distanceFromOrigin",
    new THREE.BufferAttribute(distFromOrigin, 1)
  );
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute(
    "scale",
    new THREE.BufferAttribute(isPlaying ? prevScales : scales, 1)
  );
  return geometry;
};

export default {
  generateParticlesSpiral: generateParticlesSpiral(),
};
