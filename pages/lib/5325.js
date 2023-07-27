export const isAndroid = () => hasWindowAndNavigator && isAndroidOS;
export const isAnyMobile = () => hasWindowAndNavigator && isAnyMobileDevice;
export const isBlackBerry = () => hasWindowAndNavigator && isBlackBerryOS;
export const isChrome = () => hasWindowAndNavigator && isChromeBrowser;
export const isEdge = () => hasWindowAndNavigator && isEdgeBrowser;
export const isFF = () => hasWindowAndNavigator && isFirefoxBrowser;
export const isIOS = () => hasWindowAndNavigator && isiOS;
export const isIPad = () => hasWindowAndNavigator && isiPad;
export const isLinux = () => hasWindowAndNavigator && isLinuxOS;
export const isMac = () => hasWindowAndNavigator && isMacOS;
export const isOperaMini = () => hasWindowAndNavigator && isOperaMiniBrowser;
export const isSafari = () => hasWindowAndNavigator && isSafariBrowser;
export const isWindows = () => hasWindowAndNavigator && isWindowsOS;
export const mobiletouch = () => hasWindowAndNavigator && supportsMobileTouch;
export const touch = () => hasWindowAndNavigator && supportsTouch;

const hasWindowAndNavigator =
  typeof window !== "undefined" && typeof navigator !== "undefined";
const supportsTouch =
  hasWindowAndNavigator &&
  ("ontouchstart" in window || !!navigator.maxTouchPoints);
const supportsMobileTouch =
  hasWindowAndNavigator && supportsTouch && "onorientationchange" in window;
const isChromeBrowser =
  hasWindowAndNavigator && window.chrome && window.chrome.runtime;
const isFirefoxBrowser =
  hasWindowAndNavigator &&
  window.navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
const isEdgeBrowser =
  hasWindowAndNavigator && /\sEdge\/\d\d\b/.test(navigator.userAgent);
const isSafariBrowser =
  hasWindowAndNavigator &&
  Boolean(navigator.vendor) &&
  navigator.vendor.indexOf("Apple") > -1 &&
  -1 === navigator.userAgent.indexOf("CriOS") &&
  -1 === navigator.userAgent.indexOf("FxiOS");
const isMacOS = hasWindowAndNavigator && /mac/i.test(navigator.platform);
const isWindowsOS =
  hasWindowAndNavigator && /Win32|Win64/i.test(navigator.platform);
const isLinuxOS = hasWindowAndNavigator && /Linux/i.test(navigator.platform);
const isAndroidOS =
  hasWindowAndNavigator && /Android/i.test(navigator.userAgent);
const isBlackBerryOS =
  hasWindowAndNavigator && /BlackBerry/i.test(navigator.userAgent);
const isiOS =
  hasWindowAndNavigator && /iPhone|iPad|iPod/.test(navigator.platform);
const isOperaMiniBrowser =
  hasWindowAndNavigator && /Opera Mini/i.test(navigator.userAgent);
const isiPad =
  hasWindowAndNavigator &&
  (("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1) ||
    /iPad/.test(navigator.platform));
const isAnyMobileDevice =
  isAndroidOS || isBlackBerryOS || isiOS || isOperaMiniBrowser;
