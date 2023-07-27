import { enabled } from "./helpers";
import "../../94025";
import "../../82992"; // ! not correct

new RegExp("^quandl", "i");

function canShowSpreadActions() {
  let e = false;
  if (enabled("show_spread_operators")) {
    e = true;
  }
  return e;
}

function globalKeypressMatches(e) {
  if (e.ctrlKey) {
    return false;
  }
  if (e.metaKey) {
    return false;
  }
  if (!e.charCode) {
    return false;
  }
  if (!e.which || e.which <= 32) {
    return false;
  }
  const t = e.target;
  if (
    !t ||
    (!/^(input|textarea)$/i.test(t.tagName) &&
      t.getAttribute("role") !== "listbox")
  ) {
    return true;
  }
  return false;
}

export { canShowSpreadActions, globalKeypressMatches };
