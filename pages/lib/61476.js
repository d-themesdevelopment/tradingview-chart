import { Interval, isAlignmentEnabled, getChartStyleStudy, decodeExtendedSymbol, findSuitableResolutionToBuildFrom, SubsessionId } from 'chart-library';

class DataFeed {
  constructor() {
    this.cache = {};
  }

  getCache(key) {
    return this.cache[key];
  }

  putCache(key, value) {
    this.cache[key] = value;
  }

  subscribe(
    symbol,
    currency,
    unit,
    resolution,
    onBarData,
    onError,
    onDataReady,
    onNoData,
    onRescheduleNeeded,
    onSubsessionId
  ) {
    const symbolKey = decodeExtendedSymbol(symbol);
    currency = symbolKey["currency-id"] || currency;
    unit = symbolKey["unit-id"] || unit;
    const cacheKey = symbolKey.symbol;
    const cacheData = this.getCache(cacheKey);

    if (!cacheData) {
      const item = this.createItem(
        symbol,
        currency,
        unit,
        resolution,
        onBarData,
        onDataReady,
        onNoData,
        onRescheduleNeeded,
        onSubsessionId
      );
      this.putCache(cacheKey, item);
      return item.listeners.addListener(onBarData, onError);
    }

    return {
      key: cacheKey,
      listener: onBarData,
    };
  }

  unsubscribe(subscription) {
    const cacheData = this.getCache(subscription.key);
    if (cacheData) {
      cacheData.listeners.removeListener(subscription.listener);
    }
  }

  removeUnused() {
    const unusedKeys = Object.keys(this.cache).filter(
      (key) => this.cache[key] && this.cache[key].listeners.listenersCount() === 0
    );
    if (unusedKeys.length > 0) {
      for (const key of unusedKeys) {
        const cacheData = this.cache[key];
        this.cache[key] = null;
        cacheData.stop();
      }
      this.removeUnused();
    }
  }

  rebuildFrom(resolution, requestedResolution) {
    const result = findSuitableResolutionToBuildFrom(resolution, requestedResolution);
    if (result.error) {
      console.error(result.errorMessage);
    }
    return result.resolution;
  }

  createItem(
    symbol,
    currency,
    unit,
    resolution,
    onBarData,
    onDataReady,
    onNoData,
    onRescheduleNeeded,
    onSubsessionId
  ) {
    const listeners = new DataFeedListeners();
    const decodedSymbol = decodeExtendedSymbol(symbol);
    const symbolInfo = decodedSymbol.symbol;

    currency = decodedSymbol["currency-id"] || currency;
    unit = decodedSymbol["unit-id"] || unit;
    const rebuildRequested =
      symbolInfo.type in decodedSymbol &&
      (symbolInfo.type === "type" || !isAlignmentEnabled());

    if (!rebuildRequested && symbolInfo.has_empty_bars && !isAlignmentEnabled()) {
      console.error(
        'Misconfiguration error: attempt to request data for symbol with "has_empty_bars" flag, but "disable_resolution_rebuild" featureset is enabled'
      );
    }

    let engine;
    if ("type" in symbolInfo) {
      const chartStyleStudy = getChartStyleStudy(symbolInfo);
      const rebuildRequested = symbolInfo.has_empty_bars;
      const resolutionToBuildFrom = this.rebuildFrom(resolution, requestedResolution);
      const isRecalculated = false;
      engine = new StudyEngine({
        tickerid: symbolInfo,
        currencyCode: currency,
        unitId: unit,
        subsessionId: onSubsessionId,
        period: resolution,
        body: chartStyleStudy,
        sessionId: requestedResolution,
        symbolInfo,
        dataRange: isRecalculated,
        forceAlignBars: false,
        recalc: (e, t) => this._recalc(t),
        out: (e, t) => this._out(e, t),
        nonseriesOut: (e, t) => this._nonseriesOut(e, t),
        setNoMoreData: () => {
          this.barset && (this.barset.endOfData = true);
        },
        onErrorCallback: (e) => {
          this.listeners.onError(e);
        },
      });
    } else {
      if (isAlignmentEnabled() && !rebuildRequested) {
        console.error(
          'Misconfiguration error: remove "disable_resolution_rebuild" featureset or provide ' +
            resolution +
            " data by yourself"
        );
      }
      const isRecalculated = false;
      engine = new BarSetEngine(listeners, symbolInfo.symbol, { currency, unit, session: onSubsessionId }, resolution, onDataReady, symbolInfo.session === SubsessionId.Regular, host, onNoData, onRescheduleNeeded);
    }

    return engine;
  }
}

class DataFeedListeners {
  constructor() {
    this.listeners = [];
  }

  listenersCount() {
    return this.listeners.reduce((count, listener) => count + (listener ? 1 : 0), 0);
  }

  addListener(dataListener, onErrorCallback) {
    this.listeners.push({ dataListener, onErrorCallback });
    if (this.barset) {
      dataListener(this.barset);
    }
    if (this.errorMsg) {
      onErrorCallback(this.errorMsg);
    }
  }

  removeListener(listener) {
    const filteredListeners = this.listeners.filter((item) => item.dataListener === listener);
    if (filteredListeners.length !== 0) {
      const index = this.listeners.indexOf(filteredListeners[0]);
      delete this.listeners[index];
    }
  }

  onError(error) {
    this.errorMsg = error || "unspecified error";
    for (const listener of this.listeners) {
      if (listener && listener.onErrorCallback) {
        listener.onErrorCallback(error);
      }
    }
  }

  fire(data, t) {
    if (!t) {
      this.barset = data;
    }
    for (const listener of this.listeners) {
      if (listener && listener.dataListener) {
        listener.dataListener(data);
      }
    }
  }
}

export function setupFeed(host) {
  DataFeed.instance = new DataFeed(host);
  setupFeed(DataFeed.instance);
}

export function unsubscribeUnused() {
  DataFeed.instance.removeUnused();
}
