import { GUI } from "dat.gui";

const gui = new GUI(),
  controlFolder = gui.addFolder("Controls"),
  particleControlsFolder = gui.addFolder("Particle Controls"),
  audioControlsFolder = gui.addFolder("Audio Controls"),
  emissionControlsFolder = gui.addFolder("Emission Controls"),
  noiseControlsFolder = gui.addFolder("Noise Controls"),
  controlsGUI = {
    guiControls: ["reset"],
    particlesParams: ["particleMirror"],
    controls: ["dynamicRadius", "visualizationPreset"],
    emission: ["enableMonoColor"],
    customParams: [
      {
        name: "spacing",
        min: 0,
        max: 1,
        step: 0.01,
        folder: particleControlsFolder,
      },
      {
        name: "maxPoints",
        min: 0,
        max: 720 * 17,
        step: 360,
        folder: particleControlsFolder,
      },
      {
        name: "colorSpectrum",
        min: 3,
        max: 30,
        step: 3,
        folder: particleControlsFolder,
      },
      {
        name: "aperture",
        min: 0,
        max: Math.PI,
        step: 0.01,
        folder: particleControlsFolder,
      },

      {
        name: "idleMultiplier",
        min: 0,
        max: 2,
        step: 0.01,
        folder: controlFolder,
      },
      {
        name: "deltaResponseLimit",
        min: 0.001,
        max: 0.01,
        step: 0.001,
        folder: audioControlsFolder,
      },
      {
        name: "radiusMultiplier",
        min: 0.01,
        max: 1,
        step: 0.0001,
        folder: gui,
      },
      {
        name: "divisions",
        min: 1,
        max: 15,
        step: 1,
        folder: emissionControlsFolder,
      },
      {
        name: "lifespan",
        min: 10,
        max: 250,
        step: 1,
        folder: emissionControlsFolder,
      },
      {
        name: "noiseScale",
        min: 0,
        max: 1,
        step: 0.0001,
        folder: noiseControlsFolder,
      },
      {
        name: "noiseForce",
        min: 0,
        max: 1,
        step: 0.0001,
        folder: noiseControlsFolder,
      },
    ],
  },
  initGui = (params) => {
    controlsGUI.customParams.forEach((control) =>
      control.folder
        .add(params, control.name)
        .min(control.min)
        .max(control.max)
        .step(control.step)
        .listen()
    );

    controlsGUI.particlesParams.forEach((control) =>
      particleControlsFolder.add(params, control)
    );
    controlsGUI.controls.forEach((control) =>
      controlFolder.add(params, control)
    );
    controlsGUI.emission.forEach((control) =>
      emissionControlsFolder.add(params, control)
    );

    controlsGUI.guiControls.forEach((control) => gui.add(params, control));
    gui.add(params, "sideView").name("side view");
    emissionControlsFolder.addColor(params, "monoColor");
  };

export const GUIControls = {
  gui,
  controlFolder,
  particleControlsFolder,
  initGui,
};
