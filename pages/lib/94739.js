"use strict";

const { EventEmitter } = require("events");
const assert = require("assert");
const r = require("lodash");
const PlotList = require("97034").PlotList;
const {
  unpackNonSeriesData,
  ensureDefined,
  ensureNotNull,
} = require("./1115");
const { LiveStudyGraphics } = require("60393");
const {
  StudyStatusType,
  studyPlotFunctionMap,
  studyEmptyPlotValuePredicate,
} = require("75319");

const logger = getLogger("Chart.StudyDataSource");

let DataSourceStatus;
(function (DataSourceStatus) {
  DataSourceStatus[(DataSourceStatus["Idle"] = 0)] = "Idle";
  DataSourceStatus[(DataSourceStatus["AwaitingConnection"] = 1)] =
    "AwaitingConnection";
  DataSourceStatus[(DataSourceStatus["AwaitingParent"] = 2)] =
    "AwaitingParent";
  DataSourceStatus[(DataSourceStatus["AwaitingFirstDataUpdate"] = 3)] =
    "AwaitingFirstDataUpdate";
  DataSourceStatus[(DataSourceStatus["Active"] = 4)] = "Active";
})(DataSourceStatus || (DataSourceStatus = {}));

class StudyDataSource {
  constructor(gateway, seriesSource, turnaroundPrefix, metaInfo) {
    this._inputs = null;
    this._status = DataSourceStatus.Idle;
    this._studyId = null;
    this._turnaroundCounter = 1;
    this._studyStatus = { type: StudyStatusType.Undefined };
    this._studyStatusChanged = new EventEmitter();
    this._graphics = new LiveStudyGraphics();
    this._dataCleared = new EventEmitter();
    this._dataUpdated = new EventEmitter();
    this._boundOnGatewayIsConnectedChanged = this._onGatewayIsConnectedChanged.bind(
      this
    );
    this._ongoingDataUpdate = Promise.resolve();
    this._gateway = gateway;
    this._metaInfo = metaInfo;
    this._seriesSource = seriesSource;
    this._turnaroundPrefix = turnaroundPrefix;
    this._plots = new PlotList(
      studyPlotFunctionMap(this._metaInfo),
      studyEmptyPlotValuePredicate
    );
    this._gateway
      .isConnected()
      .subscribe(this._boundOnGatewayIsConnectedChanged);
  }

  destroy() {
    this.stop();
    this._gateway
      .isConnected()
      .unsubscribe(this._boundOnGatewayIsConnectedChanged);
  }

  metaInfo() {
    return this._metaInfo;
  }

  inputs() {
    return this._inputs;
  }

  setInputs(inputs) {
    this._inputs = inputs;
    if (this._studyId !== null) {
      this._turnaroundCounter++;
      this._onStudyStatusChangedTo({ type: StudyStatusType.Undefined });
      this._gateway.modifyStudy(
        this._studyId,
        this._turnaround(),
        inputs,
        this._onMessage.bind(this)
      );
      if (this._status === DataSourceStatus.Active) {
        this._changeStatusTo(DataSourceStatus.AwaitingFirstDataUpdate);
      }
    }
  }

  isStarted() {
    return this._status !== DataSourceStatus.Idle;
  }

  isActive() {
    return this._status === DataSourceStatus.Active;
  }

  start() {
    if (this.isStarted()) {
      logger.logNormal("start: data source is already started, nothing to do");
    } else {
      assert(
        this._inputs !== null,
        "Inputs should be defined when starting a study data source"
      );
      if (this._gateway.isConnected().value()) {
        this._createStudy();
      } else {
        this._changeStatusTo(DataSourceStatus.AwaitingConnection);
      }
    }
  }

  stop() {
    if (this.isStarted()) {
      if (this._studyId !== null) {
        this._gateway.removeStudy(this._studyId);
        this._studyId = null;
        this._onStudyStatusChangedTo({ type: StudyStatusType.Undefined });
      }
      this._changeStatusTo(DataSourceStatus.Idle);
    } else {
      logger.logNormal("stop: data source is already stopped, nothing to do");
    }
  }

  studyId() {
    return this._studyId;
  }

  studyStatus() {
    return this._studyStatus;
  }

  studyStatusChanged() {
    return this._studyStatusChanged;
  }

  plots() {
    return this._plots;
  }

  graphics() {
    return this._graphics;
  }

  clearData() {
    this._plots.clear();
    this._graphics.clear();
    this._dataCleared.emit();
  }

  stopAndStealData() {
    assert(
      this._status === DataSourceStatus.Active,
      "Couldn't steal data from non-active data source"
    );
    this.stop();
    const plots = this._plots;
    const graphics = this._graphics.extract();
    this._plots = new PlotList(
      studyPlotFunctionMap(this._metaInfo),
      studyEmptyPlotValuePredicate
    );
    return { plots, graphics };
  }

  dataCleared() {
    return this._dataCleared;
  }

  dataUpdated() {
    return this._dataUpdated;
  }

  moveData(e) {
    this._ongoingDataUpdate = this._ongoingDataUpdate.then(() => {
      this._plots.move(e);
    });
  }

  pendingUpdatesReady() {
    return this._ongoingDataUpdate;
  }

  _changeStatusTo(status) {
    assert(
      this._status !== status,
      "Source and destination status should be distinct"
    );
    logger.logNormal(
      `Status changed from ${DataSourceStatus[this._status]} to ${
        DataSourceStatus[status]
      }`
    );
    this._status = status;
  }

  _createStudy() {
    const parentId = this._seriesSource.instanceId();
    if (parentId !== null) {
      this._createStudyUsingParentId(parentId);
    } else {
      this._changeStatusTo(DataSourceStatus.AwaitingParent);
      this._seriesSource
        .dataEvents()
        .completed()
        .subscribe(this, this._onSeriesCompleted, true);
    }
  }

  _createStudyUsingParentId(parentId) {
    assert(
      this._status !== DataSourceStatus.Active,
      'Status should not be "Active" when creating a study'
    );
    assert(
      this._studyStatus.type === StudyStatusType.Undefined,
      'Study status should be "Undefined" when creating a study'
    );
    assert(
      this._studyId === null,
      "Study id should be empty when creating a study"
    );
    this._studyId = makeNextStudyId();
    this._gateway.createStudy(
      this._studyId,
      this._turnaround(),
      parentId,
      this._metaInfo.fullId +
        (this._metaInfo.packageId === "tv-basicstudies" ? "" : "!"),
      ensureNotNull(this._inputs),
      this._onMessage.bind(this)
    );
    this._changeStatusTo(DataSourceStatus.AwaitingFirstDataUpdate);
  }

  _onGatewayIsConnectedChanged(isConnected) {
    if (isConnected) {
      this._onGatewayConnected();
    } else {
      this._onGatewayDisconnected();
    }
  }

  _onGatewayConnected() {
    if (this._status === DataSourceStatus.AwaitingConnection) {
      this._createStudy();
    }
  }

  _onGatewayDisconnected() {
    if (
      this._status !== DataSourceStatus.Idle &&
      this._status !== DataSourceStatus.AwaitingConnection
    ) {
      this._studyId = null;
      this._changeStatusTo(DataSourceStatus.AwaitingConnection);
      if (this._studyStatus.type !== StudyStatusType.Undefined) {
        this._onStudyStatusChangedTo({ type: StudyStatusType.Undefined });
      }
    }
    this._turnaroundCounter = 1;
  }

  _onSeriesCompleted() {
    if (this._status === DataSourceStatus.AwaitingParent) {
      this._createStudyUsingParentId(ensureNotNull(this._seriesSource.instanceId()));
    }
  }

  _onStudyStatusChangedTo(newStatus) {
    const oldStatus = this._studyStatus;
    this._studyStatus = newStatus;
    logger.logNormal(
      `Study status type changed from ${StudyStatusType[oldStatus.type]} to ${
        StudyStatusType[newStatus.type]
      }`
    );
    this._studyStatusChanged.emit(oldStatus, newStatus);
  }

  _onMessage(message) {
    if (message.method === "data_update") {
      const { customId, turnaround, plots, nonseries } = message.params;
      if (
        customId === this._studyId &&
        this._checkTurnaround(turnaround)
      ) {
        this._onDataUpdate(plots, ensureDefined(nonseries));
      }
    } else if (message.method === "study_loading") {
      const [, , seriesStatus] = message.params;
      if (seriesStatus === this._studyId && this._checkTurnaround(turnaround)) {
        this._onStudyLoading(seriesStatus);
      }
    } else if (message.method === "study_completed") {
      const [, , seriesStatus] = message.params;
      if (seriesStatus === this._studyId && this._checkTurnaround(turnaround)) {
        this._onStudyCompleted(seriesStatus);
      }
    } else if (message.method === "study_error") {
      const [, , seriesStatus, error, errorParams] = message.params;
      if (seriesStatus === this._studyId && this._checkTurnaround(turnaround)) {
        this._onStudyError(seriesStatus, error, errorParams);
      }
    } else if (message.method === "clear_data") {
      if (this._checkTurnaround(message.params.turnaround)) {
        this.clearData();
      }
    }
  }

  _onDataUpdate(plots, nonseries) {
    if (this._status !== DataSourceStatus.Idle) {
      if (this._status === DataSourceStatus.AwaitingFirstDataUpdate) {
        this._changeStatusTo(DataSourceStatus.Active);
        this.clearData();
      }
      this._mergePlots(plots);
      if (nonseries !== null) {
        if (nonseries.indexes_replace) {
          assert(nonseries !== "nochange");
          this._graphics.replaceIndexesTo(nonseries);
        } else {
          if (nonseries !== "nochange") {
            this._graphics.replaceIndexesTo(nonseries);
          }
          if (nonseries.graphicsCmds !== undefined) {
            this._graphics.processCommands(
              nonseries.graphicsCmds,
              this._metaInfo.graphics
            );
          }
        }
      }
      this._dataUpdated.emit(plots, nonseries, nonseries.indexes);
    }
  }

  _mergePlots(plots) {
    this._plots.merge(plots);
  }

  _turnaround() {
    return `${this._turnaroundPrefix}${this._turnaroundCounter}`;
  }

  _checkTurnaround(turnaround) {
    const currentTurnaround = this._turnaround();
    return (
      turnaround === currentTurnaround ||
      turnaround === this._seriesSource.turnaround() ||
      turnaround === `${this._seriesSource.turnaround()}_${currentTurnaround}`
    );
  }
}

module.exports = {
  StudyDataSource,
};
