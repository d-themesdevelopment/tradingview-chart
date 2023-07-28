import { Big } from "big.js"; // ! not correct
// import { getLogger } from "chartiq/js/legacy/log";

// const logger = getLogger("Chart.PriceFormatter");
const decimalSign = ".";
const decimalSignFractional = "'";

const formatterErrors = {
  custom: "Invalid value",
  fraction: "Invalid fractional value",
  secondFraction: "Invalid second fractional value",
};

function calculateFractionalLength(priceScale, minMove, fractional, minMove2) {
  let fractionalLength = 0;
  if (priceScale > 0 && minMove > 0) {
    let scale = priceScale;
    if (fractional && minMove2 && minMove2 > 0) {
      scale /= minMove2;
    }
    while (scale > 1) {
      scale /= 10;
      fractionalLength++;
    }
  }
  return fractionalLength;
}

export function numberToStringWithLeadingZero(number, length) {
  if (typeof number !== "number") {
    return "n/a";
  }
  if (!Number.isInteger(length)) {
    throw new TypeError("Invalid length");
  }
  if (length < 0 || length > 24) {
    throw new TypeError("Invalid length");
  }
  if (length === 0) {
    return number.toString();
  }
  return ("0000000000000000" + number.toString()).slice(-length);
}

function getVariableMinTickData(variableMinTickData, fractional) {
  if (typeof variableMinTickData !== "undefined") {
    const data = variableMinTickData.split(" ").map(Number);
    if (data.length % 2 === 0 || data.some(Number.isNaN)) {
      return [
        {
          minTick: variableMinTickData,
          price: Infinity,
          maxIndex: Infinity,
        },
      ];
    }
    const result = [];
    for (let i = 0; i < data.length; i += 2) {
      const price = typeof data[i + 1] !== "undefined" ? data[i + 1] : Infinity;
      const prevPrice = result[result.length - 1]?.price || 0;
      const prevMaxIndex = result[result.length - 1]?.maxIndex || 0;
      const maxIndex =
        price === Infinity
          ? Infinity
          : new Big(price)
              .minus(prevPrice)
              .div(data[i])
              .plus(prevMaxIndex)
              .toNumber();
      result.push({
        minTick: data[i],
        price,
        maxIndex,
      });
    }
    return result;
  }
  return undefined;
}

class PriceFormatter {
  constructor(
    priceScale,
    minMove,
    fractional,
    minMove2,
    variableMinTick,
    ignoreMinMove
  ) {
    if (
      typeof priceScale !== "number" ||
      !Number.isInteger(priceScale) ||
      priceScale < 0
    ) {
      throw new TypeError("Invalid base");
    }

    this.type = "price";
    this.priceScale = priceScale;
    this.minMove = minMove || 1;
    this.minMove2 = minMove2;
    this.variableMinTick = variableMinTick;
    this.variableMinTickData = getVariableMinTickData(
      undefined,
      variableMinTick
    );
    this.fractional = fractional;
    this.fractionalLength = calculateFractionalLength(
      priceScale,
      this.minMove,
      fractional,
      minMove2
    );
    this.ignoreMinMove = ignoreMinMove;
  }

  isFractional() {
    return !!this.fractional;
  }

  state() {
    return {
      fractional: this.fractional,
      fractionalLength: this.fractionalLength,
      minMove: this.minMove,
      minMove2: this.minMove2,
      priceScale: this.priceScale,
      variableMinTick: this.variableMinTick,
      ignoreMinMove: this.ignoreMinMove,
    };
  }

  formatChange(value, from, to) {
    return this._formatImpl(value - from, to);
  }

  format(
    value,
    withSign,
    signRequired,
    ignoreMinMove = false,
    removeEndingZeros = true
  ) {
    return this._formatImpl(
      value,
      withSign,
      signRequired,
      ignoreMinMove,
      removeEndingZeros
    );
  }

  parse(value) {
    if (value[0] === "+") {
      value = value.substring(1);
    }
    value = value.replace("−", "-");
    value = stripLTRMarks(value);

    if (value.includes("e")) {
      if (/^(-?)[0-9]+\.[0-9]*e(-?)[0-9]+$/.exec(value)) {
        const number = parseFloat(value.replace(decimalSign, "."));
        return {
          value: number,
          res: true,
          suggest: this.format(number),
        };
      }
      return {
        error: formatterErrors.custom,
        res: false,
      };
    }

    let match = /^(-?)[0-9]+$/.exec(value);
    if (match) {
      const number = parseFloat(value);
      return {
        value: number,
        res: true,
        suggest: this.format(number),
      };
    }

    match = new RegExp("^(-?)[0-9]+" + decimalSign + "[0-9]*$").exec(value);
    if (match) {
      const number = parseFloat(value.replace(decimalSign, "."));
      return {
        value: number,
        res: true,
        suggest: this.format(number),
      };
    }

    return {
      error: formatterErrors.custom,
      res: false,
    };
  }

  _formatImpl(value, withSign, signRequired, ignoreMinMove, removeEndingZeros) {
    const fractional = this.fractional;
    const priceScale = this.priceScale;
    const minMove = this.minMove;
    const fractionalLength = this.fractionalLength;

    let sign = "";
    if (value < 0) {
      if (!signRequired) {
        sign = "";
      } else {
        sign = "-";
      }
      value = -value;
    } else if (value && withSign) {
      sign = "+";
    }

    let result = "";
    if (value >= 0 && value < 1e15) {
      result = fractional
        ? this._formatAsFractional(value)
        : this._formatAsDecimal(value);
    } else {
      result = this._formatAsExponential(value);
    }

    return forceLTRStr(sign + result);
  }

  _formatAsExponential(value) {
    const exponent = Math.floor(0.75 * Math.log10(this.priceScale));
    const adjustedValue = value * Math.pow(10, exponent);
    const exponentString = `e-${exponent}`;
    const precision = Math.log10(this.priceScale) - exponent;
    return `${adjustedValue
      .toFixed(precision)
      .replace(".", decimalSign)}${exponentString}`;
  }

  _formatAsDecimal({
    price,
    priceScale,
    minMove,
    fractionalLength = 0,
    tailSize = 0,
    cutFractionalByPrecision = false,
  }) {
    if (priceScale > 1e15) {
      return this._formatAsExponential(price);
    }

    let denominator;
    if (this.fractional) {
      denominator = Math.pow(10, fractionalLength);
    } else {
      denominator =
        (Math.pow(10, tailSize) * priceScale) /
        (cutFractionalByPrecision ? 1 : minMove);
    }

    const denominatorInverse = 1 / denominator;

    let integerPart;
    if (denominator > 1) {
      integerPart = Math.floor(price);
    } else {
      const base = Math.floor(
        Math.round(price / denominatorInverse) * denominatorInverse
      );
      integerPart =
        Math.round((price - base) / denominatorInverse) === 0
          ? base
          : base + denominatorInverse;
    }

    let fractionalPart = "";
    if (denominator > 1) {
      const residual =
        price -
        integerPart -
        (priceScale > 1 ? fractionalPart / priceScale : 0);

      fractionalPart =
        decimalSign +
        numberToStringWithLeadingZero(
          residual.toFixed(fractionalLength),
          fractionalLength + tailSize
        );
      fractionalPart = this._removeEndingZeros(fractionalPart, tailSize);
    }

    return integerPart.toString() + fractionalPart;
  }

  _getFractPart(value, tailSize, priceScale) {
    const fracPart = {
      0: 0,
      5: 1,
    };
    const fracPart2 = {
      0: 0,
      2: 1,
      5: 2,
      7: 3,
    };
    const fracPart3 = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7,
    };
    if (tailSize === 2) {
      return typeof fracPart[value] === "undefined" ? -1 : fracPart[value];
    } else if (tailSize === 4) {
      return typeof fracPart2[value] === "undefined" ? -1 : fracPart2[value];
    } else if (tailSize === 8 && priceScale === 2) {
      return typeof fracPart3[value] === "undefined" ? -1 : fracPart3[value];
    }
    return value;
  }

  _formatAsFractional(value, tailSize = 0) {
    const priceScale = this.priceScale;
    const minMove = this.minMove;

    const integerPart = Math.floor(value);
    let fractionalPart = "";
    if (tailSize) {
      let residual = (value - integerPart) * priceScale;
      residual = Math.round(residual * Math.pow(10, tailSize));
      fractionalPart = numberToStringWithLeadingZero(residual, tailSize);
      fractionalPart = this._removeEndingZeros(fractionalPart, tailSize);
    }

    if (!this.fractionalLength) {
      throw new Error("_fractionalLength is not calculated");
    }

    let fractional = "";
    if (this.minMove2) {
      let residual =
        (value - integerPart - fractionalPart / priceScale) * priceScale;
      residual = Math.round(residual * this.minMove) % this.minMove;
      fractional = numberToStringWithLeadingZero(
        Math.floor(residual),
        this.fractionalLength
      );
      const secondFractional = this._getFractPart(
        Math.floor(residual % this.minMove2),
        1,
        priceScale
      );
      fractional += decimalSignFractional + secondFractional;
    } else {
      const residual = this._getFractPart(
        Math.floor(fractionalPart * minMove),
        1,
        priceScale
      );
      fractional = numberToStringWithLeadingZero(
        Math.floor(residual),
        this.fractionalLength * minMove
      );
    }

    return integerPart.toString() + decimalSignFractional + fractional;
  }

  _removeEndingZeros(value, tailSize) {
    for (let i = 0; i < tailSize && value[value.length - 1] === "0"; i++) {
      value = value.substring(0, value.length - 1);
    }
    return value;
  }

  _parseAsDecimal(value) {
    if (value.includes("e")) {
      if (/^(-?)[0-9]+\.[0-9]*e(-?)[0-9]+$/.exec(value)) {
        const number = parseFloat(value.replace(decimalSign, "."));
        return {
          value: number,
          res: true,
          suggest: this.format(number),
        };
      }
      return {
        error: formatterErrors.custom,
        res: false,
      };
    }

    let match = /^(-?)[0-9]+$/.exec(value);
    if (match) {
      const number = parseFloat(value);
      return {
        value: number,
        res: true,
        suggest: this.format(number),
      };
    }

    match = new RegExp("^(-?)[0-9]+" + decimalSign + "[0-9]*$").exec(value);
    if (match) {
      const number = parseFloat(value.replace(decimalSign, "."));
      return {
        value: number,
        res: true,
        suggest: this.format(number),
      };
    }

    return {
      error: formatterErrors.custom,
      res: false,
    };
  }

  _patchFractPart(value, tailSize, priceScale) {
    const part = {
      0: 0,
      5: 1,
    };
    const part2 = {
      0: 0,
      2: 1,
      5: 2,
      7: 3,
    };
    const part3 = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7,
    };
    if (tailSize === 2) {
      return typeof part[value] === "undefined" ? -1 : part[value];
    } else if (tailSize === 4) {
      return typeof part2[value] === "undefined" ? -1 : part2[value];
    } else if (tailSize === 8 && priceScale === 2) {
      return typeof part3[value] === "undefined" ? -1 : part3[value];
    }
    return value;
  }

  _parseAsSingleFractional(value) {
    let match = /^(-?)[0-9]+$/.exec(value);
    if (match) {
      const number = parseFloat(value);
      return {
        value: number,
        res: true,
        suggest: this.format(number),
      };
    }

    match = new RegExp(
      "^(-?)([0-9]+)" + decimalSignFractional + "([0-9]+)$"
    ).exec(value);
    if (match) {
      const negative = !!match[1];
      const integerPart = parseInt(match[2]);
      const priceScale = this.priceScale;
      const fracPart = this._getFractPart(parseInt(match[3]), 1, priceScale);

      if (fracPart >= priceScale || fracPart < 0) {
        return {
          error: formatterErrors.fraction,
          res: false,
        };
      }

      let number = integerPart + fracPart / priceScale;
      if (negative) {
        number = -number;
      }

      return {
        value: number,
        res: true,
        suggest: this.format(number),
      };
    }

    return {
      error: formatterErrors.custom,
      res: false,
    };
  }

  _parseAsDoubleFractional(value) {
    let match = /^(-?)[0-9]+$/.exec(value);
    if (match) {
      const number = parseFloat(value);
      return {
        value: number,
        res: true,
        suggest: this.format(number),
      };
    }

    match = new RegExp(
      "^(-?)([0-9]+)" +
        decimalSignFractional +
        "([0-9]+)" +
        decimalSignFractional +
        "([0-9]+)$"
    ).exec(value);
    if (match) {
      const negative = !!match[1];
      const integerPart = parseInt(match[2]);
      const priceScale = this.priceScale;
      const minMove2 = this.minMove2;
      const fracPart1 = this._getFractPart(parseInt(match[3]), 1, priceScale);
      const fracPart2 = this._getFractPart(parseInt(match[4]), 2, minMove2);

      if (fracPart1 >= priceScale || fracPart1 < 0) {
        return {
          error: formatterErrors.fraction,
          res: false,
        };
      }

      if (minMove2 && (fracPart2 >= minMove2 || fracPart2 < 0)) {
        return {
          error: formatterErrors.secondFraction,
          res: false,
        };
      }

      let number = NaN;
      if (minMove2) {
        const residual = (fracPart1 + fracPart2 / minMove2) / priceScale;
        number = integerPart + residual;
      }

      if (negative) {
        number = -number;
      }

      return {
        value: number,
        res: true,
        suggest: this.format(number),
      };
    }

    return {
      error: formatterErrors.custom,
      res: false,
    };
  }
}

export { PriceFormatter, numberToStringWithLeadingZero, formatterOptions };
