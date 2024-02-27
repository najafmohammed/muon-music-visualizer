export const blink = (element) => {
  element.style.opacity = "0";
  setTimeout(() => {
    element.style.opacity = "1";
  }, 200);
};
