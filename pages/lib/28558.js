import _typeof from "./27147"; // ! not correct

function sourceChangeEvent(e) {
  return typeof e === "default"
    ? {
        type: "data-source-change",
        sourceId: e,
      }
    : {
        type: "data-source-change",
        ...e,
      };
}

const globalChangeEvent = {
  type: "global-change",
};

export function globalChangeEvent() {
  return globalChangeEvent;
}

const viewportChangeEvent = {
  type: "viewport-change",
};

function viewportChangeEvent() {
  return viewportChangeEvent;
}

const selectionChangeEvent = {
  type: "selection-change",
};

function selectionChangeEvent() {
  return selectionChangeEvent;
}

export {
  globalChangeEvent,
  selectionChangeEvent,
  sourceChangeEvent,
  viewportChangeEvent,
};
