import { generateParticlesSpiral } from "../Resources/geometries";
export const redrawGeometry = (
  isPlaying,
  prevParams,
  params,
  particles,
  particles2
) => {
  const rotation = -Math.PI / 2;
  if (
    prevParams.maxPoints !== params.maxPoints ||
    prevParams.colorSpectrum !== params.colorSpectrum ||
    prevParams.aperture !== params.aperture ||
    prevParams.spacing !== params.spacing
  ) {
    const prevScales = particles.geometry.attributes.scale.array;
    particles.geometry.dispose();
    particles.geometry = generateParticlesSpiral(
      params.maxPoints,
      params.colorSpectrum,
      params.aperture,
      params.radiusMultiplier,
      prevScales,
      isPlaying
    );
    particles.rotation.z = rotation;
    if (params.particleMirror) {
      particles2.geometry.dispose();
      particles2.geometry = generateParticlesSpiral(
        params.maxPoints,
        params.colorSpectrum,
        params.aperture,
        params.radiusMultiplier,
        prevScales,
        isPlaying
      );
      particles2.rotation.z = rotation;
    }

    prevParams.maxPoints = params.maxPoints;
    prevParams.colorSpectrum = params.colorSpectrum;
    prevParams.aperture = params.aperture;
    prevParams.spacing = params.spacing;
  }
};
