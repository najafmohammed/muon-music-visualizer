import { globalParams } from "..";

export const updateStats = (
  exponentialBassScaler,
  exponentialTrebleScaler,
  _delta,
  coreScaler
) => {
  const elements = ["grid-core", "grid-bass", "grid-treble", "grid-delta"];
  const values = [
    coreScaler,
    exponentialBassScaler,
    exponentialTrebleScaler,
    _delta * 10,
  ];
  elements.forEach(
    (element, index) =>
      (document.getElementById(element).innerHTML = (
        values[index] * (index > 0 ? 100 : 1)
      ).toFixed(4))
  );
  globalParams.updateStatsLock = true;
  globalParams.updateStatsLock &&
    setTimeout(() => {
      globalParams.updateStatsLock = !globalParams.updateStatsLock;
    }, 50);
};
