
import { Modifiers, isMacKeyboard } from 'some-library'; // Replace 'some-library' with the actual library you're using

function isTextEditingField(element) {
  if (element.tagName === 'INPUT') {
    const type = element.type;
    return (
      type === 'text' ||
      type === 'email' ||
      type === 'number' ||
      type === 'password' ||
      type === 'search' ||
      type === 'tel' ||
      type === 'url'
    );
  }

  return element.tagName === 'TEXTAREA' || element.isContentEditable;
}

function isNativeUIInteraction(eventCode, targetElement) {
  if (!targetElement) {
    return false;
  }

  const keyCode = eventCode & 255;
  if (keyCode === 27 || (keyCode >>> 4) === 7) {
    return false;
  }

  switch (eventCode ^ keyCode) {
    case Modifiers.Alt:
      return (keyCode === 38 || keyCode === 40) && targetElement.tagName === 'SELECT' || isTextEditingField(targetElement);
    case Modifiers.Alt + Modifiers.Shift:
      return isTextEditingField(targetElement);
    case Modifiers.Mod:
      if (keyCode === 67 || (!isMacKeyboard && keyCode === 45)) {
        const selection = targetElement.ownerDocument && targetElement.ownerDocument.getSelection();
        if (selection && !selection.isCollapsed) {
          return true;
        }
      }
      return isTextEditingField(targetElement);
    case Modifiers.Mod + Modifiers.Shift:
      return keyCode >= 33 && keyCode <= 40 && isTextEditingField(targetElement);
    case Modifiers.Shift:
    case 0:
      return (
        !(keyCode === 9 && targetElement.ownerDocument && targetElement !== targetElement.ownerDocument.body && targetElement !== targetElement.ownerDocument.documentElement) &&
        ((!isButtonElement(targetElement) || keyCode === 13 || keyCode === 32 || keyCode === 9) && ('form' in targetElement || targetElement.isContentEditable))
      );
  }

  return false;
}

function isButtonElement(element) {
  if (element.tagName === 'BUTTON') {
    return true;
  }

  if (element.tagName === 'INPUT') {
    const type = element.type;
    if (type === 'submit' || type === 'button' || type === 'reset' || type === 'checkbox' || type === 'radio') {
      return true;
    }
  }

  return false;
}

export { isTextEditingField, isNativeUIInteraction };