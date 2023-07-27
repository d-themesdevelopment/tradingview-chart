
import { getQuoteSessionInstance } from '<path_to_quoteSession_module>';
import { guid } from '<path_to_guid_module>';
import { EventBase } from '<path_to_EventBase_module>';
import { ensureDefined } from '<path_to_ensureDefined_module>';
import { DefaultProperty } from '<path_to_DefaultProperty_module>';

class QuotesProvider {
  constructor(multiplexerType = "full") {
    this._quotes = null;
    this._quoteSessionSymbol = null;
    this._quoteSessionClientId = "";
    this._pausedQuoteSessionSymbol = null;
    this._quotesUpdate = new EventBase();
    this._quoteSymbolChanged = new EventBase();
    this._multiplexerType = multiplexerType;
  }

  setQuotesSessionSymbol(symbol) {
    if (this._quoteSessionSymbol !== symbol) {
      this._pausedQuoteSessionSymbol = null;
      if (!this._quoteSessionClientId) {
        this._quoteSessionClientId = "series-" + guid();
      }
      this._unsubscribeQuoteSession();
      if (symbol) {
        this._subscribeQuoteSession(symbol);
      }
      this._quoteSymbolChanged.fire();
    }
  }

  quotesUpdate() {
    return this._quotesUpdate;
  }

  quoteSymbolChanged() {
    return this._quoteSymbolChanged;
  }

  quotes() {
    return this._quotes;
  }

  isPaused() {
    return this._pausedQuoteSessionSymbol !== null;
  }

  pause() {
    if (this._pausedQuoteSessionSymbol === null) {
      this._pausedQuoteSessionSymbol = this._quoteSessionSymbol;
      this._unsubscribeQuoteSession();
    }
  }

  resume() {
    if (this._pausedQuoteSessionSymbol !== null) {
      this._subscribeQuoteSession(this._pausedQuoteSessionSymbol);
      this._pausedQuoteSessionSymbol = null;
    }
  }

  destroy() {
    this._unsubscribeQuoteSession();
  }

  _onUpdate(data, invalidation) {
    this._quotes = data && data.values || null;
    if (invalidation && invalidation.values) {
      this._quotesUpdate.fire(data, invalidation);
    }
  }

  _subscribeQuoteSession(symbol) {
    this._quoteSessionSymbol = symbol;
    getQuoteSessionInstance(this._multiplexerType).subscribe(
      this._quoteSessionClientId,
      this._quoteSessionSymbol,
      this._onUpdate.bind(this)
    );
  }

  _unsubscribeQuoteSession() {
    if (this._quoteSessionSymbol) {
      getQuoteSessionInstance(this._multiplexerType).unsubscribe(
        this._quoteSessionClientId,
        this._quoteSessionSymbol
      );
      this._quoteSessionSymbol = null;
      this._quotes = null;
    }
  }
}

export { QuotesProvider };
