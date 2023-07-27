"use strict";

import { LineDataSource } from "./13087";
import { DefaultProperty } from "./46100";
// import { t } from "translation-module";

class LineToolNote extends LineDataSource {
  static TOOLTIP_WIDTH = 300;
  static TOOLTIP_PADDING = 10;
  static TOOLTIP_LINESPACING = 5;
  static version = 1;

  constructor(chartWidget, options, properties, model) {
    super(
      chartWidget,
      options || LineToolNote.createProperties(),
      properties,
      model
    );
    this.version = LineToolNote.version;

    import("some-module-for-NotePaneView").then(({ NotePaneView }) => {
      this._setPaneViews([new NotePaneView(this, this._model)]);
    });
  }

  pointsCount() {
    return 1;
  }

  name() {
    return "Note";
  }

  getTooltipWidth() {
    return LineToolNote.TOOLTIP_WIDTH;
  }

  getTooltipPadding() {
    return LineToolNote.TOOLTIP_PADDING;
  }

  getTooltipLineSpacing() {
    return LineToolNote.TOOLTIP_LINESPACING;
  }

  template() {
    var template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text);
  }

  static createProperties(options) {
    if (options && options.markerColor && options.borderColor === undefined) {
      options.borderColor = options.markerColor;
    }
    var properties = new DefaultProperty("linetoolnote", options);
    LineToolNote._configureProperties(properties);
    return properties;
  }

  state(options) {
    var state = super.state(options);
    if (options) {
      state.state.fixedSize = false;
    }
    return state;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return (
      await Promise.all([
        import("module1"),
        import("module2"),
        import("module3"),
        import("module4"),
        import("module5"),
      ])
    ).NoteDefinitionsViewModel;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild(
        "text",
        new TranslationModule.t(null, undefined, TranslationModule.something)
      );
    }
    properties.addExclusion("text");
  }
}

class AnchoredLineToolNote extends LineToolNote {
  constructor(chartWidget, options) {
    super(chartWidget, options || AnchoredLineToolNote.createProperties());
  }

  title() {
    return TranslationModule.t(null, undefined, TranslationModule.something);
  }

  name() {
    return "Anchored Note";
  }

  isFixed() {
    return true;
  }

  hasEditableCoordinates() {
    return false;
  }

  static createProperties(options) {
    var properties = new DefaultProperty("linetoolnoteabsolute", options);
    LineToolNote._configureProperties(properties);
    return properties;
  }
}

export { LineToolNote, AnchoredLineToolNote };
