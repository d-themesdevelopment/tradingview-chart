"use strict";

const { supportTouch } = require("path/to/support-touch-module"); // ! not correct

export let lastMouseOrTouchEventInfo = supportTouch()
  ? {
      isTouch: true,
      stylus: false,
    }
  : {
      isTouch: false,
    };

function getLastMouseOrTouchEventInfo() {
  return lastMouseOrTouchEventInfo;
}

function setLastMouseOrTouchEventInfo(info) {
  lastMouseOrTouchEventInfo = info.isTouch
    ? {
        isTouch: true,
        stylus: info.stylus,
      }
    : {
        isTouch: false,
      };
}
