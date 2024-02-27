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
        name: "maxPoints",
        min: 0,
        max: 720 * 15,
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
        step: 0.001,
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
    controlsGUI.guiControls.forEach((control) => gui.add(params, control));
    gui.add(params, "sideView").name("side view");
    controlFolder
      .add(params, "contracted")
      .onFinishChange((_contracted) => {
        params.radiusMultiplier = 0.202;
        params.maxPoints = _contracted ? 720 * 15 : 720 * 5;
      })
      .listen()
      .name("Contract");
  };

export const GUIControls = {
  gui,
  controlFolder,
  particleControlsFolder,
  initGui,
};
