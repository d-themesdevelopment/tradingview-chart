import { lowerbound, ensureNotNull } from './utils';

function formatString(str, ...args) {
  return str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
}

function toISOString(timestamp) {
  return new Date(timestamp).toISOString();
}

class BarSet {
  constructor(symbolInfo) {
    this.symbolInfo = symbolInfo;
    this.bars = [];
    this.firstLoadedTimeMs = null;
    this.endOfData = false;
  }

  add(bar) {
    this.bars.push(bar);
  }

  count() {
    return this.bars.length;
  }
}

class DWMAligner {
  constructor(sessionSpec) {
    this.sessionSpec = sessionSpec;
  }

  timeToExchangeTradingDay(time) {
    return this.sessionSpec.alignToExchangeTradingDay(new Date(time)).getTime();
  }
}

class DatafeedRequestsCachedProcessor {
  constructor(datafeed, serverTimeOffsetGetter, resetCacheTimePeriod) {
    this.datafeed = datafeed;
    this.serverTimeOffsetGetter = serverTimeOffsetGetter;
    this.resetCacheTimePeriod = resetCacheTimePeriod;
    this.threads = {};
  }

  destroy() {
    Object.values(this.threads).forEach(thread => thread.destroy());
    this.threads = {};
    delete this.datafeed;
  }

  purgeCache() {
    Object.values(this.threads).forEach(thread => thread.destroy());
    this.threads = {};
  }

  subscribe(symbolInfo, resolution, onHistoryCallback, onErrorCallback) {
    const threadId = this.getThreadId(symbolInfo, resolution);
    if (!this.threads[threadId]) {
      this.threads[threadId] = this.createThread(symbolInfo, resolution);
    }
    const thread = this.threads[threadId];
    return `${threadId}"${thread.addSubscription({}, onHistoryCallback, onErrorCallback)}`;
  }

  unsubscribe(subscriptionId) {
    const [threadId, subscriptionKey] = subscriptionId.split('"');
    if (this.threads.hasOwnProperty(threadId)) {
      const thread = this.threads[threadId];
      thread.removeSubscription(parseInt(subscriptionKey));
    } else {
      console.warn('Data thread does not exist:', subscriptionId);
    }
  }

  getThreadId(symbolInfo, resolution) {
    return `${symbolInfo.name}|${resolution}`;
  }

  createThread(symbolInfo, resolution) {
    return new DatafeedThread(this.datafeed, symbolInfo, resolution, this.serverTimeOffsetGetter, this.resetCacheTimePeriod);
  }
}

class DatafeedThread {
  constructor(datafeed, symbolInfo, resolution, serverTimeOffsetGetter, resetCacheTimePeriod) {
    this.cache = {
      bars: []
    };
    this.nextSubscriptionId = 0;
    this.pendingSubscribers = [];
    this.subscribers = [];
    this.requesting = false;
    this.leftDate = null;
    this.nextTime = null;
    this.realtimeOn = false;
    this.endOfData = false;
    this.resetCacheTimeout = null;
    this.errorMessage = null;
    this.destroyed = false;
    this.emptyResponsesCount = 0;
    this.firstDataRequest = true;
    this.datafeed = datafeed;
    this.symbolInfo = symbolInfo;
    this.interval = Interval.parse(resolution);
    this.resolution = this.interval.value();
    this.dwmAligner = new DWMAligner(new SessionSpec(symbolInfo.timezone, symbolInfo.session, symbolInfo.session_holidays, symbolInfo.corrections));
    this.serverTimeOffsetGetter = serverTimeOffsetGetter;
    this.resetCacheTimePeriod = resetCacheTimePeriod || 10000;
    this.updateDatesFromExpirationDate();
  }

  destroy() {
    if (this.subscribers.length !== 0) {
      console.warn('Destroying with non-empty state');
    }
    this.clearResetCacheTimeout();
    this.unsubscribeRealtime();
    this.purgeCache();
    this.destroyed = true;
  }

  addSubscription(range, onHistoryCallback, onErrorCallback) {
    const subscriptionId = this.getNextSubscriptionId();
    this.pendingSubscribers.push({
      key: subscriptionId,
      range: range,
      onHistoryCallback: onHistoryCallback,
      onErrorCallback: onErrorCallback
    });
    if (Interval.isDWM(this.resolution) && range.to !== undefined && this.dwmAligner !== null && range.to % 864e5) {
      console.warn(`${this.logMessagePrefix()}Internal error: invalid date for DWM resolution ${toISOString(range.to)}, expected time without a time part`);
    }
    this.clearResetCacheTimeout();
    setTimeout(() => {
      if (!this.destroyed) {
        this.processPendingSubscribers();
      }
    }, 0);
    return subscriptionId;
  }

  removeSubscription(subscriptionId) {
    const pendingSubscription = this.pendingSubscribers.find(sub => sub.key === subscriptionId);
    if (pendingSubscription) {
      const index = this.pendingSubscribers.indexOf(pendingSubscription);
      this.pendingSubscribers.splice(index, 1);
      return;
    }
    const subscription = this.subscribers.find(sub => sub.key === subscriptionId);
    if (subscription) {
      const index = this.subscribers.indexOf(subscription);
      this.subscribers.splice(index, 1);
      if (this.subscribers.length === 0) {
        this.resetCacheTimeout = setTimeout(() => {
          this.resetCacheTimeout = null;
          this.purgeCache();
          this.unsubscribeRealtime();
        }, this.resetCacheTimePeriod);
      }
      return;
    }
    console.warn(`Unknown subscription symbol=${this.symbolInfo.name}, resolution=${this.resolution}, key=${subscriptionId}`);
  }

  logMessage(message, isError = false) {
    if (isDebugModeEnabled() || isError) {
      console.log(`${this.logMessagePrefix()}${message}`);
    }
  }

  logMessagePrefix() {
    const currencyCode = this.symbolInfo.currency_code;
    const unitId = this.symbolInfo.unit_id;
    return `FEED [${this.symbolInfo.name}|${this.resolution}${currencyCode ? '|' + currencyCode : ''}${unitId ? '|' + unitId : ''}]: `;
  }

  clearResetCacheTimeout() {
    if (this.resetCacheTimeout !== null) {
      clearTimeout(this.resetCacheTimeout);
      this.resetCacheTimeout = null;
    }
  }

  purgeCache() {
    this.logMessage('Reset cache');
    this.cache = {
      bars: []
    };
    this.errorMessage = null;
    this.leftDate = null;
    this.endOfData = false;
    this.firstDataRequest = true;
    this.updateDatesFromExpirationDate();
  }

  updateDatesFromExpirationDate() {
    if (this.symbolInfo.expiration_date !== undefined) {
      this.nextTime = this.symbolInfo.expiration_date * 1e3;
      this.leftDate = (this.symbolInfo.expiration_date + 1) * 1e3;
    }
  }

  dealignTime(time) {
    return this.dwmAligner !== null ? this.dwmAligner.timeToExchangeTradingDay(time) : time;
  }

  normalizeRange(range) {
    const to = range.to !== undefined ? range.to : this.dealignTime(this.now());
    if (this.cache.bars.length === 0 || (range.to !== undefined && to <= ensureNotNull(this.leftDate))) {
      return {
        countBack: range.countBack,
        to: to
      };
    }
    const alignTime = this.dwmAligner !== null ? this.dwmAligner.timeToSessionStart(to) : to;
    const countBack = range.countBack;
    if (countBack < this.cache.bars.length) {
      return {
        countBack: 0,
        to: alignTime
      };
    }
    return {
      countBack: countBack - this.cache.bars.length,
      to: this.dealignTime(this.cache.bars[0].time)
    };
  }

  processPendingSubscribers() {
    const pendingSubscribers = this.pendingSubscribers;
    if (pendingSubscribers.length === 0) {
      return;
    }
    if (this.requesting) {
      return this.logMessage('Processing is skipped due to active request');
    }
    this.logMessage(`Processing pending subscribers, count=${pendingSubscribers.length}`);
    if (this.errorMessage) {
      const error = this.errorMessage;
      this.logMessage(`Return error: ${error}`);
      this.pendingSubscribers = [];
      pendingSubscribers.forEach(sub => {
        sub.onErrorCallback(error);
      });
      return;
    }
    let range = this.normalizeRange(pendingSubscribers[0].range);
    for (const sub of pendingSubscribers.map(sub => this.normalizeRange(sub.range))) {
      if (sub.to < range.to || (sub.to === range.to && sub.countBack > range.countBack)) {
        range = sub;
      }
    }
    this.logMessage(`Leftmost subscriber requires ${range.countBack} bars prior ${toISOString(range.to)}`);
    if (
      this.leftDate === null ||
      (range.to < this.leftDate && (this.nextTime === null || range.to < this.nextTime)) ||
      range.countBack !== 0 ||
      this.endOfData
    ) {
      this.pendingSubscribers = [];
      pendingSubscribers.forEach(sub => {
        const thread = this.moveSubscriberToRealtime(sub);
        this.returnHistoryDataToSubscriber(sub, thread);
      });
      this.subscribeRealtimeIfNeeded();
    } else {
      this.ensureRequestedTo(range);
    }
  }

  moveSubscriberToRealtime(subscriber) {
    const thread = {
      key: subscriber.key,
      onHistoryCallback: subscriber.onHistoryCallback,
      barset: null
    };
    this.subscribers.push(thread);
    return thread;
  }

  isSymbolExpired() {
    return this.symbolInfo.expired || this.symbolInfo.expiration_date !== undefined;
  }

  subscribeRealtimeIfNeeded() {
    if (this.subscribers.length !== 0 && !this.realtimeOn && !this.isSymbolExpired()) {
      this.subscribeRealtime();
    }
  }

  subscribeRealtime() {
    if (this.symbolInfo.expired || this.realtimeOn) {
      return;
    }
    this.realtimeOn = true;
    this.datafeed.subscribeBars(this.symbolInfo, this.resolution, bar => {
      if (this.dwmAligner !== null) {
        bar.time = this.dwmAligner.timeToSessionStart(bar.time);
      }
      this.putToCacheNewBar(bar);
      this.subscribers.forEach(sub => {
        const barset = sub.barset;
        if (barset === null) {
          throw new Error('subscriber.barset is null');
        }
        barset.add(bar);
        sub.onHistoryCallback(barset);
      });
    }, `${this.symbolInfo.name}|${this.resolution}`, () => {
      this.unsubscribeRealtime();
      const leftDate = this.leftDate;
      this.purgeCache();
      if (leftDate !== null && requestOnlyVisibleRangeOnResetEnabled()) {
        this.ensureRequestedTo({ to: leftDate, countBack: 0 });
      }
    });
    this.logMessage('Subscribed to realtime');
  }

  unsubscribeRealtime() {
    if (!this.isSymbolExpired() && this.realtimeOn) {
      this.datafeed.unsubscribeBars(`${this.symbolInfo.name}|${this.resolution}`);
      this.logMessage('Unsubscribed from realtime');
      this.realtimeOn = false;
    }
  }

  returnHistoryDataToSubscriber(subscriber, thread) {
    const range = this.normalizeRange(subscriber.range);
    const barset = this.createBarsetForRange(range);
    if (barset.count() > 0) {
      this.logMessage(`Bars to return for request ${subscriber.key}: total ${barset.count()} bars in [${toISOString(barset.bars[0].time)} ... ${toISOString(barset.bars[barset.count() - 1].time)}]`);
    } else {
      this.logMessage(`Request ${subscriber.key}. Nothing to return.`);
    }
    thread.barset = barset;
    if (this.endOfData && this.leftDate !== null && range.to <= this.leftDate) {
      barset.endOfData = true;
    }
    subscriber.onHistoryCallback(barset);
  }

  createBarsetForRange(range) {
    const to = this.dwmAligner !== null ? this.dwmAligner.timeToSessionStart(range.to) : range.to;
    const startIndex = lowerbound(this.cache.bars, to, (a, b) => a.time < b);
    const bars = this.cache.bars.slice(Math.max(0, startIndex - range.countBack));
    const barset = new BarSet(this.symbolInfo);
    barset.bars = bars;
    if (bars.length !== 0) {
      barset.firstLoadedTimeMs = this.dealignTime(bars[0].time);
    } else if (this.cache.bars.length !== 0) {
      barset.firstLoadedTimeMs = this.dealignTime(this.cache.bars[this.cache.bars.length - 1].time);
    } else {
      barset.firstLoadedTimeMs = this.dealignTime(ensureNotNull(this.leftDate));
    }
    return barset;
  }

  ensureRequestedTo(range) {
    let leftDate;
    if (this.requesting) {
      this.logMessage('Internal error: trying to call getBars while the previous request is active', true);
      return;
    }
    if (this.leftDate !== null) {
      leftDate = this.leftDate;
    } else {
      const now = this.now();
      if (this.dwmAligner === null) {
        leftDate = now;
      } else {
        let time = this.sessionSpec.alignToNearestSessionStart(new Date(now), 1).getTime();
        if (time < now) {
          const end = this.sessionSpec.alignToNearestSessionEnd(new Date(time), 1).getTime();
          time = this.sessionSpec.alignToNearestSessionStart(new Date(end + 1000), 1).getTime();
        }
        leftDate = this.dealignTime(time);
      }
    }
    const requestedRange = alignPeriodsBackForDataRequest(this.symbolInfo.session, this.symbolInfo.session_holidays, this.symbolInfo.corrections, this.interval.letter(), this.interval.multiplier(), range.countBack, Math.min(range.to, leftDate, this.nextTime || Infinity));
    if (this.leftDate !== null && this.leftDate < requestedRange) {
      return this.processPendingSubscribers();
    }
    const firstDataRequest = this.firstDataRequest;
    this.firstDataRequest = false;
    if (!this.isSymbolExpired() && !this.requesting) {
      this.requesting = true;
      this.logMessage(`Requested data from=${toISOString(requestedRange)}, to=${toISOString(range.to)}`);
      this.datafeed.getBars(
        this.symbolInfo,
        this.resolution,
        requestedRange,
        bars => {
          if (bars.length !== 0) {
            const startBarTime = bars[0].time;
            const endBarTime = bars[bars.length - 1].time;
            this.logMessage(`Received bars count=${bars.length}, from=${toISOString(startBarTime)}, to=${toISOString(endBarTime)}`);
          }
          this.receiveBars(bars, range, firstDataRequest);
        },
        error => {
          this.logMessage(`Data error=${error}`);
          this.errorMessage = error;
          this.receiveBars([], range, firstDataRequest);
        }
      );
    } else if (this.leftDate !== null) {
      this.logMessage(`Not requested data from=${toISOString(requestedRange)}, to=${toISOString(range.to)}`);
      this.processPendingSubscribers();
    }
  }

  now() {
    return new Date().getTime() + this.serverTimeOffsetGetter();
  }

  receiveBars(bars, range, firstDataRequest) {
    this.requesting = false;
    if (this.errorMessage !== null) {
      if (this.subscribers.length === 0) {
        this.resetCacheTimeout = setTimeout(() => {
          this.resetCacheTimeout = null;
          this.purgeCache();
          this.unsubscribeRealtime();
        }, this.resetCacheTimePeriod);
      }
      this.processPendingSubscribers();
      return;
    }
    if (bars.length === 0) {
      ++this.emptyResponsesCount;
      if (this.emptyResponsesCount >= 3) {
        this.endOfData = true;
      }
      if (this.leftDate !== null && requestOnlyVisibleRangeOnResetEnabled()) {
        this.ensureRequestedTo({ to: this.leftDate, countBack: 0 });
      }
      this.processPendingSubscribers();
      return;
    }
    this.emptyResponsesCount = 0;
    const barsCount = bars.length;
    const lastBarTime = bars[barsCount - 1].time;
    this.putToCacheNewBars(bars, range.to);
    if (barsCount < range.countBack) {
      this.logMessage(`Few bars received: ${barsCount} < ${range.countBack}`);
    }
    this.leftDate = this.dealignTime(lastBarTime);
    if (this.nextTime !== null && this.nextTime < this.leftDate) {
      this.leftDate = this.nextTime;
    }
    if (this.leftDate <= range.to) {
      this.endOfData = true;
    }
    const cachedData = this.createBarsetForRange(range);
    this.subscribers.forEach(sub => {
      const thread = sub;
      if (thread.barset !== null) {
        throw new Error('thread.barset is not null');
      }
      const barset = new BarSet(this.symbolInfo);
      barset.bars = cachedData.bars.slice();
      barset.firstLoadedTimeMs = cachedData.firstLoadedTimeMs;
      thread.barset = barset;
      if (barsCount !== 0) {
        const firstBarTime = bars[0].time;
        if (firstBarTime < cachedData.firstLoadedTimeMs) {
          const addCount = range.countBack - barsCount;
          if (addCount > 0) {
            this.logMessage(`Thread ${thread.key}: cached bars < requested bars (need=${range.countBack}, cached=${barsCount}), load missing bars count=${addCount}`);
            const additionalBars = this.cache.bars.slice(0, addCount);
            additionalBars.reverse();
            additionalBars.forEach(bar => {
              thread.barset.add(bar);
            });
          }
        }
        bars.forEach(bar => {
          thread.barset.add(bar);
        });
        thread.onHistoryCallback(thread.barset);
      } else {
        this.logMessage(`Thread ${thread.key}: no data for range from=${toISOString(range.to)}, to=${toISOString(this.leftDate)}`);
        thread.onHistoryCallback(thread.barset);
      }
    });
    this.processPendingSubscribers();
  }

  putToCacheNewBars(bars, to) {
    this.cache.bars = bars.concat(this.cache.bars);
    this.cache.bars.sort((a, b) => a.time - b.time);
    const lastBar = this.cache.bars[this.cache.bars.length - 1];
    if (lastBar === undefined) {
      return;
    }
    this.nextTime = lastBar.time;
    this.leftDate = this.dealignTime(this.cache.bars[0].time);
    if (this.nextTime <= to) {
      this.endOfData = true;
    }
  }

  putToCacheNewBar(bar) {
    const i = lowerbound(this.cache.bars, bar.time, (a, b) => a.time < b);
    if (i !== this.cache.bars.length && this.cache.bars[i].time === bar.time) {
      this.cache.bars[i] = bar;
    } else {
      this.cache.bars.splice(i, 0, bar);
    }
  }

  getNextSubscriptionId() {
    return this.nextSubscriptionId++;
  }
}

export default class Datafeed {
  constructor() {
    this.datafeedRequestsCachedProcessor = null;
    this.serverTimeOffset = null;
    this.serverTimeUpdateReceivedCallback = null;
    this.resetCacheTimePeriod = null;
  }

  onReady(callback) {
    setTimeout(() => callback(this.defaultConfiguration()), 0);
  }

  defaultConfiguration() {
    return {
      supports_marks: false,
      supports_search: true,
      supports_group_request: false,
      supports_time: true,
      supports_timescale_marks: false,
      supports_time_range: true,
      exchanges: [
        {
          value: '',
          name: 'All Exchanges',
          desc: ''
        }
      ],
      symbols_types: [
        {
          name: 'All types',
          value: ''
        }
      ],
      supported_resolutions: [
        '1',
        '5',
        '15',
        '30',
        '60',
        '1D',
        '1W'
      ]
    };
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    setTimeout(() => {
      onSymbolResolvedCallback({
        name: symbolName,
        description: symbolName,
        session: '24x7',
        timezone: 'Etc/UTC',
        ticker: symbolName,
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        intraday_multipliers: ['1', '5', '15', '30', '60'],
        supported_resolution: ['1', '5', '15', '30', '60', '1D', '1W'],
        volume_precision: 0,
        data_status: 'streaming'
      });
    }, 0);
  }

  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
    this.ensureDatafeedRequestsCachedProcessor().subscribe(
      symbolInfo,
      resolution,
      rangeStartDate,
      rangeEndDate,
      onDataCallback,
      onErrorCallback
    );
  }

  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    this.ensureDatafeedRequestsCachedProcessor().subscribeRealtimeData(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback
    );
  }

  unsubscribeBars(subscriberUID) {
    this.ensureDatafeedRequestsCachedProcessor().unsubscribeRealtimeData(subscriberUID);
  }

  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    setTimeout(() => {
      onResultReadyCallback([
        {
          symbol: 'AAPL',
          full_name: 'AAPL',
          description: 'Apple Inc.',
          exchange: 'NASDAQ',
          ticker: 'AAPL',
          type: 'stock'
        },
        {
          symbol: 'MSFT',
          full_name: 'MSFT',
          description: 'Microsoft Corporation',
          exchange: 'NASDAQ',
          ticker: 'MSFT',
          type: 'stock'
        },
        {
          symbol: 'GOOGL',
          full_name: 'GOOGL',
          description: 'Alphabet Inc. (Google)',
          exchange: 'NASDAQ',
          ticker: 'GOOGL',
          type: 'stock'
        }
      ]);
    }, 0);
  }

  getServerTime(callback) {
    if (this.serverTimeUpdateReceivedCallback) {
      this.serverTimeUpdateReceivedCallback.push(callback);
      return;
    }
    this.serverTimeUpdateReceivedCallback = [callback];
    setTimeout(() => {
      const updateTime = () => {
        const now = new Date();
        const nowLocal = new Date(now.getTime() - this.serverTimeOffset);
        this.serverTimeUpdateReceivedCallback.forEach(cb => cb(nowLocal.getTime()));
        setTimeout(updateTime, 60000 - (nowLocal.getTime() % 60000) + 1000);
      };
      updateTime();
    }, 0);
  }

  ensureDatafeedRequestsCachedProcessor() {
    if (this.datafeedRequestsCachedProcessor === null) {
      this.datafeedRequestsCachedProcessor = new DatafeedRequestsCachedProcessor(
        this,
        () => this.serverTimeOffset,
        this.resetCacheTimePeriod
      );
    }
    return this.datafeedRequestsCachedProcessor;
  }
}

function alignPeriodsBackForDataRequest(session, sessionHolidays, sessionCorrections, intervalLetter, intervalValue, countBack, to) {
  if (countBack === 0) {
    return to;
  }
  const now = to;
  let time = now;
  let dayOrIntervalIndex = intervalValue;
  while (true) {
    const nextTime = time - 1000 * session.intervalBack(intervalLetter, dayOrIntervalIndex);
    if (session.isSessionContains(time, intervalLetter, dayOrIntervalIndex, sessionHolidays, sessionCorrections)) {
      if (countBack > 0) {
        --countBack;
      } else {
        return nextTime;
      }
    }
    --dayOrIntervalIndex;
    if (dayOrIntervalIndex < 0) {
      break;
    }
    time = nextTime;
  }
  return time;
}

function isDebugModeEnabled() {
  return false;
}

function requestOnlyVisibleRangeOnResetEnabled() {
  return false;
}
