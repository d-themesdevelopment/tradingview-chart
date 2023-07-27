const TOOLBAR_WIDTH_EXPANDED = 52;
const TOOLBAR_WIDTH_COLLAPSED = 5;

const tooltipDataMap = new WeakMap();

export function getTooltipData(element, key) {
  const data = tooltipDataMap.get(element);
  return data instanceof Function ? data(key) : data && data[key];
}

export function setTooltipData(element, key, value) {
  if (value instanceof Function) {
    tooltipDataMap.set(element, value);
  } else {
    const data = tooltipDataMap.get(element);
    const newData = typeof data === "function" ? {} : data || {};
    newData[key] = value;
    tooltipDataMap.set(element, newData);
  }
}
