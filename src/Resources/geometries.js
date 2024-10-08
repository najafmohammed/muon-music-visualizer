import * as THREE from "three";
import { Operations } from "../Utils/operations";

export const generateParticlesSpiral = (
  points = 720,
  colorSpectrum,
  aperture = 1,
  radiusMultiplier = 1,
  prevScales,
  isPlaying,
  spacing = 1
) => {
  points = Operations.roundTo3(points);
  const positions = new Float32Array(points * 3);
  const scales = new Float32Array(points);
  const index = new Float32Array(points);
  const colors = new Float32Array(points * 3);
  const radii = new Float32Array(points);
  const color = new THREE.Color();
  const angleFromOrigin = new Float32Array(points);
  const distFromOrigin = new Float32Array(points * 3);
  let radius = 3.14;

  for (let ix = 0, pt = 0; ix < points; ix++, pt += 3) {
    radius += Math.sin(ix + aperture);
    if (ix % 3 === 0) {
      radius += 0.01;
    }
    positions[pt] = Math.sin(ix * radiusMultiplier) * radius * spacing;
    positions[pt + 1] = Math.cos(ix * radiusMultiplier) * radius * spacing;
    positions[pt + 2] = 1;

    radii[ix] = radius;
    scales[ix] = 1;
    index[ix] = ix;

    const { x, y } = { x: positions[pt], y: positions[pt + 1] };
    angleFromOrigin[ix] = Operations.angleFromOrigin(x, y);
    distFromOrigin[ix] = Operations.distanceFromOrigin(x, y);
    // color.setHSL(Math.atan2(x, y), 0.5, 0.5);
    color.setHSL(Math.abs(0.1 * (ix / points) * colorSpectrum), 0.5, 0.5);

    color.toArray(colors, ix * 3);
    if (ix > 1440) radius -= 0.0015;
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
  geometry.setAttribute("index", new THREE.BufferAttribute(index, 1));
  geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
  return geometry;
};

export default {
  generateParticlesSpiral: generateParticlesSpiral(),
};
