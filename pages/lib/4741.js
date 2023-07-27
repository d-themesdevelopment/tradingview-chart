import { WatchedValue } from "./WatchedValue";
import { hashFromEvent, modifiersFromEvent, isMacKeyboard } from "./68335";
import { isNativeUIInteraction } from "./54717";
import { trackEvent } from "analytics"; // ! not correct

class KeyCombination {
  constructor(modifiers, code) {
    this.modifiers = modifiers;
    this.code = code;
  }

  altOrOptionCode() {
    return this.code === "AltLeft" || this.code === "AltRight";
  }

  controlOrMetaCode() {
    if (isMacKeyboard) {
      return (
        this.code === "MetaLeft" ||
        this.code === "MetaRight" ||
        this.code === "OSLeft" ||
        this.code === "OSRight"
      );
    } else {
      return this.code === "ControlLeft" || this.code === "ControlRight";
    }
  }
}

class KeyboardPressedKeysState extends WatchedValue {
  setValue(keyCombination, force = false) {
    const currentValue = this.value();
    if (
      force ||
      currentValue === undefined ||
      currentValue.code !== keyCombination.code ||
      currentValue.modifiers !== keyCombination.modifiers
    ) {
      super.setValue(keyCombination);
    }
  }
}

class HotkeyActionGroup {
  constructor(manager, options) {
    this._actions = [];
    this._manager = manager;
    this.modal = !(!options || !options.modal);

    if (options) {
      this.desc = options.desc;
    }

    if (options && options.isDisabled) {
      if (typeof options.isDisabled === "function") {
        this.isDisabled = options.isDisabled;
      } else {
        this.isDisabled = () => true;
      }
    } else {
      this.isDisabled = () => false;
    }

    this._manager.registerGroup(this);
  }

  add(options) {
    const action = new HotkeyAction(this, options);
    this._actions.push(action);
    return action;
  }

  remove(action) {
    for (let i = this._actions.length; i-- > 0; ) {
      if (this._actions[i] === action) {
        this._actions.splice(i, 1);
      }
    }
  }

  handleHotkey(keyCombination, event) {
    for (let i = this._actions.length; i-- > 0; ) {
      const action = this._actions[i];
      if (
        action.hotkey === keyCombination &&
        (!action.element ||
          (event.target && action.element.contains(event.target))) &&
        !action.isDisabled()
      ) {
        action.handler(event);
        event.preventDefault();
        this._callMatchedHotkeyHandler(keyCombination);
        return true;
      }
    }
    return false;
  }

  promote() {
    this._manager.promoteGroup(this);
  }

  destroy() {
    this._actions.length = 0;
    this._manager.unregisterGroup(this);
  }

  static setMatchedHotkeyHandler(handler) {
    HotkeyActionGroup._matchedHotkeyHandler = handler;
  }

  _callMatchedHotkeyHandler(keyCombination) {
    if (HotkeyActionGroup._matchedHotkeyHandler) {
      HotkeyActionGroup._matchedHotkeyHandler(keyCombination);
    }
  }
}

const keyboardManager = new (class {
  constructor() {
    this._groups = [];
    this._pressedKeys = new WatchedValue(0);
    this._keyboardPressedKeysState = new KeyboardPressedKeysState(
      new KeyCombination(0)
    );

    this._keyDownListener = (event) => {
      if (event.defaultPrevented) return;

      const keyCombination = hashFromEvent(event);
      this._pressedKeys.setValue(keyCombination);
      this._keyboardPressedKeysState.setValue(
        new KeyCombination(modifiersFromEvent(event), event.code)
      );

      if (!isNativeUIInteraction(keyCombination, event.target)) {
        for (let i = this._groups.length; i-- > 0; ) {
          const group = this._groups[i];
          if (!group.isDisabled()) {
            if (group.handleHotkey(keyCombination, event)) return;
            if (group.modal) return;
          }
        }
      }
    };

    this._keyUpListener = (event) => {
      const keyCombination = hashFromEvent(event);
      this._pressedKeys.setValue(keyCombination);
      this._keyboardPressedKeysState.setValue(
        new KeyCombination(modifiersFromEvent(event), "")
      );
    };

    this._blurEvent = () => {
      this._pressedKeys.setValue(0);
      this._keyboardPressedKeysState.setValue(new KeyCombination(0, ""));
    };

    this._mouseEvent = (event) => {
      const modifiers = modifiersFromEvent(event);
      const currentKeys = 255 & (this._pressedKeys.value() ?? 0);
      this._pressedKeys.setValue(modifiers | currentKeys);
    };
  }

  listen(element) {
    element.addEventListener("keydown", this._keyDownListener);
    element.addEventListener("keyup", this._keyUpListener);
    element.addEventListener("blur", this._blurEvent);
    element.addEventListener("mousemove", this._mouseEvent);
  }

  unlisten(element) {
    element.removeEventListener("keydown", this._keyDownListener);
    element.removeEventListener("keyup", this._keyUpListener);
    element.removeEventListener("blur", this._blurEvent);
    element.removeEventListener("mousemove", this._mouseEvent);
  }

  registerGroup(group) {
    this._groups.push(group);
  }

  unregisterGroup(group) {
    for (let i = this._groups.length; i--; ) {
      if (this._groups[i] === group) {
        this._groups.splice(i, 1);
      }
    }
  }

  promoteGroup(group) {
    let lastIndex = this._groups.length - 1;
    for (let i = this._groups.length; i--; ) {
      if (this._groups[i] === group) {
        if (i !== lastIndex) {
          this._groups.splice(i, 1);
          this._groups.splice(lastIndex, 0, group);
        }
        return;
      }
      if (this._groups[i].modal) {
        lastIndex = i - 1;
      }
    }
  }

  pressedKeys() {
    return this._pressedKeys.readonly();
  }

  keyboardPressedKeysState() {
    return this._keyboardPressedKeysState.readonly();
  }
})();

function createGroup(options) {
  return new HotkeyActionGroup(keyboardManager, options);
}

function registerWindow(window) {
  keyboardManager.listen(window);
}

function unregisterWindow(window) {
  keyboardManager.unlisten(window);
}

export const pressedKeys = keyboardManager.pressedKeys();
const keyboardPressedKeysState = keyboardManager.keyboardPressedKeysState();

registerWindow(window);

HotkeyActionGroup.setMatchedHotkeyHandler((keyCombination) => {
  trackEvent("Keyboard Shortcuts", hashFromEvent(keyCombination));
});
