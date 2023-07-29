export const gsapControlParams = {
  cameraResetPosition: {
    duration: 1,
    x: 0,
    y: 0,
    z: 100,
  },
  cameraResetRotation: {
    duration: 1,
    x: 0,
    y: 0,
    z: 0,
  },
  cameraPosition1Pos: {
    duration: 1,
    x: 0,
    y: -100,
    z: 17,
  },
  cameraPostion1Rot: {
    duration: 1,
    x: 1.4024061696473666,
    y: 0,
    z: 0,
  },
  cameraIntroScale: {
    duration: 1,
    x: 1,
    y: 1,
    z: 1,
    delay: 0.5,
  },
  cameraIntroRotation: {
    duration: 1.5,
    x: 0,
    y: 0,
    z: 0,
    delay: 0.5,
  },
  cameraIntroPosition: {
    duration: 1,
    x: 0,
    y: 0,
    z: 100,
  },
  cameraIntroMaxPoints: {
    duration: 2.8,
    maxPoints: 720 * 7,
    delay: 1.0,
  },
  cameraIntroColorSpectrum: {
    duration: 1.0,
    colorSpectrum: 30,
    delay: 2.2,
  },
  cameraIntroColorSpectrumCorrection: {
    duration: 2.5,
    colorSpectrum: 18,
    delay: 3.0,
  },

  cameraIntroRadiusSpacing1: {
    delay: 1.0,
    duration: 1.3,
    spacing: 3.0,
  },

  cameraIntroRadiusSpacing2: {
    delay: 2.3,
    duration: 0.2,
    spacing: 1.0,
  },
  cameraIntroRadiusMultiplier3: {
    delay: 2.0,
    duration: 0.2,
    radiusMultiplier: 0.66,
  },

  paramsResetValues: [
    { param: "colorSpectrum", value: 18 },
    { param: "maxPoints", value: 5040 },
    { param: "apertureParticle", value: 3 },
    { param: "particleMirror", value: true },
    { param: "radiusMultiplier", value: 0.66 },
    { param: "updateLockInterval", value: 0.12 },
    { param: "deltaResponseLimit", value: 0.005 },
    { param: "spiralMultiplier", value: 0.005 },
  ],
};
