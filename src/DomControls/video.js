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
  }
};
