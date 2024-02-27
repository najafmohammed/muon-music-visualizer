import gsap from "gsap";
import { gsapControlParams } from "./params";
export const gsapControls = {
  cameraIntro: (camera, params) => {
    camera.scale.set(0, 0, 0);
    camera.rotation.set(0, 0, -6);
    camera.position.set(0, 0, 10);
    params.maxPoints = 360;
    gsap.to(camera.scale, gsapControlParams.cameraIntroScale);
    gsap.to(camera.rotation, gsapControlParams.cameraIntroRotation);
    gsap.to(camera.position, gsapControlParams.cameraIntroPosition);
    gsap.to(params, gsapControlParams.cameraIntroMaxPoints);
    gsap.to(params, gsapControlParams.cameraIntroColorSpectrum);
    gsap.to(params, gsapControlParams.cameraIntroColorSpectrumCorrection);
    gsap.to(params, gsapControlParams.cameraIntroRadiusMultiplier1);
    gsap.to(params, gsapControlParams.cameraIntroRadiusMultiplier2);
    gsap.to(params, gsapControlParams.cameraIntroRadiusSpacing1);
    gsap.to(params, gsapControlParams.cameraIntroRadiusSpacing2);
    gsap.to(params, gsapControlParams.cameraIntroRadiusMultiplier3);
  },
  reset: (camera, params) => {
    gsap.to(camera.position, gsapControlParams.cameraResetPosition);
    gsap.to(camera.rotation, gsapControlParams.cameraResetRotation);
    gsapControlParams.paramsResetValues.forEach((element) => {
      params[element.param] = element.value;
    });
  },
  sideView: (camera) => {
    gsap.to(camera.position, gsapControlParams.cameraPosition1Pos);
    gsap.to(camera.rotation, gsapControlParams.cameraPostion1Rot);
  },
};
