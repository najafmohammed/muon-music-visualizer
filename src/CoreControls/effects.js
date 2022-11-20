export const coreBaseScaler = (distortionFr, bassFr) => {
  const distance = 1;
  const amp = 4;
  return distance + bassFr * distortionFr * amp;
};
export const hueControl = (scaler) => {
  const time = Date.now() * 0.00015;
  const hue = ((360 * (1.0 + !scaler && time + scaler * 4)) % 360) / 360;
  return hue % 1;
};
