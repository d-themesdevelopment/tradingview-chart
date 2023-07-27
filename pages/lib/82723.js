import { globalKeypressMatches } from 'some-library';
import { enabled } from 'another-library';
import { showChangeIntervalDialogAsync, trackEvent } from 'yet-another-library';
import { loadChangeIntervalDialog } from 'some-other-library';
import { loadNewSymbolSearch } from 'some-more-library';

const keyPressHandlers = [];
let currentDialog = null;

function findKeyPressHandlerIndex(name) {
  for (let i = 0; i < keyPressHandlers.length; i++) {
    if (keyPressHandlers[i].name === name) {
      return i;
    }
  }
  return -1;
}

function handleKeyPress(event) {
  if (!currentDialog) {
    for (let i = keyPressHandlers.length - 1; i >= 0 && !keyPressHandlers[i].func(event); i--);
  }
}

window.addEventListener('keypress', handleKeyPress, false);

function activateKeyPressHandler(handler) {
  keyPressHandlers.unshift(handler);
}

function showDialog(options) {
  const promise = currentDialog = loadNewSymbolSearch().then((dialog) => {
    if (promise === currentDialog) {
      dialog.showDefaultSearchDialog(options);
    }
  });
  return promise;
}

function handleGlobalKeyPress(event) {
  if (!globalKeypressMatches(event)) {
    return false;
  }

  event.preventDefault();
  const char = String.fromCharCode(event.charCode);

  if (enabled('show_interval_dialog_on_key_press') && /^[1-9]$/.test(char)) {
    showChangeIntervalDialogAsync({ initVal: char });
  } else if (enabled('symbol_search_hot_key')) {
    showDialog({ defaultValue: char, selectSearchOnInit: false, source: 'keyboard' });
    trackEvent('GUI', 'SS', 'hotkey');
  }

  return true;
}

function activateKeyPressHandler() {
  loadChangeIntervalDialog();
  activateKeyPressHandler({ name: 'symbolEdit', func: handleGlobalKeyPress });
}

export { activateKeyPressHandler, showDialog };
