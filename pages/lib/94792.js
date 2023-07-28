"use strict";

const TranslatedString = require("./TranslatedString");
const doAnimate = require("./Animation");
const ChartUndoModelBase = require("./45446").ChartUndoModelBase; // ! not correct
// const saveDefaultProperties = require("./46100").saveDefaultProperties;
// const UndoCommand = require("./62591").UndoCommand;
const ApplyLineToolTemplateUndoCommand = require("./ApplyLineToolTemplateUndoCommand");
const SetPriceScaleSelectionStrategyCommand =
  require("./53051").SetPriceScaleSelectionStrategyCommand;
const SetScaleRatioPropertiesCommand =
  require("./610").SetScaleRatioPropertiesCommand;
const trackEvent = require("./51768").trackEvent; // ! not correct

const RestoreDefaultsPreferencesUndoCommand =
  require("./4505").RestoreDefaultsPreferencesUndoCommand;

const SetPriceScaleModeCommand = require("./95367").SetPriceScaleModeCommand; // ! not correct

const PriceScaleChangeUndoCommand =
  require("./67521").PriceScaleChangeUndoCommand;

// ! not correct parts
const moveLeftString = new TranslatedString(
  "move left",
  require("./44352").t(null, void 0, require("./15086"))
);
const moveRightString = new TranslatedString(
  "move right",
  require("./44352").t(null, void 0, require("./61711"))
);
const toggleAutoScaleString = new TranslatedString(
  "toggle auto scale",
  require("./44352").t(null, void 0, require("./63060"))
);
const toggleLockScaleString = new TranslatedString(
  "toggle lock scale",
  require("./44352").t(null, void 0, require("./21203"))
);
const toggleRegularScaleString = new TranslatedString(
  "toggle regular scale",
  require("./44352").t(null, void 0, require("./33714"))
);
const toggleIndexedTo100ScaleString = new TranslatedString(
  "toggle indexed to 100 scale",
  require("./44352").t(null, void 0, require("./98860"))
);
const togglePercentageScaleString = new TranslatedString(
  "toggle percentage scale",
  require("./44352").t(null, void 0, require("./68642"))
);
const toggleLogScaleString = new TranslatedString(
  "toggle log scale",
  require("./44352").t(null, void 0, require("./60166"))
);
const invertScaleString = new TranslatedString(
  "invert scale",
  require("./44352").t(null, void 0, require("./94245"))
);
const removePaneString = new TranslatedString(
  "remove pane",
  require("./44352").t(null, void 0, require("./47637"))
);
const applyAllChartPropertiesString = new TranslatedString(
  "apply all chart properties",
  require("./44352").t(null, void 0, require("./64034"))
);
const setPriceScaleSelectionStrategyString = new TranslatedString(
  "set price scale selection strategy to {title}",
  require("./44352").t(null, void 0, require("./69485"))
);

class ChartUndoModel extends ChartUndoModelBase {
  constructor(e, t, i, s, r, n, o, a, l, c, h, d) {
    super(e, t, i, s, r, n, o, a, l, c, h, d);

    this.beginUndoMacro = (e, t) => {
      const undoMacro = o.beginUndoMacro(e);
      undoMacro.setCustomFlag("doesnt_affect_save", t);
      return undoMacro;
    };

    this.endUndoMacro = o.endUndoMacro.bind(o);
    this.createUndoCheckpoint = o.createUndoCheckpoint.bind(o);
    this.undoToCheckpoint = o.undoToCheckpoint.bind(o);
  }

  version() {
    return this.m_model.version();
  }

  createPane(e) {
    return this.m_model.createPane(e);
  }

  restart() {
    this.m_model.restart();
  }

  disconnect() {
    this.m_model.disconnect();
  }

  studyVersioning() {
    return this.m_model.studyVersioning();
  }

  chartModel() {
    return this._model();
  }

  _model() {
    return this.m_model;
  }

  pushUndoCommand(e) {
    this._pushUndoCommand(e);
  }

  _pushUndoCommand(e) {
    this._undoHistory.pushUndoCommand(e);
  }

  startScrollPrice(e, t, i) {
    if (!t.isAutoScale()) {
      this._initialPriceScrollState = t.state();
      this._initialPriceScrollPos = i;
      this.chartModel().startScrollPrice(e, t, i);
    }
  }

  scrollPriceTo(e, t, i) {
    if (!t.isAutoScale()) {
      if (
        this._initialPriceScrollPos &&
        Math.abs(this._initialPriceScrollPos - i) > 20
      ) {
        this.pushUndoCommand(
          new PriceScaleChangeUndoCommand(
            this.m_model,
            e,
            t,
            this._initialPriceScrollState
          )
        );
        delete this._initialPriceScrollState;
        delete this._initialPriceScrollPos;
      }
      this.chartModel().scrollPriceTo(e, t, i);
    }
  }

  endScrollPrice(e, t) {
    if (!t.isAutoScale()) {
      delete this._initialPriceScrollState;
      delete this._initialPriceScrollPos;
      this.chartModel().endScrollPrice(e, t);
    }
  }

  setPriceAutoScale(e, t, i) {
    this.pushUndoCommand(
      new PriceScaleChangeUndoCommand(this.m_model, e, t, t.state())
    );
    this.chartModel().setPriceAutoScale(e, t, i);
  }

  setWidth(e) {
    this.m_model.setWidth(e);
  }

  setPaneHeight(e, t) {
    this.m_model.setPaneHeight(e, t);
  }

  gridSource() {
    return this.m_model.gridSource();
  }

  watermarkSource() {
    return this.m_model.watermarkSource();
  }

  publishedChartsTimelineSource() {
    return this.m_model.publishedChartsTimelineSource();
  }

  crossHairSource() {
    return this.m_model.crossHairSource();
  }

  model() {
    return this.m_model;
  }

  chartWidget() {
    return this._chartWidget;
  }

  mainSeries() {
    return this.m_model.m_mainSeries;
  }

  mainSeriesScaleRatioProperty() {
    return this.m_model.mainSeriesScaleRatioProperty();
  }

  timeScale() {
    return this.m_model.timeScale();
  }

  selectionMacro(e, t) {
    return this.m_model.selectionMacro(e, t);
  }

  setHoveredSource(e, t) {
    this.m_model.setHoveredSource(e, t);
  }

  selection() {
    return this.m_model.selection();
  }

  onSelectedSourceChanged() {
    return this.m_model.onSelectedSourceChanged();
  }

  activeStrategySource() {
    return this.m_model.activeStrategySource();
  }

  invalidate(e) {
    this.m_model.invalidate(e);
  }

  setCurrentPosition(e, t, i, s) {
    this.m_model.setCurrentPosition(e, t, i, s);
  }

  setAndSaveCurrentPosition(e, t, i, s) {
    this.m_model.setAndSaveCurrentPosition(e, t, i, s);
  }

  setProperties(e, t, i) {
    const self = this;
    this.beginUndoMacro(i);
    this.m_model.selectionMacro(() => {
      for (let r = 0; r < e.length; r++) {
        self.setProperty(e[r], t[r], i);
      }
    });
    this.endUndoMacro();
  }

  setPriceScaleMode(e, t, i) {
    const keys = Object.keys(e);
    const currentMode = t.mode();
    let hasChanges = false;

    for (let o = 0; o < keys.length; o++) {
      if (currentMode[keys[o]] !== e[keys[o]]) {
        hasChanges = true;
        break;
      }
    }

    if (hasChanges) {
      const command = new SetPriceScaleModeCommand(e, t, i, this.m_model);
      this.pushUndoCommand(command);
    }
  }

  setPriceScaleSelectionStrategy(e) {
    if (
      this.m_model.properties().priceScaleSelectionStrategyName.value() !== e
    ) {
      trackEvent("Chart", "Change PriceScale Selection Strategy");
      const title = setPriceScaleSelectionStrategyString.format({ title: e });
      this.beginUndoMacro(title);
      this.setProperty(
        this.m_model.properties().priceScaleSelectionStrategyName,
        e,
        title
      );
      const command = new SetPriceScaleSelectionStrategyCommand(
        this.m_model,
        e,
        title
      );
      this.pushUndoCommand(command);
      this.endUndoMacro();
    }
  }

  setScaleRatioProperty(e, t, i) {
    if (e.value() !== t) {
      const command = new SetScaleRatioPropertiesCommand(e, t, i, this.m_model);
      this.pushUndoCommand(command);
    }
  }

  lineBeingCreated() {
    return this.m_model.lineBeingCreated();
  }

  paneBeingCreatedLineOn() {
    return this.m_model.paneBeingCreatedLineOn();
  }

  cancelCreatingLine() {
    this.m_model.cancelCreatingLine();
  }

  lineCancelled() {
    return this.m_model.lineCancelled();
  }

  lineBeingEdited() {
    return this.m_model.lineBeingEdited();
  }

  sourcesBeingMoved() {
    return this.m_model.sourcesBeingMoved();
  }

  dataSources() {
    return this.m_model.dataSources();
  }

  orderedDataSources(e) {
    return this.m_model.orderedDataSources(e);
  }

  dataSourceForId(e) {
    return this.m_model.dataSourceForId(e);
  }

  state(e, t, i, s) {
    return this.m_model.state(e, t, i, s);
  }

  calculateDefaultTags() {
    return this.m_model.calculateDefaultTags();
  }

  onTagsChanged() {
    return this.m_model.onTagsChanged();
  }

  moveLeft() {
    try {
      this.beginUndoMacro(moveLeftString);
    } catch (e) {
      return;
    }

    const e = this.m_model.timeScale().width();
    const self = this;

    doAnimate({
      to: e / 5,
      onStep(e) {
        self.startScrollTime(e);
        self.scrollTimeTo(0);
        self.endScrollTime();
      },
      onComplete() {
        self.endUndoMacro();
      },
    });
  }

  moveRight() {
    try {
      this.beginUndoMacro(moveRightString);
    } catch (e) {
      return;
    }

    const e = this.m_model.timeScale().width();
    const self = this;

    doAnimate({
      to: e / 5,
      onStep(e) {
        self.startScrollTime(0);
        self.scrollTimeTo(e);
        self.endScrollTime();
      },
      onComplete() {
        self.endUndoMacro();
      },
    });
  }

  scrollChart(e) {
    if (this.m_model.scrollEnabled()) {
      this.startScrollTime(0);
      this.scrollTimeTo(e);
      this.endScrollTime();
    }
  }

  restorePreferences() {
    const command = new RestoreDefaultsPreferencesUndoCommand(this.model());
    this.pushUndoCommand(command);
  }

  applyPreferences(e) {
    throw new Error("Not implemented");
  }

  applyLineToolTemplate(e, t, i) {
    this.beginUndoMacro(i);
    this.saveLineToolState(e, i);
    const command = new ApplyLineToolTemplateUndoCommand(e, t, i);
    this.pushUndoCommand(command);
    this.saveLineToolState(e, i);
    this.endUndoMacro();
    this.model().updateSource(e);
  }

  isInReplay() {
    return this.m_model.isInReplay();
  }

  switchToReplay(e, t) {}

  switchToRealtime() {}

  togglePriceScaleAutoScaleMode(e) {
    const t = {
      autoScale: !e.isAutoScale(),
    };
    this.setPriceScaleMode(t, e, toggleAutoScaleString);
  }

  togglePriceScaleLockScaleMode(e) {
    const t = {
      lockScale: !e.isLockScale(),
    };
    this.setPriceScaleMode(t, e, toggleLockScaleString);
  }

  setPriceScaleRegularScaleMode(e) {
    this.setPriceScaleMode(
      {
        log: false,
        percentage: false,
        indexedTo100: false,
      },
      e,
      toggleRegularScaleString
    );
  }

  togglePriceScaleIndexedTo100ScaleMode(e) {
    const t = {
      indexedTo100: !e.isIndexedTo100(),
    };
    this.setPriceScaleMode(t, e, toggleIndexedTo100ScaleString);
  }

  togglePriceScalePercentageScaleMode(e) {
    const t = {
      percentage: !e.isPercentage(),
    };
    this.setPriceScaleMode(t, e, togglePercentageScaleString);
  }

  togglePriceScaleLogScaleMode(e) {
    const t = {
      log: !e.isLog(),
    };
    this.setPriceScaleMode(t, e, toggleLogScaleString);
  }

  invertPriceScale(e) {
    const t = e.properties().isInverted;
    this.setProperty(t, !t.value(), invertScaleString);
  }

  removePane(e) {
    const dataSources = this.m_model.panes()[e].dataSources().slice();
    this.removeSources(dataSources, false, removePaneString);
  }
}

module.exports = ChartUndoModel;
