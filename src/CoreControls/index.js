import { BloomPass } from "./postProcessing";
import { sineWavePropagation, wavePresetController } from "./wave";
import { hueControl, coreBaseScaler } from "./effects";
import { visualizationPresets } from "./params";
import { redrawGeometry } from "./controls";
import { audioProcessing } from "./audio";

export const CoreControls = {
  BloomPass,
  hueControl,
  coreBaseScaler,
  sineWavePropagation,
  visualizationPresets,
  redrawGeometry,
  wavePresetController,
  audioProcessing,
};
