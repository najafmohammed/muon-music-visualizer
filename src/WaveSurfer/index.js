import CursorPlugin from "wavesurfer.js/src/plugin/cursor/index.js";

export const waveSurferParams = {
  container: "#waveform",
  waveColor: "#03202b",
  progressColor: "#007dae",
  cursorColor: "#020f14",
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  cursorWidth: 1,
  height: 55,
  barGap: 3,
  hideScrollbar: true,
  barMinHeight: 1,
  normalize: true,
  backend: "MediaElementWebAudio",
  plugins: [
    CursorPlugin.create({
      showTime: true,
      opacity: 1,
      customShowTimeStyle: {
        "background-color": "#000",
        color: "#fff",
        padding: "5px",
        "font-size": "12px",
        "border-radius": "10px",
        "transition-delay": "0s",
      },
    }),
  ],
};
