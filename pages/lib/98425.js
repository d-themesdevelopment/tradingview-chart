
import { createPrimitiveProperty } from './createPrimitiveProperty.js';
import { getBool, remove, setValue, onSync } from './56840.js';

const CHART_MARKET_OPEN_STATUS_PROPERTY = "Chart.ShowMarketOpenStatus";

function getDefaultShowMarketOpenStatus() {
  return getBool(CHART_MARKET_OPEN_STATUS_PROPERTY, true);
}

export const showMarketOpenStatusProperty = createPrimitiveProperty(getDefaultShowMarketOpenStatus());

export function restoreShowMarketOpenStatusProperty() {
  showMarketOpenStatusProperty.setValue(true);
  remove(CHART_MARKET_OPEN_STATUS_PROPERTY);
}

onSync.subscribe(null, () => showMarketOpenStatusProperty.setValue(getDefaultShowMarketOpenStatus()));

showMarketOpenStatusProperty.subscribe(null, () => setValue(CHART_MARKET_OPEN_STATUS_PROPERTY, showMarketOpenStatusProperty.value()));

