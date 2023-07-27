


import { isCFDSymbol } from 'some-library'; // Replace 'some-library' with the actual library you're using
import { PriceFormatter } from 'some-library'; // Replace 'some-library' with the actual library you're using

class PipFormatter extends PriceFormatter {
  constructor(pipPriceScale, pipMinMove, symbol, currencyCode, locale) {
    if (!pipMinMove) {
      pipMinMove = 1;
    }

    if (symbol === 'forex' || isCFDSymbol(symbol, locale)) {
      super(currencyCode);
      this._isForex = true;
    } else {
      super(1);
      this._isForex = false;
    }

    this._pipPriceScale = pipPriceScale;
    this._pipMinMove = pipMinMove;
    this._pipMinMove2 = symbol;
  }

  format(price, minMove, fractionDigits) {
    let pipMinMove = this._isForex ? this._pipMinMove2 : this._pipMinMove;
    if (typeof pipMinMove === 'undefined') {
      pipMinMove = NaN;
    }

    return super.format((price * this._pipPriceScale) / pipMinMove, minMove, fractionDigits);
  }
}

export default PipFormatter;
