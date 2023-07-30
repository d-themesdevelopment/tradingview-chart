import { bind, e } from "import-module";
import { LineDataSource } from "./13087";
// import { CalloutPaneView } from "callout-pane-view-module";
import { LineToolColorsProperty } from "./68806";
import { DefaultProperty } from "./68806";
import { t } from "t-module";

class LineToolCallout extends LineDataSource {
  constructor(source, model, properties, options) {
    super(
      source,
      properties || LineToolCallout.createProperties(),
      model,
      options
    );
    this._barOffset = 0;
    this._dragStartLeftEdgeIndex = NaN;
    this._timeScale = source.timeScale();

    e(1583)
      .then(bind(70326))
      .then((CalloutPaneView) => {
        this._setPaneViews([new CalloutPaneView(this, this._model)]);
      });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Callout";
  }

  getBarOffset() {
    return this._barOffset;
  }

  shouldBeRemovedOnDeselect() {
    return this._properties.childs().text.value().trim() === "";
  }

  addPoint(point) {
    const added = super.addPoint(point);
    if (added) {
      this._calculateBarOffset();
    }
    return added;
  }

  setLastPoint(point) {
    const set = super.setLastPoint(point);
    if (set && this.points().length === 2) {
      this._calculateBarOffset();
    }
    return set;
  }

  setPoint(index, point) {
    switch (index) {
      case 0:
        super.setPoint(index, point);
        this._calculateBarOffset();
        break;
      case 1:
        const properties = this.properties().childs();
        if (!properties.wordWrapWidth) return;

        const points = this._points;
        const dragStartIndex = this._dragStartLeftEdgeIndex;
        const middleIndex = Math.round((point.index - dragStartIndex) / 2);

        if (Number.isFinite(dragStartIndex) && Number.isFinite(middleIndex)) {
          points[1] = {
            index: dragStartIndex + middleIndex,
            price: points[1].price,
          };

          this._calculateBarOffset();
          this.normalizePoints();

          const wrapWidth =
            this._timeScale.indexToCoordinate(
              dragStartIndex + 2 * middleIndex
            ) -
            this._timeScale.indexToCoordinate(dragStartIndex) -
            8 -
            2;
          if (Number.isFinite(wrapWidth)) {
            properties.wordWrapWidth.setValue(Math.max(100, wrapWidth));
            break;
          }
        }

        points[1] = point;
        this._calculateBarOffset();
        this.normalizePoints();
    }
  }

  setPoints(points) {
    super.setPoints(points);

    const properties = this.properties().childs();
    if (!properties.wordWrapWidth) return;

    const dragStartIndex = this._dragStartLeftEdgeIndex;
    const middleIndex = Math.round((points[1].index - dragStartIndex) / 2);

    this._calculateBarOffset();
    this.normalizePoints();

    if (Number.isFinite(dragStartIndex) && Number.isFinite(middleIndex)) {
      const wrapWidth =
        this._timeScale.indexToCoordinate(dragStartIndex + 2 * middleIndex) -
        this._timeScale.indexToCoordinate(dragStartIndex) -
        8 -
        2;
      if (Number.isFinite(wrapWidth)) {
        properties.wordWrapWidth.setValue(Math.max(100, wrapWidth));
      }
    }
  }

  move(dx, dy, index) {
    super.move(dx, dy, index);
    this._calculateBarOffset();
  }

  state(exclusions) {
    const state = super.state(exclusions);
    state.barOffset = this._barOffset;
    return state;
  }

  restoreData(data) {
    if (data.barOffset) {
      this._barOffset = data.barOffset;
    } else {
      this._calculateBarOffset();
    }
    this.calculatePoint2();
  }

  setPriceScale(priceScale) {
    super.setPriceScale(priceScale);
    if (priceScale && priceScale.priceRange()) {
      this.calculatePoint2();
    }
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  calculatePoint2() {
    if (
      this._model.lineBeingEdited() === this ||
      this._model.sourcesBeingMoved().includes(this)
    ) {
      return;
    }
    if (this._points.length < 2) {
      return;
    }
    const [p1, p2] = this.points();
    this._points[1] = {
      price: p2.price,
      index: p1.index + this._barOffset,
    };
  }

  static createProperties(properties) {
    const defaultProperty = new DefaultProperty("linetoolcallout", properties);
    this._configureProperties(defaultProperty);
    return defaultProperty;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild("text", new n()(t(null, undefined, i(37229))));
    }
    properties.addExclusion("text");
    properties.addChild(
      "textsColors",
      new LineToolColorsProperty([properties.childs().color])
    );
  }

  _calculateBarOffset() {
    if (this.points().length > 1) {
      this._barOffset = this.points()[1].index - this.points()[0].index;
    }
  }
}

export { LineToolCallout as LineToolCallout };
