

import { Std, assert } from 'some-library'; // Replace 'some-library' with the actual library you're using

const anchoredVWAPStudyItem = {
  name: 'Anchored VWAP',
  metainfo: {
    _metainfoVersion: 51,
    description: 'Anchored VWAP',
    shortDescription: 'Anchored VWAP',
    format: {
      type: 'inherit',
    },
    id: 'AnchoredVWAP@tv-basicstudies-1',
    is_hidden_study: true,
    is_price_study: true,
    defaults: {
      inputs: {
        start_time: 0,
        source: 'hlc3',
      },
      styles: {
        VWAP: {
          color: '#1e88e5',
          linestyle: 0,
          linewidth: 1,
          plottype: 0,
          trackPrice: false,
          transparency: 0,
          visible: true,
          display: 15,
        },
      },
    },
    inputs: [
      {
        defval: 0,
        id: 'start_time',
        isHidden: true,
        max: 253370764800,
        min: -253370764800,
        name: 'Start time',
        type: 'time',
      },
      {
        defval: 'hlc3',
        id: 'source',
        name: 'Source',
        options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
        type: 'source',
      },
    ],
    plots: [
      {
        id: 'VWAP',
        type: 'line',
      },
    ],
    styles: {
      VWAP: {
        histogramBase: 0,
        title: 'VWAP',
      },
    },
  },
  constructor: class {
    constructor() {
      this._isNewSession = null;
      this._firstBarTime = 0;
    }
    init(context, inputCallback) {
      this._firstBarTime = inputCallback(0);
      this._isNewSession = null;
    }
    main(context, inputCallback, priceCallback) {
      if (typeof priceCallback === 'undefined') {
        return [NaN];
      }
      assert(context.symbol.time === priceCallback.time);

      const currentTime = priceCallback.time;
      if (currentTime && currentTime < this._firstBarTime) {
        return [NaN];
      }

      const volume = Std.volume(context);
      const source = Std[inputCallback(1)](context);
      const sum = context.new_unlimited_var();
      const sumVolume = context.new_unlimited_var();
      const barTime = context.symbol.time;

      if (barTime !== null) {
        if (this._isNewSession === null) {
          this._isNewSession = Std.createNewSessionCheck(context);
        }

        if (this._isNewSession(barTime)) {
          this._resetHist(sum);
          this._resetHist(sumVolume);
        }
      }

      sum.set(Std.nz(sum.get()) + source * volume);
      sumVolume.set(Std.nz(sumVolume.get()) + volume);

      return [sum.get() / sumVolume.get()];
    }
    _resetHist(hist) {
      hist.hist = null;
      if (typeof hist.add_hist !== 'undefined') {
        hist.add_hist.call(hist);
      }
    }
  },
};

export default anchoredVWAPStudyItem;

