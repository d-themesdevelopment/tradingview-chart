"use strict";

class MetaInfoHelper {
  constructor(metaInfo) {
    this._metaInfo = metaInfo;
  }

  hasUserEditableInputs() {
    return this._metaInfo.inputs.some(isUserEditableInput);
  }

  getUserEditableInputs() {
    return this._metaInfo.inputs.filter(isUserEditableInput);
  }

  hasUserEditableProperties() {
    return StudyMetaInfo.isScriptStrategy(this._metaInfo);
  }

  hasUserEditableStyles() {
    const { plots, bands, filledAreas, graphics } = this._metaInfo;
    return (
      plots.length > 0 ||
      bands !== undefined ||
      filledAreas !== undefined ||
      isCustomStudy(this._metaInfo.shortId) ||
      StudyMetaInfo.isScriptStrategy(this._metaInfo) ||
      Object.values(graphics).some((g) => g !== undefined)
    );
  }

  getUserEditablePlots() {
    const uniqueTargets = new Set();
    const { plots, ohlcPlots, styles } = this._metaInfo;

    return plots.filter((plot) => {
      if (
        isColorerPlot(plot) ||
        isTextColorerPlot(plot) ||
        isDataOffsetPlot(plot) ||
        isOhlcColorerPlot(plot) ||
        isAlertConditionPlot(plot) ||
        isDataPlot(plot)
      ) {
        return false;
      }

      if (isOhlcPlot(plot)) {
        const target = plot.target;
        if (uniqueTargets.has(target)) {
          return false;
        }
        uniqueTargets.add(target);
        const ohlcPlotsInfo = ensureDefined(ohlcPlots);
        return !ensureDefined(ohlcPlotsInfo[target]).isHidden;
      } else {
        const style = styles ? styles[plot.id] : undefined;
        return style === undefined || !style.isHidden;
      }
    });
  }

  hasUserEditableOptions() {
    return (
      this.hasUserEditableInputs() ||
      this.hasUserEditableProperties() ||
      this.hasUserEditableStyles()
    );
  }

  getStrategyProperties() {
    const { inputs } = this._metaInfo;
    const strategyInputs = inputs.filter(isStrategyInput);
    const strategyProperties = { ...defaultStrategyProperties };

    for (const input of strategyInputs) {
      const internalId = input.internalID;
      strategyProperties[internalId] = input;
      if (!defaultStrategyProperties.hasOwnProperty(internalId)) {
        getLogger("Platform.GUI.PropertyDialog.Indicators.MetaInfo").logWarn(
          `Unknown strategy input internal id ${internalId} in ${this._metaInfo.fullId}`
        );
      }
    }

    return clone(strategyProperties);
  }
}

const defaultStrategyProperties = {
  currency: undefined,
  backtest_fill_limits_assumption: undefined,
  calc_on_every_tick: undefined,
  calc_on_order_fills: undefined,
  commission_value: undefined,
  commission_type: undefined,
  initial_capital: undefined,
  pyramiding: undefined,
  slippage: undefined,
  default_qty_type: undefined,
  default_qty_value: undefined,
  margin_long: undefined,
  margin_short: undefined,
  use_bar_magnifier: undefined,
  process_orders_on_close: undefined,
  fill_orders_on_standard_ohlc: undefined,
};

function isUserEditableInput(input) {
  return !input.groupId && !input.isHidden && input.id !== RangeDependentStudyInputNames.FirstBar && input.id !== RangeDependentStudyInputNames.LastBar;
}

function isStrategyInput(input) {
  return input.groupId === "strategy_props";
}
