
import { PriceFormatter } from '<path_to_PriceFormatter_module>';
import { forceLTRStr } from '<path_to_forceLTRStr_module>';

export class PercentageFormatter extends PriceFormatter {
  constructor(priceScale) {
    super(priceScale);
    this.type = "percentage";
  }

  state() {
    const state = PriceFormatter.prototype.state.call(this);
    state.percent = true;
    return state;
  }

  parse(text) {
    text = text.replace("%", "");
    return super.parse(text);
  }

  format(price, tick, fractionDigits, rounding = true, forceLTR = true) {
    const formatted = super.format(price, tick, fractionDigits, rounding, false) + "%";
    return forceLTR ? forceLTRStr(formatted) : formatted;
  }

  static serialize(formatter) {
    return formatter.state();
  }

  static deserialize(state) {
    return new PercentageFormatter(state.priceScale);
  }
}