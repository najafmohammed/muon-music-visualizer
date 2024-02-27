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
    prevParams.prevMaxPoints !== params.maxPoints ||
    prevParams.prevColorSpectrum !== params.colorSpectrum ||
    prevParams.prevDreamCatcher !== params.dreamCatcher ||
    prevParams.prevAperture !== params.aperture ||
    prevParams.prevContracted !== params.contracted
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

    prevParams.prevMaxPoints = params.maxPoints;
    prevParams.prevColorSpectrum = params.colorSpectrum;
    prevParams.prevDreamCatcher = params.dreamCatcher;
    prevParams.prevAperture = params.aperture;
    prevParams.prevContracted = params.contracted;
  }
};
