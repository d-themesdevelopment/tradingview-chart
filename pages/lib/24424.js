"use strict";

const { Pattern5pointsPaneView: Pattern5PointsPaneView } = require('some-module');
const { LINESTYLE_DOTTED, LINESTYLE_SOLID } = require('some-module-constants');
const { ChartFontFamily } = require('some-module-fonts');

class Pattern5PointsPaneView extends Pattern5PointsPaneView {
    constructor(e, t) {
        super(e, t);
        this._abRetracement = NaN;
        this._bcRetracement = NaN;
        this._cdRetracement = NaN;
        this._xdRetracement = NaN;
        this._numericFormatter = new NumericFormatter();
        this._bcRetracementTrend = new TrendLineRenderer();
        this._xdRetracementTrend = new TrendLineRenderer();
        this._xbTrend = new TrendLineRenderer();
        this._bdTrend = new TrendLineRenderer();
        this._polylineRenderer = new PolygonRenderer(new HitTestResult(HitTarget.MovePoint));
        this._mainTriangleRenderer = new TriangleRenderer();
        this._triangleRendererPoints234 = new TriangleRenderer();
        this._xbLabelRenderer = new TextRenderer();
        this._acLabelRenderer = new TextRenderer();
        this._bdLabelRenderer = new TextRenderer();
        this._xdLabelRenderer = new TextRenderer();
        this._textRendererALabel = new TextRenderer();
        this._textRendererBLabel = new TextRenderer();
        this._textRendererCLabel = new TextRenderer();
        this._textRendererDLabel = new TextRenderer();
        this._textRendererXLabel = new TextRenderer();
        this._renderer = null;
    }

    renderer(e, t) {
        if (this._invalidated) this._updateImpl();
        return this._renderer;
    }

    _updateImpl() {
        super._updateImpl();
        this._updateBaseData();
        this._renderer = null;

        if (this._points.length < 2) return;

        const sourceProperties = this._source.properties().childs();
        const compositeRenderer = new CompositeRenderer();

        const textStyle = (point, text) => ({
            points: [point],
            text: text,
            color: sourceProperties.textcolor.value(),
            vertAlign: "middle",
            horzAlign: "center",
            font: ChartFontFamily,
            offsetX: 0,
            offsetY: 0,
            bold: sourceProperties.bold && sourceProperties.bold.value(),
            italic: sourceProperties.italic && sourceProperties.italic.value(),
            fontsize: sourceProperties.fontsize.value(),
            backgroundColor: sourceProperties.color.value(),
            backgroundRoundRect: 4,
        });

        const lineStyle = (point1, point2) => ({
            points: [point1, point2],
            color: sourceProperties.color.value(),
            linewidth: 1,
            linestyle: LINESTYLE_DOTTED,
            extendleft: false,
            extendright: false,
            leftend: LineEnd.Normal,
            rightend: LineEnd.Normal,
        });

        const [pointA, pointB, pointC, pointD, pointE] = this._points;

        const mainTriangleData = {
            points: [pointA, pointB, this._points.length < 3 ? pointB : pointC],
            color: "rgba(0, 0, 0, 0)",
            linewidth: sourceProperties.linewidth.value(),
            backcolor: sourceProperties.backgroundColor.value(),
            fillBackground: sourceProperties.fillBackground.value(),
            transparency: sourceProperties.transparency.value(),
        };
        this._mainTriangleRenderer.setData(mainTriangleData);
        compositeRenderer.append(this._mainTriangleRenderer);

        if (this._points.length > 3) {
            const trianglePoints234Data = {
                points: [pointC, pointD, this._points.length === 5 ? pointE : pointD],
                color: "rgba(0, 0, 0, 0)",
                linewidth: sourceProperties.linewidth.value(),
                backcolor: sourceProperties.backgroundColor.value(),
                fillBackground: sourceProperties.fillBackground.value(),
                transparency: sourceProperties.transparency.value(),
            };
            this._triangleRendererPoints234.setData(trianglePoints234Data);
            compositeRenderer.append(this._triangleRendererPoints234);
        }

        const polylineData = {
            points: this._points,
            color: sourceProperties.color.value(),
            linewidth: sourceProperties.linewidth.value(),
            backcolor: sourceProperties.backgroundColor.value(),
            fillBackground: false,
            linestyle: LINESTYLE_SOLID,
            filled: false,
        };
        this._polylineRenderer.setData(polylineData);
        compositeRenderer.append(this._polylineRenderer);

        if (this._points.length >= 3) {
            const xbLabel = textStyle(pointA.add(pointC).scaled(0.5), this._numericFormatter.format(this._abRetracement));
            this._xbLabelRenderer.setData(xbLabel);
            compositeRenderer.append(this._xbLabelRenderer);

            const xbLine = lineStyle(pointA, pointC);
            this._xbTrend.setData(xbLine);
            compositeRenderer.append(this._xbTrend);
        }

        if (this._points.length >= 4) {
            const acLine = lineStyle(pointB, pointD);
            this._bcRetracementTrend.setData(acLine);
            compositeRenderer.append(this._bcRetracementTrend);

            const acLabel = textStyle(pointB.add(pointD).scaled(0.5), this._numericFormatter.format(this._bcRetracement));
            this._acLabelRenderer.setData(acLabel);
            compositeRenderer.append(this._acLabelRenderer);
        }

        if (this._points.length >= 5) {
            const bdLabel = textStyle(pointA.add(pointE).scaled(0.5), this._numericFormatter.format(this._cdRetracement));
            this._bdLabelRenderer.setData(bdLabel);
            compositeRenderer.append(this._bdLabelRenderer);

            const xdLine = lineStyle(pointA, pointE);
            this._xdRetracementTrend.setData(xdLine);
            compositeRenderer.append(this._xdRetracementTrend);

            const xdLabel = textStyle(pointA.add(pointE).scaled(0.5), this._numericFormatter.format(this._xdRetracement));
            this._xdLabelRenderer.setData(xdLabel);
            compositeRenderer.append(this._xdLabelRenderer);

            const bdLine = lineStyle(pointD, pointE);
            this._bdTrend.setData(bdLine);
            compositeRenderer.append(this._bdTrend);
        }

        const xLabel = textStyle(pointA, "X");
        if (pointB.y > pointA.y) {
            xLabel.vertAlign = "bottom";
            xLabel.offsetY = 5;
        } else {
            xLabel.vertAlign = "top";
            xLabel.offsetY = 5;
        }
        this._textRendererXLabel.setData(xLabel);
        compositeRenderer.append(this._textRendererXLabel);

        const aLabel = textStyle(pointB, "A");
        if (pointB.y < pointA.y) {
            aLabel.vertAlign = "bottom";
            aLabel.offsetY = 5;
        } else {
            aLabel.vertAlign = "top";
            aLabel.offsetY = 5;
        }
        this._textRendererALabel.setData(aLabel);
        compositeRenderer.append(this._textRendererALabel);

        if (this._points.length > 2) {
            const bLabel = textStyle(pointD, "B");
            if (pointD.y < pointB.y) {
                bLabel.vertAlign = "bottom";
                bLabel.offsetY = 5;
            } else {
                bLabel.vertAlign = "top";
                bLabel.offsetY = 5;
            }
            this._textRendererBLabel.setData(bLabel);
            compositeRenderer.append(this._textRendererBLabel);
        }

        if (this._points.length > 3) {
            const cLabel = textStyle(pointE, "C");
            if (pointE.y < pointD.y) {
                cLabel.vertAlign = "bottom";
                cLabel.offsetY = 5;
            } else {
                cLabel.vertAlign = "top";
                cLabel.offsetY = 5;
            }
            this._textRendererCLabel.setData(cLabel);
            compositeRenderer.append(this._textRendererCLabel);
        }

        if (this._points.length > 4) {
            const dLabel = textStyle(pointC, "D");
            if (pointE.y < pointC.y) {
                dLabel.vertAlign = "bottom";
                dLabel.offsetY = 5;
            } else {
                dLabel.vertAlign = "top";
                dLabel.offsetY = 5;
            }
            this._textRendererDLabel.setData(dLabel);
            compositeRenderer.append(this._textRendererDLabel);
        }

        this.addAnchors(compositeRenderer);
        this._renderer = compositeRenderer;
    }

    _updateBaseData() {
        const points = this._source.points();

        if (points.length >= 3) {
            const [pointA, pointB, pointC] = points;
            this._abRetracement = Math.round(1000 * Math.abs((pointC.price - pointB.price) / (pointB.price - pointA.price))) / 1000;
        }

        if (points.length >= 4) {
            const [, pointB, pointC, pointD] = points;
            this._bcRetracement = Math.round(1000 * Math.abs((pointD.price - pointC.price) / (pointC.price - pointB.price))) / 1000;
        }

        if (points.length >= 5) {
            const [pointA, pointB, pointC, pointD, pointE] = points;
            this._cdRetracement = Math.round(1000 * Math.abs((pointE.price - pointD.price) / (pointD.price - pointC.price))) / 1000;
            this._xdRetracement = Math.round(1000 * Math.abs((pointE.price - pointB.price) / (pointB.price - pointA.price))) / 1000;
        }
    }
}

module.exports = {
    Pattern5PointsPaneView,
};
