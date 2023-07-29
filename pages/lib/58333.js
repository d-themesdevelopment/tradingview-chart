
import {parseRgb, distanceRgb, rgbToHexString, invertRgb} from "./24377.js";
import {ensureNotNull} from "./assertions.js"
import {isNumber} from "./helpers.js";
import {translateMessage} from "./44352.js";
import {CheckMobile} from "./49483.js"
import {resetTransparency} from "./87095.js";
import {forceLTRStr} from "./38223.js";
import {PlotRowSearchMode} from "./86094.js";
import {tool} from "./88348.js";
import {PercentageFormatter} from "./PercentageFormatter.js";
import {VolumeFormatter} from "./VolumeFormatter.js";
import {SeriesBarColorer} from "./35994.js";
import {barPercentChange} from "./barPercentChange.js"
import {getPriceValueFormatterForSource, shouldBeFormattedAsPercent, shouldBeFormattedAsIndexedTo100} from "./92052.js";
import {isLineToolName} from "./15367.js";
import {notAvailable} from "./88546.js";

const mobileCheck58333 = CheckMobile.any(),
y = mobileCheck58333 && !0,
percentageFormatter = new PercentageFormatter,
volumeFormatter = new VolumeFormatter(2),
notAvailString58333 = `${notAvailable} (${notAvailable}%)`;


function calculateColor(e, t) {
const i = parseRgb(t),
    s = parseRgb(e);
return distanceRgb(i, s) < 70 ? rgbToHexString(invertRgb(i)) : t
}
class SeriesValuesProvider {
constructor(e, t) {
    this._series = e, this._model = t, this._emptyValues = [{
        title: translateMessage(null, void 0, "Open"),
        visible: !1,
        value: "",
        index: 0,
        id: ""
    }, {
        title: translateMessage(null, void 0, "High"),
        visible: !1,
        value: "",
        index: 1,
        id: ""
    }, {
        title: translateMessage(null, void 0, "Low"),
        visible: !1,
        value: "",
        index: 2,
        id: ""
    }, {
        title: translateMessage(null, void 0, i(31691)),
        visible: !1,
        value: "",
        index: 3,
        id: ""
    }, {
        title: "",
        visible: !1,
        value: "",
        index: 4,
        id: ""
    }, {
        title: "",
        visible: !1,
        value: "",
        index: 5,
        id: ""
    }, {
        title: translateMessage(null, void 0, "Close"),
        visible: !1,
        value: "",
        index: 6,
        id: ""
    }, {
        title: translateMessage(null, {
            context: "study"
        }, "Vol"),
        visible: !1,
        value: "",
        index: 7,
        id: ""
    }]
}
getItems() {
    return this._emptyValues
}
getValues(e) {
    var t, i, n;
    const o = this._showLastPriceAndChangeOnly(),
        a = this._emptyValues.map((e => ({
            ...e,
            visible: !o
        })));
    a[0].value = notAvailable, a[1].value = notAvailable, a[2].value = notAvailable, a[3].value = notAvailable, a[6].value = notAvailString58333, a[7].value = notAvailable, a[5].visible = !1;
    const d = a[4];
    if (d.value = notAvailable, d.visible = !1, this._model.timeScale().isEmpty() || 0 === this._series.bars().size() || this._series.priceScale().isEmpty()) return a;
    isNumber(e) || (e = ensureNotNull(this._series.data().last()).index);
    const u = this._series.nearestIndex(e, PlotRowSearchMode.NearestLeft);
    if (void 0 === u) return a;
    const p = this._series.data().valueAt(u),
        m = this._model.backgroundTopColor().value();
    if (null === p) return a;
    const f = p[1],
        S = p[2],
        x = p[3],
        T = p[4],
        {
            values: I
        } = this._changesData(T, u, o),
        M = getPriceValueFormatterForSource(this._series);
    if (shouldBeFormattedAsPercent(this._series) || shouldBeFormattedAsIndexedTo100(this._series)) a[6].value = "";
    else if (void 0 !== I) {
        const e = this._series.formatter(),
            {
                currentPrice: s,
                prevPrice: r,
                change: n
            } = I,
            o = null !== (i = null === (t = e.formatChange) || void 0 === t ? void 0 : t.call(e, s, r, !0)) && void 0 !== i ? i : e.format(n, !0);
        a[6].value = forceLTRStr(`${o} (${percentageFormatter.format(I.percentChange,!0)})`)
    }
    if (o) a[5].value = null == T ? notAvailable : M(T), a[5].visible = !0, a[6].visible = !0;
    else {
        a[0].value = null == f ? notAvailable : M(f), a[1].value = null == S ? notAvailable : M(S), a[2].value = null == x ? notAvailable : M(x), a[3].value = null == T ? notAvailable : M(T), a[4].value = M(this._series.barFunction()(p));
        const e = p[5];
        isNumber(e) ? a[7].value = volumeFormatter.format(e): a[7].visible = !1
    }
    let A = null;
    if (o && !y) A = void 0 === I || I.change >= 0 ? SeriesBarColorer.upColor(this._series.properties()) : SeriesBarColorer.downColor(this._series.properties());
    else {
        const e = this._series.barColorer().barStyle(u, !1);
        A = calculateColor(m, null !== (n = e.barBorderColor) && void 0 !== n ? n : e.barColor)
    }
    A = resetTransparency(calculateColor(m, A));
    for (const e of a) e.color = A;
    return a
}
_showLastPriceAndChangeOnly() {
    return mobileCheck58333 && (null === this._model.crossHairSource().pane || isLineToolName(tool.value()) || null !== this._model.lineBeingEdited())
}
_changesData(e, t, i) {
    var s;
    if (i && !y) {
        const t = this._series.quotes();
        if (null !== t) {
            const i = null !== t.change ? t.change : 0;
            return {
                values: {
                    change: i,
                    currentPrice: e,
                    prevPrice: e - i,
                    percentChange: null !== t.change_percent ? t.change_percent : 0
                }
            }
        }
    } else {
        const i = this._series.data().search(t - 1, PlotRowSearchMode.NearestLeft),
            r = null !== (s = null == i ? void 0 : i.value[4]) && void 0 !== s ? s : null;
        if (null !== r && null != e) return {
            values: {
                change: e - r,
                currentPrice: e,
                prevPrice: r,
                percentChange: barPercentChange(r, e)
            }
        }
    }
    return {}
}
}
