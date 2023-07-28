import { ensureNotNull } from "./assertions";
import { Point } from "86441"; // ! not correct
import { DefaultProperty } from "./46100";
import { changeLineStyle } from "./88348";
import { LineDataSource } from "./13087";
import { clone } from "./StrickTypeChecks";
import { ensure } from "./assertions";
import { e } from "./21905";

class LineToolParallelChannel extends LineDataSource {
  constructor(source, points, properties, model) {
    super(
      source,
      points || LineToolParallelChannel.createProperties(),
      properties,
      model
    );
    this._alertCreationAvailable = new ensureNotNull(
      properties.alertCreationAvailable().value() && this._isTimePointsValid()
    );
    this._priceAxisViews.push(this.createPriceAxisView(3));
    this._coordOffsetWhileMovingOrChanging = null;
    this._pendingPriceOffset = null;
    e(1583)
      .then(e.bind(e, 26013))
      .then(({ ParallelChannelPaneView }) => {
        this._setPaneViews([new ParallelChannelPaneView(this, this._model)]);
      });
    this._normalizedPointsChanged.subscribe(this, () => {
      this._alertCreationAvailable.setValue(
        properties.alertCreationAvailable().value() && this._isTimePointsValid()
      );
    });
  }

  alertCreationAvailable() {
    return this._alertCreationAvailable.readonly();
  }

  paneViews(e) {
    if (this._pendingPriceOffset !== null) {
      this._applyPendingPriceOffset();
    }
    return super.paneViews(e);
  }

  setLastPoint(point, override) {
    if (override && override.shift() && this.points().length === 2) {
      this._snapPoint45Degree(point, this.points()[0]);
    }
    const lastPoint = clone(point);
    super.setLastPoint(point);
    return lastPoint;
  }

  startMoving(startPoint, priceOffset, timeOffset, override) {
    super.startMoving(startPoint, priceOffset, timeOffset, override);
    this._coordOffsetWhileMovingOrChanging = this._findPixelsHeight();
  }

  endMoving(endPoint, priceOffset, timeOffset) {
    this._coordOffsetWhileMovingOrChanging = null;
    return super.endMoving(endPoint, priceOffset, timeOffset);
  }

  startChanging(startPoint, priceOffset, timeOffset) {
    super.startChanging(startPoint, priceOffset, timeOffset);
    this._coordOffsetWhileMovingOrChanging = this._findPixelsHeight();
  }

  endChanging(endPoint, priceOffset, timeOffset) {
    this._coordOffsetWhileMovingOrChanging = null;
    return super.endChanging(endPoint, priceOffset, timeOffset);
  }

  restoreExternalPoints(state, priceScale, regenerateId) {
    const screenPoints = regenerateId
      ? state.points
      : this._timePoint.map((point, index) => ({
          price: point.price,
          offset: state.points[index].offset,
          time_t: state.points[index].time_t,
        }));
    if (
      super.restoreExternalPoints(
        { ...state, points: screenPoints },
        priceScale
      )
    ) {
      if (
        priceScale.pricesChanged &&
        this._points.length === screenPoints.length
      ) {
        for (let i = 0; i < screenPoints.length; i++) {
          this._points[i].price = screenPoints[i].price;
        }
      }
    }
  }

  restorePoints(state, priceScale, regenerateId) {
    super.restorePoints(state, priceScale, regenerateId);
    this._alertCreationAvailable.setValue(
      super.alertCreationAvailable().value() && this._isTimePointsValid()
    );
  }

  setPoint(index, point, override, fromAlertCreation) {
    if (this._points[0].index === this._points[1].index && index >= 4) {
      return;
    }
    this._snapPointBeforeChange(index, point, override);
    const pointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[0])
    );
    const lastPointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[1])
    );
    const newPointToScreen = ensureNotNull(this.pointToScreenPoint(point));
    const coordOffsetWhileMovingOrChanging = ensureNotNull(
      this._coordOffsetWhileMovingOrChanging
    );
    const priceScale = ensure(this.priceScale());
    const firstValue = ensureNotNull(this.ownerSource()).firstValue();
    switch (index) {
      case 0:
        super.setPoint(index, point);
        this._points[2].price = priceScale.coordinateToPrice(
          newPointToScreen.y + coordOffsetWhileMovingOrChanging,
          firstValue
        );
        break;
      case 1:
        super.setPoint(index, point);
        break;
      case 2:
        super.setPoint(index, point);
        this._points[0].price = priceScale.coordinateToPrice(
          newPointToScreen.y - coordOffsetWhileMovingOrChanging,
          firstValue
        );
        this._points[0].index = point.index;
        break;
      case 3:
        this._points[1].price = priceScale.coordinateToPrice(
          newPointToScreen.y - coordOffsetWhileMovingOrChanging,
          firstValue
        );
        this._points[1].index = point.index;
        break;
      case 4: {
        const lineVector = lastPointToScreen.subtract(pointToScreen);
        const t = (newPointToScreen.x - pointToScreen.x) / lineVector.x;
        const intersectPoint = pointToScreen.addScaled(lineVector, t);
        const offsetY = newPointToScreen.y - intersectPoint.y;
        this._points[2].price = priceScale.coordinateToPrice(
          pointToScreen.y + offsetY,
          firstValue
        );
        break;
      }
      case 5: {
        const lineVector = lastPointToScreen.subtract(pointToScreen);
        const t = (newPointToScreen.x - pointToScreen.x) / lineVector.x;
        const intersectPoint = pointToScreen.addScaled(lineVector, t);
        const offsetY = newPointToScreen.y - intersectPoint.y;
        this._points[0].price = priceScale.coordinateToPrice(
          pointToScreen.y + offsetY,
          firstValue
        );
        this._points[1].price = priceScale.coordinateToPrice(
          lastPointToScreen.y + offsetY,
          firstValue
        );
        break;
      }
    }
    const linkKey = this.linkKey().value();
    if (linkKey && !fromAlertCreation && index < 4) {
      const prices = this._points.map((point) => point.price);
      changeLineStyle({
        model: this._model,
        linkKey: linkKey,
        state: {
          prices: prices,
        },
      });
    }
  }

  state(state) {
    const toolState = super.state(state);
    if (this._pendingPriceOffset !== null) {
      toolState.priceOffset = this._pendingPriceOffset;
    }
    return toolState;
  }

  restoreExternalState(state) {
    const { prices, ...toolState } = state;
    if (prices && this.isActualSymbol()) {
      for (let i = 0; i < prices.length; i++) {
        this._points[i].price = this._timePoint[i].price = prices[i];
      }
    }
    super.restoreExternalState(toolState);
  }

  restoreData(data) {
    if (data.priceOffset !== undefined) {
      this._pendingPriceOffset = data.priceOffset;
    }
  }

  getPoint(index) {
    if (index < 3) {
      return super.getPoint(index);
    }
    const firstPointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[0])
    );
    const lastPointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[1])
    );
    const thirdPointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[2])
    );
    if (!firstPointToScreen || !lastPointToScreen || !thirdPointToScreen) {
      return null;
    }
    switch (index) {
      case 3: {
        const offsetY = thirdPointToScreen.y - firstPointToScreen.y;
        const intersectPoint = lastPointToScreen.add(new Point(0, offsetY));
        return this.screenPointToPoint(intersectPoint);
      }
      case 4: {
        const offsetY = thirdPointToScreen.y - firstPointToScreen.y;
        const intersectPoint = lastPointToScreen.add(new Point(0, offsetY));
        const middlePoint = thirdPointToScreen.add(intersectPoint).scaled(0.5);
        return this.screenPointToPoint(middlePoint);
      }
      case 5: {
        const middlePoint = firstPointToScreen
          .add(lastPointToScreen)
          .scaled(0.5);
        return this.screenPointToPoint(middlePoint);
      }
    }
    return null;
  }

  alignCrossHairToAnchor(index) {
    return index <= 3;
  }

  pointsCount() {
    return 3;
  }

  name() {
    return "Parallel Channel";
  }

  hasEditableCoordinates() {
    return false;
  }

  addPoint(index, point, override) {
    const pointsCount = this.points().length;
    if (override && override.shift() && pointsCount === 2) {
      this._snapPoint45Degree(point, this.points()[0]);
    }
    if (pointsCount === 2) {
      point = this._convertLastPointTo3rdPoint(ensureNotNull(this._lastPoint));
    }
    return super.addPoint(index, point);
  }

  timeAxisPoints() {
    return this._axisPoints();
  }

  priceAxisPoints() {
    return this._axisPoints();
  }

  canHasAlert() {
    return true;
  }

  static createProperties(properties) {
    const defaultProperties = new DefaultProperty(
      "linetoolparallelchannel",
      properties
    );
    this._configureProperties(defaultProperties);
    return defaultProperties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const ParallelChannelDefinitionsViewModel = await Promise.all([
      e(7201),
      e(3753),
      e(5871),
      e(8167),
      e(8537),
    ]).then(e.bind(e, 21905));
    return ParallelChannelDefinitionsViewModel;
  }

  _getAlertPlots() {
    const thirdPoint = this.getPoint(3);
    if (!thirdPoint) {
      return [];
    }
    const points = [
      this._points[0],
      this._points[1],
      this._points[2],
      thirdPoint,
    ];
    const getLinePoints = (point1, point2) =>
      point1.index <= point2.index ? [point1, point2] : [point2, point1];
    const upperLinePoints = getLinePoints(points[0], points[1]);
    const lowerLinePoints = getLinePoints(points[2], points[3]);
    let upperPoints, lowerPoints;
    if (points[2].price < points[0].price) {
      upperPoints = lowerLinePoints;
      lowerPoints = upperLinePoints;
    } else {
      upperPoints = upperLinePoints;
      lowerPoints = lowerLinePoints;
    }
    const extendLeft = this.properties().childs().extendLeft.value();
    const extendRight = this.properties().childs().extendRight.value();
    return [
      this._linePointsToAlertPlot(
        upperPoints,
        "Upper",
        extendLeft,
        extendRight
      ),
      this._linePointsToAlertPlot(
        lowerPoints,
        "Lower",
        extendLeft,
        extendRight
      ),
    ].filter((plot) => plot !== null);
  }

  _correctLastPoint(point) {
    if (
      this._points.length < 2 ||
      this._points[1].index === this._points[0].index
    ) {
      return point;
    }
    const newPointToScreen = ensureNotNull(this.pointToScreenPoint(point));
    const lastPointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[1])
    );
    const firstPointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[0])
    );
    const lineVector = lastPointToScreen.subtract(firstPointToScreen);
    const t = (newPointToScreen.x - firstPointToScreen.x) / lineVector.x;
    const intersectPoint = firstPointToScreen.addScaled(lineVector, t);
    const offsetY = newPointToScreen.y - intersectPoint.y;
    const newPointWithOffset = firstPointToScreen.add(new Point(0, offsetY));
    return ensureNotNull(this.screenPointToPoint(newPointWithOffset));
  }

  _isTimePointsValid() {
    return this._timePoint.every((point) => Number.isFinite(point.price));
  }

  _axisPoints() {
    const points = this.points();
    const firstPointToScreen = this._points[0]
      ? this.pointToScreenPoint(this._points[0])
      : null;
    const lastPointToScreen = this._points[1]
      ? this.pointToScreenPoint(this._points[1])
      : null;
    const thirdPointToScreen = this._points[2]
      ? this.pointToScreenPoint(this._points[2])
      : null;
    if (firstPointToScreen && lastPointToScreen && thirdPointToScreen) {
      const offsetY = lastPointToScreen.y - firstPointToScreen.y;
      const newPointWithOffset = thirdPointToScreen.add(new Point(0, offsetY));
      points.push(ensureNotNull(this.screenPointToPoint(newPointWithOffset)));
    }
    return points;
  }

  _convertLastPointTo3rdPoint(point) {
    const newPointToScreen = ensureNotNull(this.pointToScreenPoint(point));
    const lastPointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[1])
    );
    const firstPointToScreen = ensureNotNull(
      this.pointToScreenPoint(this._points[0])
    );
    const lineVector = lastPointToScreen.subtract(firstPointToScreen);
    const t = (newPointToScreen.x - firstPointToScreen.x) / lineVector.x;
    const intersectPoint = firstPointToScreen.addScaled(lineVector, t);
    const offsetY = newPointToScreen.y - intersectPoint.y;
    const newPointWithOffset = firstPointToScreen.add(new Point(0, offsetY));
    return ensureNotNull(this.screenPointToPoint(newPointWithOffset));
  }

  _findPixelsHeight() {
    const thirdPointToScreen = this.pointToScreenPoint(this._points[2]);
    const firstPointToScreen = this.pointToScreenPoint(this._points[0]);
    return thirdPointToScreen && firstPointToScreen
      ? thirdPointToScreen.y - firstPointToScreen.y
      : null;
  }

  _applyPendingPriceOffset() {
    const priceOffset = this._pendingPriceOffset;
    if (priceOffset === null || this._points.length < 3) {
      return;
    }
    const priceScale = this.priceScale();
    const firstValue = ensureNotNull(this.ownerSource()).firstValue();
    if (!priceScale || priceScale.isEmpty() || firstValue === null) {
      return;
    }
    const newPointPrice1 = priceOffset + this._points[0].price;
    const newPointPrice2 = priceOffset + this._points[1].price;
    const newPointPriceMiddle =
      0.5 * (newPointPrice1 + newPointPrice2) - priceOffset;
    const newPointPrice = 0.5 * (newPointPrice1 + newPointPrice2);
    const firstPointCoordinate = priceScale.priceToCoordinate(
      newPointPriceMiddle,
      firstValue
    );
    const secondPointCoordinate = priceScale.priceToCoordinate(
      newPointPrice,
      firstValue
    );
    const coordinateOffset = secondPointCoordinate - firstPointCoordinate;
    const newPointPriceCoordinate =
      priceScale.priceToCoordinate(this._points[0].price, firstValue) +
      coordinateOffset;
    const newPointPriceValue = priceScale.coordinateToPrice(
      newPointPriceCoordinate,
      firstValue
    );
    this._points[2].price = newPointPriceValue;
    this._timePoint[2].price = newPointPriceValue;
    this._points[2].index = this._points[0].index;
    this._timePoint[2].time_t = this._timePoint[0].time_t;
    this._timePoint[2].offset = this._timePoint[0].offset;
    this._pendingPriceOffset = null;
  }

  _snapPointBeforeChange(index, point, override) {
    if (override && override.shift()) {
      switch (index) {
        case 0:
        case 1:
          this._snapPoint45Degree(point, this._points[1 - index]);
          break;
        case 2:
        case 3:
          const middlePoint = ensureNotNull(this.getPoint(5 - index));
          this._snapPoint45Degree(point, middlePoint);
      }
    }
  }
}
