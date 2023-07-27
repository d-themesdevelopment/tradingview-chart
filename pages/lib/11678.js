"use strict";

import { translateMessage } from ("./44352.js");

const sessionDescriptionMap = new Map([
  ["Premarket", translateMessage(null, { context: "sessions" }, "Premarket")],
  ["Postmarket", translateMessage(null, { context: "sessions" }, "Postmarket")],
  ["Regular Trading Hours", translateMessage(null, { context: "sessions" }, "Regular trading hours")],
  ["Extended Trading Hours", translateMessage(null, { context: "sessions" }, "Extended trading hours")],
  ["Electronic Trading Hours", translateMessage(null, { context: "sessions" }, "Electronic trading hours")],
]);

function translateSessionDescription(session) {
  return sessionDescriptionMap.get(session) || session;
}

const sessionShortDescriptionMap = new Map([
  ["Premarket", translateMessage(null, { context: "sessions" }, "PRE")],
  ["Postmarket", translateMessage(null, { context: "sessions" }, "POST")],
  ["Regular Trading Hours", translateMessage(null, { context: "sessions" }, "RTH")],
  ["Extended Trading Hours", translateMessage(null, { context: "sessions" }, "ETH")],
  ["Electronic Trading Hours", translateMessage(null, { context: "sessions" }, "ETH")],
]);

function translateSessionShortDescription(session) {
  return sessionShortDescriptionMap.get(session) || session;
}

export { translateSessionDescription, translateSessionShortDescription };
