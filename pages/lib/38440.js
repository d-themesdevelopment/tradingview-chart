"use strict";
const { LineDataSource } = require("./13087");
const { DefaultProperty, LineToolColorsProperty } = require("./46100");

export class LineToolBalloon extends LineDataSource {
  constructor(e, t, i, s) {
    super(e, t || LineToolBalloon.createProperties(), i, s);
    this._createPaneView();
  }

  pointsCount() {
    return 1;
  }

  name() {
    return "Balloon";
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  shouldBeRemovedOnDeselect() {
    return "" === this._properties.childs().text.value().trim();
  }

  static createProperties(e) {
    const properties = new DefaultProperty("linetoolballoon", e);
    LineToolBalloon._configureProperties(properties);
    return properties;
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text);
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)])
      .then(i.bind(i, 38534))
      .then(({ BalloonDefinitionsViewModel }) => BalloonDefinitionsViewModel);
  }

  _createPaneView() {
    i.e(1583)
      .then(i.bind(i, 74718))
      .then(({ BalloonPaneView }) => {
        this._setPaneViews([new BalloonPaneView(this, this._model)]);
      });
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild("text", new (a())(c));
    }
    properties.addExclusion("text");
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().borderColor])
    );
    properties.addChild(
      "textsColors",
      new LineToolColorsProperty([properties.childs().color])
    );
  }
}

return { LineToolBalloon };
