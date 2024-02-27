import * as THREE from "three";
import { Operations } from "../Utils/operations";
import { globalParams } from "..";
import { CoreControls } from ".";
import { GUIControls } from "../GUI";
import point from "../../static/textures/point.png";
import { getCurl } from "../Utils/curl";
import gsap from "gsap";
// begin the shader optimizations
export const Unifoms = {
  color: { value: new THREE.Color(0xffffff) },
  pointTexture: {
    value: new THREE.TextureLoader().load(point),
  },
  time: {
    value: 1.0,
  },
  resolution: {
    value: new THREE.Vector2(),
  },
  isPlaying: {
    value: false,
  },
  dStrength: {
    value: 0.5,
  },
  beatScaler: {
    value: 1,
  },
  maxPoints: {
    value: 720,
  },
  radiusMultiplier: {
    value: 1,
  },
  spacing: {
    value: 1,
  },
  redrawGeom: {
    value: false,
  },
};
export const sineWavePropagation = (
  wavesurfer,
  particles,
  particles2,
  sineCounter,
  dataArray,
  params,
  exponentialBassScaler,
  exponentialTrebleScaler,
  prevParams
) => {
  let redrawGeom = false;

  const beatScaler =
    exponentialTrebleScaler * 3.14 + exponentialBassScaler * 6 + 0.7;

  let freqData = [];
  dataArray.forEach((data) => data > 0.1 && freqData.push(data));

  Unifoms.time.value = sineCounter;
  Unifoms.isPlaying.value = wavesurfer.isPlaying();
  Unifoms.dStrength.value = params.distortionStrength;
  Unifoms.beatScaler.value = beatScaler;
  Unifoms.maxPoints.value = params.maxPoints;
  Unifoms.radiusMultiplier.value = params.radiusMultiplier;
  Unifoms.spacing.value = params.spacing;

  if (
    prevParams.radiusMultiplier !== params.radiusMultiplier ||
    prevParams.spacing !== params.spacing
  ) {
    redrawGeom = true;
    prevParams.radiusMultiplier = params.radiusMultiplier;
    prevParams.spacing = params.spacing;
    Unifoms.redrawGeom.value = redrawGeom;
  }
  const u_freqData = new Float32Array(params.maxPoints);
  let point = 0;
  if (wavesurfer.isPlaying()) {
    for (let ix = 0; ix < Operations.roundTo3(params.maxPoints); ix++) {
      point = Math.floor(
        Operations.map(ix, 0, params.maxPoints, 0, freqData.length)
      );
      u_freqData[ix] = freqData[point];
    }
  }
  particles.geometry.setAttribute(
    "u_freqData",
    new THREE.BufferAttribute(u_freqData, 1)
  );
  particles2.geometry.setAttribute(
    "u_freqData",
    new THREE.BufferAttribute(u_freqData, 1)
  );

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;
  particles2.geometry.attributes.position.needsUpdate = true;
  particles2.geometry.attributes.scale.needsUpdate = true;
};
export const wavePresetController = (params, _delta) => {
  let data = sessionStorage.getItem("initUpdateLockInterval");
  let updateLockTimeout = setTimeout(() => {
    globalParams.updateLock = !globalParams.updateLock;
  }, params.updateLockInterval * 100);

  data === "false" &&
    GUIControls.controlFolder
      .add(params, "updateLockInterval")
      .min(0.01)
      .max(0.3)
      .step(0.01)
      .listen()
      .onFinishChange(() => {
        clearTimeout(updateLockTimeout);
        globalParams.updateLock && updateLockTimeout;
      });
  if (data === "false")
    sessionStorage.setItem("initUpdateLockInterval", "true");

  if (
    Math.abs(_delta) > params.deltaResponseLimit &&
    !globalParams.updateLock &&
    params.dynamicRadius
  ) {
    globalParams.updateLock = true;
    if (!params.visualizationPreset) {
      params.radiusMultiplier += _delta;
      params.radiusMultiplier = (params.radiusMultiplier % 1) + 0.001;
    }
    if (params.fieldDistortion) {
      if (
        params.visualizationPreset > CoreControls.newSpiral.length ||
        params.visualizationPreset > CoreControls.fieldDistortion.length
      )
        visualizationPreset = 0;
    }
    const fieldDistortionActive = params.fieldDistortion > 3;
    const newSpiral =
      CoreControls.newSpiral[globalParams.visualserPresetCounter];
    const fieldDistortion =
      CoreControls.fieldDistortion[globalParams.visualserPresetCounter];
    const vizPreset =
      CoreControls.visualizationPresets[globalParams.visualserPresetCounter];
    gsap.to(params, {
      duration: params.updateLockInterval,
      ease: "power4.out",
      radiusMultiplier: params.visualizationPreset
        ? fieldDistortionActive
          ? fieldDistortion
          : vizPreset
        : params.radiusMultiplier,
    });
    if (params.visualizationPreset) {
      globalParams.visualserPresetCounter++;

      globalParams.visualserPresetCounter =
        globalParams.visualserPresetCounter %
        (fieldDistortionActive
          ? CoreControls.fieldDistortion.length
          : CoreControls.visualizationPresets.length);
    }
  }
};
