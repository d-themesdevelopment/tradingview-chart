  import {ensureNotNull} from "./assertions.js";
  import {translateMessage} from "./44352.js";
  import {TranslatedString} from "./TranslatedString.js";
  import {UndoCommand} from "./UndoCommand.js";
  import {defaultsPreferencesByWhiteList} from "./12416.js";
  import {dateFormatProperty, restoreDateFormatSettingsValue} from "./83407.js";
  import {timeHoursFormatProperty, restoreTimeHoursFormatSettingsValue} from "./16164.js";
  import {showMarketOpenStatusProperty, restoreShowMarketOpenStatusProperty} from "./98425.js";
  import {currencyUnitVisibilityProperty, restoreShowMarketOpenStatusProperty} from "./42226.js";
  import {tradingService} from "./40493.js";
  import {addPlusButtonProperty, restoreAddPlusButtonSettingsValue, addPlusButtonProperty} from "./11095.js";

  const ChartPropString = new TranslatedString("apply all chart properties", translateMessage(null, void 0, "apply all chart properties"));
  class RestoreDefaultsPreferencesUndoCommand extends UndoCommand {
      constructor(e) {
          super(ChartPropString), this._trading = null, this._oldShowSellBuyButtons = null, this._oldNoConfirmEnabled = null, this._oldShowOnlyRejectionNotifications = null, this._oldShowPricesWithZeroVolume = null, this._oldShowPricesWithSpread = null, this._oldOrderExecutedSoundEnabled = null, this._prevWatermarkPreferences = null, this._model = e, this._trading = tradingService(), null !== this._trading && (this._oldShowSellBuyButtons = this._trading.showSellBuyButtons.value(), this._oldNoConfirmEnabled = this._trading.noConfirmEnabled.value(), this._oldShowOnlyRejectionNotifications = this._trading.showOnlyRejectionNotifications.value(), this._oldShowPricesWithZeroVolume = this._trading.showPricesWith().zeroVolume.value(), this._oldShowPricesWithSpread = this._trading.showPricesWith().spread.value(), this._oldOrderExecutedSoundEnabled = this._trading.orderExecutedSoundParams.enabled.value()), this._defaultsPreferences = defaultsPreferencesByWhiteList(this._model, this._model.mainSeries()), this._oldPreferences = e.preferences(), this._prevDateFormat = dateFormatProperty.value(), this._prevTimeHoursFormat = timeHoursFormatProperty.value(), this._prevAddPlusButton = addPlusButtonProperty.value(), this._prevShowOpenMarkerStatus = showMarketOpenStatusProperty.value(), this._prevCurrencyUnitVisibility = currencyUnitVisibilityProperty().value();
          const t = this._model.watermarkSource();
          null !== t && (this._prevWatermarkPreferences = t.properties().state())
      }
      redo() {
          null !== this._trading && (this._trading.showSellBuyButtons.setValue(!0), this._trading.noConfirmEnabled.setValue(!1), this._trading.showOnlyRejectionNotifications.setValue(!1), this._trading.showPricesWith().zeroVolume.setValue(!0), this._trading.showPricesWith().spread.setValue(!0),
              this._trading.orderExecutedSoundParams.enabled.setValue(!1)), this._model.applyPreferences(this._defaultsPreferences), this._model.updateScales(), restoreDateFormatSettingsValue(), restoreTimeHoursFormatSettingsValue(), restoreAddPlusButtonSettingsValue(), restoreShowMarketOpenStatusProperty(), restoreCurrencyUnitVisibilitySettingsValue();
          const e = this._model.watermarkSource();
          null !== e && e.restorePropertiesDefaults()
      }
      undo() {
          null !== this._trading && (this._trading.showSellBuyButtons.setValue(ensureNotNull(this._oldShowSellBuyButtons)), this._trading.noConfirmEnabled.setValue(ensureNotNull(this._oldNoConfirmEnabled)), this._trading.showOnlyRejectionNotifications.setValue(ensureNotNull(this._oldShowOnlyRejectionNotifications)), this._trading.showPricesWith().zeroVolume.setValue(ensureNotNull(this._oldShowPricesWithZeroVolume)), this._trading.showPricesWith().spread.setValue(ensureNotNull(this._oldShowPricesWithSpread)), this._trading.orderExecutedSoundParams.enabled.setValue(ensureNotNull(this._oldOrderExecutedSoundEnabled))), this._model.applyPreferences(this._oldPreferences), this._model.updateScales(), dateFormatProperty.setValue(this._prevDateFormat), timeHoursFormatProperty.setValue(this._prevTimeHoursFormat), showMarketOpenStatusProperty.setValue(this._prevShowOpenMarkerStatus), p.addPlusButtonProperty.setValue(this._prevAddPlusButton), currencyUnitVisibilityProperty().setValue(this._prevCurrencyUnitVisibility);
          const e = this._model.watermarkSource();
          null !== e && null !== this._prevWatermarkPreferences && e.properties().mergeAndFire(this._prevWatermarkPreferences)
      }
  }