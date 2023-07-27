"use strict";

var s = i(56840);
var r = i(14483);
var n = i(58275);
var o = i.n(n);

const defaultVisible = !r.enabled("hide_left_toolbar_by_default");
const storedVisible = s.getBool(
  "ChartDrawingToolbarWidget.visible",
  defaultVisible
);
const isDrawingToolbarVisible = new (o())(storedVisible);

export { isDrawingToolbarVisible };
