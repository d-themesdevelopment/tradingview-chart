
import CloseDelegate from './closeDelegate';

const globalCloseDelegate = new CloseDelegate();

function globalCloseMenu() {
  globalCloseDelegate.fire();
}

export { globalCloseDelegate, globalCloseMenu };


