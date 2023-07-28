import { r, d, ensureNotNull } from "./50151";
import { createPrimitiveProperty } from "59680";
import { DefaultProperty } from "46100";
import { n } from "58275";
import { l, WatchedObject } from "83669";
import { h, emit } from "57898";
import { getValue, setValue } from "56840";
import { saveDefaults, defaults } from "85804";

function toolIsCursor(tool) {
  return tool === "cursor" || tool === "arrow" || tool === "dot";
}

function toolIsMeasure(tool) {
  return tool === "measure";
}

function resetToCursor(force = false) {
  if (!force && v) {
    if (v.childs().stayInDrawingMode.value()) {
      return;
    }
  }
  C.setValue(M.value());
}

export const SelectPointMode = {
  None: 0,
  Replay: 1,
  Study: 2,
};

let v = null;
let S = null;
let y = null;
let b = null;
let w = null;

const crosshairLock = new WatchedObject(null);
const tool = new l();
export const activePointSelectionMode = new l()(SelectPointMode.None);
const iconTool = new l();
const stickerTool = new l();
const emojiTool = new l();
const cursorTool = new l();
const drawOnAllCharts = new l();
const drawOnAllChartsMode = new l();
const isToolCreatingNow = new l()(false);
const isToolEditingNow = new l()(false);
const isToolMovingNow = new l()(false);
const isDirectionalMovementActive = new l()(false);
const createdLineTool = new d();
const continuedLineTool = new d();
const cancelledLineTool = new d();
const beenSetLineToolLastPoint = new d();
const startedMovingLineTool = new d();
const movedLineTool = new d();
const finishedMovingLineTool = new d();
const startedChangingLineTool = new d();
const changedLineTool = new d();
const finishedChangingLineTool = new d();
const removedLineTool = new d();
const finishedLineTool = new d();
const changedLineStyle = new d();
const copiedLineTool = new d();
const restoredLineTool = new d();
const restoredLineToolState = new d();
const restoreLineTool = new d();
const hideAllDrawings = new d();
const hideAllIndicators = new d();
const lockDrawings = new d();
const hideMarksOnBars = new d();
const continueLineTool = new d();
const startMovingLineTool = new d();
const moveLineTool = new d();
const finishMovingLineTool = new d();
const startChangingLineTool = new d();
const changeLineTool = new d();
const finishChangingLineTool = new d();
const removeLineTool = new d();
const finishLineTool = new d();
export const changeLineStyle = new d();
const copyLineTool = new d();
export const runOnDrawingStateReady = new d();
const isStudyEditingNow = new l()(false);

let isInitializing = false;
let initializationCallbacks = [];

function init() {
  if (isInitializing) {
    return;
  }

  tool.setValue(getValue("chart.cursorPreference", "cursor"));
  tool.subscribe(
    (value) => {
      if (toolIsCursor(value) && M.value() !== value) {
        M.setValue(value);
      }
    },
    { callWithLast: true }
  );

  M.subscribe((value) => {
    if (value) {
      setValue("chart.cursorPreference", value);
    }
  });

  v = new DefaultProperty("drawings");
  S = createPrimitiveProperty();
  y = createPrimitiveProperty();
  b = createPrimitiveProperty();
  w = createPrimitiveProperty();
  S.setValue(false);
  y.setValue(false);
  b.setValue(false);
  w.setValue(false);

  tool.subscribe(() => {
    emit("onSelectedLineToolChanged");
  });

  iconTool.subscribe(() => {
    saveDefaults("linetoolicon", {
      ...defaults("linetoolicon"),
      icon: iconTool.value(),
    });
  });

  stickerTool.subscribe(() => {
    saveDefaults("linetoolsticker", {
      ...defaults("linetoolsticker"),
      sticker: stickerTool.value(),
    });
  });

  emojiTool.subscribe(() => {
    saveDefaults("linetoolemoji", {
      ...defaults("linetoolemoji"),
      emoji: emojiTool.value(),
    });
  });

  isInitializing = true;
  initializationCallbacks.forEach((callback) => callback());
  initializationCallbacks = [];
}

function runOnInitialization(callback) {
  if (isInitializing) {
    callback();
  } else {
    initializationCallbacks.push(callback);
  }
}

function properties() {
  return ensureNotNull(v);
}

function hideAllDrawings() {
  return ensureNotNull(S);
}

function hideAllIndicators() {
  return ensureNotNull(y);
}

function lockDrawings() {
  return ensureNotNull(b);
}

function hideMarksOnBars() {
  return ensureNotNull(w);
}

function drawOnAllCharts() {
  return drawOnAllCharts;
}

function drawOnAllChartsMode() {
  return drawOnAllChartsMode;
}

export {
  SelectPointMode,
  activePointSelectionMode,
  beenSetLineToolLastPoint,
  cancelLineTool,
  cancelledLineTool,
  changeLineStyle,
  changeLineTool,
  changedLineStyle,
  changedLineTool,
  continueLineTool,
  continuedLineTool,
  copiedLineTool,
  copyLineTool,
  createLineTool,
  createdLineTool,
  crosshairLock,
  cursorTool,
  drawOnAllCharts,
  drawOnAllChartsMode,
  emojiTool,
  finishChangingLineTool,
  finishLineTool,
  finishMovingLineTool,
  finishedChangingLineTool,
  finishedLineTool,
  finishedMovingLineTool,
  hideAllDrawings,
  hideAllIndicators,
  hideMarksOnBars,
  iconTool,
  init,
  isDirectionalMovementActive,
  isStudyEditingNow,
  isToolCreatingNow,
  isToolEditingNow,
  isToolMovingNow,
  lockDrawings,
  moveLineTool,
  movedLineTool,
  properties,
  removeLineTool,
  removedLineTool,
  resetToCursor,
  restoreLineTool,
  restoreLineToolState,
  restoredLineTool,
  restoredLineToolState,
  runOnDrawingStateReady,
  setLineToolLastPoint,
  startChangingLineTool,
  startMovingLineTool,
  startedChangingLineTool,
  startedMovingLineTool,
  stickerTool,
  tool,
  toolIsCursor,
  toolIsMeasure,
};
