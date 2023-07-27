import { ensureNotNull } from "./assertions";
import {
  NumericFormatter,
  // resetTransparency
} from "./NumericFormatter";

import {
  LineDataSource,
  //  PriceAxisView
} from "./13087";
// import {
//   LevelsProperty,
//   LineToolWidthsProperty,
//   LineToolColorsProperty,
// } from "some-import-path";
// import { TranslatedString, t } from "some-import-path";
// import { hideAllDrawings, changeLineStyle } from "some-import-path";
import {
  RiskRewardPointIndex, // ! not correct
  RiskDisplayMode,
  // RiskRewardDefinitionsViewModel,
} from "./4895";
// import { DefaultProperty } from "some-import-path";
// import { sourceChangeEvent } from "some-import-path";
import {
  PriceRange,
  PriceAxisView as FibSpeedResistanceArcsDefinitionsViewModel,
} from "./PriceRange";

import { PriceAxisView as FibSpeedResistanceArcsDefinitionsViewModel } from "./42275";

class FibSpeedResistanceArcsLineDataSource extends LineDataSource {
  constructor(source, properties, model, priceScale) {
    super(
      source,
      properties || FibSpeedResistanceArcsLineDataSource.createProperties(),
      model,
      priceScale
    );
    this._syncStateExclusions = [
      "points",
      "entryPrice",
      "stopPrice",
      "targetPrice",
      "stopLevel",
      "profitLevel",
      "riskSize",
      "qty",
      "amountTarget",
      "amountStop",
    ];
    this._riskInChange = false;
    this.version = 2;

    if (
      !properties ||
      (!properties.hasChild("stopLevel") && !properties.hasChild("profitLevel"))
    ) {
      properties.addProperty("stopLevel", 0);
      properties.addProperty("profitLevel", 0);

      this.ownerSourceChanged().subscribe(this, () => {
        const visibleBarsRange = this._source
          .timeScale()
          .visibleBarsStrictRange();
        const firstBar = visibleBarsRange.firstBar();
        const lastBar = visibleBarsRange.lastBar();
        const ownerSource = ensureNotNull(this.ownerSource());
        const priceScale = ownerSource.priceScale();
        let priceRange = ensureNotNull(
          ownerSource.priceRange(firstBar, lastBar)
        );

        if (priceScale && priceScale.isLog()) {
          const minValue = priceScale.logicalToPrice(priceRange.minValue());
          const maxValue = priceScale.logicalToPrice(priceRange.maxValue());
          priceRange = new PriceRange(minValue, maxValue);
        }

        if (priceRange && !priceRange.isEmpty()) {
          const riskLevel = Math.round(
            0.2 * priceRange.length() * this.ownerSourceBase()
          );
          properties.stopLevel.setValue(riskLevel);
          properties.profitLevel.setValue(riskLevel);
        }
      });
    }

    const propertiesChilds = properties.childs();
    propertiesChilds.stopLevel.listeners().subscribe(this, this.recalculate);
    propertiesChilds.stopLevel.listeners().subscribe(null, () => {
      this.properties().childs().stopPrice.childChanged(null);
    });

    propertiesChilds.profitLevel.listeners().subscribe(this, this.recalculate);
    propertiesChilds.profitLevel.listeners().subscribe(null, () => {
      this.properties().childs().targetPrice.childChanged(null);
    });

    properties.addChild("entryPrice", new EntryPriceProperty(this));
    properties.addChild("stopPrice", new StopPriceProperty(this));
    properties.addChild("targetPrice", new TargetPriceProperty(this));

    if (!properties.hasChild("riskSize")) {
      properties.addProperty("riskSize", 0);
    }
    if (!properties.hasChild("qty")) {
      properties.addProperty("qty", 0);
    }
    if (!properties.hasChild("amountTarget")) {
      properties.addProperty(
        "amountTarget",
        propertiesChilds.accountSize.value()
      );
    }
    if (!properties.hasChild("amountStop")) {
      properties.addProperty(
        "amountStop",
        propertiesChilds.accountSize.value()
      );
    }

    properties.addExclusion("riskSize");
    properties.addExclusion("qty");
    properties.addExclusion("amountTarget");
    properties.addExclusion("amountStop");

    this._riskInPercentsFormatter = new NumericFormatter(2);
    this._riskInMoneyFormatter = new NumericFormatter();

    propertiesChilds.risk.subscribe(this, this._recalculateRiskSize);
    propertiesChilds.accountSize.subscribe(this, this._recalculateRiskSize);
    propertiesChilds.riskDisplayMode.subscribe(this, this._recalculateRisk);
    propertiesChilds.riskDisplayMode.subscribe(this, this._recalculateRiskSize);
    propertiesChilds.entryPrice.subscribe(this, this._recalculateRiskSize);
    propertiesChilds.stopPrice.subscribe(this, this._recalculateRiskSize);
    propertiesChilds.profitLevel.subscribe(this, this._recalculateRiskSize);
    propertiesChilds.profitLevel.subscribe(
      this,
      this.syncPriceLevels.bind(this)
    );
    propertiesChilds.stopLevel.subscribe(this, this._recalculateRiskSize);
    propertiesChilds.stopLevel.subscribe(this, this.syncPriceLevels.bind(this));
    propertiesChilds.qty.subscribe(this, this._recalculateRiskSize);

    this.ownerSourceChanged().subscribe(
      null,
      (oldOwnerSource, newOwnerSource) => {
        if (oldOwnerSource) {
          oldOwnerSource.barsProvider().dataUpdated().unsubscribeAll(this);
        }
        if (newOwnerSource) {
          newOwnerSource
            .barsProvider()
            .dataUpdated()
            .subscribe(this, this._onSeriesUpdated);
        }
      }
    );

    this.pointAdded().subscribe(this, (pointIndex) => {
      switch (pointIndex) {
        case RiskRewardPointIndex.Entry:
        case RiskRewardPointIndex.Close:
          this._recalculateRiskSize();
          this._recalculateQty();
          break;
      }
    });

    this.pointChanged().subscribe(this, (pointIndex) => {
      switch (pointIndex) {
        case RiskRewardPointIndex.Entry:
        case RiskRewardPointIndex.Close:
          this._recalculateRiskSize();
          this._recalculateQty();
          break;
      }
    });

    if (
      propertiesChilds.riskDisplayMode.value() === RiskDisplayMode.Percentage &&
      propertiesChilds.risk.value() > 100
    ) {
      propertiesChilds.riskDisplayMode.setValueSilently(RiskDisplayMode.Money);
    }

    propertiesChilds.entryPrice.subscribe(this, this._recalculateQty);
    propertiesChilds.stopPrice.subscribe(this, this._recalculateQty);
    propertiesChilds.riskSize.subscribe(this, this._recalculateQty);
    propertiesChilds.entryPrice.subscribe(this, this._recalculateAmount);
    propertiesChilds.profitLevel.subscribe(this, this._recalculateAmount);
  }
}
