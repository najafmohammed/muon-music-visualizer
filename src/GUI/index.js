import { GUI } from "dat.gui";

const gui = new GUI(),
  controlFolder = gui.addFolder("Controls"),
  particleControlsFolder = gui.addFolder("Particle Params"),
  audioControlsFolder = gui.addFolder("Audio Controls"),
  controlsGUI = {
    guiControls: ["reset"],
    particlesParams: ["particleMirror"],
    controls: ["dynamicRadius", "dreamCatcher", "visualizationPreset"],
    customParams: [
      {
        name: "spacing",
        min: 0,
        max: 1,
        step: 0.01,
        folder: particleControlsFolder,
      },
      {
        name: "distortionStrength",
        min: 0,
        max: 2,
        step: 0.01,
        folder: particleControlsFolder,
      },
      {
        name: "maxPoints",
        min: 0,
        max: 720 * 7,
        step: 360,
        folder: particleControlsFolder,
      },
      {
        name: "colorSpectrum",
        min: 0,
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

    particleControlsFolder
      .add(params, "fieldDistortion")
      .min(1)
      .max(20)
      .step(0.1)
      .listen()
      .onChange((value) => {
        params.updateLockInterval = value > 3 ? 0.17 : 0.07;
      });

    controlsGUI.guiControls.forEach((control) => gui.add(params, control));
    gui.add(params, "sideView").name("side view");
  };

export const GUIControls = {
  gui,
  controlFolder,
  particleControlsFolder,
  initGui,
};
