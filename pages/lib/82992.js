import { deepEquals } from 'path/to/deepEquals';
import { WatchedObject as BaseWatchedObject } from 'path/to/watchedObject';

function defaultComparator(a, b) {
  return deepEquals(a, b)[0];
}

class WatchedObject extends BaseWatchedObject {
  constructor(initialValue, comparator = defaultComparator) {
    super(initialValue);
    this._comparator = comparator;
  }

  setValue(value, silent) {
    if (!this._comparator(this.value(), value)) {
      super.setValue(value, silent);
    }
  }
}

export { WatchedObject };

import { ensureNotNull, deepEquals } from 'path/to/utils';
import { WatchedObject } from 'path/to/watchedObject';
import { getLogger } from 'path/to/logger';
import { setInterval } from 'path/to/setInterval';
import { spawn } from 'path/to/spawn';
import { Interval, normalize as normalizeInterval, isEqual as isEqualInterval } from 'path/to/interval';
import { enabled } from 'path/to/featureFlags';
import { allChartStyles, isCloseBasedSymbol, isSingleValueBasedStyle } from 'path/to/chartUtils';
import { symbolSameAsCurrent } from 'path/to/symbolUtils';
import { setMuteLinkingGroup } from 'path/to/muteLinkingGroup';
import { LineToolColorsProperty } from 'path/to/lineToolColorsProperty';
import { LineToolWidthsProperty } from 'path/to/lineToolWidthsProperty';

const logger = getLogger('Linking');

class LinkingGroup {
  constructor(groupIndex, watchedProps) {
    this.watchedSymbol = new WatchedObject();
    this.seriesShortSymbol = new WatchedObject();
    this.proSymbol = new WatchedObject();
    this.watchedInterval = new WatchedObject();
    this.watchedIntraday = new WatchedObject();
    this.watchedSeconds = new WatchedObject();
    this.watchedTicks = new WatchedObject();
    this.watchedDataFrequencyResolution = new WatchedObject();
    this.watchedRange = new WatchedObject();
    this.watchedSupportedResolutions = new WatchedObject();
    this.watchedSupportedChartStyles = new WatchedObject([]);
    this.symbolNamesList = new WatchedObject();

    this._chartWidgetCollection = null;
    this._chartWidgetBindingState = 0;
    this._activeChartWidget = null;
    this._linkingGroupCharts = null;
    this._boundChartWidget = null;
    this._watchedSymbolListenerBound = this._watchedSymbolListener.bind(this);
    this._watchedIntervalListenerBound = this._watchedIntervalListener.bind(this);
    this._muted = false;

    this.updateBoundChartWidget = () => {
      const chartWidget = this._chartToBind();
      if (chartWidget !== this._boundChartWidget) {
        if (chartWidget === null) {
          this.unbindFromChartWidget();
        } else {
          this.bindToChartWidget(chartWidget);
        }
      }
    };

    this._updateAllGroupChartWidgets = () => {
      if (this._destroySymbolIntervalPropertySubscriptions) {
        this._destroySymbolIntervalPropertySubscriptions();
      }
      const linkingGroupCharts = ensureNotNull(this._linkingGroupCharts).value();
      const symbolSubscriptions = [];
      const intervalSubscriptions = [];
      for (const chart of linkingGroupCharts) {
        const symbolWV = chart.symbolWV().spawn();
        const resolutionWV = chart.resolutionWV().spawn();
        symbolWV.subscribe(this._updateSymbolByProperty.bind(this, chart));
        resolutionWV.subscribe(this._updateIntervalByProperty.bind(this, chart));
        symbolSubscriptions.push(symbolWV);
        intervalSubscriptions.push(resolutionWV);
      }

      this._destroySymbolIntervalPropertySubscriptions = () => {
        symbolSubscriptions.forEach(sub => sub.destroy());
        intervalSubscriptions.forEach(sub => sub.destroy());
        this._destroySymbolIntervalPropertySubscriptions = undefined;
      };

      const symbolValue = this.watchedSymbol.value();
      if (linkingGroupCharts.length > 1 && this._needApplySymbol(symbolValue) && !this._muted) {
        this._setGroupSymbol(symbolValue);
      }

      const intervalValue = this.watchedInterval.value();
      if (linkingGroupCharts.length > 1 && this._needApplyInterval(intervalValue) && !this._muted) {
        this._setGroupInterval(intervalValue);
      }

      this.updateBoundChartWidget();
    };

    this._groupIndex = groupIndex;

    const subscribeProperty = (watchedObj, property) => {
      watchedObj.subscribe(value => {
        if (i() === this) {
          property.setValue(value);
        }
      }, { callWithLast: true });
    };

    subscribeProperty(this.watchedSymbol, watchedProps.watchedSymbol);
    subscribeProperty(this.seriesShortSymbol, watchedProps.seriesShortSymbol);
    subscribeProperty(this.proSymbol, watchedProps.proSymbol);
    subscribeProperty(this.watchedInterval, watchedProps.watchedInterval);
    subscribeProperty(this.watchedIntraday, watchedProps.watchedIntraday);
    subscribeProperty(this.watchedSeconds, watchedProps.watchedSeconds);
    subscribeProperty(this.watchedTicks, watchedProps.watchedTicks);
    subscribeProperty(this.watchedDataFrequencyResolution, watchedProps.watchedDataFrequencyResolution);
    subscribeProperty(this.watchedRange, watchedProps.watchedRange);
    subscribeProperty(this.watchedSupportedResolutions, watchedProps.watchedSupportedResolutions);
    subscribeProperty(this.watchedSupportedChartStyles, watchedProps.watchedSupportedChartStyles);
    subscribeProperty(this.symbolNamesList, watchedProps.symbolNamesList);
  }

  mute(value) {
    this._muted = value;
  }

  bindToChartWidgetCollection(chartWidgetCollection) {
    this.unbindFromChartWidgetCollection();
    this._chartWidgetCollection = chartWidgetCollection;
    this._activeChartWidget = chartWidgetCollection.activeChartWidget.spawn();
    this._activeChartWidget.subscribe(this.updateBoundChartWidget);
    this._linkingGroupCharts = chartWidgetCollection.linkingGroupsCharts(this._groupIndex).spawn();
    this._linkingGroupCharts.subscribe(this._updateAllGroupChartWidgets);
    this.updateBoundChartWidget();
    this._updateAllGroupChartWidgets();
  }

  unbindFromChartWidgetCollection() {
    if (this._chartWidgetCollection) {
      this.unbindFromChartWidget();
      this._chartWidgetCollection.onAboutToBeDestroyed.unsubscribeAll(this);
      this._chartWidgetCollection = null;
    }
    if (this._linkingGroupCharts) {
      this._linkingGroupCharts.destroy();
      this._linkingGroupCharts = null;
    }
    if

 (this._destroySymbolIntervalPropertySubscriptions) {
      this._destroySymbolIntervalPropertySubscriptions();
    }
    this._activeChartWidget = null;
    this._chartWidgetBindingState = 0;
  }

  bindToChartWidget(chartWidget) {
    this.unbindFromChartWidget();
    this._boundChartWidget = chartWidget;
    if (chartWidget.hasModel()) {
      this._onChartModelCreated(chartWidget.model());
    } else {
      chartWidget.modelCreated().subscribe(this, this._onChartModelCreated);
      this._chartWidgetBindingState = 1;
      const mainSeriesProperties = chartWidget.properties().childs().mainSeriesProperties.childs();
      this.watchedSymbol.setValue(mainSeriesProperties.symbol.value());
      this.watchedInterval.setValue(mainSeriesProperties.interval.value());
      this._boundChartWidget.linkingGroupIndex().subscribe(this.updateBoundChartWidget);
    }
  }

  unbindFromChartWidget() {
    const chartWidget = this._boundChartWidget;
    if (chartWidget) {
      switch (this._chartWidgetBindingState) {
        case 1:
          chartWidget.modelCreated().unsubscribe(this, this._onChartModelCreated);
          break;
        case 2:
          this.watchedSymbol.unsubscribe(this._watchedSymbolListenerBound);
          this._mainSeries().dataEvents().symbolResolved().unsubscribe(this, this._updateSeriesSymbolInfo);
          this._mainSeries().dataEvents().symbolError().unsubscribe(this, this._updateSeriesSymbolInfo);
          this.watchedInterval.unsubscribe(this._watchedIntervalListenerBound);
          delete this.watchedSymbol.hook;
          delete this.watchedSymbol.writeLock;
      }
      chartWidget.linkingGroupIndex().unsubscribe(this.updateBoundChartWidget);
      this._boundChartWidget = null;
      this._chartWidgetBindingState = 0;
    }
  }

  boundChartWidget() {
    return this._boundChartWidget;
  }

  _mainSeries() {
    if (!this._boundChartWidget) {
      throw new Error('ChartWidget is undefined');
    }
    return this._boundChartWidget.model().mainSeries();
  }

  _watchedSymbolListener(value) {
    if (this._needApplySymbol(value) && !this._muted) {
      this._setGroupSymbol(value);
    }
  }

  _updateSymbolByProperty(chart, value) {
    const symbolLock = this._symbolLock();
    if (symbolLock && this._needApplySymbol(value) && !this._muted) {
      this._setGroupSymbol(value);
    }
    if (symbolLock || chart === this._boundChartWidget) {
      this.watchedSymbol.setValue(value);
    }
  }

  _watchedIntervalListener(value) {
    const interval = normalizeInterval(value);
    if (interval && this._needApplyInterval(interval) && !this._muted) {
      this._setGroupInterval(interval);
    }
  }

  _updateIntervalByProperty(chart, value) {
    const intervalLock = this._intervalLock();
    const interval = normalizeInterval(value);
    if (intervalLock && interval && this._needApplyInterval(interval) && !this._muted) {
      this._setGroupInterval(interval);
    }
    if (intervalLock || chart === this._boundChartWidget) {
      this.watchedInterval.setValue(interval !== null ? interval : value);
    }
  }

  _sendSnowplowAnalytics() {
    if (!window.user.do_not_track) {
      throw new Error('Unsupported');
    }
  }

  _updateSeriesSymbolInfo() {
    this.seriesShortSymbol.setValue(ensureNotNull(this._boundChartWidget).getSymbol(true));
    const seriesSymbolInfo = this._mainSeries().symbolInfo();
    if (seriesSymbolInfo) {
      const proSymbol = seriesSymbolInfo.pro_name || enabled('trading_terminal') && (seriesSymbolInfo.full_name || seriesSymbolInfo.name) || '';
      this.proSymbol.setValue(proSymbol);
      if (seriesSymbolInfo.aliases) {
        this.symbolNamesList.setValue(seriesSymbolInfo.aliases);
      }
      const supportedResolutions = seriesSymbolInfo.supported_resolutions;
      if (supportedResolutions) {
        this.watchedSupportedResolutions.setValue(supportedResolutions);
      } else {
        this.watchedSupportedResolutions.setValue(undefined);
      }
      let supportedChartStyles = allChartStyles();
      if (isCloseBasedSymbol(seriesSymbolInfo)) {
        supportedChartStyles = supportedChartStyles.filter(style => isSingleValueBasedStyle(style));
      }
      this.watchedSupportedChartStyles.setValue(supportedChartStyles);
      this.watchedIntraday.setValue(!!seriesSymbolInfo.has_intraday);
      this.watchedSeconds.setValue(!!seriesSymbolInfo.has_seconds);
      this.watchedTicks.setValue(!isCloseBasedSymbol(seriesSymbolInfo) && !!seriesSymbolInfo.has_ticks);
      this.watchedRange.setValue(!isCloseBasedSymbol(seriesSymbolInfo));
      const dataFrequencyResolution = seriesSymbolInfo.data_frequency || undefined;
      this.watchedDataFrequencyResolution.setValue(dataFrequencyResolution);
    } else {
      this.watchedIntraday.deleteValue();
      this.watchedSeconds.deleteValue();
      this.watchedTicks.deleteValue();
      this.watchedRange.deleteValue();
      this.proSymbol.deleteValue();
    }
  }

  _onChartModelCreated(model) {
    if (!this._boundChartWidget) {
      throw new Error('ChartWidget is undefined');
    }
    this._chartWidgetBindingState = 2;
    this._boundChartWidget.modelCreated().unsubscribe(this, this._onChartModelCreated);
    this.watchedSymbol.setValue(this._boundChartWidget.symbolWV().value());
    this.watchedSymbol.subscribe(this._watchedSymbolListenerBound);
    const mainSeries = this._mainSeries();
    mainSeries.dataEvents().symbolResolved().subscribe(this, this._updateSeriesSymbolInfo);
    mainSeries.dataEvents().symbolError().subscribe(this, this._updateSeriesSymbolInfo);
    mainSeries.dataEvents().symbolNotPermitted().subscribe(this, this._updateSeriesSymbolInfo);
    mainSeries.dataEvents().symbolGroupNotPermitted().subscribe(this, this._updateSeriesSymbolInfo);
    this._updateSeriesSymbolInfo();
    this.watchedInterval.setValue(this._boundChartWidget.resolutionWV().value());
    this.watchedInterval.subscribe(this._watchedIntervalListenerBound);
    if (this._boundChartWidget.readOnly()) {
      this.watchedSymbol.writeLock = true;
    }
  }

  _chartToBind() {
    const chartWidgetCollection = this._chartWidgetCollection;
    return chartWidgetCollection ? chartWidgetCollection.activeChartWidget.value() : null;
  }

  _symbolLock() {
    const chartWidgetCollection = this._chartWidgetCollection;
    return !chartWidgetCollection || chartWidgetCollection.lock.symbol.value();
  }

  _intervalLock() {
    const chartWidgetCollection = this._chartWidgetCollection;
    return !chartWidgetCollection || chartWidgetCollection.lock.interval.value();
  }

  _chartsForLock(lockType) {
    const symbolLock = this._symbolLock();
    if (lockType === 0) {
      return

 symbolLock ? ensureNotNull(this._linkingGroupCharts).value() : this._boundChartWidget ? [this._boundChartWidget] : [];
    } else if (lockType === 1) {
      return symbolLock ? ensureNotNull(this._linkingGroupCharts).value() : this._boundChartWidget ? [this._boundChartWidget] : [];
    }
    return [];
  }

  _setGroupSymbol(symbol) {
    this.mute(true);
    if (this._symbolLock()) {
      ensureNotNull(this._chartWidgetCollection).setSymbol(symbol, this._groupIndex);
    } else {
      ensureNotNull(this._boundChartWidget).setSymbol(symbol);
    }
    this.mute(false);
  }

  _needApplySymbol(symbol) {
    const chartsForLock = this._chartsForLock(0);
    const matchingChart = chartsForLock.find(chart => chart.hasModel() && chart.model().mainSeries().symbolInfo() && chart.model().mainSeries().symbolSameAsCurrent(symbol));
    if (matchingChart) {
      const matchingSymbolInfo = matchingChart.model().mainSeries().symbolInfo();
      if (chartsForLock.every(chart => symbolSameAsCurrent(chart.symbolWV().value(), matchingSymbolInfo))) {
        return false;
      }
    }
    return chartsForLock.some(chart => chart.symbolWV().value() !== symbol);
  }

  _setGroupInterval(interval) {
    this.mute(true);
    if (this._intervalLock()) {
      ensureNotNull(this._chartWidgetCollection).setResolution(interval, this._groupIndex);
    } else {
      ensureNotNull(this._boundChartWidget).setResolution(interval);
    }
    this.mute(false);
  }

  _needApplyInterval(interval) {
    return this._chartsForLock(1).some(chart => !isEqualInterval(chart.resolutionWV().value(), interval));
  }
}

const linking = new class {
  constructor() {
    this._watchedSymbol = new WatchedValue();
    this._seriesShortSymbol = new WatchedValue();
    this._proSymbol = new WatchedValue();
    this._watchedInterval = new WatchedValue();
    this._watchedIntraday = new WatchedValue();
    this._watchedSeconds = new WatchedValue();
    this._watchedTicks = new WatchedValue();
    this._watchedDataFrequencyResolution = new WatchedValue();
    this._watchedRange = new WatchedValue();
    this._watchedSupportedResolutions = new WatchedValue();
    this._watchedSupportedChartStyles = new WatchedValue()([]);
    this._symbolNamesList = new WatchedValue();
    this._chartWidgetCollection = null;
    this._onSymbolLinkBound = this._onSymbolLink.bind(this);
    this._searchCharts = null;
    this._searchChartsLoadDebounced = null;
    this._selfEmit = false;
    this._preventFeedBySymbol = false;
    this._feedBySymbolDebounceCounter = 0;
    this._linkingGroups = new Map();
    this._activeLinkingGroup = new WatchedValue();
    this._activeLinkingGroupIndex = null;
    this._updateLinkingGroups = () => {
      ensureNotNull(this._chartWidgetCollection).allLinkingGroups().value().forEach(e => this._linkingGroup(e));
      this._linkingGroups.forEach(e => e.updateBoundChartWidget());
    };
    this._activeLinkingGroup.subscribe(group => {
      this._watchedSymbol.setValue(this._activeLinkingGroup.value().watchedSymbol);
      this._seriesShortSymbol.setValue(this._activeLinkingGroup.value().seriesShortSymbol);
      this._proSymbol.setValue(this._activeLinkingGroup.value().proSymbol);
      this._watchedInterval.setValue(this._activeLinkingGroup.value().watchedInterval);
      this._watchedIntraday.setValue(this._activeLinkingGroup.value().watchedIntraday);
      this._watchedSeconds.setValue(this._activeLinkingGroup.value().watchedSeconds);
      this._watchedTicks.setValue(this._activeLinkingGroup.value().watchedTicks);
      this._watchedDataFrequencyResolution.setValue(this._activeLinkingGroup.value().watchedDataFrequencyResolution);
      this._watchedRange.setValue(this._activeLinkingGroup.value().watchedRange);
      this._watchedSupportedResolutions.setValue(this._activeLinkingGroup.value().watchedSupportedResolutions);
      this._watchedSupportedChartStyles.setValue(this._activeLinkingGroup.value().watchedSupportedChartStyles);
      this._symbolNamesList.setValue(this._activeLinkingGroup.value().symbolNamesList);
    });
    if (setMuteLinkingGroup) {
      setMuteLinkingGroup((groupIndex, muted) => {
        this._linkingGroup(groupIndex).mute(muted);
      });
    }
  }

  get symbol() {
    return this._watchedSymbol;
  }

  get proSymbol() {
    return this._proSymbol;
  }

  get symbolNamesList() {
    return this._symbolNamesList;
  }

  get seriesShortSymbol() {
    return this._seriesShortSymbol.readonly();
  }

  get interval() {
    return this._watchedInterval;
  }

  get intraday() {
    return this._watchedIntraday.readonly();
  }

  get seconds() {
    return this._watchedSeconds.readonly();
  }

  get ticks() {
    return this._watchedTicks.readonly();
  }

  get range() {
    return this._watchedRange.readonly();
  }

  get supportedResolutions() {
    return this._watchedSupportedResolutions.readonly();
  }

  get supportedChartStyles() {
    return this._watchedSupportedChartStyles.readonly();
  }

  get preventFeedBySymbol() {
    return this._preventFeedBySymbol;
  }

  get dataFrequencyResolution() {
    return this._watchedDataFrequencyResolution.readonly();
  }

  activeLinkingGroup() {
    return this._activeLinkingGroup.readonly();
  }

  getChartWidget() {
    return this.activeLinkingGroup().value().boundChartWidget();
  }

  bindToChartWidgetCollection(chartWidgetCollection) {
    this.unbindFromChartWidgetCollection();
    this._chartWidgetCollection = chartWidgetCollection;
    this._chartWidgetCollection.onAboutToBeDestroyed.subscribe(this, this._unbindFromChartWidgetCollection);
    this._chartWidgetCollection.allLinkingGroups().subscribe(this._updateLinkingGroups);
    this._updateLinkingGroups();
    this._activeLinkingGroupIndex = chartWidgetCollection.activeLinkingGroup().spawn();
    this._activeLinkingGroupIndex.subscribe(groupIndex => {
      this._activeLinkingGroup.setValue(this._linkingGroup(groupIndex));
    }, {
      callWithLast: true
    });
    this._linkingGroups.forEach(group => group.bindToChartWidgetCollection(chartWidgetCollection));
  }

  bindToSearchCharts(searchCharts) {
    this.unbindFromSearchCharts();
    this._searchCharts = searchCharts;
    this._searchCharts.onSearchBySymbol.subscribe(this, this._onSearchBySymbol);
    this._searchCharts.loadingSymbol.subscribe(loading => {
      if (!loading) {
        this._feedBySymbolDebounceCounter = 0;
      }
    });
    this._watched

Symbol.subscribe(symbol => {
      if (!this._selfEmit) {
        this._preventFeedBySymbol = false;
        this._searchCharts.setSymbol(symbol);
      }
    });
  }

  unbindFromChartWidgetCollection() {
    if (this._chartWidgetCollection) {
      this._chartWidgetCollection.onAboutToBeDestroyed.unsubscribe(this, this._unbindFromChartWidgetCollection);
      this._chartWidgetCollection.allLinkingGroups().unsubscribe(this._updateLinkingGroups);
      this._chartWidgetCollection = null;
    }
    this._activeLinkingGroupIndex.destroy();
    this._activeLinkingGroupIndex = null;
    this._linkingGroups.forEach(group => group.unbindFromChartWidgetCollection());
  }

  unbindFromSearchCharts() {
    if (this._searchCharts) {
      this._searchCharts.onSearchBySymbol.unsubscribe(this, this._onSearchBySymbol);
      this._searchCharts = null;
    }
  }

  _onSymbolLink(symbol) {
    const searchCharts = ensureNotNull(this._searchCharts);
    const selfEmit = this._selfEmit;
    if (!selfEmit) {
      this._selfEmit = true;
      if (this._preventFeedBySymbol) {
        searchCharts.clearSymbol();
      } else {
        searchCharts.setSymbol(symbol);
      }
      this._selfEmit = false;
    }
  }

  _onSearchBySymbol(symbol) {
    if (this._selfEmit) {
      return;
    }
    const selfEmit = this._selfEmit;
    this._selfEmit = true;
    this._watchedSymbol.setValue(symbol);
    this._preventFeedBySymbol = false;
    this._selfEmit = selfEmit;
  }

  _unbindFromChartWidgetCollection() {
    this.unbindFromChartWidgetCollection();
  }

  _linkingGroup(index) {
    let linkingGroup = this._linkingGroups.get(index);
    if (!linkingGroup) {
      linkingGroup = new LinkingGroup(index, {
        watchedSymbol: this._watchedSymbol,
        seriesShortSymbol: this._seriesShortSymbol,
        proSymbol: this._proSymbol,
        watchedInterval: this._watchedInterval,
        watchedIntraday: this._watchedIntraday,
        watchedSeconds: this._watchedSeconds,
        watchedTicks: this._watchedTicks,
        watchedDataFrequencyResolution: this._watchedDataFrequencyResolution,
        watchedRange: this._watchedRange,
        watchedSupportedResolutions: this._watchedSupportedResolutions,
        watchedSupportedChartStyles: this._watchedSupportedChartStyles,
        symbolNamesList: this._symbolNamesList
      });
      this._linkingGroups.set(index, linkingGroup);
    }
    return linkingGroup;
  }
}();

export {
  linking
};