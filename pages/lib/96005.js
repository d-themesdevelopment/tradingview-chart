"use strict";

export class TradingViewApiBase {
  constructor({
    chartApiInstance,
    chartWidgetCollection,
    studyMarket,
    saveChartService,
    loadChartService,
    sharingChartService = null,
    webview = null,
  }) {
    this._chartWidgetCollection = chartWidgetCollection;
    this._studyMarket = studyMarket;
    this._saveChartService = saveChartService;
    this._sharingChartService = sharingChartService;
    this._loadChartLayoutDialog = loadChartService;
    this._chartWidgets = new WeakMap();
    this._symbolSync = chartWidgetCollection.lock.symbol.spawn();
    this._intervalSync = chartWidgetCollection.lock.interval.spawn();
    this._dateRangeSync = chartWidgetCollection.lock.dateRange.spawn();
    this._crosshairSync = chartWidgetCollection.lock.crosshair.spawn();
    this._timeSync = chartWidgetCollection.lock.trackTime.spawn();
  }

  destroy() {
    this._symbolSync.destroy();
    this._intervalSync.destroy();
    this._dateRangeSync.destroy();
    this._crosshairSync.destroy();
    this._timeSync.destroy();
  }

  themes() {
    if (!this._themesApi) {
      this._themesApi = new TradingViewThemesAPI({
        chartWidgetCollection: this._chartWidgetCollection,
      });
    }
    return this._themesApi;
  }

  dialogs() {
    return {
      Indicators: this._studyMarket,
      Compare: this._chartWidgetCollection.getCompareDialogRenderer(),
      ObjectsTree: null,
      ChartProperties:
        this._chartWidgetCollection.getChartPropertiesDialogRenderer(),
      ChartLayoutSaveAs: this._saveChartService
        ? this._saveChartService.getSaveAsController()
        : null,
      ChartLayoutRename: this._saveChartService
        ? this._saveChartService.getRenameController()
        : null,
      ChartLayoutCreate: this._saveChartService
        ? this._saveChartService.getCreateController()
        : null,
      ChartLayoutLoad: this._loadChartLayoutDialog,
      Alerts: this._alertsWidgetDialog,
      Details: this._detailsDialogController,
      FinancialsCharts: null,
      Technicals: null,
      Forecast: null,
    };
  }

  webview() {
    // To be implemented
    throw new Error("Not implemented");
  }

  studyTemplatesDrawerApi() {
    // To be implemented
    throw new Error("Not implemented");
  }

  fontIconsSettingsDrawer() {
    // To be implemented
    throw new Error("Not implemented");
  }

  intervalsService() {
    // To be implemented
    throw new Error("Not implemented");
  }

  supportedChartTypes() {
    return this._chartWidgetCollection.supportedChartStyles.spawn();
  }

  setBrokerName(brokerName) {
    this._chartWidgetCollection.setBroker(brokerName);
  }

  drawOnAllChartsMode(enabled) {
    this._chartWidgetCollection.lock.drawOnAllChartsMode().setValue(enabled);
  }

  drawOnAllCharts(enabled) {
    this._chartWidgetCollection.lock.drawOnAllCharts().setValue(enabled);
  }

  getDrawOnAllChartsMode() {
    return this._chartWidgetCollection.lock.drawOnAllChartsMode().value();
  }

  disableTrackingEvents() {
    this._chartWidgetCollection.lock.disableTrackingEvents();
  }

  getSaveChartService() {
    return this._saveChartService;
  }

  symbolSync() {
    return this._symbolSync;
  }

  intervalSync() {
    return this._intervalSync;
  }

  dateRangeSync() {
    return this._dateRangeSync;
  }

  crosshairSync() {
    return this._crosshairSync;
  }

  timeSync() {
    return this._timeSync;
  }

  setSymbolSearchUI(symbolSearchUI) {
    // To be implemented
    throw new Error("Not implemented");
  }

  chart(index = 0) {
    const chartWidgets = this._chartWidgetCollection.getAll();
    if (index < 0 || index >= chartWidgets.length) {
      throw new Error(`Incorrect chart index: ${index}`);
    }
    return this._getChartWidgetApi(chartWidgets[index]);
  }

  activeChart() {
    return this._getChartWidgetApi(
      this._chartWidgetCollection.activeChartWidget.value()
    );
  }

  setActiveChart(index) {
    const chartWidgets = this._chartWidgetCollection.getAll();
    if (index >= 0 && index < chartWidgets.length) {
      const chartWidget = chartWidgets[index];
      if (
        this._chartWidgetCollection.activeChartWidget.value().inFullscreen()
      ) {
        chartWidget.requestFullscreen();
      } else {
        this._chartWidgetCollection.activeChartWidget.setValue(chartWidget);
      }
    }
  }

  activeChartIndex() {
    const activeChartWidget =
      this._chartWidgetCollection.activeChartWidget.value();
    return this._chartWidgetCollection.getAll().indexOf(activeChartWidget);
  }

  chartsCount() {
    return this._chartWidgetCollection.layouts[
      this._chartWidgetCollection.layout.value()
    ].count;
  }

  layout() {
    return this._chartWidgetCollection.layout.value();
  }

  layoutName() {
    return this._chartWidgetCollection.metaInfo.name.value();
  }

  layoutNameWatchedValue() {
    return this._chartWidgetCollection.metaInfo.name.readonly();
  }

  async layoutSettingsDrawer() {
    // To be implemented
    throw new Error("Not implemented");
  }

  setLayout(layout, options) {
    if (options && options.withUndo) {
      this._chartWidgetCollection.setChartLayoutWithUndo(layout);
    } else {
      this._chartWidgetCollection.setLayout(layout);
    }
  }

  undoRedoState() {
    return this._chartWidgetCollection.undoHistory.state();
  }

  clearUndoHistory() {
    return this._chartWidgetCollection.undoHistory.clearStack();
  }

  undo() {
    this._chartWidgetCollection.undoHistory.undo();
  }

  redo() {
    this._chartWidgetCollection.undoHistory.redo();
  }

  async selectLineTool(tool, options) {
    if (!supportedLineTools[tool]) return;
    const lineToolName = supportedLineTools[tool].name;

    if (tool === "icon") {
      const icon = options?.icon;
      if (icon !== undefined) {
        iconTool.setValue(icon);
      }
    }

    if (tool === "emoji") {
      const emoji = options?.emoji;
      if (emoji !== undefined) {
        emojiTool.setValue(emoji);
      }
    }

    if (tool === "sticker") {
      const sticker = options?.sticker;
      if (sticker !== undefined) {
        stickerTool.setValue(sticker);
      }
    }

    tool.setValue(lineToolName);
  }

  async favoriteDrawingsToolbar() {
    const { FavoriteDrawingsApi } = await import(
      /* webpackChunkName: "favorite-drawings" */ "./favorite-drawings-api"
    );
    if (!this._favoriteDrawingsToolbar) {
      this._favoriteDrawingsToolbar = new FavoriteDrawingsApi();
    }
    return this._favoriteDrawingsToolbar;
  }

  sharingChart() {
    return this._sharingChartService;
  }

  watchlist() {
    // To be implemented
    throw new Error("Not implemented");
  }

  setWatchlistApiPromise(promise) {
    // To be implemented
    throw new Error("Not implemented");
  }

  news() {
    // To be implemented
    throw new Error("Not implemented");
  }

  setNewsApiPromise(promise) {
    // To be implemented
    throw new Error("Not implemented");
  }

  widgetbar() {
    // To be implemented
    throw new Error("Not implemented");
  }

  setWidgetbarApiPromise(promise) {
    // To be implemented
    throw new Error("Not implemented");
  }

  getChartStorage() {
    return getChartStorage();
  }

  setDebugMode(enabled) {
    this._saveChartService.setEnabled("charting_library_debug_mode", enabled);
  }

  setFeatureEnabled(feature, enabled) {
    this._saveChartService.setEnabled(feature, enabled);
  }

  magnetEnabled() {
    if (!this._magnetEnabledWatchedValue) {
      this._magnetEnabledWatchedValue = new goldenLayout.util.WatchedValue(
        properties().childs().magnet.value()
      );
      this._magnetEnabledWatchedValue.subscribe((value) => {
        saveDefaultProperties(true);
        properties().childs().magnet.setValue(value);
        saveDefaultProperties(false);
      });
      properties()
        .childs()
        .magnet.subscribe(this, () => {
          this._magnetEnabledWatchedValue.setValue(
            properties().childs().magnet.value()
          );
        });
    }
    return this._magnetEnabledWatchedValue;
  }

  magnetMode() {
    if (!this._magnetModeWatchedValue) {
      this._magnetModeWatchedValue = new goldenLayout.util.WatchedValue(
        properties().childs().magnetMode.value()
      );
      this._magnetModeWatchedValue.subscribe((value) => {
        saveDefaultProperties(true);
        properties().childs().magnetMode.setValue(value);
        saveDefaultProperties(false);
      });
      properties()
        .childs()
        .magnetMode.subscribe(this, () => {
          this._magnetModeWatchedValue.setValue(
            properties().childs().magnetMode.value()
          );
        });
    }
    return this._magnetModeWatchedValue;
  }

  flushBufferedData() {
    fire();
  }

  chartWidgetCollectionState(...args) {
    return this._chartWidgetCollection.state(...args);
  }

  chartWidgetCollectionSeriesStatuses() {
    return this._chartWidgetCollection.chartSeriesStatuses();
  }

  initAllLineTools() {
    const promises = Object.keys(supportedLineTools)
      .filter((tool) => !supportedLineTools[tool])
      .map((tool) => initLineTool(tool));
    return Promise.all(promises);
  }

  watermark() {
    if (!this._watermarkApi) {
      throw new Error("Watermark API is not initialized yet.");
    }
    return this._watermarkApi;
  }

  setWatermarkApi(api) {
    this._watermarkApi = api;
  }

  setForceFullscreenMode() {
    // To be implemented
    throw new Error("Not implemented");
  }

  setMultichartMode() {
    // To be implemented
    throw new Error("Not implemented");
  }

  _getChartWidgetApi(widget) {
    let api = this._chartWidgets.get(widget);
    if (api === undefined) {
      api = new ChartWidgetApi(widget, this._activateChart.bind(null, widget));
      this._chartWidgets.set(widget, api);
    }
    return api;
  }

  _chartIndex(widget) {
    const chartWidgets = this._chartWidgetCollection.getAll();
    return chartWidgets.indexOf(widget);
  }

  _activateChart() {
    return this._chartWidgetCollection.activeChartWidget.value();
  }
}
