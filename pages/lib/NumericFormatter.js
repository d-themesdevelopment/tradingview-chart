
import { LineDataSource } from '<path_to_LineDataSource_module>';
import { alignToStep } from '<path_to_alignToStep_module>';

class NumericFormatter {
  constructor(precision) {
    this._precision = precision;
  }

  format(value) {
    return (this._precision !== undefined ? value.toFixed(this._precision) : NumericFormatter.formatNoE(value)).replace(".", formatterOptions.decimalSign);
  }

  parse(value) {
    const formattedValue = value.replace(formatterOptions.decimalSign, ".");
    let parsedValue = parseFloat(formattedValue);
    if (this._precision) {
      parsedValue = +parsedValue.toFixed(this._precision);
    }
    return parsedValue;
  }

  static formatNoE(value) {
    if (!Number.isFinite(value)) {
      return String(value);
    }
    const bigValue = new Big(value);
    return bigValue.lt(1) ? bigValue.toFixed() : bigValue.toString();
  }
}

export { NumericFormatter };