import { deepExtend } from "./30888";
import { QuoteSession } from "./QuoteSession";
import { default as formatNumber } from "priceFormatter"; // ! not correct
import { uniq } from "./uniq";

import { QUOTE_FIELDS_CACHE, QUOTE_FIELDS } from "./67545";
class QuoteMultiplexer {
  constructor(type, options) {
    this.options = Object.assign(
      {
        throttleTimeout: 125,
      },
      options
    );
    this.connected = false;
    this.symbolData = {};
    this.subscriptions = {};
    this.onConnect = new Event();
    this.onDisconnect = new Event();
    this.quoteApi = new QuoteSession(window.ChartApiInstance);
    this.type = type || "full";
    this.delayUpdateFastSymbols = debounce(
      this.updateFastSymbols.bind(this),
      250
    );
    this.throttledSymbolData = {};
    this.formatterValuesCache = {};
    this.waitingForFormatters = {};
    this.snapshotValuesCache = {};
    this.waitingForSnapshot = {};
    this.connect();
  }

  destroy() {
    this.quoteApi.destroy();
    this.quoteApi = null;
    this.connected = false;
    this.onDisconnect.fire();
  }

  connect() {
    this.quoteApi.connect(this.quoteHandler.bind(this));
  }

  quoteHandler(event) {
    const { method, params } = event;
    switch (method) {
      case "connected":
        if (!this.connected) {
          this.connected = true;
          this.onConnected();
        }
        break;
      case "quote_list_fields":
        break;
      case "quote_symbol_data":
        if (this.connected) {
          this.onSymbolData(params[0]);
        }
        break;
      case "quote_completed":
        if (this.connected) {
          this.onSymbolData({
            symbolname: params[0],
            complete: performance.now(),
            values: {},
          });
        }
        break;
      case "disconnected":
        if (this.connected) {
          this.connected = false;
          this.onDisconnect.fire();
        }
        break;
    }
  }

  onConnected() {
    this.setFields();
    const symbols = Object.keys(this.symbolData);
    if (symbols.length) {
      this.quoteApi.quoteAddSymbols(symbols);
      this.delayUpdateFastSymbols();
    }
    this.onConnect.fire();
  }

  setFields() {
    const fields = QuoteMultiplexer.prototype.typeFields[this.type];
    if (fields && fields.length) {
      this.quoteApi.quoteSetFields(fields);
    }
  }

  onSymbolData(data) {
    try {
      if (data.status) {
        QUOTE_FIELDS_CACHE.update(data, QUOTE_FIELDS, false);
      }
    } catch (error) {}

    const symbolName = data.symbolname;
    let throttledData = this.throttledSymbolData[symbolName];
    if (!throttledData) {
      throttledData = this.throttledSymbolData[symbolName] = {
        dispatch: debounce(
          this.dispatchSymbolData.bind(this),
          this.options.throttleTimeout
        ),
      };
    }

    if (throttledData.cache) {
      deepExtend(throttledData.cache, data);
    } else {
      throttledData.cache = data;
    }

    throttledData.dispatch(symbolName);
  }

  dispatchSymbolData(symbolName) {
    const symbol = this.symbolData[symbolName];
    const data = this.throttledSymbolData[symbolName].cache;
    delete this.throttledSymbolData[symbolName].cache;
    if (this.symbolData[symbolName]) {
      deepExtend(symbol, data);
      if (symbol.values) {
        this.parseUpdateMode(symbol.values);
      }
      for (const subscription in this.subscriptions) {
        const subscribers = this.subscriptions[subscription];
        if (subscribers.has(symbolName)) {
          [...subscribers.get(symbolName)].forEach((subscriber) => {
            subscriber(symbol, data);
          });
        }
      }
    }
  }

  subscribe(eventName, symbols, callback) {
    this.subscriptions[eventName] = this.subscriptions[eventName] || new Map();
    const subscribers = this.subscriptions[eventName];
    symbols = [].concat(symbols);
    const newSymbols = [];
    symbols.forEach((symbol) => {
      if (this.symbolData[symbol]) {
        if (!subscribers.has(symbol)) {
          this.symbolData[symbol].subscribers_count++;
        }
      } else {
        this.symbolData[symbol] = {
          subscribers_count: 1,
        };
        newSymbols.push(symbol);
      }
      if (!subscribers.has(symbol)) {
        subscribers.set(symbol, []);
      }
      subscribers.get(symbol).push(callback);
      subscribers.get(symbol).fast = true;
      if (this.symbolData[symbol] && this.symbolData[symbol].values) {
        callback(this.symbolData[symbol], this.symbolData[symbol]);
      }
    }, this);

    if (newSymbols.length && this.connected) {
      this.quoteApi.quoteAddSymbols(newSymbols);
      this.delayUpdateFastSymbols();
    }
  }

  unsubscribe(eventName, symbols, callback) {
    symbols = [].concat(symbols);
    const subscribers = this.subscriptions[eventName];
    const symbolsToRemove = [];
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      if (subscribers) {
        if (subscribers.has(symbol) && callback) {
          const index = subscribers.get(symbol).indexOf(callback);
          if (index >= 0) {
            subscribers.get(symbol).splice(index, 1);
          }
          if (subscribers.get(symbol).length === 0) {
            subscribers.delete(symbol);
          }
        } else {
          subscribers.delete(symbol);
        }
        if (subscribers.size === 0) {
          delete this.subscriptions[eventName];
        }
      }

      if (this.symbolData.hasOwnProperty(symbol)) {
        if (subscribers && !subscribers.has(symbol)) {
          this.symbolData[symbol].subscribers_count--;
        }
        if (this.symbolData[symbol].subscribers_count === 0) {
          delete this.symbolData[symbol];
          symbolsToRemove.push(symbol);
        }
      }
    }
    if (symbolsToRemove.length && this.connected) {
      this.quoteApi.quoteRemoveSymbols(symbolsToRemove);
      this.delayUpdateFastSymbols();
    }
  }

  setFastSymbols(eventName, symbols) {
    const subscribers = this.subscriptions[eventName];
    if (subscribers) {
      const subscribedSymbols = Array.from(subscribers.keys());
      for (let i = 0; i < subscribedSymbols.length; ++i) {
        const symbol = subscribedSymbols[i];
        subscribers.get(symbol).fast = symbols.indexOf(symbol) !== -1;
      }
    }
    this.delayUpdateFastSymbols();
  }

  updateFastSymbols() {
    if (this.connected) {
      const fastSymbols = this.getFastSymbols();
      if (fastSymbols.length === 0) {
        this.quoteApi.quoteHibernateAll();
      } else {
        this.quoteApi.quoteFastSymbols(fastSymbols);
      }
    }
  }

  getFastSymbols() {
    const fastSymbols = [];
    for (const eventName in this.subscriptions) {
      const subscribers = this.subscriptions[eventName];
      const subscribedSymbols = Array.from(subscribers.keys());
      for (let i = 0; i < subscribedSymbols.length; ++i) {
        const symbol = subscribedSymbols[i];
        if (subscribers.get(symbol).fast) {
          fastSymbols.push(symbol);
        }
      }
    }
    return uniq(fastSymbols);
  }

  formatter(symbol, options) {
    if (this.waitingForFormatters[symbol]) {
      return this.waitingForFormatters[symbol];
    }

    return new Promise((resolve, reject) => {
      if (this.formatterValuesCache[symbol]) {
        resolve(
          formatNumber(
            this.formatterValuesCache[symbol],
            options && !this.formatterValuesCache[symbol].fractional
              ? 1
              : this.formatterValuesCache[symbol].minmov
          )
        );
      } else {
        const guid = guid();
        this.subscribe(guid, [symbol], (data) => {
          if (data.status === "error") {
            this.waitingForFormatters[symbol] = null;
            reject("Quotes snapshot is not received");
          } else if (
            data.values &&
            data.values.pricescale &&
            data.values.minmov
          ) {
            this.waitingForFormatters[symbol] = null;
            this.formatterValuesCache[symbol] = data.values;
            resolve(
              formatNumber(
                data.values,
                options && !data.values.fractional ? 1 : data.values.minmov
              )
            );
            this.unsubscribe(guid, symbol);
          }
        });
      }
    });
  }

  snapshot(symbol) {
    if (this.waitingForSnapshot[symbol]) {
      return this.waitingForSnapshot[symbol];
    }

    return new Promise((resolve, reject) => {
      if (this.snapshotValuesCache[symbol]) {
        resolve(this.snapshotValuesCache[symbol]);
      } else {
        const guid = guid();
        this.subscribe(guid, [symbol], (data) => {
          if (data.status === "error") {
            this.waitingForSnapshot[symbol] = null;
            reject("Quotes snapshot is not received");
          } else if (
            data.values &&
            data.values.minmov &&
            data.values.pricescale
          ) {
            this.waitingForSnapshot[symbol] = null;
            this.snapshotValuesCache[symbol] = data.values;
            resolve(data.values);
            this.unsubscribe(guid, symbol);
          }
        });
      }
    });
  }
}

QuoteMultiplexer.prototype.typeFields = {};
QuoteMultiplexer.prototype.typeFields.simple = [
  "base-currency-logoid",
  "ch",
  "chp",
  "currency-logoid",
  "currency_code",
  "currency_id",
  "base_currency_id",
  "current_session",
  "description",
  "exchange",
  "format",
  "fractional",
  "is_tradable",
  "language",
  "local_description",
  "listed_exchange",
  "logoid",
  "lp",
  "lp_time",
  "minmov",
  "minmove2",
  "original_name",
  "pricescale",
  "pro_name",
  "short_name",
  "type",
  "typespecs",
  "update_mode",
  "volume",
  "value_unit_id",
];

QuoteMultiplexer.prototype.typeFields.simpleDetailed =
  QuoteMultiplexer.prototype.typeFields.simple.concat([
    "ask",
    "bid",
    "fundamentals",
    "high_price",
    "is_tradable",
    "low_price",
    "open_price",
    "prev_close_price",
    "rch",
    "rchp",
    "rtc",
    "rtc_time",
    "status",
    "basic_eps_net_income",
    "beta_1_year",
    "earnings_per_share_basic_ttm",
    "industry",
    "market_cap_basic",
    "price_earnings_ttm",
    "sector",
    "volume",
    "dividends_yield",
    "timezone",
  ]);

QuoteMultiplexer.prototype.typeFields.full = [];
QuoteMultiplexer.prototype.typeFields.watchlist =
  QuoteMultiplexer.prototype.typeFields.simple.concat([
    "rchp",
    "rtc",
    "country_code",
    "provider_id",
  ]);

QuoteMultiplexer.prototype.typeFields.portfolio = [
  "pro_name",
  "short_name",
  "exchange",
  "listed_exchange",
  "description",
  "sector",
  "type",
  "typespecs",
  "industry",
  "currency_code",
  "currency_id",
  "ch",
  "chp",
  "logoid",
  "currency-logoid",
  "base-currency-logoid",
  "earnings_per_share_forecast_next_fq",
  "earnings_release_next_date",
  "earnings_release_date",
  "earnings_per_share_fq",
  "lp",
  "fractional",
  "minmov",
  "minmove2",
  "pricescale",
  "volume",
  "average_volume",
  "market_cap_basic",
  "total_revenue",
  "earnings_per_share_basic_ttm",
  "price_earnings_ttm",
  "beta_1_year",
  "dps_common_stock_prim_issue_fy",
  "dividends_yield",
  "fundamental_currency_code",
  "rates_mc",
  "rates_fy",
  "rates_ttm",
  "format",
];

QuoteMultiplexer.prototype.typeFields.notes = [
  "short_name",
  "pro_name",
  "logoid",
  "currency-logoid",
  "base-currency-logoid",
  "symbol-primaryname",
  "type",
  "typespecs",
];

TradingView.QuoteMultiplexer = QuoteMultiplexer;

if (typeof module !== "undefined" && module.exports) {
  module.exports = QuoteMultiplexer;
}
