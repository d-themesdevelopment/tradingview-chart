
import { get_timezone } from '<path_to_timezone_module>';

export function parseTzOffset(timezone, currentTime = Date.now()) {
  const offset = get_timezone(timezone).offset_utc(currentTime);
  let sign = "";
  const hours = offset / 1000 / 60 / 60;
  if (hours % 1) {
    sign = ":" + Math.round(Math.abs(hours % 1 * 60)).toString().padStart(2, "0");
  }
  let str = "";
  str = hours > 0 ? "+" + (hours - hours % 1) + sign : hours === 0 ? "" : String(hours - hours % 1 + sign);

  return {
    offset,
    string: "UTC" + str
  };
}

