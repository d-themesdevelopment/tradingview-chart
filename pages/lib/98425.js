
import { createPrimitiveProperty } from '<path_to_createPrimitiveProperty_module>';
import { getBool, remove, setValue, onSync } from '<path_to_sync_module>';

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

