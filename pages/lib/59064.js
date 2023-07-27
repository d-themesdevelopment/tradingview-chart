
import Delegate from './57898.js';

const globalCloseDelegate = new Delegate();

function globalCloseMenu() {
  globalCloseDelegate.fire();
}

export { globalCloseDelegate, globalCloseMenu };


