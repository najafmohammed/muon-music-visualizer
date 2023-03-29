let currentScale = 2;
let lockScale = false;
let maxSize = false;

const videoContainer = document.getElementById("album-art-container");

const wheelHandler = (event) => {
  event.preventDefault();
  if (!lockScale) {
    const delta = event.deltaY * -0.01;
    currentScale = Math.min(Math.max(1, currentScale), 3.5);
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
    console.log(lockScale);
  }
};
const mouseEnterHandler = (event) => {
  event.preventDefault();
  videoContainer.style.scale = currentScale > 1 && currentScale;
  videoContainer.style.opacity = 1;
  console.log(lockScale);
};
const dblClickHandler = (event) => {
  event.preventDefault();
  lockScale = !lockScale;
  console.log(lockScale);
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

export const initVideo = (files, video, ambient) => {
  let source = document.createElement("source");
  let ambientSource = document.createElement("source");
  const albumArt = document.getElementById("album-art-image");
  const fileExt = files[0].name.split(".").pop();
  if (fileExt === "mp3" || fileExt === "flac") {
    albumArt.style.display = "block";
    video.src = "";
    ambient.src = "";
  } else {
    albumArt.style.display = "none";
    source.setAttribute("src", URL.createObjectURL(files[0]));
    source.setAttribute("type", "video/mp4");

    ambientSource.setAttribute("src", URL.createObjectURL(files[0]));
    ambientSource.setAttribute("type", "video/mp4");

    video.src = URL.createObjectURL(files[0]);
    video.play();
    video.muted = true;

    ambient.src = URL.createObjectURL(files[0]);
    ambient.play();
    ambient.muted = true;

    removeListners();
    videoScaler();
  }
};
