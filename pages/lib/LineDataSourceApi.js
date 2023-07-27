
import { LineDataSourceApi } from '<path_to_LineDataSourceApi_module>';
import { isLineToolRiskReward } from '<path_to_isLineToolRiskReward_module>';

const pointsCountMap = new Map([
  ["LineToolRiskRewardLong", 2],
  ["LineToolRiskRewardShort", 2],
  ["LineToolBezierQuadro", 3],
  ["LineToolBezierCubic", 4],
]);

function getPointsCount(lineTool) {
  const pointsCount = pointsCountMap.get(lineTool.toolname);
  if (pointsCount !== undefined) {
    return pointsCount;
  }
  const customPointsCount = lineTool.pointsCount();
  return customPointsCount === -1 ? lineTool.points().length : customPointsCount;
}

class LineDataSourceApi {
  constructor(source, undoModel, model, pointsConverter) {
    this._source = source;
    this._undoModel = undoModel;
    this._model = model;
    this._pointsConverter = pointsConverter;
  }

  isSelectionEnabled() {
    return this._source.isSelectionEnabled();
  }

  setSelectionEnabled(enabled) {
    this._source.setSelectionEnabled(enabled);
  }

  isSavingEnabled() {
    return this._source.isSavedInChart();
  }

  setSavingEnabled(enabled) {
    this._source.setSavingInChartEnabled(enabled);
  }

  isShowInObjectsTreeEnabled() {
    return this._source.showInObjectTree();
  }

  setShowInObjectsTreeEnabled(enabled) {
    this._source.setShowInObjectsTreeEnabled(enabled);
  }

  isUserEditEnabled() {
    return this._source.userEditEnabled();
  }

  setUserEditEnabled(enabled) {
    this._source.setUserEditEnabled(enabled);
  }

  bringToFront() {
    this._model.bringToFront([this._source]);
  }

  sendToBack() {
    this._model.sendToBack([this._source]);
  }

  getProperties() {
    return this._source.properties().state(l, true);
  }

  setProperties(properties) {
    this._setProps(this._source.properties(), properties, "");
  }

  getPoints() {
    let points = this._source.points();
    const pointsCount = getPointsCount(this._source);
    if (points.length > pointsCount) {
      assert(isLineToolRiskReward(this._source.toolname));
      points = points.slice(0, pointsCount);
    }
    return this._pointsConverter.dataSourcePointsToPriced(points);
  }

  setPoints(points) {
    if (this._source.isFixed()) {
      return;
    }
    const pointsCount = getPointsCount(this._source);
    if (pointsCount !== points.length) {
      throw new Error(`Wrong points count. Required: ${pointsCount}, provided: ${points.length}`);
    }
    const dataSourcePoints = this._pointsConverter.apiPointsToDataSource(points);
    this._model.startChangingLinetool(this._source);
    this._model.changeLinePoints(this._source, dataSourcePoints);
    this._model.endChangingLinetool(true);
    this._source.createServerPoints();
  }

  getAnchoredPosition() {
    return this._source.positionPercents();
  }

  setAnchoredPosition(position) {
    const fixedPoint = this._source.fixedPoint();
    const linkKey = this._source.linkKey().value();
    const screenPoint = fixedPoint !== undefined ? this._source.screenPointToPoint(fixedPoint) : null;
    if (!this._source.isFixed() || fixedPoint === undefined || linkKey === null || screenPoint === null) {
      return;
    }
    const points = {
      logical: screenPoint,
      screen: fixedPoint,
    };
    const targetMap = new Map();
    targetMap.set(linkKey, position);
    this._model.startMovingSources([this._source], points, null, new Map());
    this._model.moveSources(points, targetMap);
    this._model.endMovingSources(true);
  }

  ownerSourceId() {
    return ensureNotNull(this._source.ownerSource()).id();
  }

  changePoint(point, index) {
    if (this._source.isFixed()) {
      return;
    }
    const dataSourcePoint = this._pointsConverter.apiPointsToDataSource([point])[0];
    this._model.startChangingLinetool(this._source, { ...dataSourcePoint }, index);
    this._model.changeLinePoint({ ...dataSourcePoint });
    this._model.endChangingLinetool(false);
    this._source.createServerPoints();
  }

  isHidden() {
    return this._source.isSourceHidden();
  }

  getRawPoints() {
    return this._source.points();
  }

  setRawPoint(index, point) {
    this._model.startChangingLinetool(this._source, { ...point }, index);
    this._model.changeLinePoint({ ...point });
    this._model.endChangingLinetool(false);
  }

  move(from, to) {
    this._model.startMovingSources([this._source], { logical: from }, null, new Map());
    this._model.moveSources({ logical: to }, new Map());
    this._model.endMovingSources(false);
  }

  dataAndViewsReady() {
    return this._source.dataAndViewsReady();
  }

  zorder() {
    return this._source.zorder();
  }

  symbol() {
    return this._source.properties().symbol.value();
  }

  currency() {
    return this._source.properties().currencyId.value();
  }

  unit() {
    return this._source.properties().unitId.value();
  }

  share(enabled) {
    this._undoModel.shareLineTools([this._source], enabled);
  }

  sharingMode() {
    return this._source.sharingMode().value();
  }

  _setProps(properties, props, prefix) {
    for (const prop in props) {
      if (!props.hasOwnProperty(prop)) {
        continue;
      }
      const fullPropName = prefix.length === 0 ? prop : `${prefix}.${prop}`;
      if (properties.hasOwnProperty(prop)) {
        const propValue = props[prop];
        if (isHashObject(propValue)) {
          this._setProps(properties[prop], propValue, fullPropName);
        } else {
          properties[prop].setValue(propValue);
        }
      } else {
        console.warn(`Unknown property "${fullPropName}"`);
      }
    }
  }
}

export { LineDataSourceApi };