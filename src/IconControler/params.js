import pause from "../../static/images/pause.png";
import play from "../../static/images/play.png";
import expand from "../../static/images/expand.png";
import collapse from "../../static/images/collapse.png";
import lock from "../../static/images/lock.png";
import unlock from "../../static/images/unlock.png";
import stats from "../../static/images/stats.png";
import creativeCommons from "../../static/images/creativeCommons.png";

let state = {
  animationPlaying: true,
  enablefullscreen: true,
  audioPaused: true,
  statsClose: true,
  notMuted: true,
  unlock: true,
};

export const toggleParams = [
  {
    element: "toggle-fullscreen",
    state: state.enablefullscreen,
    img1: expand,
    // img2: collapse, should use collapse but icon can be mislabelled on closing the file dialog
    img2: expand,
  },
  {
    element: "control-animation",
    state: state.animationPlaying,
    img1: pause,
    img2: play,
  },
  {
    element: "play-audio",
    state: state.audioPaused,
    img1: pause,
    img2: play,
  },
  {
    element: "stats",
    state: state.statsClose,
    img1: stats,
    img2: creativeCommons,
  },
  { element: "lock", state: state.unlock, img1: unlock, img2: lock },
];
