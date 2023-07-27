
import { isMac, isIOS } from '5325';

const isMacKeyboard = isMac || isIOS;

function modifiersFromEvent(event) {
  let modifiers = 0;
  if (event.shiftKey) {
    modifiers += 1024;
  }
  if (event.altKey) {
    modifiers += 512;
  }
  if (event.ctrlKey) {
    modifiers += isMacKeyboard ? 2048 : 256;
  }
  if (event.metaKey) {
    modifiers += 2048;
  }
  return modifiers;
}

function hashFromEvent(event) {
  return modifiersFromEvent(event) | event.keyCode;
}

const Modifiers = {
  None: 0,
  Alt: 512,
  Shift: 1024,
  Mod: isMacKeyboard ? 2048 : 256,
  Control: 256,
  Meta: 2048,
};

const hashShiftPlusEnter = 1037;

function humanReadableModifiers(modifiers, includePlus = !isMacKeyboard) {
  let result = '';
  if (256 & modifiers) {
    result += isMacKeyboard ? '^' : 'Ctrl';
    if (includePlus) {
      result += ' + ';
    }
  }
  if (512 & modifiers) {
    result += isMacKeyboard ? '⌥' : 'Alt';
    if (includePlus) {
      result += ' + ';
    }
  }
  if (1024 & modifiers) {
    result += isMacKeyboard ? '⇧' : 'Shift';
    if (includePlus) {
      result += ' + ';
    }
  }
  if (2048 & modifiers) {
    result += isMacKeyboard ? '⌘' : 'Win';
    if (includePlus) {
      result += ' + ';
    }
  }
  return result;
}

const keySymbols = {
  9: '⇥',
  13: '↵',
  27: 'Esc',
  8: isMacKeyboard ? '⌫' : 'Backspace',
  32: 'Space',
  35: 'End',
  36: 'Home',
  37: '←',
  38: '↑',
  39: '→',
  40: '↓',
  45: 'Ins',
  46: 'Del',
  188: ',',
  191: '/',
};

for (let i = 1; i <= 16; i++) {
  keySymbols[i + 111] = `F${i}`;
}

function humanReadableHash(hash) {
  let result = humanReadableModifiers(hash);
  const keyCode = hash & 255;
  result += keyCode in keySymbols ? keySymbols[keyCode] : String.fromCharCode(keyCode);
  return result;
}

export {
  Modifiers,
  hashFromEvent,
  hashShiftPlusEnter,
  humanReadableHash,
  humanReadableModifiers,
  isMacKeyboard,
  modifiersFromEvent,
};
