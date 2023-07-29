import {pressedKeys} from "./4741.js";
import {modifiersFromEvent, isMacKeyboard, Modifiers, hashFromEvent} from "./68335.js";
import {isNativeUIInteraction} from "./35749.js";
import {WatchedValue} from "./58275.js";
import {EnvironmentState} from "./EnvironmentState.js";

      export const shiftPressed = new WatchedValue(Boolean(
        (pressedKeys.value() !== null ? pressedKeys.value() : 0) & Modifiers.Shift
      ));
      export const modifierPressed = new WatchedValue(Boolean(
        (pressedKeys.value() !== null ? pressedKeys.value() : 0) & Modifiers.Mod
      ));
      const altPressed = new WatchedValue(Boolean(
        (pressedKeys.value() !== null ? pressedKeys.value() : 0) & Modifiers.Alt
      ));
      const modifierCombinations = [
        Modifiers.None,
        Modifiers.Alt,
        Modifiers.Mod,
        Modifiers.Alt + Modifiers.Shift,
      ];

  function shiftPressed() {
      return shiftPressed
  }

  function modifierPressed() {
      return modifierPressed
  }

  function globalEnvironmentState() {
      return new EnvironmentState({
          altKey: altPressed.value(),
          ctrlKey: modifierPressed().value(),
          metaKey: modifierPressed().value(),
          shiftKey: shiftPressed().value()
      })
  }
  pressedKeys.subscribe(((e = 0) => {
      shiftPressed.setValue(Boolean(e & Modifiers.Shift)), modifierPressed.setValue(Boolean(e & Modifiers.Mod)), 
      altPressed.setValue(Boolean(e & Modifiers.Alt))
  }));
  class ChartHotkeysListener {
      constructor(e, t) {
          this._pressedKeyCode = null, this._boundKeydownHandler = null, this._boundKeyupHandler = null, this._chartWidget = e, this._parent = t, this._boundKeydownHandler = this._keydownHandler.bind(this), this._boundKeyupHandler = this._keyupHandler.bind(this), this._parent.ownerDocument.addEventListener("keydown", this._boundKeydownHandler), this._parent.ownerDocument.addEventListener("keyup", this._boundKeyupHandler)
      }
      destroy() {
          null !== this._boundKeydownHandler && (this._parent.ownerDocument.removeEventListener("keydown", this._boundKeydownHandler), this._boundKeydownHandler = null), null !== this._boundKeyupHandler && (this._parent.ownerDocument.removeEventListener("keyup", this._boundKeyupHandler), this._boundKeyupHandler = null)
      }
      _keydownHandler(e) {
          this._chartWidget.hasModel() && window.document.activeElement === window.document.body && this._chartWidget.isActive() && (this._handleMoveDrawingsKeyDown(e) || this._handleScrollKeyDown(e) || this._handleZoomKeyDown(e)) && e.preventDefault()
      }
      _keyupHandler(e) {
          this._chartWidget.hasModel() && this._handleScrollKeyUp(e)
      }
      _handleMoveDrawingsKeyDown(e) {
          const t = 255 & hashFromEvent(e),
              i = this._chartWidget.model();
          switch (t) {
              case 37:
                  return i.moveSelectedToolsLeft();
              case 39:
                  return i.moveSelectedToolsRight();
              case 38:
                  return i.moveSelectedToolsUp();
              case 40:
                  return i.moveSelectedToolsDown()
          }
          return !1
      }
      _handleScrollKeyDown(e) {
          if (null !== this._pressedKeyCode) return !1;
          const t = hashFromEvent(e),
              i = 255 & t,
              s = modifiersFromEvent(e);
          let r;
          if (37 === i) r = 1;
          else {
              if (39 !== i) return !1;
              r = -1
          }
          return !(isMacKeyboard && s === Modifiers.Mod || !modifierCombinations.includes(s))
           && (!isNativeUIInteraction(t, e.target) && (this._pressedKeyCode = i,
              s === Modifiers.None ? this._chartWidget.scrollHelper().moveByBar(r) : s === Modifiers.Alt || 
              s === Modifiers.Mod ? this._chartWidget.scrollHelper().move(r) : -1 === r ? this._chartWidget.model().timeScale().scrollToRealtime(!0) : this._chartWidget.model().timeScale().scrollToFirstBar(), !0))
      }
      _handleScrollKeyUp(e) {
          if (null === this._pressedKeyCode) return !1;
          const t = hashFromEvent(e);
          if (isNativeUIInteraction(t, e.target)) return !1;
          return (255 & t) === this._pressedKeyCode && (this._pressedKeyCode = null, this._chartWidget.scrollHelper().stopMove(), !0)
      }
      _handleZoomKeyDown(e) {
          const t = hashFromEvent(e),
              i = 255 & t;
          if (modifiersFromEvent(e) !== Modifiers.Mod || isNativeUIInteraction(t, e.target)) return !1;
          const s = this._chartWidget.model();
          if (38 === i) s.zoomIn();
          else {
              if (40 !== i) return !1;
              s.zoomOut()
          }
          return !0
      }
  }
