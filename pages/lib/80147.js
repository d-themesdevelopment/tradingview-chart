import { EventManager } from 'some-library';
import { assert } from 'assert-library';
import { backend } from 'backend-library';
import { ChartSaverBase } from 'chart-saver-library';
import { t } from 't-library';
import { saveChart, saveScript } from 'save-library';

function setContent(chart, content) {
  chart.content = JSON.stringify(content);
}

export class ChartSaver extends ChartSaverBase {
  constructor(options) {
    super(options);
    this._chartAboutToBeSavedEvent = new EventManager();
    this._chartSavedEvent = new EventManager();
    this._chartSizeLimitExceededEvent = new EventManager();
  }

  chartSizeLimitExceeded() {
    return this._chartSizeLimitExceededEvent;
  }

  chartAboutToBeSaved() {
    return this._chartAboutToBeSavedEvent;
  }

  chartSaved() {
    return this._chartSavedEvent;
  }

  saveToJSON() {
    const commonSavingInfo = this._getCommonSavingInfo(false);
    setContent(commonSavingInfo, this._getChartWidgetCollectionState(false, true));
    return commonSavingInfo;
  }

  _getChartWidgetCollectionState(wholeCollection, includeInvisible, includeNotActive, includeDataSources, includeLayouts) {
    if (!wholeCollection) {
      includeInvisible = true;
      includeDataSources = false;
    }
    if (includeDataSources) {
      return this._chartWidgetCollection.state(wholeCollection, includeInvisible, includeNotActive, includeLayouts);
    } else {
      return this._chartWidgetCollection.activeChartWidget.value().state(wholeCollection, includeInvisible, includeNotActive, includeLayouts);
    }
  }

  publishChart(options) {}

  publishScript(options, callback, context) {}

  onPublish(callback, context) {}

  _saveChartImpl(chartInfo, chartWidget, successCallback, errorCallback, onSavingCallback) {
    const onSuccess = function(token) {
      if (!chartWidget.id.value()) {
        chartWidget.id.setValue(token);
        chartWidget.uid.setValue(token);
      }
      if (typeof successCallback === 'function') {
        successCallback(chartWidget, chartInfo);
      }
    };
    if (!chartInfo.name) {
      console.warn('Saving chart with empty name is not allowed');
      return errorCallback();
    }
    backend.saveChart(chartInfo.name, chartInfo.short_name, chartInfo.resolution, chartInfo, chartWidget)
      .then(onSuccess.bind(this))
      .catch(errorCallback.bind(this));
  }

  saveChartSilently(callback, errorCallback, options) {
    options = options || {};
    const getSavingInfo = function(wholeCollection) {
      const state = this._getChartWidgetCollectionState(false, undefined, undefined, undefined, wholeCollection);
      const savingInfo = this._getCommonSavingInfo(false, wholeCollection);
      setContent(savingInfo, state);
      if (options.chartName) {
        savingInfo.name = options.chartName;
      }
      if (!savingInfo.name || savingInfo.name.length === 0) {
        if (options.defaultChartName) {
          savingInfo.name = options.defaultChartName;
        }
      }
      if (options.autoSave) {
        savingInfo.autoSave = true;
      }
      return savingInfo;
    }.bind(this);

    this._isSaveInProcess = true;
    this._chartAboutToBeSavedEvent.fire();
    this._saveChart(getSavingInfo, function(widget, chartInfo) {
      assert(!this._chartWidgetCollection.readOnly(), 'Trying to save layout in read-only mode');
      if (chartInfo) {
        this._chartWidgetCollection.metaInfo.name.setValue(chartInfo.name);
      }
      this._prevChartState = chartInfo;
      this._chartSavedEvent.fire(true);
      this._isSaveInProcess = false;
      if (callback) {
        callback({
          uid: widget.uid.value(),
          data: chartInfo
        });
      }
      if (this._prevChartState) {
        delete this._prevChartState.savingToken;
      }
    }.bind(this), function() {
      this._chartSavedEvent.fire(false);
      this._isSaveInProcess = false;
      if (errorCallback) {
        errorCallback(...arguments);
      }
    }.bind(this), options);
  }

  isSaveInProcess() {
    return this._isSaveInProcess;
  }
}