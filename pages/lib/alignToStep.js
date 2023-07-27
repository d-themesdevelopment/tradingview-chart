
import { BigNumber } from 'bignumber.js';

function alignToStep(value, step) {
  return BigNumber(value).div(step).round(0, BigNumber.ROUND_HALF_UP).mul(step).toNumber();
}