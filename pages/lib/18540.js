import { saveDefaultProperties, runOnDrawingStateReady } from "./46100";
import { runOnDrawingStateReady } from "./88348";
import { SelectPointMode, toolIsMeasure } from "./88348";

import { MagnetMode, isLineToolName } from "./MagnetMode"; // ! not correct

import { modifierPressed, shiftPressed } from "./28571";
import {
  properties,
  tool,
  isToolEditingNow,
  isToolCreatingNow,
  activePointSelectionMode,
  isStudyEditingNow,
  isToolEditingNow,
  toolIsMeasure,
} from "./88348";

const isMagnetEnabled = new BehaviorSubject(false);
const magnetMode = new BehaviorSubject(MagnetMode.WeakMagnet);

const setIsMagnetEnabled = (value) => {
  saveDefaultProperties(true);
  properties().childs().magnet.setValue(value);
  saveDefaultProperties(false);
};

const setMagnetMode = (value) => {
  saveDefaultProperties(true);
  properties().childs().magnetMode.setValue(value);
  properties().childs().magnet.setValue(true);
  saveDefaultProperties(false);
};

const modifierKeyPressed = modifierPressed();
const shiftKeyPressed = shiftPressed();

function handleMagnetUpdate() {
  const isModifierKeyPressed = modifierKeyPressed.value();
  if (
    shiftKeyPressed.value() &&
    (isToolEditingNow.value() || isToolCreatingNow.value())
  ) {
    isMagnetEnabled.setValue(false);
    return;
  }
  let isLineTool = false;
  let isMagnetModeEnabled = false;
  if (activePointSelectionMode.value() === SelectPointMode.Replay) {
    isLineTool = false;
    isMagnetModeEnabled = false;
  } else {
    const currentTool = tool.value();
    const isToolEditingOrMeasure =
      isToolEditingNow.value() ||
      toolIsMeasure(currentTool) ||
      isStudyEditingNow.value();
    isLineTool =
      isModifierKeyPressed &&
      (isLineToolName(currentTool) || isToolEditingOrMeasure);
    isMagnetModeEnabled = properties().childs().magnet.value();
  }
  const magnetModeValue =
    isMagnetModeEnabled && isLineTool
      ? MagnetMode.StrongMagnet
      : properties().childs().magnetMode.value();
  const isMagnetEnabledValue = isLineTool
    ? !isMagnetModeEnabled
    : isMagnetModeEnabled;
  magnetMode.setValue(magnetModeValue);
  isMagnetEnabled.setValue(isMagnetEnabledValue);
}

function magnetEnabled() {
  return isMagnetEnabled;
}

function magnetMode() {
  return magnetMode;
}

runOnDrawingStateReady(() => {
  properties().childs().magnet.subscribe(null, handleMagnetUpdate);
  properties().childs().magnetMode.subscribe(null, handleMagnetUpdate);
  modifierKeyPressed.subscribe(handleMagnetUpdate);
  shiftKeyPressed.subscribe(handleMagnetUpdate);
  tool.subscribe(handleMagnetUpdate);
  isToolEditingNow.subscribe(handleMagnetUpdate);
  handleMagnetUpdate();
});

export { magnetEnabled, magnetMode, setIsMagnetEnabled, setMagnetMode };
