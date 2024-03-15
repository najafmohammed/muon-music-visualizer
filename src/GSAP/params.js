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
    duration: 1.0,
    maxPoints: 1440,
    delay: 0.5,
  },
  cameraIntroMaxPoints2: {
    duration: 0.5,
    maxPoints: 2880,
    delay: 1.5,
  },
  cameraIntroMaxPoints3: {
    duration: 0.5,
    maxPoints: 3960,
    delay: 2.0,
  },
  cameraIntroColorSpectrum: {
    duration: 0.5,
    colorSpectrum: 30,
    delay: 1,
  },
  cameraIntroColorSpectrumCorrection: {
    duration: 3,
    ease: "steps(4)",
    divisions: 2,
    colorSpectrum: 18,
    delay: 1.5,
  },

  cameraIntroRadiusSpacing1: {
    duration: 1.3,
    spacing: 1.5,
  },

  cameraIntroRadiusSpacing2: {
    delay: 1.3,
    duration: 1.0,
    spacing: 1.0,
  },

  paramsResetValues: [
    { param: "colorSpectrum", value: 18 },
    { param: "maxPoints", value: 3960 },
    { param: "apertureParticle", value: 3 },
    { param: "particleMirror", value: true },
    { param: "radiusMultiplier", value: 0.66 },
    { param: "updateLockInterval", value: 0.12 },
    { param: "deltaResponseLimit", value: 0.005 },
  ],
};
