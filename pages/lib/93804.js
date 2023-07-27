"use strict";

const s = require("./50151");
const r = require("./61401");
const { ensureTimePointIndexIndex } = require("./1115");

export function materializeBackground(e, t) {
  if (e.start >= t.length || e.stop >= t.length) {
    return null;
  }

  const start = t[e.start];
  const stop = t[e.stop];

  if (stop === r.INVALID_TIME_POINT_INDEX) {
    return null;
  }

  s.assert(
    start === r.INVALID_TIME_POINT_INDEX || start <= stop,
    "start should not exceed stop"
  );

  return {
    start: start === r.INVALID_TIME_POINT_INDEX ? null : start,
    stop: stop,
  };
}

export function dematerializeBackground(e, t, i) {
  return {
    id: t,
    start: ensureTimePointIndexIndex(
      i.indexOf(e.start !== null ? e.start : r.INVALID_TIME_POINT_INDEX)
    ),
    stop: ensureTimePointIndexIndex(i.indexOf(e.stop)),
  };
}

export function isBackgroundInBarsRange(e, t) {
  if (e.start === null) {
    return t.firstBar() <= e.stop;
  }

  const start = Math.min(e.start, e.stop);
  const stop = Math.max(e.start, e.stop);

  return (
    t.contains(start) ||
    t.contains(stop) ||
    (start < t.firstBar() && stop > t.lastBar())
  );
}
