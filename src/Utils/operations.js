const clamp = (input, min, max) => {
  return input < min ? min : input > max ? max : input;
};

const map = (current, in_min, in_max, out_min, out_max) => {
  const mapped =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
};
const fractionate = (val, minVal, maxVal) => {
  return (val - minVal) / (maxVal - minVal);
};

const getRandomRange = (min, max) => {
  return Math.random() * (max - min) + min;
};
const modulate = (val, minVal, maxVal, outMin, outMax) => {
  const fr = fractionate(val, minVal, maxVal);
  const delta = outMax - outMin;
  return outMin + fr * delta;
};

const avg = (arr) => {
  const total = arr.reduce(function (sum, b) {
    return sum + b;
  });
  return total / arr.length;
};

const max = (arr) => {
  return arr.reduce((a, b) => {
    return Math.max(a, b);
  });
};
const distanceFromOrigin = (x, y) => Math.sqrt(x * x + y * y);
const angleFromOrigin = (x, y) => {
  const rad = Math.atan2(y, x);
  const deg = (rad * 180) / Math.PI;
  return rad;
};
function calcAngleRadian(x, y) {
  return Math.atan2(y, x);
}

const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  time = time - hours * 3600;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };
  const _hours = ` ${str_pad_left(hours, "0", 2)}:`;
  // const milliseconds = `:${(time % 1).toFixed(2).substring(2)}`;
  let finalTime = `${str_pad_left(minutes, "0", 2)}:${str_pad_left(
    seconds,
    "0",
    2
  )}`;
  hours > 0 && (finalTime = _hours + finalTime);
  return finalTime;
};
const roundTo3 = (n) => {
  if (n > 0) return Math.ceil(n / 3.0) * 3;
  else if (n < 0) return Math.floor(n / 3.0) * 3;
  else return 3;
};

export const Operations = {
  map,
  getRandomRange,
  modulate,
  avg,
  max,
  distanceFromOrigin,
  angleFromOrigin,
  formatTime,
  roundTo3,
};
