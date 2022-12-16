import { Operations } from "../Utils/operations";
import { globalParams } from "..";
import { CoreControls } from ".";
import { GUIControls } from "../GUI";

import gsap from "gsap";
//TODO update distortion visualization
// add all these updates and then commit with msg of updated the visualization params
// begin the shader optimisations
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
  let radiusMultiplierIsChanged = false;
  if (prevParams.radiusMultiplier !== params.radiusMultiplier) {
    radiusMultiplierIsChanged = true;
    prevParams.radiusMultiplier = params.radiusMultiplier;
  }
  const positions = particles.geometry.attributes.position.array;
  const positions2 = particles2.geometry.attributes.position.array;
  const scales = particles.geometry.attributes.scale.array;
  const scales2 = particles2.geometry.attributes.scale.array;
  const radiuses = particles2.geometry.attributes.radii.array;
  const angleFromOrigin = particles.geometry.attributes.angleFromOrigin.array;
  const distanceFromOrigin =
    particles.geometry.attributes.distanceFromOrigin.array;
  let i = 0,
    j = 0,
    point = 0;
  let freqData = [];
  dataArray.forEach((data) => data > 0.1 && freqData.push(data));
  const distortion = true;

  for (let ix = 0; ix < Operations.roundTo3(params.maxPoints); ix++) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const angle = angleFromOrigin[ix];
    const distFromOrigin = distanceFromOrigin[ix];

    if (radiusMultiplierIsChanged) {
      const radii = radiuses[ix];
      positions[i] = positions2[i] =
        Math.sin(ix * params.radiusMultiplier) * radii;
      positions[i + 1] = positions2[i + 1] =
        Math.cos(ix * params.radiusMultiplier) * radii;

      // new spiral
      // positions[i] = positions2[i] += distFromOrigin * Math.sin(angle);
      // positions[i + 1] = positions2[i + 1] += distFromOrigin * angle;
    }

    positions[i] === 0 && (scales[j] = scales2[j] = 0);
    if (wavesurfer.isPlaying()) {
      point = Math.floor(
        Operations.map(j, 0, params.maxPoints, 0, freqData.length)
      );
      const beatScaler =
        exponentialTrebleScaler * 3.14 + exponentialBassScaler * 6 + 0.3;
      // EXPLOSION
      /* 
      const aperture = beatScaler;
      positions[i] = positions2[i] =
      positions[i] / Math.sin(ix + aperture * 1.4);
      positions[i + 1] = positions2[i + 1] =
      positions[i + 1] / Math.sin(ix + aperture * 1.4);
      */
      const positionSinefactor =
        6 *
        Math.cos(distFromOrigin * 0.85 - beatScaler * 3 - sineCounter * 1.414);
      const radiateSineWave =
        positionSinefactor > 0 ? positionSinefactor : positionSinefactor * 2.7;

      freqData[point]
        ? (positions[i + 2] = positions2[i + 2] =
            freqData[point] * 0.05 + radiateSineWave)
        : (positions[i + 2] = positions2[i + 2] = positionSinefactor + 0.05);
      scales[j] = scales2[j] = positions2[i + 2] * 0.141;
      //special viz 2
      // positions[i + 2] = positions2[i + 2] += Math.abs(1 - distFromOrigin) * 10;
      // particles.rotation.z = particles2.rotation.z -= 0.000001;
      // scales[j] = scales2[j] += distFromOrigin * 0.1;
    } else {
      positions[i + 2] = positions2[i + 2] =
        3.14 *
        Math.sin(
          distFromOrigin -
            sineCounter -
            (distortion && Math.sin(y) * Math.cos(x))
        );
      scales[j] = scales2[j] = positions[i + 2] * Math.abs(angle);
      if (scales[j] > 2.5) {
        scales[j] = scales2[j] = 2.5;
      }
    }

    if (positions[i + 2] < 1) {
      scales[j] = scales2[j] = 0.141;
    }

    i += 3;
    j++;
  }

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
    gsap.to(params, {
      duration: params.updateLockInterval,
      ease: "power4.out",
      radiusMultiplier: params.visualizationPreset
        ? CoreControls.visualizationPresets[globalParams.visualserPresetCounter]
        : params.radiusMultiplier,
    });
    if (params.visualizationPreset) {
      globalParams.visualserPresetCounter++;
      globalParams.visualserPresetCounter =
        globalParams.visualserPresetCounter %
        CoreControls.visualizationPresets.length;
    }
  }
};
