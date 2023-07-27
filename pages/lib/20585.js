import { assert } from "./assertions";
import { ChartModelBase } from "LibraryName2"; // ! not correct

import { Watermark } from "./30255";
import { InvalidationMask, InvalidationLevel } from "./InvalidationLevel";

import {
  // isLineTool,
  CheckMobile,
} from "LibraryName3";

import { globalChangeEvent, sourceChangeEvent } from "./28558";
import { MainSeriesScaleRatioProperty } from "./MainSeriesScaleRatioProperty";
import { dateFormatProperty } from "./83407";
import { timeHoursFormatProperty } from "./16164";
import { scaleRatio } from "./29541";

import {
  isStudy,
  isFundamentalStudy,
  // StudyInserter,
} from "LibraryName5"; // ! not correct

// import { AppliedTimeFrame } from 'LibraryName6';
// import { ReplayStatus } from 'LibraryName7';
// import { enabled } from 'LibraryName8';

class ChartModel extends ChartModelBase {
  constructor(
    chartWidget,
    options,
    theme,
    localization,
    timeScale,
    mainSeries,
    paneIndexPredicate,
    visibilityDelegate,
    handleScaleStateChangedCallback,
    handlePaneStateChangedCallback
  ) {
    super(
      chartWidget,
      options,
      theme,
      localization,
      timeScale,
      mainSeries,
      paneIndexPredicate,
      visibilityDelegate,
      handleScaleStateChangedCallback,
      handlePaneStateChangedCallback
    );
    this._mainSeriesScaleRatioProperty = new MainSeriesScaleRatioProperty(this);
    this.m_mainSeries
      .dataEvents()
      .completed()
      .subscribe(this, () => {
        if (this._scrollingState) {
          this.gotoTime();
        }
      });
    this.m_mainSeries.onIntervalChanged().subscribe(this, () => {
      this._recalcVRStudiesParams.oldStartVisibleIndex = NaN;
      this._recalcVRStudiesParams.oldEndVisibleIndex = NaN;
    });
    if (!this._readOnly) {
      this.m_mainSeries
        .properties()
        .addChild(
          "priceAxisProperties",
          this.m_mainSeries.m_priceScale.properties()
        );
      this._properties.paneProperties.legendProperties.showStudyTitles
        .listeners()
        .subscribe(this, (e) => {
          if (!e.value()) {
            this._properties.paneProperties.legendProperties.showStudyArguments.setValue(
              false
            );
          }
        });
    }
    this._watermarkSource = this._options.watermarkEnabled
      ? new Watermark(this, this.m_mainSeries)
      : null;
    this.hideAllDrawingsSubscription = this._chartApi
      .hideAllDrawings()
      .subscribe(this, this._onDrawingsVisibilityChanged);
    this.hideAllIndicatorsSubscription = this._chartApi
      .hideAllIndicators()
      .subscribe(this, this._onIndicatorsVisibilityChanged);
    this._properties.scalesProperties
      .listeners()
      .subscribe(this, this.fullUpdate);
    this._studyShiftColorStartOffset = undefined;
    this.handleScaleStateChangedCallback = handleScaleStateChangedCallback;
    this.handlePaneStateChangedCallback = handlePaneStateChangedCallback;
    this.handlePaneStateChangedCallback(null, {
      added: this.m_mainSeries,
    });
    this.applyPredefinedThemes();
  }

  applyPreferences(preferences) {
    for (const property in preferences) {
      if (
        this._properties[property] !== undefined &&
        property !== "m_mainSeries"
      ) {
        this._properties[property].mergeAndFire(preferences[property]);
      }
    }
    if (preferences.timeScale !== undefined) {
      this._timeScale
        .defaultRightOffset()
        .setValue(preferences.timeScale.defaultRightOffset);
      this._timeScale
        .defaultRightOffsetPercentage()
        .setValue(preferences.timeScale.defaultRightOffsetPercentage);
      this._timeScale
        .usePercentageRightOffset()
        .setValue(preferences.timeScale.usePercentageRightOffset);
    }
    this._properties.saveDefaults();
    this.m_mainSeries.applyPreferences(preferences.mainSeries);
    this.sessions().applyPreferences(preferences.sessions);
    this.recalculateAllPanes(globalChangeEvent());
    this.fullUpdate();
  }

  initConnection() {
    this._chartApi.switchTimezone(this.timezone());
  }

  updatePane(pane) {
    const invalidationMask = this._paneInvalidationMask(pane);
    this.invalidate(invalidationMask);
  }

  fullUpdate() {
    this.invalidate(InvalidationMask.full());
  }

  lightUpdate() {
    this.invalidate(InvalidationMask.light());
  }

  mainSeries() {
    return this.m_mainSeries;
  }

  timeScale() {
    return this._timeScale;
  }

  watermarkSource() {
    return this._watermarkSource;
  }

  priceScaleSlotsCount() {
    let left = 0;
    let right = 0;
    this._panes.forEach((pane) => {
      left = Math.max(pane.leftPriceScales().length, left);
      right = Math.max(pane.rightPriceScales().length, right);
    });
    const total = left + right;
    if (CheckMobile.any()) {
      const sourcePane = this.paneForSource(this.mainSeries());
      const position = sourcePane.priceScalePosition(
        this.mainSeries().priceScale()
      );
      const isRight = position === "right";
      return position === "overlay"
        ? { left: 0, right: 1, total }
        : { left: isRight ? 0 : 1, right: isRight ? 1 : 0, total };
    }
    return { left, right, total };
  }

  setPriceAutoScale(series, autoScale, percentage) {
    series.setPriceAutoScale(autoScale, percentage);
    this.invalidate(
      this._paneInvalidationMask(series, InvalidationLevel.Light)
    );
  }

  updateScales(force, reset) {
    this._undo;

    Model._chartWidget._updateScalesActions();
  }

  mainSeriesScaleRatioProperty() {
    return this._mainSeriesScaleRatioProperty;
  }

  mainSeriesScaleRatioPropertyOnChanged() {
    this._mainSeriesScaleRatioProperty
      .listeners()
      .fire(this._mainSeriesScaleRatioProperty);
  }

  mainSeriesScaleRatio() {
    return scaleRatio(this._timeScale, this.m_mainSeries.priceScale());
  }

  setMainSeriesScaleRatio(ratio) {
    const pane = this.paneForSource(this.m_mainSeries);
    pane.applyPriceScaleRatio(this.m_mainSeries.priceScale(), ratio);
  }

  destroy() {
    this.mainSeries().properties().childs().showCountdown.unsubscribeAll(this);
    this.mainSeries().onTimeFrameApplied().unsubscribeAll(this);
    this.mainSeries().onIntervalChanged().unsubscribeAll(this);
    this._appliedTimeFrame.destroy();
    this.clearIntervals();
    this._chartApi
      .hideAllDrawings()
      .unsubscribe(this, this._onDrawingsVisibilityChanged);
    this._chartApi
      .hideAllIndicators()
      .unsubscribe(this, this._onIndicatorsVisibilityChanged);
    this.resetDeferredStudies();
    this.allStudies().forEach((study) => this.removeSource(study));
    Array.from(this._customSourcesMap.keys()).forEach(
      this._removeCustomSource,
      this
    );
    assert(this._topmostCustomSources.length === 0);
    assert(this._fgCustomSources.length === 0);
    assert(this._bgCustomSources.length === 0);
    assert(this._allCustomSources.length === 0);
    assert(this._customSourcesMap.size === 0);
    for (let i = 0; i < this._panes.length; i++) {
      this._panes[i].destroy();
    }
    this._panes.length = 0;
    this._sessions = null;
    this.m_mainSeries
      .onStyleChanged()
      .unsubscribe(this._timeScale, this._timeScale.invalidateVisibleBars);
    this._timeScale
      .visibleBarsStrictRangeChanged()
      .unsubscribe(this.m_mainSeries, this.m_mainSeries.clearHighLowPriceCache);
    this._timeScale
      .visibleBarsStrictRangeChanged()
      .unsubscribe(this.m_mainSeries, this.m_mainSeries.clearAveragePriceCache);
    this._timeScale.barSpacingChanged().unsubscribeAll(this);
    this._timeScale.onScroll().unsubscribeAll(this);
    this._timeScale.destroy();
    dateFormatProperty.unsubscribe(this, this._updateDateTimeFormatter);
    timeHoursFormatProperty.unsubscribe(this, this._updateDateTimeFormatter);
    this.mainSeries()
      .properties()
      .interval.unsubscribe(this, this._updateDateTimeFormatter);
    if (this._trendLineStatsCache) {
      this._trendLineStatsCache.destroy();
    }
    if (this._fibRetracementLabelsCache) {
      this._fibRetracementLabelsCache.destroy();
    }
    this._properties.paneProperties.legendProperties.showLegend.unsubscribeAll(
      this
    );
    this._dataSourceCollectionChanged.unsubscribeAll(this);
    this.m_crossHairSource.destroy();
    super.destroy();
  }

  listUserStudies(options) {
    const studies = [];
    options = options || {};
    for (let i = 0; i < this._panes.length; i++) {
      const dataSources = this._panes[i].dataSources();
      for (let j = 0; j < dataSources.length; j++) {
        const dataSource = dataSources[j];
        if (
          isStudy(dataSource) &&
          !isFundamentalStudy(dataSource) &&
          dataSource.showInObjectTree()
        ) {
          const metaInfo = dataSource.metaInfo && dataSource.metaInfo();
          if (metaInfo) {
            const id = metaInfo.id;
            if (options.dontCountVolume && id === "Volume@tv-basicstudies")
              continue;
            if (options.dontCountCompare && id === "Compare@tv-basicstudies")
              continue;
            if (options.dontCountOverlay && id === "Overlay@tv-basicstudies")
              continue;
          }
          studies.push(metaInfo.shortDescription);
        }
      }
    }
    return studies;
  }

  restoreSource(shouldBeCreated, paneIndex, state, defaults, priceScale) {
    let pane, source;
    if (shouldBeCreated) {
      pane = this.createPane(paneIndex);
    } else {
      pane = this.panes()[paneIndex];
    }
    const isStudy = state.type.toLowerCase().startsWith("study");
    if (
      !(source = isStudy
        ? pane.restoreStudy(state)
        : pane.restoreLineTool(state))
    ) {
      return null;
    }

    let priceScaleToApply = null;

    if (priceScale) {
      priceScaleToApply = priceScale;
    } else if (source.ownerSource()) {
      priceScaleToApply = source.ownerSource().priceScale();
    }

    if (priceScaleToApply) {
      source.setPriceScale(priceScaleToApply);
      priceScaleToApply.addDataSource(source);
    } else {
      priceScaleToApply = pane.createPriceScaleAtPosition(
        defaults.position,
        defaults.priceScaleIndex
      );

      if (priceScale && priceScale.id) {
        priceScaleToApply.setId(priceScale.id);
      }

      source.setPriceScale(priceScaleToApply);
      priceScaleToApply.addDataSource(source);
    }

    if (!shouldBeCreated && defaults && defaults.overlayPriceScales) {
      const overlaysToRemove = this.dataSources().filter(
        (dataSource) =>
          defaults.overlayPriceScales[dataSource.id()] !== undefined
      );
      overlaysToRemove.forEach((overlay) => {
        pane.removeSourceFromPriceScale(overlay);
      });
      const overlaysToAdd = overlaysToRemove.filter(
        (overlay) => defaults.overlayPriceScales[overlay.id()] !== undefined
      );
      const overlayPriceScales = new Map();
      overlaysToAdd.forEach((overlay) => {
        const priceScaleData = defaults.overlayPriceScales[overlay.id()];
        if (overlayPriceScales.has(priceScaleData.id)) {
          priceScaleToApply = overlayPriceScales.get(priceScaleData.id);
        } else {
          priceScaleToApply = pane.createPriceScaleAtPosition("overlay");
          priceScaleToApply.restoreState(priceScaleData);
          overlayPriceScales.set(priceScaleData.id, priceScaleToApply);
        }
        priceScaleToApply.addDataSource(overlay);
        overlay.setPriceScale(priceScaleToApply);
      });
    }
    source.start();
    if (source.restore) {
      source.restore();
    }
    if (shouldBeCreated) {
      pane.restoreState(defaults, false, this.version());
      if (isStudy) {
        this.recalculateAllPanes(sourceChangeEvent(source.id()));
        this.mainSeries().invalidateBarColorerCache();
        this.fullUpdate();
      }
    }
    return source;
  }

  cancelRequestSelectPoint() {
    this.m_crossHairSource.cancelRequestSelectPoint();
  }

  requestSelectPoint(time) {
    return this.m_crossHairSource.requestSelectPoint(time);
  }

  onPointSelected() {
    return this.m_crossHairSource.onPointSelected();
  }

  isSeriesStyleSupported(seriesStyle) {
    return this.m_mainSeries.isStyleSupported(seriesStyle);
  }

  getStudyShiftColorStartOffset() {
    return this._studyShiftColorStartOffset;
  }

  setStudyShiftColorStartOffset(offset) {
    this._studyShiftColorStartOffset = offset;
  }

  isInReplay() {
    return this.m_mainSeries.isInReplay();
  }

  onInReplayStateChanged() {
    return new Promise();
  }

  switchToReplay(fromTime, toTime) {
    // Implementation
  }

  switchToRealtime() {
    // Implementation
  }

  rendererOptionsProvider() {
    return this._rendererOptionsProvider;
  }

  priceAxisRendererOptions() {
    return this._rendererOptionsProvider.options();
  }

  isPriceScaleVisible(series) {
    const pane = this.paneForSource(series.mainSource());
    const position = pane.priceScalePosition(series);
    if (position === "overlay") {
      return true;
    }
    const priceScaleSlots = this.priceScaleSlotsCount();
    return pane.priceScaleIndex(series, position) < priceScaleSlots[position];
  }

  studyMetaInfoRepository() {
    return this._studiesMetaInfoRepository;
  }

  studiesColorRotatorFactory() {
    return this._studyColorRotatorFactory;
  }
}

export default ChartModel;
