const initEqualizer = (eqBarCount) => {
  const equalizer = document.getElementById("equalizer");
  for (let i = 0; i < eqBarCount; i++) {
    const equalizerElement = document.createElement("div");
    equalizerElement.style.backgroundColor = `hsl(${
      (360 / eqBarCount) * i
    },50%,50%)`;
    equalizerElement.style.marginBottom = `${
      Math.sin((360 / eqBarCount) * i - 1) * 10
    }px`;
    equalizerElement.setAttribute("id", `bar${i}`);
    equalizerElement.setAttribute("class", `bar`);
    equalizer.appendChild(equalizerElement);
  }
};

const updateEqualizer = (dataArray, statsVisibility, isPlaying, eqBarCount) => {
  if (statsVisibility && isPlaying) {
    for (let tempValue = 0, i = 1; i <= eqBarCount; i++) {
      const _tempArray = dataArray.slice(
        (i - 1) * (dataArray.length / eqBarCount) - i,
        i * (dataArray.length / eqBarCount) + i
      );
      tempValue = _tempArray.reduce((a, b) => a + b, 0) / 50;
      tempValue > 110 && (tempValue = 110);
      const bar = document.getElementById(`bar${i - 1}`);
      bar.style.height = `${tempValue}px`;
      bar.style.width = `${tempValue / 15}px`;
      bar.style.backgroundColor = `hsl(${tempValue * 3},50%,50%)`;
      tempValue = 0;
    }
  }
};
const eqAlignment = () =>
  ["top", "center", "bottom"].forEach((alignment) => {
    document
      .getElementById(`equalizer-${alignment}-align`)
      .addEventListener("click", () => {
        document.getElementById("equalizer").style.alignItems =
          alignment === "top"
            ? "flex-start"
            : alignment === "center"
            ? "center"
            : "flex-end";
      });
  });

export const Equalizer = {
  updateEqualizer,
  initEqualizer,
  eqAlignment,
};
