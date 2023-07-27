import { ensureNotNull, ensureDefined } from "./assertions";

import { LineDataSource } from "./13087";
import { LineDataSourceThemedProperty } from "./77680";

import { getHexColorByName } from "./48891";

import { commonLineToolPropertiesStateKeys } from "./commonLineToolPropertiesStateKeys";

import {
  factoryDefaultsForCurrentTheme,
  extractAllPropertiesKeys,
} from "./13637";

import { LineToolColorsProperty } from "./68806";

const priceNoteBaseProperties = {
  intervalsVisibilities: {
    ...commonLineToolPropertiesStateKeys.intervalsVisibilitiesDefaults,
  },
  showLabel: false,
  horzLabelsAlign: "center",
  vertLabelsAlign: "top",
  fontSize: 14,
  bold: false,
  italic: false,
  priceLabelFontSize: 12,
  priceLabelBold: false,
  priceLabelItalic: false,
};

const primaryColor = getHexColorByName("color-tv-blue-500");
const themedColors = {
  lineColor: primaryColor,
  textColor: primaryColor,
  priceLabelBackgroundColor: primaryColor,
  priceLabelBorderColor: primaryColor,
  priceLabelTextColor: getHexColorByName("color-white"),
};

const themedDefaults = new Map([
  [StdTheme.Light, themedColors],
  [StdTheme.Dark, themedColors],
]);

const allPropertiesKeys = [
  ...extractAllPropertiesKeys(
    ensureDefined(themedDefaults.get(StdTheme.Light))
  ),
  ...extractAllPropertiesKeys(priceNoteBaseProperties),
  ...commonLineToolPropertiesStateKeys,
  "text",
];

class LineToolPriceNoteProperty extends LineDataSourceThemedProperty {
  constructor(id, name, model, propertyList, defaults, options) {
    super(id, name, model, propertyList, allPropertiesKeys, defaults, options);
    this._textProperty = new TextProperty(ensureDefined(options?.text) ?? "");
    this.addChild("text", this._textProperty);
    this.addChild(
      "linesColors",
      new LineToolColorsProperty([ensureDefined(this.child("lineColor"))])
    );
    this.addChild(
      "backgroundsColors",
      new LineToolColorsProperty([
        ensureDefined(this.child("priceLabelBackgroundColor")),
      ])
    );
    this.addChild(
      "textsColors",
      new LineToolColorsProperty([
        ensureDefined(this.child("priceLabelTextColor")),
      ])
    );
  }

  template() {
    return {
      ...super.template(),
      text: this._textProperty.value(),
    };
  }

  static create(options) {
    return new this(
      "linetoolpricenote",
      "Price Note",
      factoryDefaultsForCurrentTheme(priceNoteBaseProperties, themedDefaults),
      allPropertiesKeys,
      options
    );
  }
}

const { sourceChangeEvent } = require("another-module-import-path-3");

class LineToolPriceNote extends LineDataSource {
  constructor(id, properties, model, options) {
    super(
      id,
      properties || LineToolPriceNote.createProperties(),
      model,
      options
    );
    this._labelMovingDelta = null;
    import(29734 /* path-to-PriceNotePaneView */).then(
      ({ PriceNotePaneView }) => {
        this._setPaneViews([new PriceNotePaneView(this, id)]);
      }
    );
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Price Note";
  }

  template() {
    return this._properties.template();
  }

  startMoving(event, startPoint, logicalPoint) {
    if (startPoint === 1) {
      if (this.isSourceHidden()) return;
      const logicalStartPoint = ensureDefined(event.logical);
      const endPoint = this.points()[1];
      this._labelMovingDelta = {
        index: endPoint.index - logicalStartPoint.index,
        price: endPoint.price - logicalStartPoint.price,
      };
      this.startChanging(startPoint, logicalStartPoint);
    } else {
      this._labelMovingDelta = null;
      super.startMoving(event, startPoint, logicalPoint);
    }
  }

  move(event, endPointIndex, logicalPoint) {
    if (this._labelMovingDelta !== null) {
      const logicalEndPoint = ensureDefined(event.logical);
      const newEndPoint = {
        index: logicalEndPoint.index + this._labelMovingDelta.index,
        price: logicalEndPoint.price + this._labelMovingDelta.price,
      };
      this.setPoint(1, newEndPoint, logicalPoint);
      this.updateAllViews(sourceChangeEvent(this.id()));
    } else {
      super.move(event, endPointIndex, logicalPoint);
    }
  }

  endMoving(event, endPoint, logicalPoint) {
    if (this._labelMovingDelta !== null) {
      this._labelMovingDelta = null;
      this.endChanging(false, event);
    } else {
      super.endMoving(event, endPoint, logicalPoint);
    }
  }

  static createProperties() {
    const properties = LineToolPriceNoteProperty.create();
    this._configureProperties(properties);
    return properties;
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text);
  }

  async _getPropertyDefinitionsViewModelClass() {
    const { PriceNoteDefinitionsViewModel } = await Promise.all([
      import(7201 /* path-to-module-1 */),
      import(3753 /* path-to-module-2 */),
      import(5871 /* path-to-module-3 */),
      import(8167 /* path-to-module-4 */),
      import(8537 /* path-to-module-5 */),
    ]).then((module) => module[0]);
    return PriceNoteDefinitionsViewModel;
  }

  _snapTo45DegreesAvailable() {
    return true;
  }
}

export { LineToolPriceNote };
