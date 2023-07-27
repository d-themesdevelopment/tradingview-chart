import { isNumber } from "./1722.js"; // Replace 'your-module-path' with the actual module path

class LimitedPrecisionNumericFormatter {
  constructor(precision = 1) {
    this._precision = precision;
  }

  format(value) {
    if (!isNumber(value)) {
      value = parseFloat(value);
    }

    const formattedValue = value.toFixed(this._precision);
    const minValue = Math.pow(10, -this._precision);

    return Math.max(parseFloat(formattedValue), minValue).toString();
  }

  parse(value) {
    const parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      return { res: false };
    }

    return {
      res: true,
      value: parsedValue,
      suggest: this.format(parsedValue),
    };
  }
}
