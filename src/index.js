import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import WaveSurfer from "wavesurfer.js";
import { waveSurferParams } from "./WaveSurfer";
import { DomControls } from "./DomControls";
import "./IconControler";
import { Operations } from "./Utils/operations";
import { CoreControls } from "./CoreControls";
import { GUIControls } from "./GUI";
import "./style.css";
import { Objects } from "./Resources/objects";
import { buttonVariables } from "./DomControls/buttons";
import { SliderVariables } from "./DomControls/sliders";
import { gsapControls } from "./GSAP";

//global export
export let globalParams = {
  updateStatsLock: false,
  updateLock: false,
  visualserPresetCounter: 0,
};

//global
let wavesurfer,
  exponentialBassScaler = 0,
  exponentialTrebleScaler = 0,
  camera,
  analyser,
  dataArray = [],
  particles,
  particles2,
  scene,
  prevExponentialBassScalar = 0,
  pauseAnimation = false;
sessionStorage.setItem("initUpdateLockInterval", "false");

const maxExponentialScaler = 0.1;

let params = {
    dreamCatcher: false,
    maxPoints: 0,
    colorSpectrum: 0,
    aperture: 3,
    sineCounterMultiplier: 1,
    idleMultiplier: 0.27,
    particleMirror: true,
    radiusMultiplier: 0.66,
    dynamicRadius: true,
    updateLockInterval: 0.17,
    deltaResponseLimit: 0.005,
    visualizationPreset: true,
    distortionStrength: 0.5,
    spacing: 1,
    fieldDistortion: 1,
    rippleDistanceScaling: 3,
    reset: () => gsapControls.reset(camera, params),
    sideView: () => gsapControls.sideView(camera),
    /* debugging */
    // camValue: () => {
    //   console.log(camera)
    //   console.log(stats)
    //   console.log (params)
    // },
  },
  sineCounter = 0,
  prevParams = {
    maxPoints: 0,
    colorSpectrum: 0,
    aperture: 0,
    radiusMultiplier: 0,
    dreamCatcher: false,
    spacing: 1,
    distortionStrength: 0.5,
    fieldDistortion: 1,
    rippleDistanceScaling: 3,
  };
const vizInit = async () => {
  DomControls.initSearchModal();
  DomControls.Equalizer.initEqualizer(SliderVariables.eqBarCount);
  DomControls.Equalizer.eqAlignment();
  const canvas = document.querySelector("canvas.webgl");
  const file = document.getElementById("thefile");
  wavesurfer = WaveSurfer.create(waveSurferParams);
  const video = document.getElementById("video-frame");
  const ambient = document.getElementById("video-frame-ambient");
  const pauseAnimationButton = document.getElementById("control-animation");
  const currentTime = document.getElementById("current-time");
  const duration = document.getElementById("duration");
  const playButton = document.getElementById("play-audio");
  wavesurfer.on("finish", () => {
    playButton.click();
  });

  DomControls.initSearch();
  DomControls.sliders(wavesurfer);

  const audioAnalyzer = () => {
    analyser = wavesurfer.backend.analyser;
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  };

  const play = () => {
    scene = new THREE.Scene();
    //initialise objects

    GUIControls.initGui(params);
    particles = Objects.initParticles(params.maxPoints);

    scene.add(particles);
    particles2 = Objects.initParticles(params.maxPoints);
    camera = Objects.initCamera();
    Objects.initOrbitControls(camera, canvas);
    const renderer = Objects.initRenderer(canvas);
    const composer = Objects.initComposer(renderer, scene, camera);
    const stats = Stats();
    document.body.appendChild(stats.dom);
    gsapControls.cameraIntro(camera, params);

    Objects.initResize(camera, renderer, composer);

    let clock = new THREE.Clock();

    const render = () => {
      stats.update();

      const timeDelta = clock.getDelta();
      const _delta = exponentialBassScaler - prevExponentialBassScalar;
      prevExponentialBassScalar = exponentialBassScaler;
      const audio = CoreControls.audioProcessing(dataArray);
      const coreScaler = audio.coreScaler;
      exponentialBassScaler = audio.exponentialBassScaler;
      exponentialTrebleScaler = audio.exponentialBassScaler;
      coreScaler > 1
        ? (sineCounter += coreScaler * 0.5 * timeDelta)
        : (sineCounter += params.idleMultiplier * timeDelta * 7);

      wavesurfer.isPlaying &&
        buttonVariables.statsVisibility &&
        !globalParams.updateStatsLock &&
        DomControls.updateStats(
          exponentialBassScaler,
          exponentialTrebleScaler,
          _delta,
          coreScaler
        );
      renderer.render(scene, camera);
      composer.render();

      if (!wavesurfer.isPlaying()) {
        params.radiusMultiplier =
          (params.radiusMultiplier + 0.00012 * timeDelta) % 1;
      } else {
        duration.innerHTML = Operations.formatTime(wavesurfer.getDuration());
        currentTime.innerHTML = Operations.formatTime(
          wavesurfer.getCurrentTime()
        );
        wavesurfer.backend.media.addEventListener("seeking", (event) => {
          video.currentTime = wavesurfer.getCurrentTime();
          ambient.currentTime = wavesurfer.getCurrentTime();
        });
        // particles2.rotation.z = Math.PI / 3;
        // particles2.rotation.y = Math.PI;
      }

      if (params.particleMirror) {
        scene.add(particles2);
      } else {
        scene.remove(particles2);
      }

      CoreControls.redrawGeometry(
        wavesurfer.isPlaying(),
        prevParams,
        params,
        particles,
        particles2
      );

      CoreControls.sineWavePropagation(
        wavesurfer,
        particles,
        particles2,
        sineCounter,
        dataArray,
        params,
        exponentialBassScaler,
        exponentialTrebleScaler,
        prevParams
      );

      sineCounter += Math.abs(_delta * 250) * timeDelta;

      CoreControls.wavePresetController(params, _delta, particles2);

      analyser.getByteFrequencyData(dataArray);

      DomControls.Equalizer.updateEqualizer(
        dataArray,
        buttonVariables.statsVisibility,
        wavesurfer.isPlaying(),
        SliderVariables.eqBarCount
      );

      if (exponentialBassScaler > maxExponentialScaler)
        exponentialBassScaler = maxExponentialScaler;

      const hue = CoreControls.hueControl(_delta * timeDelta);
      particles.material.uniforms.color.value.setHSL(hue, 0.9, 0.7);
      particles2.material.uniforms.color.value.setHSL(hue, 0.9, 0.7);
    };
    const animate = () => {
      if (pauseAnimation) return;
      requestAnimationFrame(animate);
      render();
    };
    pauseAnimationButton.addEventListener("click", () => {
      pauseAnimation = !pauseAnimation;
      if (!pauseAnimation) animate();
    });

    DomControls.initButtonControls(wavesurfer, video, ambient);
    animate();

    wavesurfer.play();
  };
  audioAnalyzer();
  play();

  file.onchange = function () {
    playButton.style.visibility = "visible";
    params.reset();
    !buttonVariables.statsVisibility &&
      document.getElementById("stats").click();
    const files = this.files;
    DomControls.updateFileData(files);
    DomControls.initVideo(files, video, ambient);
    wavesurfer.load(URL.createObjectURL(files[0]));
    wavesurfer.on("ready", () => {
      wavesurfer.play();
      playButton.dataset.state === "false" && playButton.click();
      audioAnalyzer();
    });
    if (wavesurfer.isPlaying()) {
    }
  };
};
window.onload = vizInit();
