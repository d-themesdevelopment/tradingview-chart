"use strict";

import { ensureTimePointIndexIndex } from ("./1115");
import { INVALID_TIME_POINT_INDEX } from ("./61401");

function materializePolygon(polygon, bars) {
    for (const point of polygon.points) {
        if (point.index >= bars.length) return null;
        if (bars[point.index] === INVALID_TIME_POINT_INDEX) return null;
    }

    return {
        points: polygon.points.map((point) => ({
            index: bars[point.index],
            offset: point.offset,
            level: point.level,
        })),
    };
}

function dematerializePolygon(polygon, id, barIndices) {
    return {
        id: id,
        points: polygon.points.map((point) => ({
            ...point,
            index: ensureTimePointIndexIndex(barIndices.indexOf(point.index)),
        })),
    };
}

function isPolygonInBarsRange(polygon, bars) {
    if (polygon.points.some((point) => bars.contains(point.index + (point.offset || 0)))) return true;

    let hasIndexBeforeFirstBar = false;
    let hasIndexAfterFirstBar = false;
    const firstBarIndex = bars.firstBar();

    for (const point of polygon.points) {
        const indexWithOffset = point.index + (point.offset || 0);
        if (indexWithOffset < firstBarIndex) {
            hasIndexBeforeFirstBar = true;
        } else {
            hasIndexAfterFirstBar = true;
        }
    }

    return hasIndexBeforeFirstBar && hasIndexAfterFirstBar;
}

module.exports = {
    dematerializePolygon,
    isPolygonInBarsRange,
    materializePolygon,
};
