import { setClasses } from 'some-module';
import { install } from 'some-other-module';

window.TradingView = window.TradingView || {};

window.requireAll = function (requireContext) {
  return requireContext.keys().map(requireContext);
};

function initializeTradingView() {
  setClasses();
  requireAll(require.context('./', true, /\.js$/));
  install();
}

export {
  initializeTradingView
};