"use strict";

// Import required modules
import { isEnabled as isHideLeftToolbarByDefaultEnabled } from './14483.js';
import { getBool } from './56840.js';
import { createObservable }from './58275';

// Determine if the default state of the toolbar should be visible or hidden
const isDefaultToolbarVisible = !isHideLeftToolbarByDefaultEnabled("hide_left_toolbar_by_default");

// Get the visibility status of the ChartDrawingToolbarWidget
const isChartDrawingToolbarWidgetVisible = getBool("ChartDrawingToolbarWidget.visible", isDefaultToolbarVisible);

// Create an observable for the visibility status
const observableVisible = new createObservable(isChartDrawingToolbarWidgetVisible);

// Export the observable
export { observableVisible as isDrawingToolbarVisible };
