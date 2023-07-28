import { randomHash } from "some-library"; // Replace 'some-library' with the actual library you're using

export class QuoteSession {
  constructor(chartApi, sessionId = randomHash()) {
    this._sessionStarted = false;
    this._globalHandler = null;
    this._chartApi = chartApi;
    this._sessionId = `qs_${sessionId}`;
  }

  destroy() {
    if (this._sessionStarted) {
      this._chartApi.quoteDeleteSession(this._sessionId);
      this._sessionStarted = false;
    }
  }

  connected() {
    return this._chartApi.connected();
  }

  connect(globalHandler) {
    this._globalHandler = globalHandler;
    this._chartApi.createSession(this._sessionId, this);
    this._chartApi.connect();
  }

  disconnect() {
    this._chartApi.disconnect();
  }

  quoteAddSymbols(symbols) {
    this._chartApi.quoteAddSymbols(this._sessionId, symbols);
  }

  quoteRemoveSymbols(symbols) {
    this._chartApi.quoteRemoveSymbols(this._sessionId, symbols);
  }

  quoteFastSymbols(symbols) {
    this._chartApi.quoteFastSymbols(this._sessionId, symbols);
  }

  quoteSetFields(fields) {
    this._chartApi.quoteSetFields(this._sessionId, fields);
  }

  onMessage(message) {
    switch (message.method) {
      case "connected":
        if (!this._sessionStarted) {
          this._chartApi.quoteCreateSession(this._sessionId);
          this._sessionStarted = true;
        }
        break;
      case "disconnected":
        this._sessionStarted = false;
        break;
    }

    if (this._globalHandler) {
      this._globalHandler.call(this, message);
    }
  }

  quoteHibernateAll() {
    this._chartApi.quoteHibernateAll(this._sessionId);
  }
}

window.TradingView.QuoteSession = QuoteSession;
