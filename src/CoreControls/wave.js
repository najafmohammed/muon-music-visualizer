import * as THREE from "three";
import { Operations } from "../Utils/operations";
import { globalParams } from "..";
import { CoreControls } from ".";
import { GUIControls } from "../GUI";
import point from "../../static/textures/point.png";
import { getCurl } from "../Utils/curl";
// import lattice from "../../static/textures/lattice.jpg";
import gsap from "gsap";
//TODO update distortion visualization
// add all these updates and then commit with msg of updated the visualization params
// begin the shader optimisations
export const Unifoms = {
  color: { value: new THREE.Color(0xffffff) },
  pointTexture: {
    value: new THREE.TextureLoader().load(point),
  },
  u_time: {
    type: "f",
    value: 1.0,
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
  const distortion = true;
  Unifoms.u_time.value = sineCounter;
  if (
    prevParams.radiusMultiplier !== params.radiusMultiplier ||
    prevParams.spacing !== params.spacing
  ) {
    redrawGeom = true;
    prevParams.radiusMultiplier = params.radiusMultiplier;
    prevParams.spacing = params.spacing;
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
  const beatScaler =
    exponentialTrebleScaler * 3.14 + exponentialBassScaler * 6 + 0.7;

  // if (wavesurfer.isPlaying() && params.fieldDistortion === 1) {
  //   const rotation = beatScaler * 0.001;
  //   particles.rotation.z += rotation;
  //   particles2.rotation.z -= rotation;
  // }

  const sineWaveConstant = beatScaler * 4.14 - sineCounter;
  for (let ix = 0; ix < Operations.roundTo3(params.maxPoints); ix++) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const angle = angleFromOrigin[ix];

    const distFromOrigin = distanceFromOrigin[ix];

    const radii = radiuses[ix];
    if (redrawGeom) {
      positions[i] = positions2[i] =
        Math.sin(ix * params.radiusMultiplier) * radii * params.spacing;
      positions[i + 1] = positions2[i + 1] =
        Math.cos(ix * params.radiusMultiplier) * radii * params.spacing;
      //TODO create a slider to switch between the presets
      // new spiral
      if (params.spiralVisualization) {
        const rand = 0;
        if (rand == 1) {
          positions[i] = positions2[i] += distFromOrigin * Math.cos(angle);
          positions[i + 1] = positions2[i + 1] += angle * Math.sin(angle);
        } else if (rand == 2) {
          positions[i] = positions2[i] += distFromOrigin * angle;
          positions[i + 1] = positions2[i + 1] += angle * angle;
        } else if (rand == 3) {
          positions[i] = positions2[i] += distFromOrigin * Math.cos(angle);
          positions[i + 1] = positions2[i + 1] =
            distFromOrigin * angle * angle * Math.sin(angle) + 10;
        } else {
          positions[i] = positions2[i] += distFromOrigin * Math.sin(angle);
          positions[i + 1] = positions2[i + 1] += distFromOrigin * angle;
        }
      }
    }

    positions[i] === 0 && (scales[j] = scales2[j] = 0);

    if (wavesurfer.isPlaying()) {
      point = Math.floor(
        Operations.map(j, 0, params.maxPoints, 0, freqData.length)
      );

      let positionSinefactor =
        7 *
          Math.cos(
            distFromOrigin * 0.7 +
              sineWaveConstant -
              (distortion &&
                !params.spiralVisualization &&
                Math.sin(y * params.distortionStrength) *
                  Math.cos(x * params.distortionStrength))
          ) -
        distFromOrigin * 0.1;
      freqData[point]
        ? (positions[i + 2] = positions2[i + 2] =
            freqData[point] * 0.047 + positionSinefactor)
        : (positions[i + 2] = positions2[i + 2] = positionSinefactor + 0.05);

      if (!params.spiralVisualization && params.fieldDistortion !== 1) {
        const additiveWaveComponent = (sign) => {
          const prevWave = ix * params.radiusMultiplier;
          const nextWave =
            -sineCounter * 0.1 + beatScaler * 0.1 + distFromOrigin * 0.7;

          return (
            (sign === 0 ? Math.sin(prevWave) : Math.cos(prevWave)) *
            (radii +
              params.fieldDistortion *
                (sign === 0 ? Math.cos(nextWave) : Math.sin(nextWave)) +
              freqData[point] * 0.01) *
            params.spacing
          );
        };

        positions[i] = positions2[i] = additiveWaveComponent(0);

        positions[i + 1] = positions2[i + 1] = additiveWaveComponent(1);
      }

      scales[j] = scales2[j] = positions2[i + 2] * 0.17;

      //special viz 2
      // positions[i + 2] = positions2[i + 2] += Math.abs(1 - distFromOrigin) * 10;
      // particles.rotation.z = particles2.rotation.z -= Math.PI * 0.000002;
      // scales[j] = scales2[j] += distFromOrigin * 0.1;
      // particles.rotation.z -=
      //   (exponentialTrebleScaler + exponentialBassScaler) * 0.0001;
      // particles2.rotation.z -=
      //   (exponentialTrebleScaler + exponentialBassScaler) * 0.0001;
    } else {
      positions[i + 2] = positions2[i + 2] =
        3.14 *
        1.14 *
        Math.sin(
          distFromOrigin -
            sineCounter -
            (distortion &&
              Math.sin(y * params.distortionStrength) *
                Math.cos(x * params.distortionStrength))
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
    if (params.spiralVisualization || params.fieldDistortion) {
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
        ? params.spiralVisualization
          ? newSpiral
          : fieldDistortionActive
          ? fieldDistortion
          : vizPreset
        : params.radiusMultiplier,
    });
    if (params.visualizationPreset) {
      globalParams.visualserPresetCounter++;

      globalParams.visualserPresetCounter =
        globalParams.visualserPresetCounter %
        (params.spiralVisualization
          ? CoreControls.newSpiral.length
          : fieldDistortionActive
          ? CoreControls.fieldDistortion.length
          : CoreControls.visualizationPresets.length);
    }
  }
};
