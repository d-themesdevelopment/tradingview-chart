import {translatedIntervalString} from "./translatedIntervalString.js";
import {getTranslatedSymbolDescription} from "./getTranslatedSymbolDescription.js";
import {CHART_FONT_FAMILY} from "./46501.js";
import {watermarkProperty, restoreWatermarkPropertyDefaults} from "./65632.js";
import {drawScaled} from "./74359.js";
import {applyDefaultsOverrides, applyPropertiesOverrides} from "./85804.js";
            const WATERMARK_TYPE = "symbolWatermark";
            Watermark = function(e, t) {
                var i = {},
                    o = watermarkProperty();

                function p(e, t) {
                    var s = e.font;
                    return i.hasOwnProperty(s) || (i[s] = {}), i[s].hasOwnProperty(t) || (i[s][t] = e.measureText(t).width), i[s][t]
                }
                applyDefaultsOverrides(o, void 0, !1, WATERMARK_TYPE), o.listeners().subscribe(this, (function() {
                    e.updateSource(this)
                })), this.destroy = function() {
                    o.listeners().unsubscribeAll(this)
                }, this.properties = function() {
                    return o
                }, this.restorePropertiesDefaults = function() {
                    restoreWatermarkPropertyDefaults()
                }, this.applyOverrides = function(e) {
                    applyPropertiesOverrides(o, void 0, !1, e, WATERMARK_TYPE)
                };
                var _ = {
                    renderer: function(i, a) {
                        return {
                            draw: function(l, h) {
                                drawScaled(l, h.pixelRatio, h.pixelRatio, (function() {
                                    var c = t.symbolInfo();
                                    l.fillStyle = o.color.value();
                                    var h, d = c.name;
                                    /QUANDL/.test(c.exchange) && ((h = d.split(/\//)).length && (d = h[h.length - 1]));
                                    var u = {
                                        description: c.description,
                                        short_description: c.short_description,
                                        pro_name: c.pro_name,
                                        short_name: c.name,
                                        local_description: c.local_description,
                                        language: c.language
                                    };
                                    const _ = e.watermarkContentProvider(),
                                        m = _ ? _({
                                            symbolInfo: c,
                                            interval: t.interval()
                                        }) : null;
                                    for (var g = (m ? m.map((e => ({
                                            text: e.text,
                                            font: `${e.fontSize}px ${CHART_FONT_FAMILY}`,
                                            lineHeight: e.lineHeight,
                                            vertOffset: e.vertOffset
                                        }))) : null) || [{
                                            text: d ? d + ", " + translatedIntervalString(t.interval()) : "",
                                            font: "96px " + CHART_FONT_FAMILY,
                                            lineHeight: 117,
                                            vertOffset: 0
                                        }, {
                                            text: getTranslatedSymbolDescription(u) || "",
                                            font: "48px " + CHART_FONT_FAMILY,
                                            lineHeight: 58,
                                            vertOffset: 5
                                        }], f = 0, v = 0; v < g.length; v++) {
                                        if ((b = g[v]).text) {
                                            l.font = b.font;
                                            var S = p(l, b.text);
                                            b.zoom = S > a ? a / S : 1, f += b.lineHeight * b.zoom
                                        }
                                    }
                                    var y = Math.max((i - f) / 2, 0);
                                    for (v = 0; v < g.length; v++) {
                                        var b;
                                        (b = g[v]).text && (l.save(), l.translate(a / 2, y), l.textBaseline = "top", l.textAlign = "center", l.font = b.font, l.scale(b.zoom, b.zoom), l.fillText(b.text, 0, b.vertOffset), l.restore(), y += b.lineHeight * b.zoom)
                                    }
                                }))
                            }
                        }
                    },
                    update: function() {}
                };
                this.paneViews = function() {
                    return t.symbolInfo() && o.visibility.value() ? [_] : []
                }
            }
        