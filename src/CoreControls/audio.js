import { Operations } from "../Utils/operations";
import { coreBaseScaler } from "./effects";

export const audioProcessing = (dataArray) => {
  const lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1);
  const upperHalfArray = dataArray.slice(
    dataArray.length / 2 - 1,
    dataArray.length - 1
  );

  const overallAvg = Operations.avg(dataArray);
  const lowerMax = Operations.max(lowerHalfArray);
  const lowerAvg = Operations.avg(lowerHalfArray);
  const upperMax = Operations.max(upperHalfArray);
  const upperAvg = Operations.avg(upperHalfArray);

  const lowerMaxFr = lowerMax / lowerHalfArray.length;
  const lowerAvgFr = lowerAvg / lowerHalfArray.length;
  const upperMaxFr = upperMax / upperHalfArray.length;
  const upperAvgFr = upperAvg / upperHalfArray.length;

  const baseFr = Operations.modulate(upperAvgFr, 0, 1, 0, 4) / 50;
  const trebleFr = Operations.modulate(lowerAvgFr, 0, 1, 0, 4) / 200;
  let coreScaler = coreBaseScaler(
    Operations.modulate(upperAvgFr, 0, 1, 0.5, 3.2),
    Math.pow(lowerMaxFr, 0.8)
  );
  coreScaler < 10 && coreScaler * 1.2;
  coreScaler > 12.5 && (coreScaler = 12.5);

  const exponentialBassScaler = 1.001 * (1 + baseFr * 2) - 1.001;
  const exponentialTrebleScaler = 1.001 * (1 + trebleFr * 2) - 1.001;

  return {
    baseFr,
    trebleFr,
    coreScaler,
    exponentialBassScaler,
    exponentialTrebleScaler,
  };
};
