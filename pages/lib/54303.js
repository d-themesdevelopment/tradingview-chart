import { isNumber } from "./1722.js";
import { CheckMobile } from "./49483.js";
import { isEnabled } from "./14483.js";
import { ensureDefined } from "utility-module";
import { createStudyPlotColorProvider } from "color-provider-module";
import {
  isPlotWithTechnicalValues,
  isOhlcPlot,
  isArrowsPlot,
} from "plot-helper-module";
import { PlotRowSearchMode } from "./86094.js";
import { LineStudyPlotStyle } from "study-plot-module";
import { resetTransparency } from "./87095.js";
import { notAvailable } from "color-module";
import { getPriceValueFormatterForSource } from "price-value-formatter-module";
import { tool } from "./88348.js";
import { isLineToolName } from "./15367.js";

const isMobile = CheckMobile.any();
const hideLastNaStudyOutput = isEnabled("hide_last_na_study_output");

class StudyValuesProvider {
  constructor(study, model) {
    this._emptyValues = [];
    this._colorProviders = new Map();
    this._study = study;
    this._model = model;
    this._studyMetaInfo = this._study.metaInfo();
    this._studyProperties = this._study.properties().childs();
    this._isFundamental = false;

    const plots = this._studyMetaInfo.plots;
    if (plots) {
      plots.forEach((plot, index) => {
        if (isPlotWithTechnicalValues(plot)) return;
        const id = plot.id;
        this._emptyValues.push({
          id: index,
          index: id,
          title: this._study.guiPlotName(id),
          value: "",
          visible: false,
        });
        const target = isOhlcPlot(plot) ? plot.target : id;
        this._colorProviders.set(
          target,
          createStudyPlotColorProvider(
            this._studyMetaInfo,
            this._study.properties(),
            target
          )
        );
      });
    }
  }

  getItems() {
    return this._emptyValues;
  }

  getPlotColor(index, values) {
    const value = values[index + 1];
    if (!isNumber(value)) return "";
    const positive = value > 0;
    let color;
    const plot = this._studyMetaInfo.plots[index];
    let id = plot.id;
    const properties = this._studyProperties;
    if (isOhlcPlot(plot)) {
      id = plot.target || id;
      color = ensureDefined(
        properties.ohlcPlots.childs()[id].childs().color
      ).value();
    } else if (isArrowsPlot(plot)) {
      const style = properties.styles.childs()[id];
      color = positive
        ? style.childs().colorup.value()
        : style.childs().colordown.value();
    } else {
      color = ensureDefined(
        properties.styles.childs()[id]?.child("color")
      ).value();
    }
    let plotColor = color;
    const colorProvider = this._colorProviders.get(id);
    const pointStyle = colorProvider && colorProvider.getPlotPointStyle(values);
    if (pointStyle) {
      if (isArrowsPlot(plot)) {
        if (positive && pointStyle.colors[5] !== undefined) {
          plotColor = pointStyle.colors[5];
        } else if (!positive && pointStyle.colors[6] !== undefined) {
          plotColor = pointStyle.colors[6];
        }
      } else if (pointStyle.colors[0] !== undefined) {
        plotColor = pointStyle.colors[0];
      }
    }
    if (plotColor === "transparent") {
      plotColor = color;
    }
    return resetTransparency(plotColor);
  }

  getValues(index) {
    const clonedValues = this._emptyValues.map((item) => ({ ...item }));
    let lastValueIndex = null;
    const lastIndex = this._study.data().lastIndex();
    const properties = this._studyProperties;

    if (lastIndex !== null) {
      for (const item of clonedValues) {
        if (properties.styles.childs()[item.id]?.childs().display.value() === 0)
          continue;
        const nearestIndex = this._study.nearestIndex(
          lastIndex,
          PlotRowSearchMode.NearestLeft,
          item.index + 1
        );
        if (nearestIndex === undefined) continue;
        const sourceIndex = nearestIndex + this._study.offset(item.id);
        lastValueIndex =
          lastValueIndex !== null
            ? Math.max(sourceIndex, lastValueIndex)
            : sourceIndex;
      }
    }

    const hideValues = this._hideValues();
    const naValue = hideValues ? notAvailable : "";
    for (const item of clonedValues) {
      item.value = naValue;
    }
    if (hideValues) return clonedValues;
    if (hideLastNaStudyOutput && clonedValues.length) {
      clonedValues[clonedValues.length - 1].value = "";
    }

    const priceScale = this._study.priceScale();
    if (
      !this._study.isVisible() ||
      index === null ||
      priceScale === null ||
      priceScale.isEmpty() ||
      this._model.timeScale().isEmpty()
    ) {
      return clonedValues;
    }

    const valueFormatter = getPriceValueFormatterForSource(this._study);
    const S = {};

    for (const item of clonedValues) {
      const plotId = item.id;
      const style = ensureDefined(properties.styles.childs()[plotId]);
      const display = style.childs().display.value();
      if (((item.visible = display !== 0), !item.visible)) continue;

      const plotType = style.hasChild("plottype")
        ? style.child("plottype")?.value()
        : null;
      const isStepLine =
        this._isFundamental &&
        (plotType === LineStudyPlotStyle.StepLine ||
          plotType === LineStudyPlotStyle.StepLineWithDiamonds);
      const plotIndex = item.index;
      const sourceIndex = index - this._study.offset(plotId);
      const searchMode =
        isStepLine || (lastIndex !== null && sourceIndex > lastIndex)
          ? PlotRowSearchMode.NearestLeft
          : PlotRowSearchMode.Exact;
      const searchResult = this._study.nearestIndex(sourceIndex, searchMode);

      if (searchResult === undefined) continue;
      let minBarIndex = S[plotId];
      if (minBarIndex === undefined) {
        minBarIndex = this._study.getMinFirstBarIndexForPlot(plotId);
        if (Number.isFinite(minBarIndex)) {
          S[plotId] = minBarIndex;
        }
      }
      if (minBarIndex > searchResult) continue;

      const lastBar = this._study.data().last();
      const valueAtSearchResult =
        this._study.data().valueAt(searchResult) ||
        (lastBar !== null ? lastBar.value : null);
      if (valueAtSearchResult === null) continue;

      const currentValue = valueAtSearchResult[plotIndex + 1];
      if (isNumber(currentValue)) {
        item.value = valueFormatter(currentValue);
        item.color = resetTransparency(
          this.getPlotColor(plotIndex, valueAtSearchResult)
        );
      }
    }

    return clonedValues;
  }

  _hideValues() {
    return (
      isMobile &&
      (this._model.crossHairSource().pane === null ||
        isLineToolName(tool.value()) ||
        this._model.lineBeingEdited() !== null)
    );
  }
}

export { StudyValuesProvider };
