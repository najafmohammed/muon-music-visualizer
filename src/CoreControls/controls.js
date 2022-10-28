import { generateParticlesSpiral } from "../Resources/geometries";
export const redrawGeometry = (
  isPlaying,
  prevParams,
  params,
  particles,
  particles2
) => {
  if (
    prevParams.prevMaxPoints !== params.maxPoints ||
    prevParams.prevColorSpectrum !== params.colorSpectrum ||
    prevParams.prevDreamCatcher !== params.dreamCatcher ||
    prevParams.prevAperture !== params.aperture ||
    prevParams.prevRadiusMultipler !== params.radiusMultipler ||
    prevParams.prevContracted !== params.contracted
  ) {
    const prevScales = isPlaying && particles.geometry.attributes.scale.array;

    particles.geometry.dispose();
    particles.geometry = generateParticlesSpiral(
      params.maxPoints,
      params.colorSpectrum,
      params.aperture,
      params.dreamCatcher,
      params.radiusMultipler,
      params.contracted,
      prevScales,
      isPlaying
    );

    if (params.particleMirror) {
      particles2.geometry.dispose();
      particles2.geometry = generateParticlesSpiral(
        params.maxPoints,
        params.colorSpectrum,
        params.aperture,
        params.dreamCatcher,
        params.radiusMultipler,
        params.contracted,
        prevScales,
        isPlaying
      );
      particles2.rotation.z = Math.PI / 2;
    }

    prevParams.prevMaxPoints = params.maxPoints;
    prevParams.prevColorSpectrum = params.colorSpectrum;
    prevParams.prevDreamCatcher = params.dreamCatcher;
    prevParams.prevAperture = params.aperture;
    prevParams.prevRadiusMultipler = params.radiusMultipler;
    prevParams.prevContracted = params.contracted;
  }
};
