"use strict";

const { t } = i(44352);

const sessionDescriptionMap = new Map([
  ["Premarket", t(null, { context: "sessions" }, i(56935))],
  ["Postmarket", t(null, { context: "sessions" }, i(98801))],
  ["Regular Trading Hours", t(null, { context: "sessions" }, i(24380))],
  ["Extended Trading Hours", t(null, { context: "sessions" }, i(97442))],
  ["Electronic Trading Hours", t(null, { context: "sessions" }, i(75610))],
]);

function translateSessionDescription(session) {
  return sessionDescriptionMap.get(session) || session;
}

const sessionShortDescriptionMap = new Map([
  ["Premarket", t(null, { context: "sessions" }, i(56137))],
  ["Postmarket", t(null, { context: "sessions" }, i(32929))],
  ["Regular Trading Hours", t(null, { context: "sessions" }, i(63798))],
  ["Extended Trading Hours", t(null, { context: "sessions" }, i(33021))],
  ["Electronic Trading Hours", t(null, { context: "sessions" }, i(33021))],
]);

function translateSessionShortDescription(session) {
  return sessionShortDescriptionMap.get(session) || session;
}

export { translateSessionDescription, translateSessionShortDescription };
