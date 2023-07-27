
"use strict";

import { supportTouch } from ('./49483.js');

let lastMouseOrTouchEventInfo = supportTouch() ? {
  isTouch: true,
  stylus: false
} : {
  isTouch: false
};

function getLastMouseOrTouchEventInfo() {
  return lastMouseOrTouchEventInfo;
}

function setLastMouseOrTouchEventInfo(info) {
  lastMouseOrTouchEventInfo = info.isTouch ? {
    isTouch: true,
    stylus: info.stylus
  } : {
    isTouch: false
  };
}