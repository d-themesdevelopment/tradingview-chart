export class SpreadRatioBase {
  init(context, inputCallback) {
    context.new_sym(inputCallback(1), Std.period(context));
    this._source = inputCallback(0);
    this._scaleFactor1 = 1;
    this._scaleFactor2 = 1;
  }

  main(context, inputCallback) {
    const currentTime = context.symbol.time;
    const currentValue = Std[this._source](context);

    context.select_sym(1);
    const referenceValue = Std[this._source](context);
    const unlimitedVar1 = context.new_unlimited_var(referenceValue);
    const unlimitedVar2 = context.new_unlimited_var(context.symbol.time);

    context.select_sym(0);
    if (isNaN(currentTime)) {
      return null;
    }

    let index = unlimitedVar2.indexOf(currentTime);
    if (index === -1 || unlimitedVar2.get(index) !== currentTime) {
      index = -1;
    }

    const referencePrice = index < 0 ? NaN : unlimitedVar1.get(index);

    return [
      this._doCalculation(
        this._scaleFactor1,
        currentValue,
        this._scaleFactor2,
        referencePrice
      ),
    ];
  }

  _doCalculation(scaleFactor1, value1, scaleFactor2, value2) {
    return (scaleFactor1 * value1) / (scaleFactor2 * value2);
  }
}

export const spreadRatioDefaults = {
  styles: {
    plot1: {
      linestyle: 0,
      linewidth: 2,
      plottype: 0,
      trackPrice: false,
      transparency: 35,
      color: "#800080",
      display: 15,
    },
  },
  precision: 2,
  inputs: {
    source: "close",
    symbol2: "",
  },
};

export const spreadRatioInputs = [
  {
    defval: "close",
    id: "source",
    name: "Source",
    options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
    type: "text",
  },
  {
    id: "symbol2",
    name: "Symbol",
    type: "symbol",
    confirm: true,
  },
];

export const spreadRatioPlots = [
  {
    id: "plot1",
    type: "line",
  },
];

const spreadRatioStyles = {
  plot1: {
    title: "Plot",
    histogramBase: 0,
  },
};
