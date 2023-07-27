



const SERIES_STATUS_TEXT = {
    0: "connecting",
    1: "loading",
    2: "loading",
    3: "realtime",
    4: "invalid",
    5: "snapshot",
    6: "endofday",
    7: "pulse",
    8: "delayed",
    9: "delayed_streaming",
    10: "no_bars",
    11: "replay",
    12: "error"
  };
  
  const STYLE_NAMES = {
    0: "bar",
    1: "candle",
    9: "hollowCandle",
    2: "line",
    14: "lineWithMarkers",
    15: "stepline",
    3: "area",
    16: "hlcArea",
    4: "renko",
    7: "pb",
    5: "kagi",
    6: "pnf",
    8: "heikenAshi",
    10: "baseline",
    11: "range",
    12: "hilo",
    13: "column"
  };
  
  const SYMBOL_STRING_DATA = {
    4: {
      type: "BarSetRenko@tv-prostudies",
      basicStudyVersion: 64
    },
    7: {
      type: "BarSetPriceBreak@tv-prostudies",
      basicStudyVersion: 34
    },
    5: {
      type: "BarSetKagi@tv-prostudies",
      basicStudyVersion: 34
    },
    6: {
      type: "BarSetPnF@tv-prostudies",
      basicStudyVersion: 34
    },
    8: {
      type: "BarSetHeikenAshi@tv-basicstudies",
      basicStudyVersion: 60
    },
    11: {
      type: "BarSetRange@tv-basicstudies",
      basicStudyVersion: 72
    }
  };
  
  const STYLES = {
    STYLE_BARS: 0,
    STYLE_CANDLES: 1,
    STYLE_LINE: 2,
    STYLE_AREA: 3,
    STYLE_RENKO: 4,
    STYLE_KAGI: 5,
    STYLE_PNF: 6,
    STYLE_PB: 7,
    STYLE_HEIKEN_ASHI: 8,
    STYLE_HOLLOW_CANDLES: 9,
    STYLE_BASELINE: 10,
    STYLE_RANGE: 11,
    STYLE_HILO: 12,
    STYLE_COLUMNS: 13,
    STYLE_LINE_WITH_MARKERS: 14,
    STYLE_STEPLINE: 15,
    STYLE_HLC_AREA: 16
  };
  
  const STATUS = {
    STATUS_OFFLINE: 0,
    STATUS_RESOLVING: 1,
    STATUS_LOADING: 2,
    STATUS_READY: 3,
    STATUS_INVALID_SYMBOL: 4,
    STATUS_SNAPSHOT: 5,
    STATUS_EOD: 6,
    STATUS_PULSE: 7,
    STATUS_DELAYED: 8,
    STATUS_DELAYED_STREAMING: 9,
    STATUS_NO_BARS: 10,
    STATUS_REPLAY: 11,
    STATUS_ERROR: 12
  };
