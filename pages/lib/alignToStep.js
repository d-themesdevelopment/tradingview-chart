
import { BigNumber } from '<path_to_BigNumber_module>';

function alignToStep(value, step) {
  return BigNumber(value).div(step).round(0, BigNumber.ROUND_HALF_UP).mul(step).toNumber();
}