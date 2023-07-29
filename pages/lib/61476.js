var s = i(36274).Interval,
r = i(77475).isAlignmentEnabled,
n = i(36454).getChartStyleStudy,
o = i(27856).decodeExtendedSymbol,
a = i(47609).findSuitableResolutionToBuildFrom,
l = i(66846).SubsessionId,
c = function() {
    var e = i(74649),
        t = e.StudyEngine,
        c = e.BarBuilder,
        h = e.BarSet;

    function d(e) {
        this.host = e, this.cache = {}
    }

    function u(t) {
        console.error(t), e.Std.error(t)
    }
    d.prototype.getCache = function(e) {
        return this.cache[e]
    }, d.prototype.putCache = function(e, t) {
        this.cache[e] = t
    }, d.prototype.subscribe = function(e, t, i, s, r, n, o, a, l, c, h) {
        var d = l(o),
            u = function(e, t, i, s, r, n, o, a, l) {
                var c = r.has_empty_bars ? "_" : "";
                return n + e + s + (t || "") + (i || "") + (l || "") + c + "_" + o.countBack + "_" + o.to + "_" + Boolean(a)
            }(e, t, i, s, o, a, d, c, h),
            p = this.getCache(u);
        return p || (p = this.createItem(e, t, i, s, o, d, a, c, h), this.putCache(u, p)), p.listeners.addListener(r, n), {
            key: u,
            listener: r
        }
    }, d.prototype.unsubscribe = function(e) {
        var t = this.getCache(e.key);
        t && t.listeners.removeListener(e.listener)
    }, d.prototype.removeUnused = function() {
        var e = [];
        for (var t in this.cache) {
            if (this.cache[t]) 0 === this.cache[t].listeners.listenersCount() && e.push(t)
        }
        if (0 !== e.length) {
            for (var i = 0; i < e.length; i++) {
                var s = e[i],
                    r = this.cache[s];
                this.cache[s] = null, r.stop()
            }
            this.removeUnused()
        }
    }, d.prototype.rebuildFrom = function(e, t) {
        var i = a(e, t);
        return i.error && u(i.errorMessage), i.resolution
    };
    var p = s.parse("1M").inMilliseconds(0);
    d.prototype.createItem = function(e, t, i, a, h, d, f, v, S) {
        var y = new g,
            b = o(e),
            w = "string" != typeof b.symbol ? b.symbol : b;
        t = w["currency-id"] || t, i = w["unit-id"] || i;
        var P = w.symbol,
            C = w.session && w.session !== l.Extended;
        if ((S = w.session || S) === l.Regular && (S = void 0), "type" in b) {
            var x = Object.assign({}, h);
            return h.has_empty_bars && (x.has_empty_bars = !1), new m(y, P, t, i, a, n(b), x, d, f, S)
        }
        v && !r() && u("Internal error: rebuilding is requested but it is disabled."), !v && h.has_empty_bars && u('Misconfiguration error: attempt to request data for symbol with "has_empty_bars" flag, but "disable_resolution_rebuild" featureset is enabled');
        var T, I, M = this.rebuildFrom(a, h);
        if (!s.isTicks(a) && (!s.isEqual(a, M) || v)) {
            r() || u('Misconfiguration error: remove "disable_resolution_rebuild" featureset or provide ' + a + " data by yourself");
            var A = h.has_empty_bars;
            x = Object.assign({}, h);
            h.has_empty_bars && (x.has_empty_bars = !1);
            var L = Math.ceil((T = s.parse(a), I = s.parse(M), T.kind() === I.kind() ? T.multiplier() / I.multiplier() : (T.isMonths() ? T.multiplier() * p : T.inMilliseconds()) / (I.isMonths() ? I.multiplier() * p : I.inMilliseconds())));
            return d = Object.assign({}, d, {
                countBack: d.countBack * L
            }), new m(y, e, t, i, M, new c(a, A), x, d, f, S)
        }
        return new _(y, P, {
            currency: t,
            unit: i,
            session: S
        }, a, C, this.host, h, d)
    };
    var _ = function(e, t, i, s, r, n, o, a) {
        this.listeners = e, this.host = n;
        var l = this;
        this.host.resolve(t, i, (function(e) {
            r && e.regular_session && (e.session = e.regular_session), l.subs = l.host.subscribe(e, s, a, (function(e) {
                l.listeners.fire(e)
            }), (function(e) {
                l.listeners.onError(e)
            }))
        }), (function(e) {
            l.listeners.onError(e)
        }))
    };
    _.prototype.stop = function() {
        this.subs && this.host.unsubscribe(this.subs)
    };
    var m = function(e, i, s, r, n, o, a, l, c, h) {
        this.listeners = e, this.isRecalculated = !1, this.symbolInfo = a;
        var d = this;
        this.engine = new t({
            tickerid: i,
            currencyCode: s,
            unitId: r,
            subsessionId: h,
            period: n,
            body: o,
            sessionId: c,
            symbolInfo: a,
            dataRange: l,
            forceAlignBars: !1,
            recalc: function(e, t) {
                d._recalc(t)
            },
            out: function(e, t) {
                d._out(e, t)
            },
            nonseriesOut: function(e, t) {
                d._nonseriesOut(e, t)
            },
            setNoMoreData: function() {
                d.barset && (d.barset.endOfData = !0)
            },
            onErrorCallback: function(e) {
                d.listeners.onError(e)
            }
        })
    };
    m.prototype.stop = function() {
            this.engine ? this.engine.stop() : console.error("Internal library error 0x1")
        }, m.prototype._recalc = function(e) {
            this.isRecalculated && console.error("recalc called twice!"), this.barset || (this.barset = new h(this.symbolInfo)), e && (this.barset.firstLoadedTimeMs = e.firstLoadedTimeMs, this.barset.endOfData = e.endOfData), this.listeners.fire(this.barset), this.isRecalculated = !0
        }, m.prototype._nonseriesOut = function(e, t) {
            var i = Object.assign({}, t);
            i.nonseries = !0, i.data = t.bars, delete i.bars, i.barsetSize = this.barset ? this.barset.count() : 0, i.lastBar = this.barset ? this.barset.bar(this.barset.count() - 1) : null, this.listeners.fire(i, !0)
        },
        m.prototype._out = function(e, t) {
            var i = t[0];
            if (!isNaN(i)) {
                var s = {
                        time: i,
                        open: t[1],
                        high: t[2],
                        low: t[3],
                        close: t[4],
                        volume: t[5],
                        updatetime: t[6]
                    },
                    r = t[7];
                this.barset || (this.barset = new h(e.info));
                var n = t[8];
                if (n instanceof Array)
                    for (var o = 0; o < n.length; o++) {
                        var a = t[9],
                            l = n[o],
                            c = {
                                time: l,
                                open: a,
                                high: a,
                                low: a,
                                close: a,
                                volume: 0,
                                updatetime: l
                            };
                        this.barset.add(c, !0, !0), this.isRecalculated && this.listeners.fire(this.barset)
                    }
                this.barset.add(s, r), this.barset.isBarClosed = r, this.isRecalculated && this.listeners.fire(this.barset)
            }
        };
    var g = function() {
        this.listeners = []
    };
    return g.prototype.listenersCount = function() {
        return this.listeners.reduce((function(e, t) {
            return e + (t ? 1 : 0)
        }), 0)
    }, g.prototype.addListener = function(e, t) {
        this.listeners.push({
            dataListener: e,
            onErrorCallback: t
        }), this.barset && e(this.barset), this.errorMsg && t(this.errorMsg)
    }, g.prototype.removeListener = function(e) {
        var t = this.listeners.filter((function(t) {
            return t.dataListener === e
        }));
        if (0 !== t.length) {
            var i = this.listeners.indexOf(t[0]);
            delete this.listeners[i]
        }
    }, g.prototype.onError = function(e) {
        this.errorMsg = e || "unspecified error";
        for (var t = this.listeners, i = t.length, s = 0; s < i; s++) {
            var r = t[s];
            r && r.onErrorCallback && r.onErrorCallback(e)
        }
    }, g.prototype.fire = function(e, t) {
        t || (this.barset = e);
        for (var i = this.listeners, s = i.length, r = 0; r < s; r++) {
            var n = i[r];
            n && n.dataListener(e)
        }
    }, {
        setupFeed: function(t) {
            d.instance = new d(t), e.setupFeed(d.instance)
        },
        unsubscribeUnused: function() {
            d.instance.removeUnused()
        }
    }
}();
e.exports = c
