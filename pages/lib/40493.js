"use strict";

const { hasService, service } = require("path/to/trading-service-module");

export const tradingService = {
  id: "TradingService",
};

function getTradingService() {
  return hasService(tradingService) ? service(tradingService) : null;
}
