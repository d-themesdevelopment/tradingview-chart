
import { Delegate } from '57898';

class ChartapiMessager {
  constructor(server, session) {
    this._server = server;
    this._session = session;
    this.seriesCompleted = new Delegate();
    this.seriesError = new Delegate();
  }

  onRequestMetadata(symbol, metadata) {
    this._server.receiveLocalResponse({
      method: "studies_metadata",
      params: [this._session, symbol, {
        errors: [],
        hash: "",
        metainfo: metadata,
        migrations: []
      }]
    });
  }

  onSymbolResolved(symbol, resolved) {
    this._server.receiveLocalResponse({
      method: "symbol_resolved",
      params: [this._session, symbol, resolved]
    });
  }

  onSymbolError(symbol, error) {
    this._server.receiveLocalResponse({
      method: "symbol_error",
      params: [this._session, symbol, error]
    });
  }

  onStudyError(symbol, studyId, error) {
    this._server.receiveLocalResponse({
      method: "study_error",
      params: [this._session, symbol, studyId, error]
    });
  }

  onSeriesLoading(symbol, seriesId) {
    this._server.receiveLocalResponse({
      method: "series_loading",
      params: [this._session, symbol, seriesId]
    });
  }

  onSeriesCompleted(symbol, seriesId, completionStatus) {
    this._server.receiveLocalResponse({
      method: "series_completed",
      params: [this._session, symbol, completionStatus, seriesId]
    });
    this.seriesCompleted.fire(symbol, seriesId);
  }

  onSeriesError(symbol, seriesId, error) {
    this._server.receiveLocalResponse({
      method: "series_error",
      params: [this._session, symbol, seriesId, error]
    });
    this.seriesError.fire(symbol, seriesId);
  }

  onStudyCompleted(symbol, studyId) {
    this._server.receiveLocalResponse({
      method: "study_completed",
      params: [this._session, symbol, studyId]
    });
  }

  onStudyLoading(symbol, studyId) {
    this._server.receiveLocalResponse({
      method: "study_loading",
      params: [this._session, symbol, studyId]
    });
  }

  onTickmarksUpdated(index, marks) {
    const params = {
      index: index,
      zoffset: 0,
      changes: [],
      marks: marks,
      index_diff: []
    };
    const response = {
      method: "tickmark_update",
      params: [this._session, params]
    };
    this._server.receiveLocalResponse(response);
  }

  onTimescaleUpdate(timescale, data) {
    const params = {
      index: timescale.pointsIndex,
      zoffset: 0,
      changes: timescale.points,
      marks: timescale.marks,
      index_diff: timescale.indexChange,
      baseIndex: timescale.baseIndex
    };
    const response = {
      method: "timescale_update",
      params: [this._session, this._prepareDataUpdateObjects(data), params]
    };
    this._server.receiveLocalResponse(response);
  }

  onTimescaleCompleted(completionStatus) {
    this._server.receiveLocalResponse({
      method: "timescale_completed",
      params: [this._session, completionStatus]
    });
  }

  onSeriesTimeframeUpdate(symbol, seriesId, resolution, timeframe, points) {
    const params = {
      method: "series_timeframe",
      params: [this._session, symbol, seriesId, resolution, timeframe, null, true, points]
    };
    this._server.receiveLocalResponse(params);
  }

  onPointsetDataUpdate(objId, turnaround, data) {
    this.onDataUpdate(objId, turnaround, data, null);
  }

  _prepareDataUpdateObjects(data) {
    const updateObjects = {};
    data.forEach(item => {
      updateObjects[item.objId] = {
        series: item.data,
        turnaround: item.turnaround
      };
      if (item.nonSeriesData) {
        updateObjects[item.objId].nonseries = {
          d: item.nonSeriesData.data ? JSON.stringify(item.nonSeriesData.data) : "",
          indexes: item.nonSeriesData.indexes || []
        };
      } else {
        updateObjects[item.objId].nonseries = {
          d: "",
          indexes: []
        };
      }
    });
    return updateObjects;
  }

  onDataUpdate(objId, turnaround, data, nonSeriesData) {
    const update = {
      objId: objId,
      turnaround: turnaround,
      data: data,
      nonSeriesData: nonSeriesData
    };
    const params = {
      method: "data_update",
      params: [this._session, this._prepareDataUpdateObjects([update])]
    };
    this._server.receiveLocalResponse(params);
  }

  onQuotesData(data) {
    this._server.receiveLocalResponse({
      method: "quote_symbol_data",
      params: data
    });
  }

  onDepthData(data) {
    this._server.receiveLocalResponse({
      method: "dd",
      params: data
    });
  }

  onDepthUpdate(data) {
    this._server.receiveLocalResponse({
      method: "dpu",
      params: data
    });
  }

  onClearData(data) {
    this._server.receiveLocalResponse({
      method: "clear_data",
      params: [this._session, data]
    });
  }
}

TradingView.ChartapiMessagerInstances = [];