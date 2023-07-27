import { createDeferredPromise } from 'promise-module';
import { ContextMenuManager, showWarning, showConfirm } from 'ui-module';
import { ChartChangesWatcher, TradingViewApiBase } from 'tradingview-module';
import { getStudyInputsInfo, getStudyStylesInfo } from 'study-utils-module';

const linking = require('linking-module');
const {
  logHistory,
  loggingOn,
  loggingOff
} = require('logging-module');

class CustomTradingViewApi extends TradingViewApiBase {
  constructor(options) {
    const {
      chartWidgetCollection,
      saveChartService,
      loadChartService,
      sharingChartService,
      alertsDispatcher,
      supportTicketData,
      favoriteServices,
      chartApiInstance = null,
      studyMarket = null,
      webview
    } = options;
    super({
      chartApiInstance,
      chartWidgetCollection,
      studyMarket,
      saveChartService,
      loadChartService,
      sharingChartService,
      webview
    });
    this._chartApiInstance = chartApiInstance;
    this._loadChartService = loadChartService;
    this._alertsDispatcher = alertsDispatcher;
    this._supportTicketData = supportTicketData;
    this._favoriteServices = favoriteServices;
    this._proxyWatchListChangedDelegate = null;
    this._lockDrawingsWatchedValue = null;
    this._hideDrawingsWatchedValue = null;
    this._hideIndicatorsWatchedValue = null;
    this._replayApi = null;
    this._chartChangesWatcher = null;
    this._hasChartChangesWatchedValue = null;
    this._getDataSourceHub = () => {
      return chartWidgetCollection.activeChartWidget.value().model().model();
    };
    this._alertService = this._alertsDispatcher ? new AlertService(this._alertsDispatcher, this._getDataSourceHub) : null;
    this._activeChangedChangedDelegate = new EventEmitter();
    this._chartWidgetCollection.activeChartWidget.subscribe(() => {
      this._activeChangedChangedDelegate.fire();
    });
    this.linking = linking;
  }

  subscribe(event, handler) {
    createDeferredPromise.subscribe(event, handler);
  }

  unsubscribe(event, handler) {
    createDeferredPromise.unsubscribe(event, handler);
  }

  onContextMenu(callback) {
    createDeferredPromise.subscribe('onContextMenu', (params) => {
      params.callback(callback(params.unixtime, params.price));
    });
  }

  onGrayedObjectClicked(handler) {
    createDeferredPromise.subscribe('onGrayedObjectClicked', handler);
  }

  onActiveChartChanged() {
    return this._activeChangedChangedDelegate;
  }

  changeSymbol(symbol, interval, onDataLoadedCallback) {
    linking.interval.setValue(Interval.normalize(interval));
    linking.symbol.setValue(symbol);
    if (onDataLoadedCallback) {
      this.activeChart().onDataLoaded().subscribe(null, onDataLoadedCallback, true);
    }
  }

  viewMode() {
    throw new Error('Not implemented');
  }

  viewModeWatchedValue() {
    throw new Error('Not implemented');
  }

  getSymbolInterval(callback) {
    const result = {
      symbol: linking.symbol.value(),
      interval: linking.interval.value()
    };
    if (callback) {
      callback(result);
    }
    return result;
  }

  saveChart(callback) {
    if (this._saveChartService) {
      const json = this._saveChartService.saveToJSON();
      if (callback) {
        callback(JSON.parse(json.content));
      }
    }
  }

  loadChart(data) {
    this._chartApiInstance.disconnect();
    this._chartWidgetCollection.loadContent(data.json);
    this._chartWidgetCollection.purgeUnusedWidgets();
    if (data.extendedData) {
      this._chartWidgetCollection.metaInfo.id.setValue(data.extendedData.uid);
      this._chartWidgetCollection.metaInfo.uid.setValue(data.extendedData.uid);
      this._chartWidgetCollection.metaInfo.name.setValue(data.extendedData.name);
    }
    this._chartApiInstance.connect();
    linking.symbol.setValue(this.activeChart().symbol());
    createDeferredPromise.emit('chart_loaded');
  }

  getStudiesList() {
    return this._chartApiInstance.allStudiesMetadata()
      .filter((study) => !study.is_hidden_study)
      .map((study) => study.description);
  }

  getStudyInputs(studyDescription) {
    const studyMetaInfo = StudyMetaInfo.findStudyMetaInfoByDescription(
      this._chartApiInstance.allStudiesMetadata(),
      studyDescription
    );
    return getStudyInputsInfo(studyMetaInfo);
  }

  getStudyStyles(studyDescription) {
    const studyMetaInfo = StudyMetaInfo.findStudyMetaInfoByDescription(
      this._chartApiInstance.allStudiesMetadata(),
      studyDescription
    );
    return getStudyStylesInfo(studyMetaInfo);
  }

  getSavedCharts(callback) {
    backend.getCharts().then(callback);
  }

  loadChartFromServer(chartId) {
    backend.loadChart(chartId);
  }

  saveChartToServer(chart, name, callback) {
    if (this._saveChartService) {
      this._saveChartService.saveChartSilently(chart, name, callback);
    }
  }

  setAutosave(enabled) {
    if (this._saveChartService) {
      this._saveChartService.autoSaveEnabled().setValue(enabled);
    }
  }

  removeChartFromServer(chartId, callback) {
    backend.removeChart(chartId).then(callback);
  }

  getIntervals() {
    let intervals = [];
    if (this._chartApiInstance) {
      intervals = this._chartApiInstance.defaultResolutions();
    }
    return mergeResolutions(intervals, getCustomResolutions());
  }

  closePopupsAndDialogs() {
    ContextMenuManager.hideAll();
    createDeferredPromise.emit(CLOSE_POPUPS_AND_DIALOGS_COMMAND);
  }

  selectedLineTool() {
    const supportedLineTools = Object.keys(lineTools);
    const currentTool = lineTool.value();
    for (let i = 0; i < supportedLineTools.length; ++i) {
      if (lineTools[supportedLineTools[i]].name === currentTool) {
        return supportedLineTools[i];
      }
    }
    return '';
  }

  lockAllDrawingTools() {
    if (!this._lockDrawingsWatchedValue) {
      this._lockDrawingsWatchedValue = new WatchedValue(lockDrawings.value());
      this._lockDrawingsWatchedValue.subscribe((value) => {
        lockDrawings.value = value;
      });
      lockDrawings.subscribe(this, () => {
        this._lockDrawingsWatchedValue.value = lockDrawings.value();
      });
    }
    return this._lockDrawingsWatchedValue;
  }

  hideAllDrawingTools() {
    if (!this._hideDrawingsWatchedValue) {
      this._hideDrawingsWatchedValue = new WatchedValue(hideAllDrawings.value());
      this._hideDrawingsWatchedValue.subscribe((value) => {
        hideAllDrawings.value = value;
      });
      hideAllDrawings.subscribe(this, () => {
        this._hideDrawingsWatchedValue.value = hideAllDrawings.value();
      });
    }
    return this._hideDrawingsWatchedValue;
  }

  hideAllIndicators() {
    if (!this._hideIndicatorsWatch

edValue) {
      this._hideIndicatorsWatchedValue = new WatchedValue(hideAllIndicators.value());
      this._hideIndicatorsWatchedValue.subscribe((value) => {
        hideAllIndicators.value = value;
      });
      hideAllIndicators.subscribe(this, () => {
        this._hideIndicatorsWatchedValue.value = hideAllIndicators.value();
      });
    }
    return this._hideIndicatorsWatchedValue;
  }

  mainSeriesPriceFormatter() {
    return this._chartWidgetCollection.activeChartWidget.value().model().mainSeries().priceScale().formatter();
  }

  showNoticeDialog(options) {
    showWarning({
      title: options.title,
      text: options.body || '',
      onClose: options.callback
    });
  }

  showConfirmDialog(options) {
    if (!options.callback) {
      throw new Error('Callback must be provided');
    }
    let callback = options.callback;

    function confirmHandler(result) {
      if (callback) {
        callback(result);
        callback = null;
      }
    }
    showConfirm({
      title: options.title,
      text: options.body || '',
      onClose: function() {
        confirmHandler(false);
      },
      onConfirm: function(e) {
        confirmHandler(true);
        e.dialogClose();
      }
    });
  }

  logs() {
    return {
      getLogHistory: logHistory,
      enable: loggingOn,
      disable: loggingOff
    };
  }

  showLoadChartDialog() {
    const loadChartService = this._loadChartService;
    if (loadChartService) {
      loadChartService.showLoadDialog();
    }
  }

  showSaveAsChartDialog() {
    const saveChartService = this._saveChartService;
    if (saveChartService) {
      window.runOrSignIn(() => {
        saveChartService.saveChartAs();
      }, {
        source: 'Save as chart dialogue'
      });
    }
  }

  drawOnAllCharts(value) {
    return drawOnAllCharts.value = value;
  }

  trading() {
    throw new Error('Not implemented');
  }

  waitTrading() {
    throw new Error('Not implemented');
  }

  symbolSearch() {
    throw new Error('Not implemented');
  }

  saveChartOrShowTitleDialog(value, callback, options) {
    throw new Error('Not implemented');
  }

  showRenameChartDialog() {
    throw new Error('Not implemented');
  }

  setUserInfo(data) {
    throw new Error('Not implemented');
  }

  connect() {
    throw new Error('Not implemented');
  }

  disconnect() {
    throw new Error('Not implemented');
  }

  loginRequired() {
    throw new Error('Not implemented');
  }

  onConnectionStatusChanged(handler) {
    throw new Error('Not implemented');
  }

  isConnected() {
    throw new Error('Not implemented');
  }

  showCreateAlertDialog() {
    throw new Error('Not implemented');
  }

  alertService() {
    throw new Error('Not implemented');
  }

  publishChart(data) {
    throw new Error('Not implemented');
  }

  setPublishChartOptions(options) {
    throw new Error('Not implemented');
  }

  showSupportDialog() {
    throw new Error('Not implemented');
  }

  openMobileChartPicker() {
    throw new Error('Not implemented');
  }

  closeMobileChartPicker() {
    throw new Error('Not implemented');
  }

  replayApi() {
    throw new Error('Not implemented');
  }

  takeScreenshot() {
    return this._chartWidgetCollection.takeScreenshot();
  }

  setIntervalLinkingEnabled(enabled) {
    this._chartWidgetCollection.lock.interval.setValue(enabled);
  }

  setTimeFrame(timeframe) {
    this._chartWidgetCollection.setTimeFrame(timeframe);
  }

  startFullscreen() {
    return this._chartWidgetCollection.startFullscreen();
  }

  exitFullscreen() {
    return this._chartWidgetCollection.exitFullscreen();
  }

  takeClientScreenshot(options) {
    return this._chartWidgetCollection.clientSnapshot(options);
  }

  getFavoriteIntervalsService() {
    throw new Error('Not implemented');
  }

  getFavoriteChartStylesService() {
    throw new Error('Not implemented');
  }

  getLinetoolsFavoritesStore() {
    throw new Error('Not implemented');
  }

  supportTicketData() {
    return this._supportTicketData;
  }

  hasChartChanges() {
    if (!this._chartChangesWatcher && !this._hasChartChangesWatchedValue) {
      this._chartChangesWatcher = new ChartChangesWatcher(
        this._chartWidgetCollection,
        window.saver,
        createDeferredPromise
      );
      this._hasChartChangesWatchedValue = new WatchedValue(this._chartChangesWatcher.hasChanges());
      this._chartChangesWatcher.getOnChange().subscribe(this, () => {
        this._hasChartChangesWatchedValue.value = this._chartChangesWatcher.hasChanges();
      });
    }
    return this._hasChartChangesWatchedValue;
  }

  createGoProDialog(options) {
    throw new Error('Not implemented');
  }

  onGoProDialog(event, handler) {
    throw new Error('Not implemented');
  }
}

module.exports = CustomTradingViewApi;