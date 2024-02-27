import { Noise } from "./noise.js";
// from Keith Peters' Blog
// https://www.bit-101.com/blog/2021/07/curl-noise/
export function getCurl(x, y, z) {
  const delta = 0.01;
  let n1 = Noise.simplex(x + delta, y, z);
  let n2 = Noise.simplex(x - delta, y, z);
  const cy = -(n1 - n2) / (delta * 2);

  n1 = Noise.simplex(x, y + delta, z);
  n2 = Noise.simplex(x, y - delta, z);
  const cx = (n1 - n2) / (delta * 2);

  return { x: cx, y: cy };
}
