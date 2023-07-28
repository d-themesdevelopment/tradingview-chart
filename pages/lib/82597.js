import { VolumeByPriceExpr, VbPCheckHaveVolumeExpr } from "./89529";
import { VbPCheckHaveVolumeExpr } from "./VbPCheckHaveVolumeExpr";
import {
  VolumeProfileBase,
  numOfSubHists,
  maxHHistItems,
  assert,
  ensureDefined,
} from "another-library";

import {
  HHistDirection,
  Container,
  GraphicsListColl,
  GraphicsList,
  VolumeProfileOutputSeries,
} from "yet-another-library";

import { LineStyle, LineStudyPlotStyle } from "some-other-library";
import { EraseObj } from "some-more-library";

class VolumeProfileFixedRangeVbPStudyItem extends VolumeByPriceExpr {
  constructor(e, t, i, s, r, n, o, a, l, c, h, d, u) {
    super(e, t, i, n, o, a, false, l, c, () => h, d, s, r, false, u);
    this._firstBarTime = s;
    this._lastBarTime = r;
  }

  update(e) {
    this._supplyRowsLayout(this._ctx);
    if (this.timeInRequestedRange(e)) {
      super.update(e);
    }
  }

  timeInRequestedRange(e) {
    const t = this._timeScale().get(e);
    return this._firstBarTime <= t && t < this._lastBarTime;
  }
}

class VolumeProfileFixedRangeBSStudyItem extends VolumeProfileBase {
  constructor() {
    super();
    this._rowsLayout = "Number Of Rows";
    this._rowSize = 24;
    this._volume = "Up/Down";
    this._firstBarTime = 0;
    this._lastBarTime = 0;
    this._vaVolumePercent = 70;
    this._anInt = 0;
    this._eraseCmds = [];
  }

  nextGraphicsObjId() {
    return ++this._anInt;
  }

  pushEraseObjCmd(e, t) {
    this._eraseCmds.push(new EraseObj(e, t));
  }

  popEraseCmds() {
    const e = this._eraseCmds;
    this._eraseCmds = [];
    return e;
  }

  init(e, t) {
    this._studyDataUpdate = new JStudyDataUpdate(true);
    this._hists = new GraphicsListColl();
    this._boxPolygons = new GraphicsList();
    this._pocLines = new GraphicsList();
    this._valueAreaHists = new GraphicsListColl();

    const i = new StudyGraphicsData();
    i.getObjsContainer("hhists").push(new Container("histBars2", this._hists));
    i.getObjsContainer("hhists").push(
      new Container("histBarsVA", this._valueAreaHists)
    );
    i.getObjsContainer("horizlines").push(
      new Container("pocLines", this._pocLines)
    );
    i.getObjsContainer("polygons").push(
      new Container("histBoxBg", this._boxPolygons)
    );

    this._studyDataUpdate.init(i);
    this._rowsLayout = t(0);
    this._rowSize = t(1);
    this._volume = t(2);
    this._firstBarTime = t(3);
    this._lastBarTime = t(4);
    this._vaVolumePercent = t(5);

    this.verifyRowSizeInput(this._rowSize, this._rowsLayout);

    this._originalResolution = Interval.parse(
      e.symbol.interval + e.symbol.resolution
    );
    const n =
      this._lastBarTime +
      this._originalResolution.inMilliseconds(this._lastBarTime);

    if (this._firstBarTime === 0 && this._lastBarTime === 0) {
      this._basicResolution = this._originalResolution;
    } else {
      this._basicResolution = this.findBasicResolutionForFromTo(
        this._originalResolution,
        this._firstBarTime,
        n,
        ensureDefined(e.symbol.info)
      );
    }

    this._hasSecondarySymbol = !this._originalResolution.isEqualTo(
      this._basicResolution
    );

    if (this._hasSecondarySymbol) {
      e.new_sym(e.symbol.tickerid, this._basicResolution.value());
    }

    const o = this._getRowsLayout(this._rowsLayout, this._rowSize);

    this._vbPCheckHaveVolumeExpr = new VbPCheckHaveVolumeExpr(this);
    this._volumeByPriceExpr = new VolumeProfileFixedRangeVbPStudyItem(
      numOfSubHists(this._volume),
      e,
      this,
      this._firstBarTime,
      n,
      this._hists,
      this._boxPolygons,
      this._pocLines,
      this._valueAreaHists,
      this._vaVolumePercent,
      o,
      maxHHistItems(),
      this._lastBarTime
    );

    this._volumeByPriceExpr.setIdsGeneratorProxy(this);

    this._developingPocSeries = new VolumeProfileOutputSeries();
    this._developingVAHighSeries = new VolumeProfileOutputSeries();
    this._developingVALowSeries = new VolumeProfileOutputSeries();
  }

  main(e, t, i) {
    this._hasSecondarySymbol && e.select_sym(1);

    this._timeSeries = e.new_unlimited_var();
    this._openSeries = e.new_unlimited_var();
    this._highSeries = e.new_unlimited_var();
    this._lowSeries = e.new_unlimited_var();
    this._closeSeries = e.new_unlimited_var();
    this._volumeSeries = e.new_unlimited_var();

    const r = {
      type: "composite",
      data: [],
    };

    if (i && i.period === this._basicResolution.value()) {
      this._timeSeries.set(Std.time(e));
      this._openSeries.set(Std.open(e));
      this._highSeries.set(Std.high(e));
      this._lowSeries.set(Std.low(e));
      this._closeSeries.set(Std.close(e));
      this._volumeSeries.set(Std.volume(e));

      this._developingPocSeries.addHist(Std.time(e));
      this._developingVAHighSeries.addHist(Std.time(e));
      this._developingVALowSeries.addHist(Std.time(e));

      this._vbPCheckHaveVolumeExpr.update(0, e.symbol.isLastBar);
      this._volumeByPriceExpr.update(0);

      this._developingPocSeries.removeLastIfNaN();
      this._developingVAHighSeries.removeLastIfNaN();
      this._developingVALowSeries.removeLastIfNaN();

      if (e.symbol.isLastBar) {
        this._studyDataUpdate.setEraseCmds(this.popEraseCmds());
        this._studyDataUpdate.update();
        const e = this._studyDataUpdate.getUpdate();
        if (e.json) {
          r.data.push({
            nonseries: true,
            type: "study_graphics",
            data: e.json,
          });
        }
        if (e.jsonUpdate) {
          r.data.push({
            nonseries: true,
            type: "study_graphics",
            data: e.jsonUpdate,
          });
        }
      }
    }

    if (this._hasSecondarySymbol) {
      e.select_sym(0);
    }

    if (i && i.period === this._originalResolution.value()) {
      assert(e.symbol.time === i.time);
      const t = i.time;
      const n = t + this._originalResolution.inMilliseconds(t) - 1;

      if (t && t >= this._firstBarTime) {
        const e = this._developingPocSeries.getLeftOrEqual(n);
        const t = this._developingVAHighSeries.getLeftOrEqual(n);
        const i = this._developingVALowSeries.getLeftOrEqual(n);
        r.data.push([e, t, i]);
      } else {
        r.data.push([NaN, NaN, NaN]);
      }
    }

    return r;
  }

  time() {
    return this._timeSeries;
  }

  open() {
    return this._openSeries;
  }

  high() {
    return this._highSeries;
  }

  low() {
    return this._lowSeries;
  }

  close() {
    return this._closeSeries;
  }

  volume() {
    return this._volumeSeries;
  }

  developingPoc() {
    return this._developingPocSeries;
  }

  developingVAHigh() {
    return this._developingVAHighSeries;
  }

  developingVALow() {
    return this._developingVALowSeries;
  }
}

function createVolumeProfileFixedRangeVbPStudyItem(description) {
  return {
    constructor: VolumeProfileFixedRangeBSStudyItem,
    name: description,
    metainfo: {
      _metainfoVersion: 51,
      shortDescription: "VPFR",
      format: {
        type: "volume",
      },
      is_price_study: true,
      defaults: {
        graphics: {
          hhists: {
            histBars2: {
              colors: ["#1592e6", "#fbc123"],
              direction: HHistDirection.LeftToRight,
              percentWidth: 30,
              showValues: false,
              transparencies: [76, 76],
              valuesColor: "#424242",
              visible: true,
            },
            histBarsVA: {
              colors: ["#1592e6", "#fbc123"],
              direction: HHistDirection.LeftToRight,
              percentWidth: 30,
              showValues: false,
              transparencies: [30, 30],
              valuesColor: "#424242",
              visible: true,
            },
          },
          horizlines: {
            pocLines: {
              color: "#ff0000",
              style: LineStyle.Solid,
              visible: true,
              width: 2,
            },
          },
          polygons: {
            histBoxBg: {
              color: "#37a6ef",
              transparency: 94,
            },
          },
        },
        inputs: {
          first_bar_time: 0,
          last_bar_time: 0,
          rows: 24,
          rowsLayout: "Number Of Rows",
          subscribeRealtime: true,
          vaVolume: 70,
          volume: "Up/Down",
        },
        styles: {
          developingPoc: {
            color: "#ff0000",
            linestyle: LineStyle.Solid,
            linewidth: 1,
            plottype: LineStudyPlotStyle.StepLine,
            trackPrice: false,
            transparency: 0,
            display: 0,
          },
          developingVAHigh: {
            color: "#0000ff",
            linestyle: LineStyle.Solid,
            linewidth: 1,
            plottype: LineStudyPlotStyle.StepLine,
            trackPrice: false,
            transparency: 0,
            display: 0,
          },
          developingVALow: {
            color: "#0000ff",
            linestyle: LineStyle.Solid,
            linewidth: 1,
            plottype: LineStudyPlotStyle.StepLine,
            trackPrice: false,
            transparency: 0,
            display: 0,
          },
        },
      },
      graphics: {
        hhists: {
          histBars2: {
            location: HHistLocation.Absolute,
            title: "Volume Profile",
            titles: ["Up Volume", "Down Volume"],
          },
          histBarsVA: {
            location: HHistLocation.Absolute,
            title: "Value Area",
            titles: ["Value Area Up", "Value Area Down"],
          },
        },
        horizlines: {
          pocLines: {
            name: "POC",
            showPrice: true,
          },
        },
        polygons: {
          histBoxBg: {
            mouseTouchable: false,
            name: "Histogram Box",
            showBorder: false,
          },
        },
      },
      inputs: [
        {
          defval: "Number Of Rows",
          id: "rowsLayout",
          name: "Rows Layout",
          options: ["Number Of Rows", "Ticks Per Row"],
          type: "text",
        },
        {
          defval: 24,
          id: "rows",
          max: 1000000,
          min: 1,
          name: "Row Size",
          type: "integer",
        },
        {
          defval: "Up/Down",
          id: "volume",
          name: "Volume",
          options: ["Up/Down", "Total", "Delta"],
          type: "text",
        },
        {
          defval: 0,
          id: "first_bar_time",
          isHidden: true,
          max: 253370764800,
          min: -253370764800,
          name: "First Bar Time",
          type: "time",
        },
        {
          defval: 0,
          id: "last_bar_time",
          isHidden: true,
          max: 253370764800,
          min: -253370764800,
          name: "Last Bar Time",
          type: "time",
        },
        {
          defval: 70,
          id: "vaVolume",
          max: 100,
          min: 0,
          name: "Value Area Volume",
          type: "integer",
        },
        {
          defval: true,
          id: "subscribeRealtime",
          isHidden: true,
          name: "SubscribeRealtime",
          type: "bool",
        },
      ],
      plots: [
        { id: "developingPoc", type: "line" },
        { id: "developingVAHigh", type: "line" },
        { id: "developingVALow", type: "line" },
      ],
      styles: {
        developingPoc: {
          histogramBase: 0,
          title: "Developing Poc",
        },
        developingVAHigh: {
          histogramBase: 0,
          title: "Developing VA High",
        },
        developingVALow: {
          histogramBase: 0,
          title: "Developing VA Low",
        },
      },
    },
  };
}

const volumeProfileFixedRangeVbPStudyItem =
  createVolumeProfileFixedRangeVbPStudyItem("Volume Profile Fixed Range");

const volumeProfileFixedRangeBSStudyItem =
  createVolumeProfileFixedRangeVbPStudyItem("Fixed Range");

export {
  volumeProfileFixedRangeBSStudyItem,
  volumeProfileFixedRangeVbPStudyItem,
};
