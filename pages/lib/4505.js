import { TranslatedString, t } from "i18n"; // ! not correct
import { UndoCommand } from "./UndoCommand";
import { defaultsPreferencesByWhiteList } from "./12416";
import { ensureNotNull } from "./assertions";
import { tradingService } from "./40493";

import { dateFormatProperty, restoreDateFormatSettingsValue } from "./83407";

import {
  timeHoursFormatProperty,
  restoreTimeHoursFormatSettingsValue,
} from "./16164";

import {
  addPlusButtonProperty,
  restoreAddPlusButtonSettingsValue, // ! not correct
} from "addPlusButtonSettings"; // ! not correct

import {
  showMarketOpenStatusProperty,
  restoreShowMarketOpenStatusProperty,
} from "./98425";

import {
  currencyUnitVisibilityProperty, // ! not correct
  restoreCurrencyUnitVisibilitySettingsValue, // ! not correct
} from "currencyUnitVisibilitySettings";

const applyAllChartPropertiesString = new TranslatedString(
  "apply all chart properties",
  t(null, undefined, import(64034))
);

class RestoreDefaultsPreferencesUndoCommand extends UndoCommand {
  constructor(model) {
    super(applyAllChartPropertiesString);

    this._trading = null;
    this._oldShowSellBuyButtons = null;
    this._oldNoConfirmEnabled = null;
    this._oldShowOnlyRejectionNotifications = null;
    this._oldShowPricesWithZeroVolume = null;
    this._oldShowPricesWithSpread = null;
    this._oldOrderExecutedSoundEnabled = null;
    this._prevWatermarkPreferences = null;
    this._model = model;

    this._trading = tradingService();
    if (this._trading !== null) {
      this._oldShowSellBuyButtons = this._trading.showSellBuyButtons.value();
      this._oldNoConfirmEnabled = this._trading.noConfirmEnabled.value();
      this._oldShowOnlyRejectionNotifications =
        this._trading.showOnlyRejectionNotifications.value();
      this._oldShowPricesWithZeroVolume = this._trading
        .showPricesWith()
        .zeroVolume.value();
      this._oldShowPricesWithSpread = this._trading
        .showPricesWith()
        .spread.value();
      this._oldOrderExecutedSoundEnabled =
        this._trading.orderExecutedSoundParams.enabled.value();
    }

    this._defaultsPreferences = defaultsPreferencesByWhiteList(
      this._model,
      this._model.mainSeries()
    );
    this._oldPreferences = model.preferences();
    this._prevDateFormat = dateFormatProperty.value();
    this._prevTimeHoursFormat = timeHoursFormatProperty.value();
    this._prevAddPlusButton = addPlusButtonProperty.value();
    this._prevShowOpenMarkerStatus = showMarketOpenStatusProperty.value();
    this._prevCurrencyUnitVisibility = currencyUnitVisibilityProperty().value();

    const watermarkSource = this._model.watermarkSource();
    if (watermarkSource !== null) {
      this._prevWatermarkPreferences = watermarkSource.properties().state();
    }
  }

  redo() {
    if (this._trading !== null) {
      this._trading.showSellBuyButtons.setValue(true);
      this._trading.noConfirmEnabled.setValue(false);
      this._trading.showOnlyRejectionNotifications.setValue(false);
      this._trading.showPricesWith().zeroVolume.setValue(true);
      this._trading.showPricesWith().spread.setValue(true);
      this._trading.orderExecutedSoundParams.enabled.setValue(false);
    }

    this._model.applyPreferences(this._defaultsPreferences);
    this._model.updateScales();
    restoreDateFormatSettingsValue();
    restoreTimeHoursFormatSettingsValue();
    restoreAddPlusButtonSettingsValue();
    restoreShowMarketOpenStatusProperty();
    restoreCurrencyUnitVisibilitySettingsValue();

    const watermarkSource = this._model.watermarkSource();
    if (watermarkSource !== null) {
      watermarkSource.restorePropertiesDefaults();
    }
  }

  undo() {
    if (this._trading !== null) {
      this._trading.showSellBuyButtons.setValue(
        ensureNotNull(this._oldShowSellBuyButtons)
      );
      this._trading.noConfirmEnabled.setValue(
        ensureNotNull(this._oldNoConfirmEnabled)
      );
      this._trading.showOnlyRejectionNotifications.setValue(
        ensureNotNull(this._oldShowOnlyRejectionNotifications)
      );
      this._trading
        .showPricesWith()
        .zeroVolume.setValue(ensureNotNull(this._oldShowPricesWithZeroVolume));
      this._trading
        .showPricesWith()
        .spread.setValue(ensureNotNull(this._oldShowPricesWithSpread));
      this._trading.orderExecutedSoundParams.enabled.setValue(
        ensureNotNull(this._oldOrderExecutedSoundEnabled)
      );
    }

    this._model.applyPreferences(this._oldPreferences);
    this._model.updateScales();
    dateFormatProperty.setValue(this._prevDateFormat);
    timeHoursFormatProperty.setValue(this._prevTimeHoursFormat);
    showMarketOpenStatusProperty.setValue(this._prevShowOpenMarkerStatus);
    addPlusButtonProperty.setValue(this._prevAddPlusButton);
    currencyUnitVisibilityProperty().setValue(this._prevCurrencyUnitVisibility);

    const watermarkSource = this._model.watermarkSource();
    if (watermarkSource !== null && this._prevWatermarkPreferences !== null) {
      watermarkSource.properties().mergeAndFire(this._prevWatermarkPreferences);
    }
  }
}

export { RestoreDefaultsPreferencesUndoCommand };
