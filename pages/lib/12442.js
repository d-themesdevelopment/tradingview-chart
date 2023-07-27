"use strict";

// const {
//   LiveStudyGraphics,
//   createGraphicsPaneViews,
//   createGraphicsPriceAxisViews,
//   emptyStudyGraphics,
//   isStudyGraphicsEmpty,
//   loadStudyGraphics,
//   saveStudyGraphics,
// } = i;

const { getLogger } = require("./59224"); // ! not correct

// const { isObject } = i(87095);

export class PriceAxisView extends a.PriceAxisView {
  constructor(e, t) {
    super();
    this._source = e;
    this._data = t;
  }

  _updateRendererData(e, t, i) {
    e.visible = false;
    const n = this._source.priceScale();
    const o = this._source.properties().childs();
    const a = o.visible.value();

    if (!n || n.isEmpty() || !a) return;

    const c = o.graphics
      .childs()
      [this._data.lineType]?.childs()
      [this._data.styleId]?.childs();
    if (
      !(
        c?.visible &&
        c.visible.value() &&
        c.showPrice &&
        c.showPrice.value() &&
        this._isLabelVisibleAccordinglyToProperties()
      )
    )
      return;

    const h = this._source.firstValue();
    if (h === null) return;

    const d = this._data.line.level;
    const u = resetTransparency(c.color.value());
    i.background = u;
    i.textColor = this.generateTextColor(u);
    i.coordinate = n.priceToCoordinate(d, h);
    e.text = n.formatPrice(d, h, true);
    e.visible = true;
  }

  _isLabelVisibleAccordinglyToProperties() {
    const scalesProperties = this._source
      .model()
      .properties()
      .childs()
      .scalesProperties.childs();
    return (
      scalesProperties.showStudyLastValue.value() &&
      this._source.properties().childs().showLabelsOnPriceScale.value()
    );
  }
}

async function createGraphicsPaneViews(e, t, s, r) {
  const views = [];
  const graphicInfoKeys = Object.keys(e.graphicsInfo());
  graphicInfoKeys.sort((a, b) => getZOrder(a) - getZOrder(b));

  for (const graphicType of graphicInfoKeys) {
    const view = await createGraphicsPaneView(graphicType, e, t, s, r);
    if (view !== null) {
      views.push(view);
    } else if (!isUnsupportedGraphicType(graphicType)) {
      getLogger("Chart.StudyGraphics").logWarn(
        `${graphicType} is not supported by this build of the graphics subsystem, skipping`
      );
    }
  }

  return views;
}

async function createGraphicsPaneView(graphicType, e, t, s, r) {
  switch (graphicType) {
    case "hhists":
      return new (await i.e(507).then(i.bind(i, 21335))).HHistPaneView(e, t, s);
    case "horizlines":
      return new (await i.e(507).then(i.bind(i, 13369))).HorizLinePaneView(
        e,
        t,
        s
      );
    case "vertlines":
      return new (await i.e(507).then(i.bind(i, 78266))).VertLinePaneView(
        e,
        t,
        s
      );
    case "polygons":
      return new (await i.e(507).then(i.bind(i, 66999))).PolygonPaneView(
        e,
        t,
        s
      );
    case "backgrounds":
      return new (await i.e(507).then(i.bind(i, 47372))).BackgroundPaneView(
        e,
        t,
        s
      );
    default:
      return null;
  }
}

function createGraphicsPriceAxisViews(e) {
  const views = [];
  const graphicInfoKeys = Object.keys(e.graphicsInfo());

  for (const graphicType of graphicInfoKeys) {
    switch (graphicType) {
      case "hlines":
        e.graphics()
          .hlines()
          .forEach((lines, styleId) => {
            lines.forEach((line) => {
              if (line.level !== undefined) {
                views.push(
                  new PriceAxisView(e, {
                    line: {
                      level: line.level,
                    },
                    styleId,
                    lineType: graphicType,
                  })
                );
              }
            });
          });
        break;
      case "horizlines":
        e.graphics()
          .horizlines()
          .forEach((lines, styleId) => {
            lines.forEach((line) => {
              if (line.level !== undefined) {
                views.push(
                  new PriceAxisView(e, {
                    line: {
                      level: line.level,
                    },
                    styleId,
                    lineType: graphicType,
                  })
                );
              }
            });
          });
        break;
    }
  }

  return views;
}

function getZOrder(graphicType) {
  const zOrder = r.primitivesZOrders.get(graphicType);
  return zOrder !== undefined ? zOrder : 0;
}

function isUnsupportedGraphicType(graphicType) {
  return d.has(graphicType);
}

export {
  LiveStudyGraphics,
  createGraphicsPaneViews,
  createGraphicsPriceAxisViews,
  emptyStudyGraphics,
  isStudyGraphicsEmpty,
  loadStudyGraphics,
  saveStudyGraphics,
};
