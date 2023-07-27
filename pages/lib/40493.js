"use strict";

const { hasService, service } = require("./16216.js");

export const tradingService = {
  id: "TradingService",
};

function getTradingService() {
  return hasService(tradingService) ? service(tradingService) : null;
}
