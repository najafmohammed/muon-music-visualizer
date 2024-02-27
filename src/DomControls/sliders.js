import { Equalizer } from "./equalizer";
import volumeIcon from "../../static/images/volume.png";
import mute from "../../static/images/mute.png";
export let SliderVariables = {
  eqBarCount: 32,
};
const eqSlider = () => {
  const eqBarsSlider = document.getElementById("eqBarsSlider");
  const eqBarsSliderText = document.getElementById("eqBarsSliderText");
  eqBarsSliderText.innerHTML = eqBarsSlider.value;
  eqBarsSlider.oninput = (event) => {
    const value = event.target.value;
    eqBarsSliderText.innerHTML = value;
    SliderVariables.eqBarCount = value;
    document.getElementById("equalizer").innerHTML = null;
    Equalizer.initEqualizer(SliderVariables.eqBarCount);
  };
};

const volumeSlider = (wavesurfer) => {
  const volume = document.getElementById("volume");
  const volumeText = document.getElementById("volumeText");
  const volumeButton = document.getElementById("volumeIcon");

  volume.oninput = (event) => {
    const value = event.target.value;
    volumeText.innerHTML = value;
    wavesurfer.setVolume(value * 0.01);
    if (value < 1) {
      volumeButton.src = mute;
    } else {
      volumeButton.src = volumeIcon;
    }
  };
};

export const sliders = (wavesurfer) => {
  eqSlider();
  volumeSlider(wavesurfer);
};
