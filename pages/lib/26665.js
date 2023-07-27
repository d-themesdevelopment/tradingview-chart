"use strict";

import { enabled } from "./helpers";

window.onload = function () {
  if (location.hostname.indexOf(".") >= 0 && !isLocalhost()) {
    setTimeout(function () {
      try {
        var e = getLogoType();
        if (window.ga) {
          if (e !== 0) {
            window.ga("send", "event", "s", e);
          }
          if (!urlParams.utm) {
            window.ga("send", "event", "l");
          }
        }
      } catch (e) {}
    }, 30000);
  }
};

function isLocalhost() {
  try {
    return (
      /^(192|172|10)\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(
        location.hostname
      ) || /^.*((?:\.local)|localhost)$/.test(location.hostname)
    );
  } catch (e) {
    return false;
  }
}

function getLogoType() {
  var type = 0;
  if (JSON.parse(urlParams.logo).image) {
    type = "C";
    if (!enabled("link_to_tradingview")) {
      type = "D";
    }
  }
  return type;
}
