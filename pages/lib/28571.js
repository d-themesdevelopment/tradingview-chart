import { pressedKeys } from "./4741";

import {
  Modifiers,
  hashFromEvent,
  modifiersFromEvent,
  isMacKeyboard,
} from "./3343";

import { EnvironmentState } from "./EnvironmentState";
import { isNativeUIInteraction } from "./54717";
// import { CompositeRenderer } from "some-library";

export const shiftPressed = new Boolean(
  (pressedKeys.value() !== null ? pressedKeys.value() : 0) & Modifiers.Shift
);
export const modifierPressed = new Boolean(
  (pressedKeys.value() !== null ? pressedKeys.value() : 0) & Modifiers.Mod
);
const altPressed = new Boolean(
  (pressedKeys.value() !== null ? pressedKeys.value() : 0) & Modifiers.Alt
);
const modifierCombinations = [
  Modifiers.None,
  Modifiers.Alt,
  Modifiers.Mod,
  Modifiers.Alt + Modifiers.Shift,
];

function shiftPressed() {
  return shiftPressed;
}

function modifierPressed() {
  return modifierPressed;
}

function globalEnvironmentState() {
  return new EnvironmentState({
    altKey: altPressed.value(),
    ctrlKey: modifierPressed().value(),
    metaKey: modifierPressed().value(),
    shiftKey: shiftPressed().value(),
  });
}

pressedKeys.subscribe((keys = 0) => {
  shiftPressed.setValue(Boolean(keys & Modifiers.Shift));
  modifierPressed.setValue(Boolean(keys & Modifiers.Mod));
  altPressed.setValue(Boolean(keys & Modifiers.Alt));
});

class ChartHotkeysListener {
  constructor(chartWidget, parent) {
    this._pressedKeyCode = null;
    this._boundKeydownHandler = null;
    this._boundKeyupHandler = null;
    this._chartWidget = chartWidget;
    this._parent = parent;
    this._boundKeydownHandler = this._keydownHandler.bind(this);
    this._boundKeyupHandler = this._keyupHandler.bind(this);
    this._parent.ownerDocument.addEventListener(
      "keydown",
      this._boundKeydownHandler
    );
    this._parent.ownerDocument.addEventListener(
      "keyup",
      this._boundKeyupHandler
    );
  }

  destroy() {
    if (this._boundKeydownHandler !== null) {
      this._parent.ownerDocument.removeEventListener(
        "keydown",
        this._boundKeydownHandler
      );
      this._boundKeydownHandler = null;
    }

    if (this._boundKeyupHandler !== null) {
      this._parent.ownerDocument.removeEventListener(
        "keyup",
        this._boundKeyupHandler
      );
      this._boundKeyupHandler = null;
    }
  }

  _keydownHandler(event) {
    if (
      this._chartWidget.hasModel() &&
      window.document.activeElement === window.document.body &&
      this._chartWidget.isActive()
    ) {
      if (
        this._handleMoveDrawingsKeyDown(event) ||
        this._handleScrollKeyDown(event) ||
        this._handleZoomKeyDown(event)
      ) {
        event.preventDefault();
      }
    }
  }

  _keyupHandler(event) {
    if (this._chartWidget.hasModel()) {
      this._handleScrollKeyUp(event);
    }
  }

  _handleMoveDrawingsKeyDown(event) {
    const keyCode = 255 & hashFromEvent(event);
    const model = this._chartWidget.model();

    switch (keyCode) {
      case 37:
        return model.moveSelectedToolsLeft();
      case 39:
        return model.moveSelectedToolsRight();
      case 38:
        return model.moveSelectedToolsUp();
      case 40:
        return model.moveSelectedToolsDown();
    }

    return false;
  }

  _handleScrollKeyDown(event) {
    if (this._pressedKeyCode !== null) return false;

    const keyCode = hashFromEvent(event);
    const key = 255 & keyCode;
    const modifiers = modifiersFromEvent(event);
    let direction;

    if (key === 37) {
      direction = 1;
    } else {
      if (key !== 39) return false;
      direction = -1;
    }

    return (
      !(
        (isMacKeyboard && modifiers === Modifiers.Mod) ||
        !modifierCombinations.includes(modifiers)
      ) &&
      !(
        isNativeUIInteraction(keyCode, event.target) &&
        ((this._pressedKeyCode = key),
        modifiers === Modifiers.None
          ? this._chartWidget.scrollHelper().moveByBar(direction)
          : modifiers === Modifiers.Alt || modifiers === Modifiers.Mod
          ? this._chartWidget.scrollHelper().move(direction)
          : direction === -1
          ? this._chartWidget.model().timeScale().scrollToRealtime(true)
          : this._chartWidget.model().timeScale().scrollToFirstBar())
      )
    );
  }

  _handleScrollKeyUp(event) {
    if (this._pressedKeyCode === null) return false;

    const keyCode = hashFromEvent(event);
    if (isNativeUIInteraction(keyCode, event.target)) return false;

    return (
      (255 & keyCode) === this._pressedKeyCode &&
      ((this._pressedKeyCode = null),
      this._chartWidget.scrollHelper().stopMove(),
      true)
    );
  }

  _handleZoomKeyDown(event) {
    const keyCode = hashFromEvent(event);
    const key = 255 & keyCode;

    if (
      modifiersFromEvent(event) !== Modifiers.Mod ||
      isNativeUIInteraction(keyCode, event.target)
    ) {
      return false;
    }

    const model = this._chartWidget.model();

    if (key === 38) {
      model.zoomIn();
    } else {
      if (key !== 40) return false;
      model.zoomOut();
    }

    return true;
  }
}
