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
    prevParams.dreamCatcher !== params.dreamCatcher ||
    prevParams.aperture !== params.aperture ||
    prevParams.contracted !== params.contracted
  ) {
    const prevScales = particles.geometry.attributes.scale.array;
    particles.geometry.dispose();
    particles.geometry = generateParticlesSpiral(
      params.maxPoints,
      params.colorSpectrum,
      params.aperture,
      params.dreamCatcher,
      params.radiusMultiplier,
      params.contracted,
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
        params.dreamCatcher,
        params.radiusMultiplier,
        params.contracted,
        prevScales,
        isPlaying
      );
      particles2.rotation.z = rotation;
    }

    prevParams.maxPoints = params.maxPoints;
    prevParams.colorSpectrum = params.colorSpectrum;
    prevParams.sreamCatcher = params.dreamCatcher;
    prevParams.aperture = params.aperture;
    prevParams.contracted = params.contracted;
  }
};
