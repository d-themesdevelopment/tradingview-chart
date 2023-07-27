import { isNumber, ensureDefined, ensureNotNull } from "./utils";
import { CheckMobile } from "./mobile_utils";
import {
  HHistVolumeMode,
  HHistVolumeModeProperty,
} from "./hhist_volume_mode_utils";
import { PlotRowSearchMode } from "./plot_row_search_mode_utils";
import { VolumeFormatter } from "./volume_formatter_utils";

export class HHistBasedValuesProvider {
  constructor(study, model) {
    this._emptyValues = [];
    this._study = study;
    this._model = model;

    if (this._study.metaInfo().graphics.hhists !== undefined) {
      this._emptyValues.push(createEmptyValue(0));
      this._emptyValues.push(createEmptyValue(1));
      this._emptyValues.push(createEmptyValue(2));
    }
  }

  getItems() {
    return this._emptyValues;
  }

  getValues(index) {
    const clonedEmptyValues = this._emptyValues.map((value) => ({ ...value }));

    clonedEmptyValues.forEach((value) => {
      value.visible = this._study.isVisible();
      value.value = "N/A";
    });

    const volumeMode = this._study
      .properties()
      .childs()
      .inputs.childs()
      .volume.value();
    switch (volumeMode) {
      case HHistVolumeMode.UpDown:
        clonedEmptyValues[0].title = "Up";
        clonedEmptyValues[1].title = "Down";
        clonedEmptyValues[2].title = "Total";
        break;
      case HHistVolumeMode.Total:
        clonedEmptyValues[0].title = "Total";
        clonedEmptyValues[1].visible = false;
        clonedEmptyValues[2].visible = false;
        break;
      case HHistVolumeMode.Delta:
        clonedEmptyValues[0].title = "Delta";
        clonedEmptyValues[1].title = "Max(Up, Down)";
        clonedEmptyValues[2].title = "Total";
        break;
    }

    const priceScale = this._study.priceScale();
    const timeScale = this._model.timeScale();

    if (
      priceScale === null ||
      priceScale.isEmpty() ||
      timeScale.isEmpty() ||
      this._hideValues()
    ) {
      return clonedEmptyValues;
    }

    if (index === null || !isFinite(index)) {
      const lastData = this._study.data().last();
      if (lastData === null) {
        return clonedEmptyValues;
      }
      index = lastData.index;
    }

    const crossHairSource = this._model.crossHairSource();
    const price = crossHairSource.price;

    if (!isFinite(crossHairSource.y)) {
      index = getLastVisibleBarIndex(
        this._model.timeScale(),
        this._model.mainSeries()
      );
      if (index === null) {
        return clonedEmptyValues;
      }
    }

    const hHistsByTimePointIndex = this._study
      .graphics()
      .hhistsByTimePointIndex();
    const hHist = getHHistByIndex(
      hHistsByTimePointIndex,
      index,
      price,
      this._model.mainSeries()
    );

    if (hHist === null) {
      clonedEmptyValues.forEach((value) => {
        value.value = "0";
      });
      return clonedEmptyValues;
    }

    const graphics = this._study.metaInfo().graphics.hhists;
    if (graphics === undefined) {
      return clonedEmptyValues;
    }

    if (graphics[hHist.styleId] === undefined) {
      return clonedEmptyValues;
    }

    const styleProperties = this._study
      .properties()
      .childs()
      .graphics.childs()
      .hhists.childs()
      [hHist.styleId].childs();
    const volumeFormatter = new VolumeFormatter();
    const formatVolume = (volume) =>
      isNumber(volume) ? volumeFormatter.format(volume) : "";

    if (volumeMode !== HHistVolumeMode.Delta) {
      hHist.rate.forEach((rate, index) => {
        clonedEmptyValues[index].value = formatVolume(rate);
        clonedEmptyValues[index].color = ensureDefined(
          styleProperties.colors[index].value()
        );
      });

      if (volumeMode === HHistVolumeMode.UpDown) {
        const totalRate = hHist.rate[0] + hHist.rate[1];
        clonedEmptyValues[2].value = formatVolume(totalRate);
        clonedEmptyValues[2].color = ensureDefined(
          styleProperties.valuesColor.value()
        );
      }
    } else {
      const indexToShow = hHist.rate[0] > hHist.rate[1] ? 0 : 1;
      const color = ensureDefined(styleProperties.colors[indexToShow].value());
      const totalRate = hHist.rate[0] + hHist.rate[1];

      [
        2 * hHist.rate[indexToShow] - totalRate,
        hHist.rate[indexToShow],
        totalRate,
      ].forEach((rate, index) => {
        clonedEmptyValues[index].value = formatVolume(rate);
        clonedEmptyValues[index].color = color;
      });
    }

    return clonedEmptyValues;
  }

  _hideValues() {
    return (
      CheckMobile.any() &&
      (this._model.crossHairSource().pane === null ||
        isLineToolName(
          this._study.properties().childs().graphics.childs().tool.value()
        ) ||
        this._model.lineBeingEdited() !== null)
    );
  }
}

function createEmptyValue(index, id = "", title = "") {
  return {
    id: id,
    index: index,
    title: title,
    value: "",
    visible: false,
  };
}

function getLastVisibleBarIndex(timeScale, mainSeries) {
  const lastVisibleBar = mainSeries.visibleBarsStrictRange()?.lastBar();
  if (!lastVisibleBar) {
    return null;
  }
  const nearestLeftRow = mainSeries
    .data()
    .search(lastVisibleBar, PlotRowSearchMode.NearestLeft);
  return nearestLeftRow ? nearestLeftRow.index : null;
}

function getHHistByIndex(hHistsByTimePointIndex, index, price, mainSeries) {
  if (hHistsByTimePointIndex.size === 0) {
    return null;
  }

  let barValue = null;
  if (!price) {
    const value = ensureNotNull(mainSeries.data().valueAt(index));
    barValue = mainSeries.barFunction()(value);
  }

  const nearestLeftIndex = findNearestLeftIndex(hHistsByTimePointIndex, index);
  if (nearestLeftIndex === null) {
    return null;
  }

  const hHists = hHistsByTimePointIndex.get(nearestLeftIndex);
  if (!hHists || hHists.size === 0) {
    return null;
  }

  return findHHistForPrice(hHists, barValue);
}

function findNearestLeftIndex(hHistsByTimePointIndex, index) {
  let nearestIndex = null;
  hHistsByTimePointIndex.forEach((value, key) => {
    if (key <= index && (nearestIndex === null || key > nearestIndex)) {
      nearestIndex = key;
    }
  });
  return nearestIndex;
}

function findHHistForPrice(hHists, price) {
  let foundHHist = null;
  hHists.forEach((hHist) => {
    if (hHist.priceLow <= price && price < hHist.priceHigh) {
      foundHHist = hHist;
    }
  });
  return foundHHist;
}
