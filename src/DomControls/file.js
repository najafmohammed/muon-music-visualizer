export const updateFileData = (files) => {
  const fileName = document.getElementById("file-name");
  const fileType = document.getElementById("file-type");
  const fileSize = document.getElementById("file-size");

  if (files[0]) {
    const fileExt = files[0].name.split(".").pop();
    fileName.innerHTML = files[0].name.replace(`.${fileExt}`, "");
    fileSize.innerHTML = `${(files[0].size / (1024 * 1024)).toFixed(2)} mb`;
    fileType.innerHTML = fileExt;
  }
};
