import { declareClassAsPureInterface } from "./helpers";

function ChartApiInterface() {}

ChartApiInterface.WEB_SOCKET_WAS_CONNECTED = false;

ChartApiInterface.prototype.defaultResolutions = function () {};

ChartApiInterface.prototype.availableCurrencies = function () {};

ChartApiInterface.prototype.availableUnits = function () {};

ChartApiInterface.prototype.supportedSymbolsTypes = function () {};

ChartApiInterface.prototype.symbolsGrouping = function () {};

ChartApiInterface.prototype.quoteCreateSession = function (e) {};

ChartApiInterface.prototype.quoteDeleteSession = function (e) {};

ChartApiInterface.prototype.quoteSetFields = function (e, t) {};

ChartApiInterface.prototype.quoteAddSymbols = function (e, t) {};

ChartApiInterface.prototype.quoteRemoveSymbols = function (e, t) {};

ChartApiInterface.prototype.quoteFastSymbols = function (e, t) {};

ChartApiInterface.prototype.depthCreateSession = function (e, t, i) {};

ChartApiInterface.prototype.depthDeleteSession = function (e) {};

ChartApiInterface.prototype.depthSetSymbol = function (e, t) {};

ChartApiInterface.prototype.depthClearSymbol = function (e) {};

ChartApiInterface.prototype.depthSetScale = function (e, t) {};

ChartApiInterface.prototype.chartCreateSession = function (e, t) {};

ChartApiInterface.prototype.chartDeleteSession = function (e) {};

ChartApiInterface.prototype.createSession = function (e, t) {};

ChartApiInterface.prototype.removeSession = function (e) {};

ChartApiInterface.prototype.connected = function () {};

ChartApiInterface.prototype.connect = function () {};

ChartApiInterface.prototype.disconnect = function () {};

ChartApiInterface.prototype.switchTimezone = function (e, t) {};

ChartApiInterface.prototype.resolveSymbol = function (e, t, i, s) {};

ChartApiInterface.prototype.createSeries = function (e, t, i, s, r, n, o, a) {};

ChartApiInterface.prototype.removeSeries = function (e, t, i) {};

ChartApiInterface.prototype.modifySeries = function (e, t, i, s, r, n, o) {};

ChartApiInterface.prototype.requestMoreData = function (e, t, i, s) {};

ChartApiInterface.prototype.requestMetadata = function (e, t, i) {};

ChartApiInterface.prototype.canCreateStudy = function (e, t) {};

ChartApiInterface.prototype.createStudy = function (e, t, i, s, r, n, o) {};

ChartApiInterface.prototype.getStudyCounter = function () {};

ChartApiInterface.prototype.rebindStudy = function (e, t, i, s, r, n, o, a) {};

ChartApiInterface.prototype.removeStudy = function (e, t, i) {};

ChartApiInterface.prototype.modifyStudy = function (e, t, i, s, r) {};

ChartApiInterface.prototype.createPointset = function (e, t, i, s, r, n, o) {};

ChartApiInterface.prototype.modifyPointset = function (e, t, i, s, r) {};

ChartApiInterface.prototype.removePointset = function (e, t, i) {};

ChartApiInterface.prototype.requestMoreTickmarks = function (e, t, i, s) {};

ChartApiInterface.prototype.requestFirstBarTime = function (e, t, i, s) {};

ChartApiInterface.prototype._invokeHandler = function (e, t) {};

ChartApiInterface.prototype._sendRequest = function (e, t) {};

ChartApiInterface.prototype._onMessage = function (e) {};

ChartApiInterface.prototype._dispatchNotification = function (e) {};

ChartApiInterface.prototype._invokeNotificationHandler = function (e, t, i) {};

ChartApiInterface.prototype._notifySessions = function (e) {};

ChartApiInterface.prototype.unpack = function (e) {};

ChartApiInterface.prototype.searchSymbols = function (
  e,
  t,
  i,
  s,
  r,
  n,
  o,
  a,
  l,
  c
) {};

ChartApiInterface.prototype.serverTimeOffset = function () {};

ChartApiInterface.prototype.getMarks = function (e, t, i, s, r) {};

ChartApiInterface.prototype.getTimescaleMarks = function (e, t, i, s, r) {};

declareClassAsPureInterface(ChartApiInterface, "ChartApiInterface");

export { ChartApiInterface };
