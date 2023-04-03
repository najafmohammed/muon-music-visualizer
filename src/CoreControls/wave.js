import * as THREE from "three";
import { Operations } from "../Utils/operations";
import { globalParams } from "..";
import { CoreControls } from ".";
import { GUIControls } from "../GUI";
import point from "../../static/textures/point.png";
import { getCurl } from "../Utils/curl";
import gsap from "gsap";
// begin the shader optimizations
export const Uniforms = {
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
  fieldDistortion: {
    value: 1,
  },
  delta: {
    value: 0,
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

  Uniforms.time.value = sineCounter;
  Uniforms.isPlaying.value = wavesurfer.isPlaying();
  Uniforms.dStrength.value = params.distortionStrength;
  Uniforms.beatScaler.value = beatScaler;
  Uniforms.maxPoints.value = params.maxPoints;
  Uniforms.radiusMultiplier.value = params.radiusMultiplier;
  Uniforms.spacing.value = params.spacing;
  Uniforms.fieldDistortion.value = params.fieldDistortion;

  if (
    prevParams.radiusMultiplier !== params.radiusMultiplier ||
    prevParams.spacing !== params.spacing
  ) {
    redrawGeom = true;
    prevParams.radiusMultiplier = params.radiusMultiplier;
    prevParams.spacing = params.spacing;
    Uniforms.redrawGeom.value = redrawGeom;
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
export const wavePresetController = (params, _delta, particles) => {
  Uniforms.delta.value = _delta;
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
    const rotation =
      Math.PI / ((globalParams.visualserPresetCounter + 1.1) % 3);
    particles.rotation.z = rotation;
    console.log(rotation);

    globalParams.updateLock = true;
    if (!params.visualizationPreset) {
      params.radiusMultiplier += _delta;
      params.radiusMultiplier = (params.radiusMultiplier % 1) + 0.001;
    }
    if (params.fieldDistortion) {
      if (params.visualizationPreset > CoreControls.fieldDistortion.length)
        visualizationPreset = 0;
    }
    const fieldDistortionActive = params.fieldDistortion > 3;
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
