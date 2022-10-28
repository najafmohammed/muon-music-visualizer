import { blink } from "./utils";
import { toggleParams } from "./params";

const setToggle = (element, state, img1, img2) => {
  element.src = img1;
  element.setAttribute("data-state", state);
  element.addEventListener("click", (e) => {
    blink(element);
    state = !state;
    element.setAttribute("data-state", state);
    element.src = state ? img1 : img2;
  });
};

toggleParams.forEach((icons) => {
  setToggle(
    document.getElementById(icons.element),
    icons.state,
    icons.img1,
    icons.img2
  );
});
