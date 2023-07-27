
"use strict";

const utils = (e, t, i) => {
  i.d(t, {
    PositionAveragePriceAxisView: () => PositionAveragePriceAxisView,
  });

  const { LineToolPriceAxisView } = i(71243);

  class PositionAveragePriceAxisView extends LineToolPriceAxisView {
    _formatPrice(price, priceScale) {
      return this._source.formatter().format(price);
    }
  }

  return {
    PositionAveragePriceAxisView,
  };
};
