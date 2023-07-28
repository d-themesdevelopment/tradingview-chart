"use strict";

const { t } = require(44352); // ! not correct
const { DefaultProperty } = require("./46100");
const { LineToolColorsProperty } = require("./68806");
const { LineDataSource } = require("./13087");
const { ensureNotNull, ensureDefined } = require("./assertions");
// const { SignpostPaneView } = require(59452);

const {
  positionToCoordinate,
  positionVisualDirection,
  seriesPrice,
  seriesBasePosition,
  noDataBasePosition,
} = require("./85573");

const { changeLineStyle } = require("./88348");

class SignpostPositionProperty extends ensureNotNull() {
  constructor(source) {
    super();
    this._source = source;
  }

  value() {
    const position = this._source.properties().childs().position.value();
    return parseFloat(position.toFixed(2));
  }

  setValue(value) {
    this._source.properties().childs().position.setValue(value);
    this._source.model().updateSource(this._source);
    this.listeners().fire(this);
    this._source.syncMultichartState({
      pricesChanged: false,
      indexesChanged: false,
    });
  }
}

class SignpostPointIndexProperty extends LineDataSourcePointIndexProperty {
  constructor(source, pointIndex) {
    super(source, pointIndex);
    this._source = source;
  }

  _setPointImpl(point) {
    this._source.setPointAndChangeIndex(this._pointIndex, point);
  }
}

class SignpostLineDataSource extends LineDataSource {
  constructor() {
    super();
    this._startMovingAnchorY = NaN;
  }

  priceSource() {
    return this.ownerSource();
  }

  addPoint(time, price, index) {
    return super.addPoint(
      this._updatePositionAndCorrectPoint(time),
      price,
      index
    );
  }

  setPoint(index, time, price) {
    super.setPoint(
      index,
      this._updatePositionAndCorrectPoint(
        time,
        !this.isPhantom() && !this._allowChangeAnchorHorizontally()
      ),
      price
    );
    this._syncPosition();
  }

  setPointAndChangeIndex(index, time, price) {
    super.setPoint(
      index,
      this._updatePositionAndCorrectPoint(time, false),
      price
    );
    this._syncPosition();
  }

  startMoving(time, price, index, selectSeries) {
    if (!selectSeries) {
      this._startMovingAnchorY = ensureNotNull(this._anchorYCoordinate());
    }
    super.startMoving(time, price, index);
  }

  move(time, price, index, selectSeries) {
    const startMovingPoint = ensureNotNull(this.startMovingPoint());
    const endMovingPoint = ensureDefined(time.logical);

    if (!selectSeries && price === 0) {
      const startPoint = this._points[0];
      const pointOffset = endMovingPoint.index - startMovingPoint.index;
      const priceScale = ensureNotNull(this.priceScale());
      const firstValue = ensure(this.ownerSource()?.firstValue());
      const anchorPriceOffset =
        priceScale.priceToCoordinate(endMovingPoint.price, firstValue) -
        priceScale.priceToCoordinate(startMovingPoint.price, firstValue);
      const newAnchorY = this._startMovingAnchorY + anchorPriceOffset;
      const newAnchorPrice = priceScale.coordinateToPrice(
        newAnchorY,
        firstValue
      );

      this._updatePositionAndCorrectPoint({
        index: startPoint.index + pointOffset,
        price: newAnchorPrice,
      });
    }

    super.move(time, price, index);

    if (!selectSeries) {
      this._syncPosition();
    }
  }

  _allowChangeAnchorHorizontally() {
    return false;
  }

  _updatePositionAndCorrectPoint(point, changeAnchorHorizontally) {
    if (changeAnchorHorizontally) {
      point.index = this._points[0].index;
    }

    const priceSource = this.priceSource();

    if (priceSource === null) {
      return point;
    }

    const priceScale = priceSource.priceScale();
    const firstValue = priceSource.firstValue();

    if (priceScale === null || priceScale.isEmpty() || firstValue === null) {
      return point;
    }

    const containerHeight = priceScale.height();
    let middlePriceCoordinate = containerHeight / 2;
    const upwardDirection =
      point.price >=
      priceScale.coordinateToPrice(middlePriceCoordinate, firstValue)
        ? 1
        : -1;

    const mainSeries = this._model.mainSeries();
    if (priceSource === mainSeries) {
      const baseIndex = mainSeries
        .data()
        .search(this._baseSeriesIndexForPoint(point));
      if (baseIndex !== null) {
        const previousPrice = seriesPrice(mainSeries, baseIndex, -1);
        const nextPrice = seriesPrice(mainSeries, baseIndex, 1);
        const direction = point.price >= previousPrice ? 1 : -1;
        middlePriceCoordinate = priceScale.priceToCoordinate(
          direction === 1 ? nextPrice : previousPrice,
          firstValue
        );
        point.price =
          direction === 1 ? Math.max(nextPrice, point.price) : point.price;
      }
    }

    const visualDirection =
      upwardDirection !== priceScale.isInverted() ? -1 : 1;
    const containerOffset =
      upwardDirection === -1
        ? middlePriceCoordinate
        : containerHeight - middlePriceCoordinate;
    const pointOffset = priceScale.priceToCoordinate(point.price, firstValue);
    const distance = Math.min(
      containerHeight,
      Math.abs(pointOffset - middlePriceCoordinate)
    );
    const position =
      Math.max(0, Math.min(100, (100 * distance) / containerOffset)) *
      upwardDirection;

    this.properties().childs().position.setValue(position);
    return point;
  }

  _baseSeriesIndexForPoint(point) {
    return point.index;
  }

  _syncPosition() {
    const linkKey = this.linkKey().value();

    if (linkKey !== null) {
      const state = {
        position: this.properties().childs().position.value(),
      };

      changeLineStyle({
        linkKey: linkKey,
        state: state,
        model: this._model,
      });
    }
  }

  _anchorYCoordinate() {
    const priceSource = this.priceSource();

    if (priceSource === null) {
      return null;
    }

    const priceScale = priceSource.priceScale();
    const firstValue = priceSource.firstValue();

    if (priceScale === null || priceScale.isEmpty() || firstValue === null) {
      return null;
    }

    const mainSeries = this._model.mainSeries();
    const customEvent = this.customEvent();

    if (customEvent === null) {
      return null;
    }

    let basePosition = null;
    if (priceSource === mainSeries) {
      basePosition = seriesBasePosition(mainSeries, customEvent);
    }

    if (basePosition === null) {
      basePosition = noDataBasePosition(customEvent, priceScale, firstValue);
    }

    if (basePosition === null) {
      return null;
    }

    const position = customEvent.position();
    const priceCoordinate = priceScale.priceToCoordinate(
      basePosition.price,
      firstValue
    );

    return positionToCoordinate(
      position,
      priceScale.height(),
      priceCoordinate,
      positionVisualDirection(position, priceScale.isInverted())
    );
  }
}

class LineToolSignpost extends SignpostLineDataSource {
  constructor(model, properties, options, priceScale) {
    super(
      model,
      properties !== null && properties !== void 0
        ? properties
        : LineToolSignpost.createProperties(),
      options,
      priceScale
    );

    require(1583)
      .then(require.bind(require, 26294))
      .then((SignpostPaneView) => {
        this._setPaneViews([new SignpostPaneView(this, model)]);
      });
  }

  pointsCount() {
    return 1;
  }

  name() {
    return "Signpost";
  }

  customEvent() {
    return {
      index: () => this.points()[0]?.index ?? null,
      position: () => this.properties().childs().position.value(),
    };
  }

  showInObjectTree() {
    return !this.isPhantom() && super.showInObjectTree();
  }

  isPhantom() {
    return this._model.isPhantomLine(this);
  }

  clonePositionOffset() {
    return {
      barOffset: 1,
      xCoordOffset: 0,
      yCoordOffset: 0,
    };
  }

  template() {
    const template = super.template();
    const properties = this.properties().childs();
    template.text = properties.text.value();
    template.position = properties.position.value();
    return template;
  }

  shouldBeRemovedOnDeselect() {
    const properties = this._properties.childs();
    if (properties.showImage.value()) {
      return false;
    }
    return properties.text.value().trim() === "";
  }

  static createProperties(index) {
    const properties = new DefaultProperty("linetoolsignpost", index);
    this._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild(
        "text",
        new ensureNotNull()(t(null, undefined, require(37229)))
      );
    }
    if (!properties.hasChild("position")) {
      properties.addChild("position", new ensureNotNull()(50));
    }
    properties.addExclusion("text");
    properties.addExclusion("position");
    properties.addChild(
      "backgroundsColors",
      new LineToolColorsProperty([properties.childs().plateColor])
    );
    return properties;
  }

  _createPointProperty(index) {
    super._createPointProperty(index);
    const pointProperty = this._pointsProperty.childs().points[index];
    pointProperty.removeProperty("price");
    pointProperty.removeProperty("bar");
    pointProperty.addChild("price", new SignpostPositionProperty(this));
    pointProperty.addChild("bar", new SignpostPointIndexProperty(this, 0));
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text);
    this.properties().childs().position.setValue(template.position);
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      require(7201),
      require(3753),
      require(5871),
      require(8167),
      require(8537),
    ])
      .then(require.bind(require, 18613))
      .then((viewModels) => {
        return viewModels.SignpostDefinitionsViewModel;
      });
  }

  static _configureProperties(properties) {
    LineDataSource._configureProperties(properties);
  }
}

LineToolSignpost.supportPhantomMode = true;
