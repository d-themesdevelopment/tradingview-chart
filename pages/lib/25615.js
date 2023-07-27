"use strict";

import { Pattern5pointsPaneView } = from './24424.js';

class CypherPatternPaneView extends Pattern5pointsPaneView {
    _updateBaseData() {
        const points = this._source.points();
        if (points.length >= 3) {
            const [point1, point2, point3] = points;
            this._abRetracement = Math.round(1000 * Math.abs((point3.price - point2.price) / (point2.price - point1.price))) / 1000;
        }
        if (points.length >= 4) {
            const [point1, point2, , point4] = points;
            this._bcRetracement = Math.round(1000 * Math.abs((point4.price - point1.price) / (point2.price - point1.price))) / 1000;
        }
        if (points.length >= 5) {
            const [point1, , point3, point4, point5] = points;
            this._cdRetracement = Math.round(1000 * Math.abs((point5.price - point4.price) / (point4.price - point3.price))) / 1000;
            this._xdRetracement = Math.round(1000 * Math.abs((point5.price - point4.price) / (point1.price - point4.price))) / 1000;
        }
    }
}

module.exports = {
    CypherPatternPaneView,
};
