"use strict";

import { LineDataSource } from "./13087";
import { DefaultProperty } from "./46100";
import { LineToolColorsProperty } from "./68806";

class LineToolPriceLabel extends LineDataSource {
  constructor(e, t, s, r) {
    super(e, t || LineToolPriceLabel.createProperties(), s, r);
    import(1583).then((i) => {
      const { PriceLabelPaneView } = i;
      this._setPaneViews([new PriceLabelPaneView(this, this._model)]);
    });
  }

  pointsCount() {
    return 1;
  }

  name() {
    return "Price Label";
  }

  async _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537),
    ]).then((i) => i[0].PriceLabelDefinitionsViewModel);
  }

  static createProperties(e) {
    const t = new DefaultProperty("linetoolpricelabel", e);
    LineToolPriceLabel._configureProperties(t);
    return t;
  }

  static _configureProperties(e) {
    super._configureProperties(e);
    e.addChild(
      "linesColors",
      new LineToolColorsProperty([e.childs().borderColor])
    );
    e.addChild("textsColors", new LineToolColorsProperty([e.childs().color]));
  }
}

export { LineToolPriceLabel };
