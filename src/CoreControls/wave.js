import { Operations } from "../Utils/operations";
import { globalParams } from "..";
import { CoreControls } from ".";
import { GUIControls } from "../GUI";

import gsap from "gsap";

export const sineWavePropagation = (
  wavesurfer,
  particles,
  particles2,
  sineCounter,
  dataArray,
  params,
  exponentialBassScaler,
  exponentialTrebleScaler,
  coreScaler
) => {
  const positions = particles.geometry.attributes.position.array;
  const positions2 = particles2.geometry.attributes.position.array;
  const scales = particles.geometry.attributes.scale.array;
  const scales2 = particles2.geometry.attributes.scale.array;
  const angleFromOrigin = particles.geometry.attributes.angleFromOrigin.array;

  let i = 0,
    j = 0,
    point = 0;
  let freqData = [];
  dataArray.forEach((data) => data > 0.1 && freqData.push(data));
  if (!wavesurfer.isPlaying()) {
    particles.rotation.z -= 0.0017;
    particles2.rotation.z += 0.0017;
  }
  for (let ix = 0; ix < params.maxPoints; ix++) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const angle = angleFromOrigin[ix];
    const distFromOrigin = Operations.distanceFromOrigin(x, y);

    if (wavesurfer.isPlaying()) {
      point = Math.floor(
        Operations.map(j, 0, params.maxPoints, 0, freqData.length)
      );
      const beatScaler =
        exponentialTrebleScaler * 3.14 + exponentialBassScaler * 6 + 0.3;
      scales[j] = scales2[j] += scales[j] * beatScaler;
      const positionSinefactor =
        6 *
          Math.cos(
            distFromOrigin * 0.7 -
              beatScaler * 2 -
              sineCounter * 1.414 -
              Math.cos(y) * Math.sin(x)
          ) -
        beatScaler * coreScaler * 0.45;
      const radiateSineWave =
        positionSinefactor > 0 ? positionSinefactor : positionSinefactor * 2.7;

      freqData[point]
        ? (positions[i + 2] = positions2[i + 2] =
            freqData[point] * 0.05 + radiateSineWave + 0.1)
        : (positions[i + 2] = positions2[i + 2] = positionSinefactor + 0.05);

      if (positions[i + 2] < 1) {
        scales[j] = scales2[j] = 1;
      }
    } else {
      scales[j] = scales2[j] = 1.2;
      positions[i + 2] = positions2[i + 2] =
        3 * Math.sin(distFromOrigin - sineCounter) + 0.1;
    }
    if (scales[j] > 2.5 && params.contracted) {
      scales[j] = scales2[j] = 2.5;
    }
    if (!params.contracted) {
      scales[j] = scales2[j] = scales[j] * 1.2;
    }

    if (scales[j] > 3 && !params.contracted) {
      scales[j] = scales2[j] = 3;
    }

    positions[i] === 0 && (scales[j] = scales2[j] = 0);

    i += 3;
    j++;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;
  particles.geometry.attributes.customColor.needsUpdate = true;
  particles2.geometry.attributes.customColor.needsUpdate = true;
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
      params.radiusMultipler += _delta;
      params.radiusMultipler > -0.01 &&
        params.radiusMultipler < 0.01 &&
        (params.radiusMultipler = 0.011);
      params.radiusMultipler > 1 && (params.radiusMultipler = -1);
    }
    gsap.to(params, {
      duration: params.updateLockInterval,
      ease: "power4.out",
      radiusMultipler: params.visualizationPreset
        ? CoreControls.visualizationPresets[globalParams.visualserPresetCounter]
        : params.radiusMultipler,
    });
    if (params.visualizationPreset) {
      globalParams.visualserPresetCounter++;
      globalParams.visualserPresetCounter =
        globalParams.visualserPresetCounter %
        CoreControls.visualizationPresets.length;
    }
  }
};
