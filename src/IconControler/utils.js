export const blink = (element) => {
  element.style.opacity = "0";
  setTimeout(() => {
    element.style.opacity = "1";
  }, 200);
};

export const hillDistribution = (ip) => {
  ip.sort();
  ip.reverse();
  const len = ip.length;
  const op = [];
  let pointer = Math.floor(len / 2) - (len % 2 == 0 ? 1 : 0);
  op[pointer] = ip[0];
  for (let i = 1; i < len; i++) {
    pointer += i % 2 == 0 ? -i : i;
    op[pointer] = ip[i];
  }
  return op;
};
