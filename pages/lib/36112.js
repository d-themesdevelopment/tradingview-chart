import { getLogger } from "./assertions"; // ! not correct
import { ensureNotNull } from "./assertions";

import { Interval } from "./42960"; // ! not correct

import { isPriceSourceStyle } from "./42960";

import { DataSource } from "./14292";

import { enabled, getValue, setValue } from "./helpers";

import { BarFunction } from "lib/models/bar-function";
import { sourceChangeEvent } from "lib/model-event";
import { isNumber } from "lodash";
import { PriceScale } from "lib/models/price-scale";
import { timePointToIndex } from "lib/timescale/indexes-range";
import { firstValue } from "lib/timescale/time-series-data";
import { default as PlateViewData } from "lib/models/plate-view-data";

const logger = getLogger("Chart.BarsMarksContainer");
const END_OF_TIME = Math.round(new Date(2037, 0, 1).getTime() / 1e3);

class BarsMarksContainer extends DataSource {
  constructor(model, properties, options) {
    const onWidget = model.onWidget();
    let visible;
    if (onWidget) {
      visible = !model.hideIdeas();
    } else {
      visible =
        enabled("bars_marks") && getValue("BarsMarksContainer.visible", false);
    }
    properties.merge({ visible });
    properties.childs().visible.subscribe(null, (value) => {
      if (!onWidget && !model.isSnapshot() && enabled("bars_marks")) {
        setValue("BarsMarksContainer.visible", !!value());
      }
    });

    super(options);

    this._paneViews = [];
    this._model = model;
    this._properties = properties;
    this._requests = [];
    this._marks = {};
    this._loadedRange = null;
    this._getDataTimeout = null;
    this._collectedRange = null;
    this._lastRange = null;

    const mainSeries = this._model.mainSeries();
    mainSeries.onSymbolIntervalChanged().subscribe(this, this.clearMarks);
    mainSeries.dataEvents().symbolResolved().subscribe(this, this.clearMarks);
    mainSeries
      .dataEvents()
      .completed()
      .subscribe(this, () => {
        const data = mainSeries.data();
        if (data.size() === 0) return;

        const firstIndex = ensureNotNull(data.first()).index;
        const lastIndex = ensureNotNull(data.last()).index;
        const timeScale = this.timeScale();
        const range = {
          start:
            timeScale.indexToTimePoint(
              Math.max(
                timeScale.visibleBarsStrictRange().firstBar(),
                firstIndex
              )
            ) || Infinity,
          end:
            timeScale.indexToTimePoint(
              Math.min(timeScale.visibleBarsStrictRange().lastBar(), lastIndex)
            ) || -Infinity,
        };
        this.getData(range);
      });

    this._initialize();
    this._pinnedTooltips = {};
  }

  destroy() {
    const mainSeries = this._model.mainSeries();
    mainSeries.onSymbolIntervalChanged().unsubscribeAll(this);
    mainSeries.dataEvents().symbolResolved().unsubscribeAll(this);
    mainSeries.dataEvents().completed().unsubscribeAll(this);
  }

  properties() {
    return this._properties;
  }

  marks() {
    return this._marks;
  }

  pinTooltip(id, tooltip) {
    this._pinnedTooltips[id] = tooltip;
  }

  timeScale() {
    return this._model.timeScale();
  }

  getIntervalInTicks() {
    const interval = this._model
      .mainSeries()
      .properties()
      .childs()
      .interval.value();
    const parsedInterval = Interval.parse(interval);
    if (!parsedInterval.isValid()) {
      throw new TypeError("Unexpected interval");
    }
    return parsedInterval.isRange()
      ? 60
      : parsedInterval.inMilliseconds() / 1000;
  }

  getVisibleTickMarksRange() {
    const timeScale = this.timeScale();
    if (timeScale.isEmpty()) {
      return { start: 0, end: 0 };
    }

    const visibleBarsRange = ensureNotNull(timeScale.visibleBarsStrictRange());
    const { firstIndex, lastIndex } = ensureNotNull(
      timeScale.points().range().value()
    );

    if (
      !(
        visibleBarsRange.lastBar() > firstIndex &&
        visibleBarsRange.firstBar() < lastIndex
      )
    ) {
      return { start: 0, end: 0 };
    }

    let end;
    if (visibleBarsRange.lastBar() < lastIndex) {
      end = timeScale.indexToTimePoint(visibleBarsRange.lastBar());
    } else {
      end = END_OF_TIME;
    }

    return {
      start: ensureNotNull(
        timeScale.indexToTimePoint(
          Math.max(visibleBarsRange.firstBar(), firstIndex)
        )
      ),
      end: end,
    };
  }

  getVisibleRangePlates() {
    const visibleRangePlates = [];
    const tickMarksRange = this.getVisibleTickMarksRange();
    const intervalInTicks = this.getIntervalInTicks();

    Object.keys(this._marks).forEach((id) => {
      const mark = this._marks[id];
      const tickMark = mark.tickmark;

      if (
        tickMark >= tickMarksRange.start &&
        tickMark <= tickMarksRange.end + intervalInTicks
      ) {
        visibleRangePlates.push(mark);
      }
    });

    return visibleRangePlates;
  }

  getPublishedPlates() {
    const publishedPlates = {};

    if (window.is_authenticated) {
      this.getVisibleRangePlates().forEach((mark) => {
        if (
          mark.is_public &&
          (this._pinnedTooltips[mark.id] || mark.user__id === window.user.id)
        ) {
          publishedPlates[mark.id] = mark;
        }
      });
    }

    return publishedPlates;
  }

  filterDisplayedPlates(plates) {
    const groupedPlates = plates.reduce((result, plate) => {
      const index = this._getIndex(plate.tickmark);
      if (index !== null) {
        result[index] = result[index] || [];
        result[index].push(plate);
      }
      return result;
    }, {});

    return Object.keys(groupedPlates).reduce((result, index) => {
      let plates = groupedPlates[index];
      plates = plates.sort((a, b) => b.views_count - a.views_count);
      plates = plates.slice(0, 10);
      return result.concat(plates);
    }, []);
  }

  getPlatesViewData() {
    const mainSeries = this._model.mainSeries();
    if (mainSeries.data().isEmpty()) {
      return [];
    }

    const barFunction = isPriceSourceStyle(mainSeries.style())
      ? mainSeries.barFunction()
      : null;
    const visiblePlates = this.filterDisplayedPlates(
      this.getVisibleRangePlates()
    );
    const platesData = [];
    const lastHittestData =
      this._model.lastHittestData() ?? this._model.lastSelectedHittestData();
    let hoveredPlateIndex = null;
    if (lastHittestData && this._model.hoveredSource() === this) {
      hoveredPlateIndex = lastHittestData.activeItem ?? null;
    }

    for (const plate of visiblePlates) {
      const index = ensureNotNull(this._getIndex(plate.tickmark));
      const bar = this._getBar(index);
      if (bar === null) {
        continue;
      }

      const direction = this._layout(plate.direction);
      const theme = this._theme(plate.direction);
      const hovered = hoveredPlateIndex === plate.id;
      const coordinate = this.timeScale().indexToCoordinate(index);
      const offset = this._offset(direction, bar, barFunction);
      const isInverted = ensureNotNull(this.priceScale()).isInverted();
      let order = 0;

      if (!(index in this._marks)) {
        this._marks[index] = { up: 0, down: 0 };
      }
      order = ++this._marks[index][direction];

      platesData.push({
        id: plate.id,
        x: coordinate,
        y: offset,
        yInverted: isInverted,
        order: order,
        direction: direction,
        theme: theme,
        hovered: hovered,
        pinned: true === this._pinnedTooltips[plate.id],
        user__id: plate.user__id,
        label: plate.label,
        labelFontColor: plate.labelFontColor || "#444",
        minSize: plate.minSize || 5,
        ...this._plateViewData(plate),
      });
    }

    const hoveredPlate = platesData.filter((plate) => plate.hovered)[0];
    for (let i = 0; i < visiblePlates.length; i++) {
      if (visiblePlates[i].user__id === hoveredPlate?.user__id) {
        visiblePlates[i].highlightByAuthor = true;
      }
    }

    platesData.sort((a, b) => (a.hovered && !b.hovered ? 1 : 0));
    return platesData;
  }

  priceAxisViews() {
    return null;
  }

  updateAllViews(changeEvent) {
    for (const view of this._paneViews) {
      view.update(changeEvent);
    }
  }

  updateAllViewsAndRepaint() {
    this.updateAllViews(sourceChangeEvent(this.id()));
    this._model.updateSource(this);
  }

  roundRange(range) {
    return {
      start: Math.round(range.start),
      end: Math.round(range.end),
    };
  }

  refreshData() {
    if (this._lastRange !== null) {
      this.getData(this._lastRange);
    }
  }

  getData(range) {
    if (isNumber(range.start) && isNumber(range.end)) {
      this._lastRange = range;
      range.end = END_OF_TIME;
      this._pushGetDataStack({ ...range });
    } else {
      logger.logError("Wrong range");
    }
  }

  clearMarks() {
    this._abortAllRequests();
    this._marks = {};
    this._loadedRange = null;
  }

  isUserDeletable() {
    return false;
  }

  isSavedInChart() {
    return false;
  }

  isSpeciallyZOrderedSource() {
    return true;
  }

  showInObjectTree() {
    return false;
  }

  _plateViewData(plate) {
    return {};
  }

  _layout(direction) {
    switch (direction) {
      default:
      case 0:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return "up";
      case 1:
        return "down";
    }
  }

  _theme(direction) {
    switch (direction) {
      default:
      case 0:
        return "neutral";
      case 1:
      case 5:
        return "green";
      case 2:
      case 6:
        return "red";
      case 3:
        return "yellow";
      case 4:
        return "blue";
    }
  }

  _offset(layout, bar, barFunction) {
    let value;
    switch (layout) {
      default:
      case "up":
        value = barFunction === null ? bar[2] : barFunction(bar);
        break;
      case "down":
        value = barFunction === null ? bar[3] : barFunction(bar);
    }
    return ensureNotNull(this.priceScale()).priceToCoordinate(
      value,
      ensureNotNull(firstValue(this.timeScale().points()))
    );
  }

  _getIndex(tickmark) {
    return timePointToIndex(this.timeScale(), tickmark);
  }

  _getBar(index) {
    return this._model.mainSeries().data().valueAt(index);
  }

  _rangeDifference(range) {
    range = Object.assign({ start: Infinity, end: -Infinity }, range);
    if (this._loadedRange) {
      if (range.start < this._loadedRange.start) {
        range.end = this._loadedRange.start;
      } else if (range.end > this._loadedRange.end) {
        range.start = this._loadedRange.end;
      }
    }
    return range;
  }

  _rangeUnion(range1, range2) {
    range1 = Object.assign({ start: Infinity, end: -Infinity }, range1);
    if (range2) {
      range1.start = Math.min(range2.start, range1.start);
      range1.end = Math.max(range2.end, range1.end);
    }
    return range1;
  }

  _pushGetDataStack(range) {
    if (isNumber(range.start) && isNumber(range.end)) {
      this._getDataTimeout && clearTimeout(this._getDataTimeout);
      this._collectedRange = this._rangeUnion(range, this._collectedRange);
      this._getDataTimeout = setTimeout(() => {
        this._getData(this._collectedRange);
        this._getDataTimeout = this._collectedRange = null;
      }, 300);
    } else {
      logger.logError("Wrong tickmark range");
    }
  }

  _abortAllRequests() {
    this._requests.forEach((request) => {
      request.cancel();
    });
    this._requests = [];
    this._getDataTimeout && clearTimeout(this._getDataTimeout);
    this._getDataTimeout = this._collectedRange = null;
  }
}
