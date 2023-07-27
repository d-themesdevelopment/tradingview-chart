import { LineDataSource } from "./13087";
import { DefaultProperty } from "./46100";
import { LineToolColorsProperty } from "./68806";
// import { ArrowMarkPaneView } from 'LibraryName2';

import {
  LineToolArrowMark,
  LineToolArrowMarkDown,
  LineToolArrowMarkLeft,
  LineToolArrowMarkRight,
  LineToolArrowMarkUp,
} from "./20521";

class LineToolArrowMark extends LineDataSource {
  constructor(chartWidget, name, properties, options, priceAxisViews) {
    const toolProperties =
      properties || LineToolArrowMark.createProperties(null, name);
    super(chartWidget, toolProperties, options, priceAxisViews);
    this._textPaneView = null;
    import(/* webpackChunkName: "library2" */ "LibraryName2").then(
      ({ ArrowMarkPaneView }) => {
        const paneView = [new ArrowMarkPaneView(this, chartWidget)];
        this._setPaneViews(paneView);
      }
    );
  }

  paneViews() {
    const paneViews = super.paneViews();
    if (paneViews !== null && this._textPaneView) {
      paneViews.push(this._textPaneView);
    }
    return paneViews;
  }

  pointsCount() {
    return 1;
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  static createProperties(properties, toolName) {
    const toolProperties = new DefaultProperty(toolName, properties);
    this._configureProperties(toolProperties);
    return toolProperties;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(/* webpackChunkName: "library3" */ "LibraryName3"),
      import(/* webpackChunkName: "library4" */ "LibraryName4"),
      import(/* webpackChunkName: "library5" */ "LibraryName5"),
      import(/* webpackChunkName: "library6" */ "LibraryName6"),
      import(/* webpackChunkName: "library7" */ "LibraryName7"),
    ]).then(
      ({ ArrowMarkDefinitionsViewModel }) => ArrowMarkDefinitionsViewModel
    );
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text);
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().arrowColor])
    );
    properties.addChild(
      "textsColors",
      new LineToolColorsProperty([properties.childs().color])
    );
    if (!properties.hasChild("text")) {
      properties.addChild("text", "");
    }
    properties.addExclusion("text");
  }
}

LineToolArrowMark.version = 2;

class LineToolArrowMarkLeft extends LineToolArrowMark {
  constructor(chartWidget, name, properties, options) {
    super(chartWidget, name, "linetoolarrowmarkleft", properties, options);
  }

  direction() {
    return "left";
  }

  name() {
    return "Arrow Mark Left";
  }

  textAlignParams() {
    return {
      horzAlign: "left",
      vertAlign: "middle",
      offsetX: 22,
      offsetY: 3,
    };
  }

  static createProperties(properties) {
    return super.createProperties(properties, "linetoolarrowmarkleft");
  }
}

class LineToolArrowMarkUp extends LineToolArrowMark {
  constructor(chartWidget, name, properties, options) {
    super(chartWidget, name, "linetoolarrowmarkup", properties, options);
  }

  direction() {
    return "up";
  }

  name() {
    return "Arrow Mark Up";
  }

  textAlignParams() {
    return {
      horzAlign: "center",
      vertAlign: "top",
      offsetX: 0,
      offsetY: 20,
    };
  }

  static createProperties(properties) {
    return super.createProperties(properties, "linetoolarrowmarkup");
  }
}

class LineToolArrowMarkRight extends LineToolArrowMark {
  constructor(chartWidget, name, properties, options) {
    super(chartWidget, name, "linetoolarrowmarkright", properties, options);
  }

  direction() {
    return "right";
  }

  name() {
    return "Arrow Mark Right";
  }

  textAlignParams() {
    return {
      horzAlign: "right",
      vertAlign: "middle",
      offsetX: 22,
      offsetY: 3,
      forceTextAlign: true,
    };
  }

  static createProperties(properties) {
    return super.createProperties(properties, "linetoolarrowmarkright");
  }
}

class LineToolArrowMarkDown extends LineToolArrowMark {
  constructor(chartWidget, name, properties, options) {
    super(chartWidget, name, "linetoolarrowmarkdown", properties, options);
  }

  direction() {
    return "down";
  }

  name() {
    return "Arrow Mark Down";
  }

  textAlignParams() {
    return {
      horzAlign: "center",
      vertAlign: "bottom",
      offsetX: 0,
      offsetY: 20,
    };
  }

  static createProperties(properties) {
    return super.createProperties(properties, "linetoolarrowmarkdown");
  }
}

export {
  LineToolArrowMark,
  LineToolArrowMarkDown,
  LineToolArrowMarkLeft,
  LineToolArrowMarkRight,
  LineToolArrowMarkUp,
};
