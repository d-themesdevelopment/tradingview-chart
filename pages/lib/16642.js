"use strict";

var s = require("./46100");
var r = require("./LineToolBrushBase");
var n = require("./68806");

class LineToolBrush extends r.LineToolBrushBase {
  constructor(source, options, priceScale, model) {
    super(
      source,
      options || LineToolBrush.createProperties(),
      priceScale,
      model
    );
    this._loadPaneViews(source);
  }

  smooth() {
    return this.properties().childs().smooth.value();
  }

  name() {
    return "Brush";
  }

  hasEditableCoordinates() {
    return false;
  }

  static createProperties(properties) {
    const lineToolBrushProperty = new s.DefaultProperty(
      "linetoolbrush",
      properties
    );
    this._configureProperties(lineToolBrushProperty);
    return lineToolBrushProperty;
  }

  _loadPaneViews(source) {
    i.e(1583)
      .then(i.bind(i, 48188))
      .then((PaneView) => {
        this._setPaneViews([new PaneView.BrushPaneView(this, source)]);
      });
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)])
      .then(i.bind(i, 26430))
      .then((ViewModel) => ViewModel.BrushDefinitionsViewModel);
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addChild(
      "backgroundsColors",
      new n.LineToolColorsProperty(
        [properties.childs().backgroundColor],
        properties.childs().fillBackground
      )
    );
  }
}

export { LineToolBrush };
