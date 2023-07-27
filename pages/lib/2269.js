import { createDwmAligner } from "./77475";
import { Interval } from "./36274";
import { StudyEngine } from "./StudyEngine";
import { ChartApiInterface } from "./18792";
import { HandlerInfo } from "./HandlerInfo";

const STUDY_COUNT_LIMIT = 210;

class ChartApi extends ChartApiInterface {
  constructor(options) {
    super();
    this._notificationHandlers = {};
    this._sessions = {};
    this.studyCounter = 0;
    this._connected = false;
    this._enabled = false;
    this._studyEngine = new StudyEngine(options);
    this._callbacks = {};
    this._serverTimeOffset = 0;
    this._init();
  }

  _init() {
    const chartApi = this;
    this._studyEngine.on("configuration_received", function () {
      chartApi._fireEvent("configuration_received");
    });

    this._studyEngine.on("realtime_tick", function (value) {
      const [time, open, high, low, close, volume] = value;
      const tickData = {
        time: time / 1000,
        open,
        high,
        low,
        close,
        volume,
      };
      chartApi._fireEvent("realtime_tick", tickData, true);
    });

    this._setVisibleRangeTimeout = {};
  }

  destroy() {
    this._studyEngine.destroy();
    this._studyEngine = null;
  }

  purgeCache() {
    this._studyEngine.purgeCache();
    this._studyEngine.purgeDataCache();
  }

  defaultResolutions() {
    return (
      this._studyEngine.supportedResolutions() || [
        "1",
        "3",
        "5",
        "15",
        "30",
        "45",
        "60",
        "120",
        "180",
        "240",
        "1D",
        "1W",
        "1M",
      ]
    );
  }

  availableCurrencies() {
    const supportedCurrencies = this._studyEngine
      .supportedCurrencies()
      .map((currency) => {
        return typeof currency === "string"
          ? { id: currency, code: currency }
          : currency;
      });
    return Promise.resolve(supportedCurrencies);
  }

  availableUnits() {
    return Promise.resolve(this._studyEngine.supportedUnits());
  }

  availablePriceSources(currency) {
    return this._studyEngine.supportedPriceSources(currency);
  }

  supportedSymbolsTypes() {
    return this._studyEngine.supportedSymbolsTypes();
  }

  symbolsGrouping() {
    return this._studyEngine.symbolsGrouping();
  }

  start() {
    this._enabled = true;
    this._fireEvent("start_enabled");
  }

  unsubscribe(event, callback) {
    const callbacks = this._callbacks[event];
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  on(event, callback) {
    if (!this._callbacks.hasOwnProperty(event)) {
      this._callbacks[event] = [];
    }
    this._callbacks[event].push(callback);
    return this;
  }

  _fireEvent(event, data, immediate) {
    if (this._callbacks.hasOwnProperty(event)) {
      const handlers = this._callbacks[event].slice(0);
      if (!immediate) {
        this._callbacks[event] = [];
      }
      handlers.forEach((handler) => handler(data));
    }
  }

  chartCreateSession(id) {
    this._studyEngine.chartCreateSession(id);
  }

  chartDeleteSession(id) {
    this._studyEngine.chartDeleteSession(id);
  }

  createSession(id, session) {
    this._sessions[id] = session;
    this._notificationHandlers[id] = {};
    if (this.connected()) {
      session.onMessage({ method: "connected", params: [] });
    }
  }

  removeSession(id) {
    delete this._sessions[id];
    delete this._notificationHandlers[id];
    this._studyEngine.stopSources(id);
  }

  connected() {
    return this._connected;
  }

  connect() {
    if (this._enabled) {
      if (!this.connected()) {
        this._connected = true;
        this.sessionid = "dummy session id";
        this._notifySessions({ method: "connected", params: [] });
      }
    } else {
      const chartApi = this;
      this.on("start_enabled", function () {
        chartApi.connect();
      });
    }
  }

  disconnect() {
    this._connected = false;
    this._notifySessions({ method: "disconnected", params: [] });
    this.purgeCache();
    this.studyCounter = 0;
  }

  switchTimezone(id, timezone) {
    this._studyEngine.switchTimezone(id, timezone);
  }

  receiveLocalResponse(response) {
    this._dispatchNotification(response);
    this._fireEvent(`message_${response.method}`, undefined, true);
  }

  getMarks(id, symbol, from, to, callback) {
    this._studyEngine.getMarks(id, symbol, from, to, callback);
  }

  getTimescaleMarks(id, symbol, from, to, callback) {
    this._studyEngine.getTimescaleMarks(id, symbol, from, to, callback);
  }

  resolveSymbol(id, customSymbol, onResolve) {
    this._notificationHandlers[id][customSymbol] = new HandlerInfo(
      onResolve,
      customSymbol
    );
    this._studyEngine.resolveSymbol(id, customSymbol);
  }

  _doWhenSeriesDataReceived(id, callback) {
    this._sessions[id].seriesCompleted.subscribe(null, callback, true);
  }

  createSeries(id, customSymbol, resolution, from, to, onReady, history) {
    const chartApi = this;
    this._notificationHandlers[id][customSymbol] = new HandlerInfo(function (
      response
    ) {
      if (response.method === "series_completed") {
        if (history !== null) {
          chartApi._applyTimeFrame(id, resolution, customSymbol, from, history);
          history = null;
        }
      }
      onReady(response);
    },
    customSymbol);

    const options = {
      countBack: to || 300,
    };
    if (history !== null && history.type === Interval.TimeRange) {
      options.to = 1000 * history.to;
      options.from = 1000 * history.from;
    }
    this._studyEngine.createSeries(
      id,
      customSymbol,
      resolution,
      from,
      to,
      options
    );
  }

  removeSeries(id, customSymbol) {
    delete this._notificationHandlers[id][customSymbol];
    this._studyEngine.removeSeries(id, customSymbol);
  }

  setVisibleTimeRange(
    id,
    customSymbol,
    resolution,
    from,
    to,
    resetEnd,
    options,
    callback
  ) {
    let rangeTo = to;
    let usePercentRightMargin =
      options &&
      options.applyDefaultRightMargin !== true &&
      options.percentRightMargin === undefined &&
      to !== undefined
        ? to
        : null;
    const interval = createDwmAligner(
      this._studyEngine.getSeriesInterval(id, customSymbol),
      this._studyEngine.getSeriesSymbolInfo(id, customSymbol)
    );
    if (interval !== null) {
      rangeTo = interval.timeToSessionStart(1000 * to) / 1000;
      if (usePercentRightMargin !== null) {
        usePercentRightMargin =
          interval.timeToSessionStart(1000 * usePercentRightMargin) / 1000;
      }
    }

    const chartApi = this;

    function applyVisibleRange() {
      const timeScale = chartApi._studyEngine.sessionTimeScale(id);
      if (timeScale !== null) {
        let fromIndex, toIndex;
        if (resetEnd === false) {
          fromIndex = timeScale.indexOfTime(1000 * from);
          if (usePercentRightMargin === null) {
            toIndex = timeScale.lastSessionBarIndex();
          } else {
            const toIndexTime = timeScale.indexOfTime(
              1000 * usePercentRightMargin
            );
            toIndex = toIndexTime && toIndexTime.index;
          }
        } else {
          fromIndex = timeScale.indexOfTime(1000 * from);
          if (usePercentRightMargin === null) {
            toIndex = timeScale.lastSessionBarIndex();
          } else {
            const toIndexTime = timeScale.indexOfTime(
              1000 * usePercentRightMargin
            );
            toIndex = toIndexTime && toIndexTime.index;
          }
          if (resetEnd === false) {
            const rangeStart = timeScale.firstSessionBarIndex();
            if (fromIndex < rangeStart) {
              fromIndex = rangeStart;
            }
          }
        }

        if (fromIndex !== null && toIndex !== null) {
          let startBarIndex = fromIndex.index;
          if (fromIndex.timeMs < 1000 * from) {
            startBarIndex += 1;
          }
          if (resetEnd === false) {
            const firstSessionBar = timeScale.firstSessionBarIndex();
            if (startBarIndex < firstSessionBar) {
              startBarIndex = firstSessionBar;
            }
          }
          if (startBarIndex <= toIndex) {
            TradingView.ChartapiMessagerInstances[id].onSeriesTimeframeUpdate(
              customSymbol,
              resolution,
              startBarIndex,
              toIndex,
              options
            );
            if (callback) {
              setTimeout(callback, 0);
            }
          }
        }
      }
    }

    if (this._studyEngine.isTimeScaleExtendedTo(id, 1000 * rangeTo)) {
      applyVisibleRange();
    } else {
      const seriesCompleted =
        TradingView.ChartapiMessagerInstances[id].seriesCompleted;
      const seriesError = TradingView.ChartapiMessagerInstances[id].seriesError;

      if (this._setVisibleRangeTimeout[id] !== undefined) {
        clearTimeout(this._setVisibleRangeTimeout[id]);
      }

      this._setVisibleRangeTimeout[id] = setTimeout(
        function () {
          delete this._setVisibleRangeTimeout[id];
          seriesCompleted.subscribe(null, onSeriesCompleted, true);
          seriesError.subscribe(null, onSeriesError, true);
          this._studyEngine.ensureExtendedTo(customSymbol, id, 1000 * rangeTo);
        }.bind(this),
        0
      );
    }

    function onSeriesCompleted(symbol, interval) {
      if (symbol === customSymbol && interval === resolution) {
        seriesCompleted.unsubscribe(null, onSeriesCompleted);
        seriesError.unsubscribe(null, onSeriesError);
        applyVisibleRange();
      }
    }

    function onSeriesError(symbol, interval) {
      if (symbol === customSymbol && interval === resolution) {
        seriesCompleted.unsubscribe(null, onSeriesCompleted);
        applyVisibleRange();
      }
    }
  }

  _applyTimeFrame(id, resolution, customSymbol, from, timeFrame) {
    let start,
      end,
      options = {};

    if (timeFrame.type === Interval.PeriodBack) {
      const lastBarTime = this._studyEngine.getSeriesLastBarTime(
        id,
        customSymbol
      );
      if (lastBarTime === null) {
        return;
      }
      end = lastBarTime / 1000;
      const parsedValue = Interval.parse(timeFrame.value);
      const symbolInfo = this._studyEngine.getSeriesSymbolInfo(
        id,
        customSymbol
      );
      start =
        alignPeriodsBackForVisibleRange(
          symbolInfo.session,
          symbolInfo.session_holidays,
          symbolInfo.corrections,
          parsedValue.letter(),
          parsedValue.multiplier(),
          1,
          lastBarTime
        ) / 1000;
      const interval = createDwmAligner(
        this._studyEngine.getSeriesInterval(id, customSymbol),
        symbolInfo
      );
      if (interval !== null) {
        start = interval.timeToExchangeTradingDay(1000 * start) / 1000;
        end = interval.timeToExchangeTradingDay(1000 * end) / 1000;
      }
      options = {
        applyDefaultRightMargin: true,
      };
    } else {
      start = timeFrame.from;
      end = timeFrame.to;
    }

    this.setVisibleTimeRange(
      id,
      customSymbol,
      resolution,
      start,
      end,
      false,
      options
    );
  }

  modifySeries(id, customSymbol, resolution, from, to, options, callback) {
    const chartApi = this;
    this._notificationHandlers[id][customSymbol] = new HandlerInfo(function (
      response
    ) {
      if (response.method === "series_completed") {
        if (options !== null) {
          chartApi._applyTimeFrame(id, resolution, customSymbol, from, options);
          options = null;
        }
      }
      callback(response);
    },
    customSymbol);

    this._studyEngine.modifySeries(
      id,
      customSymbol,
      resolution,
      from,
      to,
      options
    );
  }

  requestMoreData(id, customSymbol) {
    this._studyEngine.extendSeriesRange(id, customSymbol);
  }

  setStudiesAccessController(accessController) {
    this.studiesAccessController = accessController;
  }

  allStudiesMetadata() {
    return this._studyEngine.studiesMetadata();
  }

  requestMetadata(id, customSymbol, callback) {
    this._notificationHandlers[id][customSymbol] = new HandlerInfo(
      callback,
      customSymbol
    );
    const enabledTools = this.studiesAccessController.getEnabledTools();
    TradingView.ChartapiMessagerInstances[id].onRequestMetadata(
      customSymbol,
      enabledTools
    );
  }

  canCreateStudy() {
    return this.studyCounter < TradingView.STUDY_COUNT_LIMIT;
  }

  getStudyCounter() {
    return this.studyCounter;
  }

  createStudy(id, customSymbol, name, resolution, inputs, options, callback) {
    if (!this.canCreateStudy()) {
      const error = new Error("Exceeded the limit of studies");
      error.cause = "TooManyStudies";
      throw error;
    }

    this._notificationHandlers[id][customSymbol] = new HandlerInfo(
      callback,
      customSymbol
    );
    this._studyEngine.createStudy(
      id,
      customSymbol,
      resolution,
      name,
      inputs,
      options
    );
    this.studyCounter++;
  }

  rebindStudy() {
    throw new Error("Not implemented");
  }

  removeStudy(id, customSymbol, callback) {
    if (this._notificationHandlers[id][customSymbol]) {
      delete this._notificationHandlers[id][customSymbol];
      this._studyEngine.removeStudy(id, customSymbol);
      this.studyCounter--;
    }
  }

  modifyStudy(id, customSymbol, name, inputs, options, callback) {
    this._notificationHandlers[id][customSymbol] = new HandlerInfo(
      callback,
      customSymbol
    );
    this._studyEngine.modifyStudy(id, customSymbol, name, inputs, options);
  }

  createPointset(id, customSymbol, name, resolution, inputs, callback) {
    this._notificationHandlers[id][customSymbol] = new HandlerInfo(
      callback,
      customSymbol
    );
    this._studyEngine.createPointset(
      id,
      customSymbol,
      resolution,
      name,
      inputs
    );
  }

  modifyPointset() {
    throw new Error("This call is not implemented");
  }

  removePointset(id, customSymbol, callback) {
    this._notificationHandlers[id][customSymbol] = null;
    this._studyEngine.removePointset(id, customSymbol);
  }

  requestMoreTickmarks(id, customSymbol) {
    this._studyEngine.requestMoreTickmarks(id, customSymbol);
  }

  requestFirstBarTime(id, customSymbol, resolution, callback) {
    this._notificationHandlers[id][customSymbol] = new HandlerInfo(
      callback,
      customSymbol
    );
  }

  _invokeHandler(handler, response) {
    if (handler) {
      handler(response);
    }
  }

  _sendRequest() {
    throw new Error("This method is not implemented");
  }

  _onMessage() {
    throw new Error("This method is not implemented");
  }

  _dispatchNotification(notification) {
    const symbol = notification.params.shift();
    if (this._notificationHandlers[symbol]) {
      switch (notification.method) {
        case "timescale_update":
          const [id, timescale] = notification.params;
          for (const symbol in timescale) {
            const data = {
              method: "data_update",
              params: {
                customId: symbol,
                plots: timescale[symbol].series,
                nonseries: timescale[symbol].nonseries,
                turnaround: timescale[symbol].turnaround,
              },
            };
            this._invokeNotificationHandler(symbol, data);
          }
          break;
        case "tickmark_update":
          const [timescaleData] = notification.params;
          this._invokeNotificationHandler(symbol, {
            method: "timescale_update",
            params: timescaleData,
          });
          break;
        case "data_update":
          const [dataUpdate] = notification.params;
          for (const symbol in dataUpdate) {
            const data = {
              method: "data_update",
              params: {
                customId: symbol,
                plots: dataUpdate[symbol].series || dataUpdate[symbol].plots,
                nonseries: dataUpdate[symbol].nonseries,
                turnaround: dataUpdate[symbol].turnaround,
              },
            };
            this._invokeNotificationHandler(symbol, data);
          }
          break;
        case "index_update":
          const [indexUpdate] = notification.params;
          for (const symbol in indexUpdate) {
            const data = {
              method: "index_update",
              params: indexUpdate[symbol],
            };
            this._invokeNotificationHandler(symbol, data);
          }
          break;
        case "critical_error":
          logger.logNormal(
            new Date() +
              " critical_error session:" +
              this.sessionid +
              " reason:" +
              notification.params[0]
          );
          this._sessions[symbol].onMessage({
            method: "critical_error",
            params: notification.params,
          });
          break;
        case "timescale_completed":
        case "quote_symbol_data":
        case "quote_list_fields":
        case "depth_symbol_error":
        case "depth_symbol_success":
        case "dd":
        case "dpu":
        case "depth_bar_last_value":
          this._sessions[symbol].onMessage({
            method: notification.method,
            params: notification.params,
          });
          break;
        case "clear_data":
          for (const symbol in notification.params[0]) {
            this._invokeNotificationHandler(symbol, {
              method: "clear_data",
              params: notification.params[0][symbol],
            });
          }
          break;
        default:
          const handler = notification.params[0];
          this._invokeNotificationHandler(symbol, notification);
      }
    }
  }

  _invokeNotificationHandler(symbol, notification) {
    if (symbol !== undefined) {
      const handler = this._notificationHandlers[symbol];
      if (handler !== undefined && handler !== null) {
        this._invokeHandler(handler.handler, notification);
      }
    }
  }

  searchSymbols(id, query, type, exchange, params, callback) {
    this._studyEngine.searchSymbols(id, query, type, params);
  }

  _notifySessions(notification) {
    for (const session in this._sessions) {
      if (!this._sessions.hasOwnProperty(session)) {
        return;
      }
      const instance = this._sessions[session];
      if (typeof instance.onMessage === "function") {
        instance.onMessage(notification);
      }
    }
  }

  unpack(data) {
    throw new Error("This method is not implemented");
  }

  quoteCreateSession(id) {
    return this._studyEngine.quoteCreateSession(id);
  }

  quoteDeleteSession(id) {
    return this._studyEngine.quoteDeleteSession(id);
  }

  quoteSetFields(id, fields) {
    return this._studyEngine.quoteSetFields(id, fields);
  }

  quoteAddSymbols(id, symbols) {
    if (symbols.indexOf(undefined) !== -1) {
      console.warn("Got undefined in quoteAddSymbols");
      symbols = symbols.filter(function (s) {
        return !!s;
      });
    }
    return this._studyEngine.quoteAddSymbols(id, symbols);
  }

  quoteRemoveSymbols(id, symbols) {
    return this._studyEngine.quoteRemoveSymbols(id, symbols);
  }

  quoteFastSymbols(id, symbols) {
    return this._studyEngine.quoteFastSymbols(id, symbols);
  }

  quoteHibernateAll(id) {
    return this._studyEngine.quoteHibernateAll(id);
  }

  depthCreateSession(id) {
    return this._studyEngine.depthCreateSession(id);
  }

  depthDeleteSession(id) {
    return this._studyEngine.depthDeleteSession(id);
  }

  depthSetSymbol(id, symbol) {
    return this._studyEngine.depthSetSymbol(id, symbol);
  }

  getOverrides(id, resolution, symbol, onReady) {
    const overrides = this._studyEngine.getOverrides(id, resolution, symbol);
    onReady(overrides);
  }

  setOverrides(id, resolution, symbol, overrides, onReady) {
    this._studyEngine.setOverrides(id, resolution, symbol, overrides);
    onReady();
  }

  chartUpdate(session, data) {
    const handler = this._sessions[session];
    if (handler) {
      handler.onMessage(data);
    }
  }
}

export default ChartApi;
