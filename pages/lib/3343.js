import { isMac, isIOS } from "./5325"; // Replace 'some-module' with the actual module path

export const isMacKeyboard = isMac || isIOS;

export const Modifiers = {
  None: 0,
  Alt: 512,
  Shift: 1024,
  Mod: isMacKeyboard ? 2048 : 256,
  Control: 256,
  Meta: 2048,
};

export function modifiersFromEvent(event) {
  let modifiers = 0;
  if (event.shiftKey) modifiers += Modifiers.Shift;
  if (event.altKey) modifiers += Modifiers.Alt;
  if (event.ctrlKey) modifiers += Modifiers.Control;
  if (event.metaKey) modifiers += Modifiers.Meta;
  return modifiers;
}

export function hashFromEvent(event) {
  return modifiersFromEvent(event) | event.keyCode;
}

export function humanReadableModifiers(
  modifiers,
  useLongNames = !isMacKeyboard
) {
  let result = "";
  if (modifiers & Modifiers.Control) {
    result += useLongNames ? "Ctrl" : "^";
    if (useLongNames) result += " + ";
  }
  if (modifiers & Modifiers.Alt) {
    result += useLongNames ? (isMacKeyboard ? "⌥" : "Alt") : "Alt";
    if (useLongNames) result += " + ";
  }
  if (modifiers & Modifiers.Shift) {
    result += useLongNames ? (isMacKeyboard ? "⇧" : "Shift") : "Shift";
    if (useLongNames) result += " + ";
  }
  if (modifiers & Modifiers.Meta) {
    result += useLongNames ? (isMacKeyboard ? "⌘" : "Win") : "Win";
    if (useLongNames) result += " + ";
  }
  return result;
}

const specialKeys = {
  9: "⇥",
  13: "↵",
  27: "Esc",
  8: isMacKeyboard ? "⌫" : "Backspace",
  32: "Space",
  35: "End",
  36: "Home",
  37: "←",
  38: "↑",
  39: "→",
  40: "↓",
  45: "Ins",
  46: "Del",
  188: ",",
  191: "/",
};

for (let i = 1; i <= 16; i++) {
  specialKeys[i + 111] = `F${i}`;
}

export function humanReadableHash(hash) {
  let result = humanReadableModifiers(hash);
  const keyCode = hash & 255;
  result +=
    keyCode in specialKeys
      ? specialKeys[keyCode]
      : String.fromCharCode(keyCode);
  return result;
}

export const hashShiftPlusEnter = 1037;
