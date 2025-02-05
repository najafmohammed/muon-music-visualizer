import { toggleFullScreen } from "../Utils/fullScreen";
import volumeIcon from "../../static/images/volume.png";
import mute from "../../static/images/mute.png";
import { GUIControls } from "../GUI";
import { invertLockScale } from "../DomControls/video";

let isPaused = true,
  immersiveVisibility = true,
  isNotMuted;
export let buttonVariables = {
  statsVisibility: false,
};

const playAudioButton = document.getElementById("play-audio");
const toggleFullscreenButton = document.getElementById("toggle-fullscreen");
const statisticsButton = document.getElementById("stats");
const volumeButton = document.getElementById("volumeIcon");
const lockButton = document.getElementById("lock");

export const volumeButtonControl = (wavesurfer) => {
  volumeButton.src = volumeIcon;
  const volumeText = document.getElementById("volumeText");
  const volume = document.getElementById("volume");

  let _tempValue = 0;
  volumeButton.addEventListener(
    "click",
    () => {
      isNotMuted = !isNotMuted;
      isNotMuted && (_tempValue = volumeText.innerHTML);
      volumeButton.src = !isNotMuted ? volumeIcon : mute;
      const newValue = !isNotMuted ? _tempValue : 0;
      volumeText.innerHTML = newValue;
      volume.value = newValue;

      wavesurfer.toggleMute();
    },
    { passive: true }
  );
};

export const playAudioButtonControl = (wavesurfer, video, ambient) =>
  playAudioButton.addEventListener(
    "click",
    () => {
      isPaused = !isPaused;
      isPaused ? wavesurfer.play() : wavesurfer.pause();
      isPaused ? video.play() : video.pause();
      isPaused ? ambient.play() : ambient.pause();
    },
    { passive: true }
  );

const toggleFullscreenButtonConttrol = () =>
  toggleFullscreenButton.addEventListener(
    "click",
    () => {
      toggleFullScreen();
      immersiveVisibility ? GUIControls.gui.close() : GUIControls.gui.open();
      immersiveVisibility && (immersiveVisibility = !immersiveVisibility);
    },
    { passive: true }
  );

const lockButtonControl = () =>
  lockButton.addEventListener(
    "click",
    () => {
      invertLockScale();
    },
    { passive: true }
  );

const statisticsButtonControl = () =>
  statisticsButton.addEventListener(
    "click",
    () => {
      buttonVariables.statsVisibility = !buttonVariables.statsVisibility;
      buttonVariables.statsVisibility
        ? (document.getElementById("stats-display").style.visibility =
            "visible")
        : (document.getElementById("stats-display").style.visibility =
            "hidden");
      buttonVariables.statsVisibility
        ? (document.getElementById("stats-display").style.opacity = "1")
        : (document.getElementById("stats-display").style.opacity = "0");
      buttonVariables.statsVisibility
        ? (document.getElementById("credits").style.visibility = "hidden")
        : (document.getElementById("credits").style.visibility = "visible");
      buttonVariables.statsVisibility
        ? (document.getElementById("credits").style.opacity = "0")
        : (document.getElementById("credits").style.opacity = "1");
    },
    { passive: true }
  );

export const initButtonControls = (wavesurfer, video, ambient) => {
  playAudioButtonControl(wavesurfer, video, ambient);
  volumeButtonControl(wavesurfer);
  toggleFullscreenButtonConttrol();
  statisticsButtonControl();
  lockButtonControl();
};
