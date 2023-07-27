import { isNumber } from "lodash";
import { t } from "i18n-library"; // !

import { PercentageFormatter } from "./PercentageFormatter";
import { calculateColor } from "./58333";
import { CheckMobile } from "some-library"; // !
import { resetTransparency } from "./87095";

import {
  PlotRowSearchMode,
  getPriceValueFormatterForSource,
  shouldBeFormattedAsPercent,
  shouldBeFormattedAsIndexedTo100,
} from "some-other-library";

const isMobile = CheckMobile.any();
const isMobileDevice = isMobile && !true;
const percentageFormatter = new PercentageFormatter();
const notAvailableText = notAvailable;
const notAvailableWithPercentageText = `${notAvailableText} (${notAvailableText}%)`;

class OverlayLegendValuesProvider {
  constructor(study, model) {
    this._study = study;
    this._model = model;
    this._emptyValues = [
      {
        title: t(null, undefined, "EmptyValue1"),
        visible: false,
        value: "",
        index: 0,
        id: "",
      },
      {
        title: t(null, undefined, "EmptyValue2"),
        visible: false,
        value: "",
        index: 1,
        id: "",
      },
      {
        title: t(null, undefined, "EmptyValue3"),
        visible: false,
        value: "",
        index: 2,
        id: "",
      },
      {
        title: t(null, undefined, "EmptyValue4"),
        visible: false,
        value: "",
        index: 3,
        id: "",
      },
      { title: "", visible: false, value: "", index: 4, id: "" },
      { title: "", visible: false, value: "", index: 5, id: "" },
      {
        title: t(null, undefined, "EmptyValue7"),
        visible: false,
        value: "",
        index: 6,
        id: "",
      },
    ];
  }

  getItems() {
    return this._emptyValues;
  }

  getValues(index) {
    const values = this._emptyValues.map((value) => ({ ...value }));
    if (this._model.timeScale().isEmpty()) {
      return values;
    }
    if (this._study.data().size() === 0) {
      return values;
    }
    const showLastPriceAndChangeOnly = this._showLastPriceAndChangeOnly();
    if (
      (isNumber(index) ||
        (showLastPriceAndChangeOnly
          ? (index = this._study.data().lastIndex())
          : ((index = this._model.crossHairSource().appliedIndex()),
            !isNumber(index) && (index = this._study.data().lastIndex()))),
      index === null || !isNumber(index))
    ) {
      return values;
    }
    const row = this._study
      .data()
      .search(index, PlotRowSearchMode.NearestLeft, 1);
    const topColor = this._model.backgroundTopColor().value();
    if (row === null) {
      return values;
    }
    const plotIndex = row.index;
    const plotValue = row.value;
    const openValue = plotValue[1];
    const highValue = plotValue[2];
    const lowValue = plotValue[3];
    const closeValue = plotValue[4];
    values[0].value = notAvailableText;
    values[1].value = notAvailableText;
    values[2].value = notAvailableText;
    values[3].value = notAvailableText;
    values[6].value = notAvailableWithPercentageText;
    for (const value of values) {
      value.visible = !showLastPriceAndChangeOnly;
    }
    const seriesValue = values[4];
    seriesValue.visible = false;
    let barChangeData = null;
    const priceValueFormatter = getPriceValueFormatterForSource(this._study);
    if (
      shouldBeFormattedAsPercent(this._study) ||
      shouldBeFormattedAsIndexedTo100(this._study)
    ) {
      values[6].value = "";
    } else if (closeValue !== undefined) {
      const studyFormatter = this._study.formatter();
      const { currentPrice, prevPrice, change } = barChangeData;
      const formattedChange = studyFormatter.formatChange
        ? studyFormatter.formatChange(currentPrice, prevPrice, true)
        : studyFormatter.format(change, true);
      values[6].value = `${formattedChange} (${percentageFormatter.format(
        barChangeData.percentChange,
        true
      )})`;
    }
    if (showLastPriceAndChangeOnly) {
      values[5].value = C === null ? notAvailableText : priceValueFormatter(C);
      values[5].visible = true;
      values[6].visible = true;
    } else {
      values[0].value = F === null ? notAvailableText : priceValueFormatter(F);
      values[1].value = V === null ? notAvailableText : priceValueFormatter(V);
      values[2].value = P === null ? notAvailableText : priceValueFormatter(P);
      values[3].value = C === null ? notAvailableText : priceValueFormatter(C);
      seriesValue.value = priceValueFormatter(
        this._study.barFunction()(plotValue)
      );
      values[5].visible = false;
    }
    let color = null;
    if (showLastPriceAndChangeOnly && !isMobileDevice) {
      const quotes = this._study.quotes();
      if (quotes !== null) {
        color =
          quotes.change !== null && quotes.change >= 0
            ? SeriesBarColorer.upColor(this._study.properties())
            : SeriesBarColorer.downColor(this._study.properties());
      }
    } else {
      const barColorer = this._study.barColorer().barStyle(plotIndex, false);
      const barBorderColor =
        barColorer.barBorderColor !== undefined
          ? barColorer.barBorderColor
          : barColorer.barColor;
      color = calculateColor(topColor, barBorderColor);
    }
    color = resetTransparency(calculateColor(topColor, color));
    for (const value of values) {
      value.color = color;
    }
    return values;
  }

  _showLastPriceAndChangeOnly() {
    return (
      isMobileDevice &&
      (this._model.crossHairSource().pane === null ||
        isLineToolName(tool.value()) ||
        this._model.lineBeingEdited() !== null)
    );
  }
}

export { OverlayLegendValuesProvider };
