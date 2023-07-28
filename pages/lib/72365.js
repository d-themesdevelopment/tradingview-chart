import { ensure, ensureDefined, assert } from "./assertions";
import { numOfSubHists, maxHHistItems } from "./19762";
import { HHistDirection, HHistLocation } from "./90164";
import { GraphicsList } from "./GraphicsList";
import { GraphicsListColl } from "./GraphicsListColl";

import { EraseObj } from "./43945";

import { JStudyDataUpdate } from "./1386";

import {
  StudyGraphicsData,
  Container,
  // StudyGraphicsUpdate,
} from "./748";

import { Std } from "std-module"; // ! not correct
import { VbPCheckHaveVolumeExpr } from "./VbPCheckHaveVolumeExpr";
import { VolumeByPriceExpr } from "./89529";
import { VolumeProfileBase } from "./19762";
import { VolumeProfileOutputSeries } from "./VolumeProfileOutputSeries";

class VolumeProfileVisibleRangeStudyItem extends VolumeProfileBase {
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
    const eraseCmds = this._eraseCmds;
    this._eraseCmds = [];
    return eraseCmds;
  }

  init(e, t) {
    this._studyDataUpdate = new JStudyDataUpdate(true);
    this._hists = new GraphicsListColl();
    this._pocLines = new GraphicsList();
    this._valueAreaHists = new GraphicsListColl();

    const studyGraphicsData = new StudyGraphicsData();
    studyGraphicsData
      .getObjsContainer("hhists")
      .push(new Container("histBars2", this._hists));
    studyGraphicsData
      .getObjsContainer("hhists")
      .push(new Container("histBarsVA", this._valueAreaHists));
    studyGraphicsData
      .getObjsContainer("horizlines")
      .push(new Container("pocLines", this._pocLines));

    this._studyDataUpdate.init(studyGraphicsData);
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
    this._volumeByPriceExpr = new VolumeByPriceExpr(
      numOfSubHists(this._volume),
      e,
      this,
      this._firstBarTime,
      n,
      this._hists,
      this._pocLines,
      this._valueAreaHists,
      this._vaVolumePercent,
      o,
      maxHHistItems()
    );

    this._volumeByPriceExpr.setIdsGeneratorProxy(this);
    this._developingPocSeries = new VolumeProfileOutputSeries();
    this._developingVAHighSeries = new VolumeProfileOutputSeries();
    this._developingVALowSeries = new VolumeProfileOutputSeries();
  }

  main(e, t, i) {
    if (this._hasSecondarySymbol) {
      e.select_sym(1);
    }

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
        const studyGraphicsUpdate = this._studyDataUpdate.getUpdate();

        if (studyGraphicsUpdate.json) {
          r.data.push({
            nonseries: true,
            type: "study_graphics",
            data: studyGraphicsUpdate.json,
          });
        }

        if (studyGraphicsUpdate.jsonUpdate) {
          r.data.push({
            nonseries: true,
            type: "study_graphics",
            data: studyGraphicsUpdate.jsonUpdate,
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

const volumeProfileVisibleRangeStudyItem = {
  constructor: VolumeProfileVisibleRangeStudyItem,
  name: "Volume Profile Visible Range",
  metainfo: {
    _metainfoVersion: 51,
    id: "VbPVisible@tv-basicstudies-49",
    description: "Volume Profile Visible Range",
    shortDescription: "VPVR",
    format: {
      type: "volume",
    },
    is_price_study: true,
    linkedToSeries: true,
    palettes: {},
    inputs: [
      {
        id: "rowsLayout",
        name: "Rows Layout",
        defval: "Number Of Rows",
        options: ["Number Of Rows", "Ticks Per Row"],
        type: "text",
      },
      {
        id: "rows",
        name: "Row Size",
        defval: 24,
        max: 1000000,
        min: 1,
        type: "integer",
      },
      {
        id: "volume",
        name: "Volume",
        defval: "Up/Down",
        options: ["Up/Down", "Total", "Delta"],
        type: "text",
      },
      {
        id: "first_visible_bar_time",
        name: "First Visible Bar Time",
        defval: 0,
        isHidden: true,
        max: 253370764800,
        min: -253370764800,
        type: "time",
      },
      {
        id: "last_visible_bar_time",
        name: "Last Visible Bar Time",
        defval: 0,
        isHidden: true,
        max: 253370764800,
        min: -253370764800,
        type: "time",
      },
      {
        id: "vaVolume",
        name: "Value Area Volume",
        defval: 70,
        max: 100,
        min: 0,
        type: "integer",
      },
    ],
    plots: [
      {
        id: "developingPoc",
        type: "line",
      },
      {
        id: "developingVAHigh",
        type: "line",
      },
      {
        id: "developingVALow",
        type: "line",
      },
    ],
    graphics: {
      hhists: {
        histBars2: {
          location: HHistLocation.Relative,
          title: "Volume Profile",
          titles: ["Up Volume", "Down Volume"],
        },
        histBarsVA: {
          location: HHistLocation.Relative,
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
    },
    defaults: {
      graphics: {
        hhists: {
          histBars2: {
            colors: ["#1592e6", "#fbc123"],
            direction: HHistDirection.RightToLeft,
            percentWidth: 30,
            showValues: false,
            transparencies: [76, 76],
            valuesColor: "#424242",
            visible: true,
          },
          histBarsVA: {
            colors: ["#1592e6", "#fbc123"],
            direction: HHistDirection.RightToLeft,
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
            style: 0,
            visible: true,
            width: 2,
          },
        },
      },
      inputs: {
        first_visible_bar_time: 0,
        last_visible_bar_time: 0,
        rows: 24,
        rowsLayout: "Number Of Rows",
        vaVolume: 70,
        volume: "Up/Down",
      },
      styles: {
        developingPoc: {
          color: "#ff0000",
          linestyle: 0,
          linewidth: 1,
          plottype: 9,
          trackPrice: false,
          transparency: 0,
          display: 0,
        },
        developingVAHigh: {
          color: "#0000ff",
          linestyle: 0,
          linewidth: 1,
          plottype: 9,
          trackPrice: false,
          transparency: 0,
          display: 0,
        },
        developingVALow: {
          color: "#0000ff",
          linestyle: 0,
          linewidth: 1,
          plottype: 9,
          trackPrice: false,
          transparency: 0,
          display: 0,
        },
      },
    },
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
