let currentScale = 2;
let lockScale = false;
let maxSize = false;

const videoContainer = document.getElementById("album-art-container");

const wheelHandler = (event) => {
  event.preventDefault();
  if (!lockScale) {
    const delta = event.deltaY * -0.005;
    currentScale = Math.min(Math.max(1, currentScale), 3.3);
    maxSize = currentScale >= 3.5;
    currentScale += delta;
    videoContainer.style.scale = currentScale;
  }
};
const mouseLeaveHandler = (event) => {
  event.preventDefault();
  if (!lockScale) {
    videoContainer.style.scale = 1;

    videoContainer.style.opacity = 0.5;
  }
};
const mouseEnterHandler = (event) => {
  event.preventDefault();
  videoContainer.style.scale = currentScale > 1 && currentScale;
  videoContainer.style.opacity = 1;
};
const dblClickHandler = (event) => {
  event.preventDefault();
  lockScale = !lockScale;

  lockScale && (videoContainer.style.opacity = 1);
};
const removeListners = () => {
  videoContainer.removeEventListener("wheel", wheelHandler);
  videoContainer.removeEventListener("mouseleave", mouseLeaveHandler);
  videoContainer.removeEventListener("mouseenter", mouseEnterHandler);
  videoContainer.removeEventListener("dblclick", dblClickHandler);
};
const videoScaler = () => {
  videoContainer.addEventListener("wheel", wheelHandler);
  videoContainer.addEventListener("mouseleave", mouseLeaveHandler);
  videoContainer.addEventListener("mouseenter", mouseEnterHandler);
  videoContainer.addEventListener("dblclick", dblClickHandler);
};

export const initVideo = (files, video, ambient, bgVideo) => {
  const albumArt = document.getElementById("album-art-image");
  const fileExt = files[0].name.split(".").pop();
  video.src = "";
  ambient.src = "";
  bgVideo.src = "";
  if (fileExt === "mp3" || fileExt === "flac") {
    albumArt.style.display = "block";
  } else {
    albumArt.style.display = "none";
    const source = URL.createObjectURL(files[0]);
    [video, ambient, bgVideo].forEach((vid) => {
      vid.src = source;
      vid.play();
      vid.muted = true;
    });

    removeListners();
    videoScaler();
  }
};
