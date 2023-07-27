"use strict";

// import { ChartWidgetCollection } from 'chart-widget-collection';
import { changedAll } from "./ChartChangesWatcher";
import { EventDispatcher } from "another-module"; // ! not correct

class ChartSaverBase {
  constructor(chartWidgetCollection) {
    this._prevChartState = null;
    this._chartSavedDelegate = new EventDispatcher();
    this._chartWidgetCollection = chartWidgetCollection;
  }

  saveChartLineTools(chartId, callback, errorCallback, options) {
    return Promise.reject("Line tools storage is not supported");
  }

  _getCommonSavingInfo(isRealtime) {
    const chartCollection = this._chartWidgetCollection;
    const chartsSymbols = chartCollection.chartsSymbols();
    const activeChartWidget = chartCollection.activeChartWidget.value();
    const activeSymbol = chartsSymbols[activeChartWidget.id()];
    const commonInfo = {
      ...activeSymbol,
      legs: JSON.stringify(activeSymbol.legs || []),
    };

    const metaInfo = chartCollection.metaInfo;
    if (metaInfo.id.value()) {
      commonInfo.id = metaInfo.id.value();
    }
    commonInfo.name = metaInfo.name.value() || "";
    commonInfo.description = metaInfo.description.value() || "";
    commonInfo.charts_symbols = JSON.stringify(
      Object.keys(chartsSymbols).reduce((acc, key) => {
        acc[key] = { symbol: chartsSymbols[key].symbol };
        return acc;
      }, {})
    );
    commonInfo.is_realtime = isRealtime ? "0" : "1";

    return commonInfo;
  }

  async _saveLineToolsToStorage() {
    return Promise.resolve();
  }

  async _saveChart(chartStateGetter, callback, errorCallback, options) {
    const metaInfo = this._chartWidgetCollection.metaInfo;
    let changes = options.changes || changedAll;
    let shouldSaveLineTools = true;

    if (changes & 2) {
      try {
        await this._saveLineToolsToStorage();
      } catch (error) {
        changes |= 1;
        shouldSaveLineTools = false;
      }
    }

    if (changes & 1) {
      const chartState = chartStateGetter(shouldSaveLineTools);
      if (isEqual(this._prevChartState, chartState) && metaInfo.id.value()) {
        this._chartSavedDelegate.fire(true);
        return callback(metaInfo, chartState);
      }

      const saveChart = (state, info) => {
        if (shouldSaveLineTools) {
          this._chartWidgetCollection.getAll().forEach((widget) => {
            const lineToolsSynchronizer = widget.lineToolsSynchronizer();
            if (lineToolsSynchronizer) {
              lineToolsSynchronizer.markAsValidatedBecuaseOfSavingToContent(
                true
              );
            }
          });
        }
        callback(state, info);
      };

      return this._saveChartImpl(
        chartState,
        metaInfo,
        saveChart,
        errorCallback,
        options,
        chartStateGetter
      );
    }

    this._chartSavedDelegate.fire(true);
    callback(metaInfo, null);
  }
}

export { ChartSaverBase };
