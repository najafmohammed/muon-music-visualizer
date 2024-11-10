let currentScale = 2;
let lockScale = false;

// Setter for lockScale
export function invertLockScale(value) {
  lockScale = !lockScale;
}
let maxSize;

const videoContainer = document.getElementById("album-art-container");
const zoomControl = document.getElementById("zoom-control");
const videoControl = document.getElementById("video-controls");
const lock = document.getElementById("lock");

const wheelHandler = (event) => {
  if (!lockScale) {
    const delta = event.deltaY * -0.005;
    currentScale = Math.min(Math.max(1, currentScale), 3.3);
    maxSize = currentScale >= 3.5;
    currentScale += delta;
    videoContainer.style.scale = currentScale;
    zoomControl.innerHTML = `${currentScale.toFixed(1)}x`;
  }
};
const mouseLeaveHandler = (event) => {
  if (!lockScale) {
    videoContainer.style.scale = 1;
    videoControl.style.opacity = 0;
    videoContainer.style.opacity = 0.5;
    videoControl.classList.remove("reset");
  }
};
const mouseEnterHandler = (event) => {
  videoContainer.style.scale = currentScale > 1 && currentScale;
  videoContainer.style.opacity = 1;
  videoControl.style.opacity = 1;
  videoControl.classList.add("reset");
};
const dblClickHandler = (event) => {
  lock.click();
  lockScale && (videoContainer.style.opacity = 1);
};
const removeListners = () => {
  videoContainer.removeEventListener("wheel", wheelHandler);
  videoContainer.removeEventListener("mouseleave", mouseLeaveHandler);
  videoContainer.removeEventListener("mouseenter", mouseEnterHandler);
  videoContainer.removeEventListener("dblclick", dblClickHandler);
};
const videoScaler = () => {
  videoContainer.addEventListener("wheel", wheelHandler, { passive: true });
  videoContainer.addEventListener("mouseleave", mouseLeaveHandler, {
    passive: true,
  });
  videoContainer.addEventListener("mouseenter", mouseEnterHandler, {
    passive: true,
  });
  videoContainer.addEventListener("dblclick", dblClickHandler, {
    passive: true,
  });
};

export const initVideo = (files, video, ambient) => {
  if (files[0]) {
    const albumArt = document.getElementById("album-art-image");
    const fileExt = files[0].name.split(".").pop();
    video.src = "";
    ambient.src = "";
    if (fileExt === "mp3" || fileExt === "flac") {
      albumArt.style.display = "block";
    } else {
      albumArt.style.display = "none";
      const source = URL.createObjectURL(files[0]);
      [video, ambient].forEach((vid) => {
        vid.src = source;
        vid.play();
        vid.muted = true;
      });
    }
    removeListners();
    videoScaler();
  }
};
