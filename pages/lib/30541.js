import { getHexColorByName, generateColor } from "./48891";
import { generateColor } from "./87095";
import { StdTheme } from "./26843";
import { LineDataSourceThemedProperty } from "./77680";
import { intervalsVisibilitiesDefaults } from "./intervalsVisibilitiesDefaults";

const tvBlue500 = getHexColorByName("color-tv-blue-500");
const nonThemedFactoryDefaults = {
  linewidth: 1,
  fontsize: 12,
  fillLabelBackground: true,
  fillBackground: true,
  backgroundTransparency: 60,
  intervalsVisibilities: { ...intervalsVisibilitiesDefaults },
  customText: {
    visible: false,
    fontsize: 12,
    bold: false,
    italic: false,
  },
};

const themedFactoryDefaults = new Map([
  [
    StdTheme.Light,
    {
      textcolor: getHexColorByName("color-black"),
      labelBackgroundColor: getHexColorByName("color-white"),
      linecolor: tvBlue500,
      backgroundColor: generateColor(tvBlue500, 85),
      shadow: "rgba(0, 0, 0, 0.2)",
      customText: {
        color: tvBlue500,
      },
    },
  ],
  [
    StdTheme.Dark,
    {
      textcolor: getHexColorByName("color-white"),
      labelBackgroundColor: getHexColorByName("color-cold-gray-800"),
      linecolor: tvBlue500,
      backgroundColor: generateColor(tvBlue500, 85),
      shadow: "rgba(0, 0, 0, 0.4)",
      customText: {
        color: tvBlue500,
      },
    },
  ],
]);

const allPropertiesStateKeysBase = ["customText.text"];

class DateAndPriceBaseProperties extends LineDataSourceThemedProperty {
  constructor(name, defaultValue, themeValues, theme, model, options) {
    super(name, defaultValue, themeValues, theme, model, options);
    this._textProperty = new TextProperty(options?.customText?.text || "");
    this.childs().customText?.addChild("text", this._textProperty);
  }

  template() {
    const template = super.template();
    template.customText.text = this._textProperty.value();
    return template;
  }
}
