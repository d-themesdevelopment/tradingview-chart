import { ensureDefined, ensureNotNull } from "some-library";
import { LineDataSource, Point, sourceChangeEvent } from "another-library";
import { TextPaneView } from "yet-another-library";
import { DefaultProperty, LineToolColorsProperty } from "property-library";
import { t } from "translation-library";

class LineToolText extends LineDataSource {
  constructor(chartWidget, properties, sourceId, internalId) {
    const defaultProperties = properties || LineToolText.createProperties();
    super(chartWidget, defaultProperties, sourceId, internalId);
    this.barSpacing = chartWidget.timeScale().barSpacing();
    this.recalculatePointsOnCenter = false;

    import(
      /* webpackChunkName: "chart-pane-view" */ "chart-pane-view-library"
    ).then(({ TextPaneView }) => {
      const onCenterPositionChange = this.recalculatePointsOnCenter
        ? (x, y) => {
            if (this.recalculatePointsOnCenter) {
              this.recalculateCenterPosition(x, y);
            }
          }
        : undefined;

      this.setPaneViews([
        new TextPaneView(
          this,
          chartWidget,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          onCenterPositionChange
        ),
      ]);
    });
  }

  centerPosition() {
    this.recalculatePointsOnCenter = true;
  }

  setPoint(index, point, overrideProperties) {
    const childProperties = this.properties().childs();
    if (index === 1 && childProperties.wordWrapWidth.value()) {
      const timeScale = this.model().timeScale();
      const anchorX = this.isFixed()
        ? ensureDefined(this.fixedPoint()).x
        : timeScale.indexToCoordinate(this.points()[0].index);
      const width =
        timeScale.indexToCoordinate(point.index) -
        anchorX -
        ~~(childProperties.fontsize.value() / 6);
      if (!isFinite(width)) return;
      childProperties.wordWrapWidth.setValue(Math.max(100, width));
    }
  }

  pointsCount() {
    return 1;
  }

  name() {
    return "Text";
  }

  setPriceScale(priceScale) {
    super.setPriceScale(priceScale);
    if (priceScale && priceScale.priceRange()) {
      this.priceDensity =
        priceScale.height() / ensureNotNull(priceScale.priceRange()).length();
      this.isPriceDensityLog = priceScale.isLog();
    }
  }

  restoreSize() {
    const priceScale = ensureNotNull(this.priceScale());
    this.barSpacing = this.model().timeScale().barSpacing();
    this.priceDensity =
      priceScale.height() / ensureNotNull(priceScale.priceRange()).length();
    this.redraw(sourceChangeEvent(this.id()));
  }

  redraw(event) {
    this.updateAllViews(event);
    this.model().updateSource(this);
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  state(event) {
    const state = super.state(event);
    if (event) {
      state.state.fixedSize = false;
    }
    return state;
  }

  barSpacing() {
    return this.barSpacing;
  }

  priceDensity() {
    return this.priceDensity;
  }

  isPriceDensityLog() {
    return this.isPriceDensityLog;
  }

  hasEditableCoordinates() {
    return false;
  }

  shouldBeRemovedOnDeselect() {
    return this.properties().childs().text.value().trim() === "";
  }

  static createProperties(properties) {
    const defaultProperties = new DefaultProperty("linetooltext", properties);
    this.configureProperties(defaultProperties);
    return defaultProperties;
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text);
  }

  _getPropertyDefinitionsViewModelClass() {
    return import(
      /* webpackChunkName: "text-definitions-view-model" */ "text-definitions-view-model-library"
    ).then(({ TextDefinitionsViewModel }) => TextDefinitionsViewModel);
  }

  static configureProperties(properties) {
    super.configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild(
        "text",
        new TextProperty(
          t(
            null,
            undefined,
            import(
              /* webpackChunkName: "translation-library" */ "translation-library"
            )
          )
        )
      );
    }
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().borderColor])
    );
    properties.addChild(
      "textsColors",
      new LineToolColorsProperty([properties.childs().color])
    );
    properties.addExclusion("text");
    properties.addExclusion("linesColors");
    properties.addExclusion("textsColors");
  }

  recalculateCenterPosition(width, height) {
    const fixedPoint = this.isFixed()
      ? ensureDefined(this.fixedPoint())
      : ensureNotNull(this.pointToScreenPoint(this._points[0]));
    const newPoint = new Point(
      fixedPoint.x - width / 2,
      fixedPoint.y - height / 2
    );
    const newCoordinates = ensureNotNull(this.screenPointToPoint(newPoint));
    this.setPoints([newCoordinates]);
    this.normalizePoints();
    this.createServerPoints();
    this.redraw(sourceChangeEvent(this.id()));
  }
}

export class LineToolTextAbsolute extends LineToolText {
  constructor(chartWidget, properties) {
    super(chartWidget, properties || LineToolTextAbsolute.createProperties());
  }

  name() {
    return "Anchored Text";
  }

  hasEditableCoordinates() {
    return false;
  }

  isFixed() {
    return true;
  }

  static createProperties(properties) {
    const defaultProperties = new DefaultProperty(
      "linetooltextabsolute",
      properties
    );
    this.configureProperties(defaultProperties);
    return defaultProperties;
  }
}

export { LineToolText, LineToolTextAbsolute };
