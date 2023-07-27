
import { PriceFormatter } from './61146.js';
import { forceLTRStr } from './38223.js';

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