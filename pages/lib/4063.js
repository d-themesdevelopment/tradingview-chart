import { StatusProviderBase } from "./StatusProviderBase";
import { StatusView } from "./StatusView";
import { StudyStatusType } from "./StudyStatusType";
import {
  convertStudyStatusToString,
  studyStatusSolutionId,
  studyStatusTitle,
  studyStatusFeature,
} from "./13333";

import { clone } from "./StrickTypeChecks";

import PlotList from "./PlotList";

import { studyPlotFunctionMap, studyEmptyPlotValuePredicate } from "./72007";

import { saveStudyGraphics, loadStudyGraphics } from "./12616";

import { cal_to_utc, get_timezone } from "./helpers";
import { sourceChangeEvent } from "./28558";
import { ensureNotNull } from "./assertions";
import { createTimeToBarTimeAligner } from "./77475";

class StudyLineDataSource extends LineDataSource {
  constructor(chartApi, mainSeries, symbolInfo, metaInfo, plots, graphics) {
    super(chartApi, mainSeries.seriesSource(), symbolInfo, metaInfo);
    this._indexes = null;
    this._inputs = null;
    this._definitionsViewModel = null;
    this._pointsetPoints = null;
    this._loadedPlots = null;
    this._loadedGraphics = null;
    this._beingCreatedPaneView = null;
    this._anchorsPaneView = null;
    this._isLegendDisplayed = false;
    this._alignerCache = null;

    Promise.all([
      import(
        /* webpackChunkName: "study-line-being-created-pane-view" */ "./study_line_being_created_pane_view"
      ),
      import(
        /* webpackChunkName: "study-line-anchors-pane-view" */ "./study_line_anchors_pane_view"
      ),
    ]).then(([beingCreatedPaneViewModule, anchorsPaneViewModule]) => {
      const { LineToolBeingCreatedPaneView } = beingCreatedPaneViewModule;
      const { StudyLineDataSourceAnchorsPaneView } = anchorsPaneViewModule;
      this._beingCreatedPaneView = new LineToolBeingCreatedPaneView(
        this,
        chartApi
      );
      this._anchorsPaneView = new StudyLineDataSourceAnchorsPaneView(
        this,
        this.model()
      );
      this._model.lightUpdate();
    });

    this._metaInfo = metaInfo;
    this._dataSource = new StudyDataSource(
      chartApi,
      mainSeries.seriesSource(),
      symbolInfo,
      metaInfo
    );
    this._dataSource.dataCleared().subscribe(this, this._onDataCleared);
    this._dataSource.dataUpdated().subscribe(this, this._onDataUpdated);
    this._dataSource
      .studyStatusChanged()
      .subscribe(this, this._onStudyStatusChanged);
    this._statusProvider = new StudyLineDataSourceStatusProvider(this);
    this._statusView = new StudyLineDataSourceStatusView(this);
    this._showStudyArgumentsProperty = chartApi
      .properties()
      .childs()
      .paneProperties.childs()
      .legendProperties.childs().showStudyArguments;
  }

  isDisplayedInLegend() {
    return this._isLegendDisplayed;
  }

  titleInParts() {
    const parts = [];
    if (this._showStudyArgumentsProperty.value() && this._inputs) {
      for (const input of this._metaInfo.inputs) {
        if (input.isHidden === true || input.type === "bool") continue;
        const inputValue = this._inputs[input.id];
        parts.push(inputValue.toString());
      }
    }
    return [this.name(), parts];
  }

  destroy() {
    this._dataSource.dataUpdated().unsubscribeAll(this);
    this._dataSource.dataCleared().unsubscribeAll(this);
    this._dataSource.studyStatusChanged().unsubscribeAll(this);
    this._dataSource.destroy();
    if (this._definitionsViewModel !== null) {
      this._definitionsViewModel.destroy();
      this._definitionsViewModel = null;
    }
    this._unsubscribeApplyInputsOnSeriesCompleted();
    this._isDestroyed = true;
    super.destroy();
  }

  stop() {
    super.stop();
    if (!this._isDestroyed) {
      this._dataSource.stop();
      this.clearData();
    }
  }

  start() {
    super.start();
    if (!this._isDestroyed && this._inputs !== null) {
      this._dataSource.start();
    }
  }

  metaInfo() {
    return this._metaInfo;
  }

  graphicsInfo() {
    return this._metaInfo.graphics;
  }

  series() {
    return this._model.mainSeries();
  }

  translatedType() {
    return this._metaInfo.description;
  }

  name() {
    return this._metaInfo.description;
  }

  studyId() {
    return this._metaInfo.id;
  }

  setPoint(index, price, time) {
    super.setPoint(index, this._preparePoint(price, time));
  }

  move() {}

  clearData() {
    this._clearAllDataExceptPointsetPoints();
    this.updateAllViews(sourceChangeEvent(this.id()));
  }

  data() {
    return this.plots();
  }

  plots() {
    return this._loadedPlots || this._dataSource.plots();
  }

  graphics() {
    return this._loadedGraphics || this._dataSource.graphics();
  }

  firstValue() {
    return this._model.mainSeries().firstValue();
  }

  state(fullUpdate) {
    const baseState = super.state(fullUpdate);
    let metaInfo;
    if (this.metaInfo() instanceof StudyMetaInfo) {
      metaInfo = this.metaInfo().state();
    } else {
      metaInfo = clone(this.metaInfo());
      metaInfo.id = StudyMetaInfo.parseIdString(
        metaInfo.id + (metaInfo.version ? "-" + metaInfo.version : "")
      ).fullId;
    }
    const state = {
      ...baseState,
      metaInfo: metaInfo,
    };
    if (fullUpdate) {
      state.data = this.plots().state();
      state.nonseriesindexes = this._indexes;
      state.graphics = saveStudyGraphics(this.graphics(), null);
    }
    return state;
  }

  restoreData(state) {
    if (state.data !== undefined) {
      this._loadedPlots = new PlotList(
        studyPlotFunctionMap(this._metaInfo),
        studyEmptyPlotValuePredicate
      );
      this._loadedPlots.restoreState(state.data);
    }
    this._indexes =
      state.nonseriesindexes !== undefined
        ? state.nonseriesindexes
        : this._indexes;
    this._loadedGraphics = state.graphics
      ? loadStudyGraphics(state.graphics)
      : this._loadedGraphics;
  }

  getPropertyDefinitionsViewModel() {
    if (this._definitionsViewModel === null) {
      return this._getPropertyDefinitionsViewModelClass().then(
        (ViewModelClass) => {
          if (ViewModelClass === null || this._isDestroyed) {
            return null;
          }
          if (this._definitionsViewModel === null) {
            this._definitionsViewModel = new ViewModelClass(
              this._model.undoModel(),
              this
            );
          }
          return this._definitionsViewModel;
        }
      );
    }
    return Promise.resolve(this._definitionsViewModel);
  }

  paneViews(fullUpdate) {
    let views = [];
    if (this.isSourceHidden()) {
      return views;
    }
    if (this._isReady() && this._changeStatesStack.isEmpty()) {
      const baseViews = super.paneViews(fullUpdate);
      if (baseViews !== null) {
        views = views.concat(baseViews);
      }
    } else {
      if (this._beingCreatedPaneView !== null) {
        views.push(this._beingCreatedPaneView);
      }
    }
    if (this._anchorsPaneView !== null) {
      views.push(this._anchorsPaneView);
    }
    return views;
  }

  propertiesChanged(properties) {
    super.propertiesChanged(properties);
    this._onStudyInputsMayChange();
  }

  dataAndViewsReady() {
    return super.dataAndViewsReady() && this._isReady();
  }

  endChanging(startIndex, endIndex) {
    const result = super.endChanging(startIndex, endIndex);
    if (result.indexesChanged) {
      this.clearData();
    } else {
      this._updateAnchorsPrice(true);
    }
    return result;
  }

  moveData() {
    this._dataSource.moveData();
  }

  restorePoints(data, priceScale, timeScale) {
    super.restorePoints(data, priceScale, timeScale);
    this._updateAnchorsPrice(true);
  }

  realign() {
    super.realign();
    if (this._model.mainSeries().symbolInfo() === null) {
      this._alignerCache = null;
    }
  }

  statusProvider() {
    return this._statusProvider;
  }

  statusView() {
    return this._statusView;
  }

  legendView() {
    return null;
  }

  dataProblemModel() {
    return null;
  }

  dataUpdatedModeModel() {
    return null;
  }

  marketStatusModel() {
    return null;
  }

  onStatusChanged() {
    return this._dataSource.studyStatusChanged();
  }

  status() {
    return this._dataSource.studyStatus();
  }

  recalcStudyIfNeeded() {}

  static createPropertiesFromStudyMetaInfoAndState(
    chartApi,
    metaInfo,
    state,
    defaults
  ) {
    const studyProperties = prepareStudyPropertiesForLoadChart(
      chartApi,
      metaInfo,
      state,
      defaults
    );
    this._configureProperties(studyProperties);
    return studyProperties;
  }

  _onStudyStatusChanged(source, status) {
    let isLegendDisplayed;
    switch (status.type) {
      case StudyStatusType.Error:
        isLegendDisplayed = true;
        break;
      case StudyStatusType.Completed:
        isLegendDisplayed = false;
        break;
      default:
        return;
    }
    if (isLegendDisplayed === this._isLegendDisplayed) {
      return;
    }
    this._isLegendDisplayed = isLegendDisplayed;
    const pane = this._model.paneForSource(this);
    if (pane) {
      const paneIndex = this._model.panes().indexOf(pane);
      const invalidationMask =
        InvalidationMask.invalidateLegendWidgetLayout(paneIndex);
      this.model().invalidate(invalidationMask);
    }
  }

  _studyId() {
    return this._dataSource.studyId();
  }

  _isReady() {
    return true;
  }

  _updateAllPaneViews(invalidationMask) {
    super._updateAllPaneViews(invalidationMask);
    if (this._beingCreatedPaneView !== null) {
      this._beingCreatedPaneView.update();
    }
    if (this._anchorsPaneView !== null) {
      this._anchorsPaneView.update(invalidationMask);
    }
  }

  _getPointTime(point, checkTime) {
    const index = point.index;
    const timePoint = this._model.timeScale().indexToTimePoint(index);
    if (timePoint !== null) {
      return timePoint;
    }
    if (checkTime || point.time === undefined) {
      return null;
    }
    const symbolInfo = this._model.mainSeries().symbolInfo();
    if (symbolInfo === null) {
      return null;
    }
    let timezone = this._model.properties().childs().timezone.value();
    if (timezone === "exchange") {
      timezone = symbolInfo.timezone;
    }
    const o = cal_to_utc(get_timezone(timezone), point.time);
    return this._getStartBarAligner()(o) / 1000;
  }

  _updateAnchorsPrice(fullUpdate) {}

  _onPointsetUpdated(pointset) {
    super._onPointsetUpdated(pointset);
    this._pointsetPoints = this._points.map((point) => ({
      price: point.price,
      index: point.index,
      time: point.time,
    }));
    this._onStudyInputsMayChange();
  }

  _onDataCleared() {
    this.updateAllViews(
      sourceChangeEvent({
        sourceId: this.id(),
        clearData: true,
      })
    );
    this._model.updateSource(this);
  }

  _onDataUpdated(dataUpdates, fullUpdate, applyNewData) {
    this._updateAnchorsPrice();
    this.updateAllViews(
      sourceChangeEvent({
        sourceId: this.id(),
        firstUpdatedTimePointIndex: dataUpdates[0]?.index,
      })
    );
    this._model.updateSource(this);
  }

  _onStudyInputsMayChange() {
    let inputsToUpdate = null;
    if (
      this._pointsetPoints !== null &&
      this._pointsetPoints.length === this.pointsCount()
    ) {
      inputsToUpdate = this._studyInputs(this._pointsetPoints);
      if (inputsToUpdate === null) {
        this._clearAllDataExceptPointsetPoints();
        this.updateAllViews(sourceChangeEvent(this.id()));
      }
    }
    if (inputsToUpdate !== null) {
      const inputIds = this.metaInfo().inputs.map((input) => input.id);
      const updatedInputIds = Object.keys(inputsToUpdate);
      for (const id of updatedInputIds) {
        if (!inputIds.includes(id)) {
          delete inputsToUpdate[id];
        }
      }
    }
    if (!this._areInputsEqual(this._inputs, inputsToUpdate)) {
      this._applyStudyInputs(inputsToUpdate);
    }
  }

  _preparePoint(price, time) {
    return super._preparePoint(
      this._alignPointToRangeOfActualData(price),
      time
    );
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.resolve(null);
  }

  _subscribeApplyInputsOnSeriesCompleted() {
    this._unsubscribeApplyInputsOnSeriesCompleted();
    this._model
      .mainSeries()
      .dataEvents()
      .completed()
      .subscribe(this, () => this._onStudyInputsMayChange(), true);
  }

  _unsubscribeApplyInputsOnSeriesCompleted() {
    this._model.mainSeries().dataEvents().completed().unsubscribeAll(this);
  }

  _onInputsChanged() {
    // Handle inputs changed event
  }

  static _createPropertiesFromStudyIdAndState(studyId, state) {
    const propertyRootName =
      StudyMetaInfo.getStudyPropertyRootNameById(studyId);
    const properties = new DefaultProperty(propertyRootName, state);
    this._configureProperties(properties);
    return properties;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.removeExclusion("intervalsVisibilities");
  }

  _areInputsEqual(inputs1, inputs2) {
    if (inputs2 === null) {
      return inputs1 === null;
    }
    if (
      inputs1 !== null &&
      areStudyInputsEqual(this._metaInfo.inputs, inputs1, inputs2)
    ) {
      return true;
    }
    return false;
  }

  _applyStudyInputs(inputs) {
    const prevInputs = this._inputs;
    this._inputs = inputs;
    if (inputs !== null) {
      this._unsubscribeApplyInputsOnSeriesCompleted();
      this._dataSource.setInputs(inputs);
      if (
        prevInputs === null &&
        this.isStarted() &&
        !this._dataSource.isStarted()
      ) {
        this._dataSource.start();
      }
    }
    this._onInputsChanged();
  }

  _clearAllDataExceptPointsetPoints() {
    this._inputs = null;
    this._dataSource.clearData();
    this._loadedPlots = null;
    this._indexes = null;
    this._loadedGraphics = null;
  }

  _getStartBarAligner() {
    const resolution = this._model.mainSeries().interval();
    if (
      this._alignerCache !== null &&
      this._alignerCache.resolution === resolution
    ) {
      return this._alignerCache.aligner;
    }
    this._alignerCache = {
      resolution: resolution,
      aligner: createTimeToBarTimeAligner(
        resolution,
        ensureNotNull(this._model.mainSeries().symbolInfo())
      ),
    };
    return this._alignerCache.aligner;
  }
}

class StudyLineDataSourceStatusProvider extends StatusProviderBase {
  constructor(dataSource) {
    super(
      dataSource.model().properties().childs().scalesProperties.childs()
        .textColor
    );
    this._source = dataSource;
  }

  color() {
    return "#ff0000";
  }

  errorStatus() {
    const status = this._source.status();
    if (status.type === StudyStatusType.Error) {
      return {
        error: this.sourceStatusText(),
        solutionId: studyStatusSolutionId(status),
        title: studyStatusTitle(status),
        studyFeature: studyStatusFeature(status),
      };
    }
    return null;
  }

  getSplitTitle() {
    return this._source.titleInParts();
  }

  text() {
    return this._source.translatedType();
  }

  sourceStatusText() {
    return convertStudyStatusToString(this._source.status(), true);
  }
}

class StudyLineDataSourceStatusView extends StatusView {
  constructor(statusProvider) {
    super(statusProvider({}));
  }

  getSplitTitle() {
    return this._statusProvider.getSplitTitle();
  }
}

export { StudyLineDataSource };
