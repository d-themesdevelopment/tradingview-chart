(e, t, i) => {
    "use strict";
    var s = i(3035),
        r = i(74649),
        n = i(61476),
        o = i(76537).SymbolExtrapolator,
        a = i(21125).SessionTimeScale,
        l = i(34108).PointsetsManager,
        c = i(60156),
        h = i(77475).createDwmAligner,
        d = i(36274).Interval,
        u = i(76422),
        p = i(2663).visitObject,
        _ = i(1722).isObject;
    i(24172), i(60325);
    var m = i(79850).DatafeedRequestsCachedProcessor,
        g = i(38618).timezoneIsAvailable,
        f = i(77475).isAlignmentEnabled,
        v = i(27856),
        S = v.isEncodedExtendedSymbol,
        y = v.decodeExtendedSymbol,
        b = i(42960).extractSymbolNameFromSymbolInfo,
        w = i(48739).replaceGraphicsTimesWithTimePointIndexIndex,
        P = i(14483),
        C = i(66846).SubsessionId,
        x = i(60156).getPeriodsBetweenDates;
    const T = "pre_post_market_sessions",
        I = P.enabled(T);
    var M = -5e6;

    function A(e) {
        var t = e.findIndex((function(e) {
            return e.index !== M
        }));
        return -1 === t ? [] : 0 === t ? e : e.slice(t)
    }

    function L(e, t) {
        if (e) {
            if ("string" == typeof e) return void console.warn("`logo_urls` should be an array of urls, not a string.");
            const [i, s] = e;
            s ? (t["base-currency-logoid"] = i, t["currency-logoid"] = s) : t.logoid = e
        }
    }

    function k(e, t) {
        return e + "_" + t
    }
    var E = function(e) {
        var t = this;
        this._studiesCache = {}, this._objectsDataCache = {}, this._studiesNonSeriesTimes = {}, this._metainfoCache = [], this._barsCoefficientsCache = {}, this._externalDatafeed = e, e.getVolumeProfileResolutionForPeriod && r.overwriteVolumeProfileResolutionForPeriodGetter((function(t, i, s, r) {
            return e.getVolumeProfileResolutionForPeriod(t, i, s, r)
        })), this._datafeedConfiguration = null, this._marketStatusWatchers = {}, this._resolveRequests = {}, this._resolvePromisesBySymbolId = new Map, this._symbolIdToSymbolRequestString = new Map, this._callbacks = {}, this._serverTimeOffset = 0, t._logMessage("Datafeed settings received: {0}".format(JSON.stringify(window.configurationData))), t._datafeedConfiguration = t._adoptConfigurationData(window.configurationData), t._fireEvent("configuration_received"), t._externalDatafeed.getServerTime && t._externalDatafeed.getServerTime((function(e) {
            t._serverTimeOffset = e - (new Date).valueOf() / 1e3
        })), this._invalidatedPointsetSessions = new Set, this._refreshPointsetsTimerId = null, this._pointsetsManagers = {}, this._quotesInfo = [], this._depthInfo = [], this._endOfData = {}, this._computeStudyCounter = 0, this._symbolExtrapolators = {}, this._timeScales = {}, this._cachedDatafeed = new m(e, this.serverTimeOffset.bind(this), this._datafeedConfiguration.reset_cache_timeout), n.setupFeed({
            resolve: function(e, i, s, r) {
                t._resolveSymbolByName(e, i, s, r)
            },
            subscribe: function(e, i, s, r, n) {
                return t._cachedDatafeed.subscribe(e, i, s, function(e, i, s) {
                    var r = new c.SessionInfo(e.timezone, e.session, e.session_holidays, e.corrections),
                        n = c.newBarBuilder(i, r, r);
                    return function(e) {
                        if (e && e.count()) {
                            var i = 1e3 * t.getCurrentUTCTime();
                            n.moveTo(i), n.indexOfBar(i) >= 0 && e.setLastBarClosed(!1)
                        }
                        s(e)
                    }
                }(e, i, r), n)
            },
            unsubscribe: function(e) {
                return t._cachedDatafeed.unsubscribe(e)
            }
        })
    };

    function D(e, t) {
        return e + "_" + t
    }

    function V(e, t, i, s) {
        return e + (t ? "_#_" + t : "") + (i ? "_#_" + i : "") + (s ? "_#_" + s : "")
    }
    E.prototype._getSymbolExtrapolator = function(e, t, i) {
            var s = d.normalize(i),
                r = function(e, t, i) {
                    const s = void 0 !== t.subsession_id ? "," + t.subsession_id : "";
                    return e + "," + t.full_name + "," + i + s
                }(e, t, s),
                n = this._symbolExtrapolators[r];
            return void 0 === n && (n = new o(t, s), this._symbolExtrapolators[r] = n), n
        }, E.prototype._barsCoefficients = function(e, t) {
            if (void 0 === y(e).type) return {};
            var i = e + t;
            return this._barsCoefficientsCache[i] || (this._barsCoefficientsCache[i] = {}), this._barsCoefficientsCache[i]
        },
        E.prototype.destroy = function() {
            this._cachedDatafeed.destroy(), this._externalDatafeed = null, Object.keys(this._pointsetsManagers).forEach((function(e) {
                this._pointsetsManagers[e].destroy()
            }), this), this._pointsetsManagers = {}
        }, E.prototype.purgeCache = function() {
            this._endOfData = {}, this._resolveRequests = {}, this._objectsDataCache = {}, this._studiesNonSeriesTimes = {}, this._studiesCache = {}, this._resolvePromisesBySymbolId.clear(), this._symbolIdToSymbolRequestString.clear(), Object.keys(this._pointsetsManagers).forEach((function(e) {
                this._pointsetsManagers[e].destroy()
            }), this), this._pointsetsManagers = {}, Object.keys(this._timeScales).forEach((function(e) {
                this._timeScales[e].destroy()
            }), this), this._timeScales = {}, Object.keys(this._symbolExtrapolators).forEach((function(e) {
                this._symbolExtrapolators[e].destroy()
            }), this), this._symbolExtrapolators = {}
        }, E.prototype.purgeDataCache = function() {
            this._cachedDatafeed.purgeCache()
        }, E.prototype._logMessage = function(e) {
            P.enabled("charting_library_debug_mode") && console.log(e)
        }, E.prototype.on = function(e, t) {
            return this._callbacks.hasOwnProperty(e) || (this._callbacks[e] = []), this._callbacks[e].push(t), this
        }, E.prototype._fireEvent = function(e, t, i) {
            if (this._callbacks.hasOwnProperty(e)) {
                for (var s = this._callbacks[e], r = 0; r < s.length; ++r) s[r](t);
                i || (this._callbacks[e] = [])
            }
        }, E.prototype._adoptConfigurationData = function(e) {
            var t = TradingView.merge({}, e),
                i = t.supported_resolutions;
            if (!i || 0 === i.length) return t.supported_resolutions = void 0, t;
            for (var s = [], r = 0; r < i.length; r++) {
                var n = i[r];
                if (-1 !== s.indexOf(n)) throw new Error("Duplicating resolution `" + n + "`");
                s.push(n)
            }
            return t.supported_resolutions = s, t
        }, E.prototype.supportedResolutions = function() {
            return this._datafeedConfiguration.supported_resolutions
        }, E.prototype.supportedCurrencies = function() {
            return this._datafeedConfiguration.currency_codes || []
        }, E.prototype.supportedUnits = function() {
            return this._datafeedConfiguration.units || []
        }, E.prototype.supportedPriceSources = function(e) {
            return new Promise(((t, i) => {
                this._resolveSymbolImpl(e, (e => {
                    t(e.price_sources)
                }), (e => {
                    i(e)
                }))
            }))
        }, E.prototype.supportedSymbolsTypes = function() {
            return this._datafeedConfiguration.symbols_types || []
        }, E.prototype.symbolsGrouping = function() {
            return this._datafeedConfiguration.symbols_grouping || {
                futures: /$a/
            }
        }, E.prototype._findStudyObject = function(e) {
            e.endsWith("!") && (e = e.slice(0, -1));
            var t = e.split("@")[0],
                i = JSServer.studyLibrary.filter((function(i) {
                    return i.metainfo.id === e || i.metainfo.shortDescription === t
                }));
            return 0 === i.length ? null : i[0]
        }, E.prototype.getMarks = function(e, t, i, s, r) {
            var n = {
                red: 6,
                green: 5,
                blue: 4,
                yellow: 3
            };
            if (this._externalDatafeed.getMarks && this._datafeedConfiguration.supports_marks) {
                this._logMessage("Requesting bars marks: symbol {0}, resolution {1}, range [{2} ... {3}]".format(e.full_name, r, new Date(1e3 * t).toUTCString(), new Date(1e3 * i).toUTCString()));
                var o = this;
                this._externalDatafeed.getMarks(e, t, i, (function(t) {
                    var i = t.map((function(e) {
                        return e.time = parseInt(e.time), e
                    }));
                    o._logMessage("Received bars marks: symbol {0}, resolution {1}, marks {2}".format(e.full_name, r, JSON.stringify(i)));
                    var a = h(r, e),
                        l = P.enabled("two_character_bar_marks_labels"),
                        c = i.map((function(e) {
                            return e.tickmark = null !== a ? a.timeToSessionStart(1e3 * e.time) / 1e3 : e.time, e.direction = n[e.color], e.onClicked = function() {
                                u.emit("onMarkClick", e.id)
                            }, e.label = !!e.label && (l ? e.label.slice(0, 2) : e.label[0]), e
                        }));
                    s(c)
                }), r)
            }
        }, E.prototype.getTimescaleMarks = function(e, t, i, s, r) {
            if (this._externalDatafeed.getTimescaleMarks && this._datafeedConfiguration.supports_timescale_marks) {
                this._logMessage("Requesting timescale marks: symbol {0}, resolution {1}, range [{2} ... {3}]".format(e.full_name, r, new Date(1e3 * t).toUTCString(), new Date(1e3 * i).toUTCString()));
                var n = this;
                this._externalDatafeed.getTimescaleMarks(e, t, i, (function(t) {
                    n._logMessage("Received timescale marks: symbol {0}, resolution {1}, marks {2}".format(e.full_name, r, JSON.stringify(t)));
                    var i = h(r, e),
                        o = t.map((function(e) {
                            return e.tickmark = null !== i ? i.timeToSessionStart(1e3 * e.time) / 1e3 : e.time, e
                        }));
                    s(o)
                }), r)
            }
        }, E.prototype.getSeriesLastBarTime = function(e, t) {
            var i = this._getSeriesData(e, t);
            return null === i || 0 === i.length ? null : i[i.length - 1].timeMs
        }, E.prototype.getSeriesInterval = function(e, t) {
            var i = this._studiesCache[e][t];
            return i ? i.resolution : null
        }, E.prototype.getSeriesSymbolInfo = function(e, t) {
            var i = this._studiesCache[e][t];
            return i ? i.symbolInfo : null
        }, E.prototype._getSeriesData = function(e, t) {
            return this._objectsDataCache[D(e, t)] || null
        }, E.prototype._computeStudy = async function(e, t, i, s, n, o, a, l, c, u) {
                var p = !0,
                    _ = [];
                null !== l && (this._objectsDataCache[l] = null), this._timeScales[e].setCompleted(!1);
                var m = this._computeStudyCounter++;

                function g(e, t) {
                    if (e < c()) return M;
                    if (0 === t) return 0;
                    var i = _[t - 1].index;
                    return i === M ? 0 : i + 1
                }
                var v = new Map;
                var S = !1,
                    y = this,
                    b = function() {
                        return y._studiesCache[e] && y._studiesCache[e][n] && y._studiesCache[e][n].activeResolve === m
                    };
                y._studiesCache[e][n].activeResolve = m;
                var w, C, T = this._resolvePromisesBySymbolId.get(k(e, i));
                if (void 0 === T) throw new Error("This should never happen");
                try {
                    var I = await T;
                    w = I.symbolInfo, C = I.requestedSymbol
                } catch (e) {
                    return void(b() && u.onSymbolErrorCallback(e))
                }
                b() && function(i, c) {
                    var m = d.parse(s);
                    if (!m.isIntraday() || i.has_intraday) {
                        if (d.isDWM(s) && void 0 !== a.to) {
                            var b = h(s, i);
                            null !== b && (a.to = b.timeToExchangeTradingDay(a.to))
                        }
                        if (a.from && a.to) {
                            const e = x(i.session, i.session_holidays, i.corrections, m.letter(), m.multiplier(), a.from, a.to);
                            a.countBack = Math.max(e, a.countBack)
                        }
                        try {
                            var w = new r.StudyEngine({
                                tickerid: c,
                                symbolInfo: i,
                                period: s,
                                body: t,
                                sessionId: e,
                                onErrorCallback: u.onErrorCallback,
                                dataRange: a,
                                subsessionId: i.subsession_id,
                                forceAlignBars: !P.enabled("disable_sameinterval_aligning") && f(),
                                input: function(e) {
                                    return o[e]
                                },
                                out: function(e, t) {
                                    ! function(e, t, i) {
                                        for (var s = e.time, r = "number" == typeof t ? [t] : t, n = 0; n < r.length; ++n) {
                                            var o = r[n];
                                            o && "object" == typeof o && (v.set(n, o.offset), o = o.value), "number" == typeof o && isNaN(o) && (o = void 0), r[n] = o
                                        }
                                        var a = _.length - 1,
                                            l = a < 0 || s > _[a].timeMs;
                                        l ? _.push({
                                            index: g(s, _.length),
                                            value: [s / 1e3].concat(r),
                                            timeMs: s
                                        }) : (_[a].index = g(s, a), _[a].value = [s / 1e3].concat(r), _[a].timeMs = s), p || u.onRealtimeCallback([_[_.length - 1]], l, _.length, v, i)
                                    }(e, t, i)
                                },
                                nonseriesOut: function(e, t) {
                                    u.onNonSeriesDataUpdate(t, i)
                                },
                                setNoMoreData: function() {
                                    S = !0
                                },
                                recalc: function(e, s) {
                                    p = !1, _.endOfData = S, _.emptyBarCount = s.emptyBarCount, t.error && null !== t.error() || (null !== l && (y._objectsDataCache[l] = _), u.onDataReadyCallback(_, v, i, s))
                                }
                            });
                            if (!y._studiesCache[e] || !y._studiesCache[e][n]) throw Error("This should never happen");
                            y._studiesCache[e][n].engine = w
                        } catch (e) {
                            if (!e.studyError) throw e;
                            u.onErrorCallback(e.message)
                        }
                    } else u.onErrorCallback("Unsupported resolution. Did you forget to set has_intraday to true?")
                }(w, C)
            }, E.prototype._createStudy = function(e, t, i, s, r, n, o, a) {
                var l = this;

                function c(e, t, i) {
                    if (l._studiesCache[s][r].completed = !0, e = A(e), l._studyCanExtendTimeScale(s, r)) {
                        const t = e.map((function(e) {
                                return e.timeMs
                            })),
                            i = l._timeScales[s].setStudyBarsTimes(r, t);
                        l._applyTimeScaleUpdate(s, i)
                    }
                    l._timeScales[s].fillIndexesInRows(e), TradingView.ChartapiMessagerInstances[s].onDataUpdate(r, n, e, t), TradingView.ChartapiMessagerInstances[s].onStudyCompleted(r, n), l._updateTimeScaleState(s)
                }

                function h(e) {
                    var t = {};
                    if (0 !== e.size) {
                        var i = {},
                            n = l._studiesCache[s][r].metainfo;
                        e.forEach((function(e, t) {
                            i[n.plots[t].id] = e
                        })), t.data = {
                            offsets: i
                        }
                    }
                    return t
                }
                a = function(e) {
                    if (Array.isArray(e)) return e;
                    for (var t = [], i = l._studiesCache[s][r].metainfo.inputs, n = 0; n < i.length; n++) t[n] = e[i[n].id];
                    return t
                }(a), TradingView.ChartapiMessagerInstances[s].onStudyLoading(r, n);
                var d = null,
                    u = !1;
                l._computeStudy(s, i, e, t, r, a, this._seriesDataRange(s, o), null, (function() {
                    if (null === d) {
                        var e = l._getSeriesData(s, o)[0];
                        if (void 0 === e) return 1 / 0;
                        d = e.timeMs
                    }
                    return d
                }), {
                    onDataReadyCallback: function(e, t, i) {
                        u && 0 === e.length || c(e, h(t))
                    },
                    onRealtimeCallback: function(e, t, i, o, a) {
                        if (e = A(e), l._studyCanExtendTimeScale(s, r)) {
                            const t = e.map((function(e) {
                                    return e.timeMs
                                })),
                                i = l._timeScales[s].replaceBarsTimesTail(r, t);
                            l._applyTimeScaleUpdate(s, i)
                        }
                        l._timeScales[s].fillIndexesInRows(e), TradingView.ChartapiMessagerInstances[s].onDataUpdate(r, n, e, h(o)), l._updateTimeScaleState(s)
                    },
                    onSymbolErrorCallback: function() {
                        l._studiesCache[s][r].completed = !0, TradingView.ChartapiMessagerInstances[s].onStudyError(r, n, "error in series")
                    },
                    onErrorCallback: function(e) {
                        TradingView.ChartapiMessagerInstances[s].onStudyError(r, n, e)
                    },
                    onNonSeriesDataUpdate: function(e, t) {
                        switch (u = !0, e.type) {
                            case "projection":
                                break;
                            case "study_graphics":
                                var i = {
                                        data: e.data,
                                        indexes: []
                                    },
                                    n = w(i);
                                l._studiesNonSeriesTimes[s][r] = n, i.indexes = l._timeScales[s].convertTimesToIndexes(n), c([], i);
                                break;
                            case "non_series_data":
                                n = function(e) {
                                    var t = {};
                                    p(e, (function(e) {
                                        _(e) && Object.keys(e).forEach((function(i) {
                                            i.endsWith("__t") && (t[e[i]] = !0)
                                        }))
                                    }), {
                                        visitInstances: !0
                                    });
                                    var i = Object.keys(t).map(Number).sort((function(e, t) {
                                        return e - t
                                    }));
                                    return i.forEach((function(e, i) {
                                        t[e] = i
                                    })), Object.assign(e, p(e, (function(e) {
                                        return _(e) && Object.keys(e).forEach((function(i) {
                                            i.endsWith("__t") && (e[i.slice(0, -3)] = t[e[i]])
                                        })), e
                                    }), {
                                        visitInstances: !0
                                    })), i
                                }(i = {
                                    data: e.data,
                                    indexes: []
                                });
                                l._studiesNonSeriesTimes[s][r] = n, i.indexes = l._timeScales[s].convertTimesToIndexes(n), c([], i);
                                break;
                            default:
                                console.warn("unsupported non-series data type for study " + e.type)
                        }
                    }
                })
            },
            E.prototype.onSessionSeriesError = function(e) {
                this.stopSources(e);
                var t = this._mainSeriesRecord(e);
                null !== t && (t.error = !0), this._applyTimeScaleUpdate(e, this._timeScales[e].clearTimeScale())
            }, E.prototype.modifySeries = function(e, t, i, s, r) {
                var n = this._mainSeriesRecord(e);
                if (null === n || n.guid !== t) {
                    if (null !== n && n.error) return this._studiesCache[e][t].symbolId = i, this._studiesCache[e][t].resolution = s, void(this._studiesCache[e][t].turnaround = r);
                    for (var o in this._stopSourcesTree(e, t), this.createSeries(e, t, r, i, s, {
                            countBack: 0
                        }, !0), this._studiesCache[e]) {
                        var a = this._studiesCache[e][o];
                        if (a && "study" === a.type && a.parentId === t) {
                            this._studiesNonSeriesTimes[e][o] = null;
                            var l = this._studiesCache[e][a.parentId];
                            this._createStudy(l.symbolId, l.resolution, a.studyObject, e, o, a.turnaround, a.parentId, a.inputs)
                        }
                    }
                } else this._modifyMainSeries(e, i, s, r)
            }, E.prototype._modifyMainSeries = function(e, t, i, s) {
                this.stopSources(e);
                var r = this._mainSeriesRecord(e);
                for (var n in this._studiesCache[e]) {
                    (o = this._studiesCache[e][n]) && "series" === o.type && (o.guid === r.guid ? this.createSeries(e, r.guid, s, t, i, {
                        countBack: 0
                    }, !0) : this.createSeries(e, o.guid, o.turnaround, o.symbolId, i, {
                        countBack: 0
                    }, !0))
                }
                for (var n in this._studiesCache[e]) {
                    var o;
                    if ((o = this._studiesCache[e][n]) && "study" === o.type) {
                        this._studiesNonSeriesTimes[e][n] = null;
                        var a = this._studiesCache[e][o.parentId];
                        this._createStudy(a.symbolId, a.resolution, o.studyObject, e, n, o.turnaround, o.parentId, o.inputs)
                    }
                }
                this._applyTimeScaleUpdate(e, this._timeScales[e].clearTimeScale())
            }, E.prototype.stopSources = function(e) {
                for (var t in this._studiesCache[e]) {
                    var i = this._studiesCache[e][t];
                    i && "series" === i.type && this._stopSourcesTree(e, t)
                }
            }, E.prototype._stopSourcesTree = function(e, t) {
                for (var i in this._studiesCache[e]) {
                    var s = this._studiesCache[e][i];
                    s && (("series" === s.type && i === t || "study" === s.type && s.parentId === t) && (s.engine && s.engine.isStarted() && s.engine.stop(), s.activeResolve = -1))
                }
                n.unsubscribeUnused()
            }, E.prototype._recreateSourcesForDataRange = function(e, t) {
                var i = [];
                for (var s in this._studiesCache[e]) {
                    (r = this._studiesCache[e][s]) && "series" === r.type && !this._isEndOfData(e, s, r.turnaround) && (this._stopSourcesTree(e, s), i.push(s))
                }
                for (var s in i.forEach((function(i) {
                        this._startSourcesTree(e, i, Object.assign({}, t))
                    }), this), this._studiesCache[e]) {
                    var r;
                    "series" === (r = this._studiesCache[e][s]).type && this._isEndOfData(e, s, r.turnaround) && TradingView.ChartapiMessagerInstances[e].onSeriesCompleted(s, r.turnaround, r.engine.runner.host.symbolInfo.data_status)
                }
                this._updateTimeScaleState(e)
            }, E.prototype._startSourcesTree = function(e, t, i) {
                var s = this._studiesCache[e][t];
                for (var r in this.createSeries(e, t, s.turnaround, s.symbolId, s.resolution, i, !0), this._studiesCache[e]) {
                    var n = this._studiesCache[e][r];
                    n && "study" === n.type && n.parentId === t && this._createStudy(s.symbolId, s.resolution, n.studyObject, e, r, n.turnaround, n.parentId, n.inputs)
                }
            }, E.prototype.removeStudy = function(e, t) {
                if (this._studiesCache[e] && this._studiesCache[e][t] && this._studiesCache[e][t].engine && (this._studiesCache[e][t].engine.stop(), n.unsubscribeUnused()), this._studyCanExtendTimeScale(e, t)) {
                    this._timeScales[e].setCompleted(!1);
                    const i = this._timeScales[e].setStudyBarsTimes(t, []);
                    this._applyTimeScaleUpdate(e, i), this._updateTimeScaleState(e)
                }
                delete this._studiesCache[e][t], delete this._studiesNonSeriesTimes[e][t]
            }, E.prototype.removeSeries = function(e, t) {
                this._stopSourcesTree(e, t), delete this._studiesCache[e][t], this._updateMainTsBuilder(e), this._timeScales[e].isCompleted() && this._timeScales[e].setCompleted(!1);
                var i = this._timeScales[e].setSeriesBarsTimes(t, []);
                this._applyTimeScaleUpdate(e, i), this._updateTimeScaleState(e)
            }, E.prototype.modifyStudy = function(e, t, i, s) {
                var r = this._studiesCache[e][t];
                if (!r) throw Error("This should never happen");
                var o = this._studiesCache[e][r.parentId];
                r.inputs = s, r.turnaround = i, r.engine && (r.engine.stop(), n.unsubscribeUnused()), this._studiesNonSeriesTimes[e][t] = null, this._createStudy(o.symbolId, o.resolution, r.studyObject, e, t, i, r.parentId, s)
            }, E.prototype.createStudy = function(e, t, i, s, r, n) {
                var o = this._studiesCache[e][i],
                    a = this._findStudyObject(r);
                if (null === a) return console.warn("Study does not exist: " + r), void TradingView.ChartapiMessagerInstances[e].onStudyError(t, s, "unknown study name");
                var l = new a.constructor;
                this._studiesCache[e] = this._studiesCache[e] || {}, this._studiesCache[e][t] = {
                    studyObject: l,
                    guid: t,
                    type: "study",
                    inputs: n,
                    metainfo: a.metainfo,
                    turnaround: s,
                    parentId: i
                }, this._studiesNonSeriesTimes[e][t] = null, this._createStudy(o.symbolId, o.resolution, l, e, t, s, i, n)
            }, E.prototype.sessionTimeScale = function(e) {
                return this._timeScales[e] || null
            }, E.prototype.isTimeScaleExtendedTo = function(e, t) {
                var i = this._mainSeriesRecord(e);
                if (d.isDWM(i.resolution) && null != i.symbolInfo) {
                    var s = h(i.resolution, i.symbolInfo);
                    null !== s && (t = s.timeToSessionStart(t))
                }
                var r = this._timeScales[e].indexOfTime(t);
                return null !== r && r.index >= 0
            }, E.prototype.ensureExtendedTo = function(e, t, i) {
                if (!this._studiesCache[t][e]) throw Error("This should never happen");
                var s = this;
                setTimeout((function() {
                    s._recreateSourcesForDataRange(t, {
                        to: i
                    })
                }), 0)
            }, E.prototype.extendSeriesRange = function(e, t) {
                var i = this._timeScales[e].firstSeriesBarTime();
                if (null !== i) {
                    var s = this._mainSeriesRecord(e);
                    if (d.isDWM(s.resolution) && null != s.symbolInfo) {
                        var r = h(s.resolution, s.symbolInfo);
                        null !== r && (i = r.timeToExchangeTradingDay(i))
                    }
                    var n = this._symbolIdToSymbolRequestString.get(k(e, s.symbolId)),
                        o = this._barsCoefficients(n, s.resolution),
                        a = o.barsCoefficient || 1;
                    if (!o.barsCoefficient) {
                        var l = this._getSeriesData(e, s.guid);
                        null !== l && (o.expectedBarsCount = l.length + t)
                    }
                    var c = this;
                    setTimeout((function() {
                        c._recreateSourcesForDataRange(e, {
                            to: i,
                            countBack: (t + 2) * a
                        })
                    }), 0)
                } else this._logMessage("Nothing to extend - there is no points on time scale")
            }, E.prototype.seriesTurnaround = function(e, t) {
                return this._studiesCache[e] && this._studiesCache[e][t] && this._studiesCache[e][t].turnaround
            }, E.prototype._seriesDataRange = function(e, t) {
                var i = this._studiesCache[e][t];
                return null !== i.firstLoadedTimeMs ? {
                    to: i.firstLoadedTimeMs,
                    countBack: 0
                } : i.dataRange
            }, E.prototype._applyTimeScaleUpdate = function(e, t) {
                if (null !== t) {
                    var i = [];
                    for (var s in this._studiesCache[e]) {
                        var r = this._studiesCache[e][s];
                        if (r && "study" === r.type) {
                            var n = this._studiesNonSeriesTimes[e][s];
                            if (n) {
                                var o = {
                                    indexes: this._timeScales[e].convertTimesToIndexes(n),
                                    data: {
                                        indexes_replace: !0
                                    }
                                };
                                i.push({
                                    objId: s,
                                    turnaround: r.turnaround,
                                    data: [],
                                    nonSeriesData: o
                                })
                            }
                        }
                    }
                    TradingView.ChartapiMessagerInstances[e].onTimescaleUpdate(t, i), Promise.resolve().then(function() {
                        var t = this._mainSeriesRecord(e);
                        if (null !== t && null != t.symbolInfo) {
                            var i = this._getSymbolExtrapolator(e, t.symbolInfo, t.resolution);
                            this._pointsetsManagers[e].getUpdatesForSymbol(t.symbolInfo.full_name, t.resolution, i, this._timeScales[e]).forEach((function(t, i) {
                                TradingView.ChartapiMessagerInstances[e].onPointsetDataUpdate(i, null, t)
                            }))
                        }
                    }.bind(this))
                }
            }, E.prototype._updateMainTsBuilder = function(e) {
                var t = this._mainSeriesRecord(e);
                if (null !== t && null != t.symbolInfo) {
                    var i = this._getSymbolExtrapolator(e, t.symbolInfo, t.resolution);
                    this._timeScales[e].setMainSymbolExtrapolator(i)
                }
            }, E.prototype._updateTimeScaleState = function(e) {
                var t = !0,
                    i = !0;
                for (var s in this._studiesCache[e]) {
                    var r = this._studiesCache[e][s];
                    i = i && this._isEndOfData(e, s, r.turnaround), t = t && r.completed
                }
                this._timeScales[e].isCompleted() !== t && (this._timeScales[e].setCompleted(t), t && TradingView.ChartapiMessagerInstances[e].onTimescaleCompleted(i))
            }, E.prototype._mainSeriesRecord = function(e) {
                var t = null,
                    i = null;
                for (var s in this._studiesCache[e]) {
                    var r = this._studiesCache[e][s];
                    if ("series" === r.type && (null === t && (t = r), r.isMain)) {
                        i = r;
                        break
                    }
                }
                return null === i && (i = t), null !== i && (i.isMain = !0), i
            }, E.prototype._seriesCount = function(e) {
                var t = 0;
                for (var i in this._studiesCache[e]) {
                    "series" === this._studiesCache[e][i].type && (t += 1)
                }
                return t
            }, E.prototype._prepareSeriesNonSeriesData = function(e, t, i) {
                var s = i.data[i.data.length - 1],
                    r = this._getSeriesData(e, t),
                    n = null === r ? [] : i.data;
                return {
                    data: {
                        data: {
                            reversalAmount: i.reversalAmount,
                            boxSize: i.boxSize,
                            price: s ? s[4] : i.price,
                            bars: n.map((function(e, t) {
                                return {
                                    time: t,
                                    open: e[1],
                                    high: e[2],
                                    low: e[3],
                                    close: e[4],
                                    volume: e[5],
                                    factor: e[6],
                                    additionalPrice: e[6]
                                }
                            }))
                        }
                    },
                    indexes: this._timeScales[e].convertTimesToIndexes(n.map((function(e) {
                        var t = e[0] || 0;
                        return t < 0 ? r[r.length + t].timeMs : i.projectionTime + t
                    })))
                }
            }, E.prototype.createSeries = function(e, t, i, s, n, o, a) {
                this._setEndOfData(e, t, i, !1);
                var l = new r.OHLCV;
                this._studiesCache[e] = this._studiesCache[e] || {};
                var c = this._getSeriesData(e, t),
                    h = this._studiesCache[e][t],
                    u = this._seriesCount(e),
                    p = this._mainSeriesRecord(e);
                if (!h || d.isEqual(h.resolution, n) && h.symbolId === s) void 0 !== o.countBack && null !== c && 0 !== c.length && (o.to = c[0].timeMs), h && null != h.firstLoadedTimeMs ? o.to = void 0 !== o.to ? Math.min(h.firstLoadedTimeMs, o.to) : h.firstLoadedTimeMs : h || 0 === u || null !== p && (null != p.firstLoadedTimeMs ? (o.to = p.firstLoadedTimeMs, o.countBack = 0) : o = Object.assign({}, p.dataRange));
                else if (1 === u) o = Object.assign({}, h.initialDatarange);
                else {
                    var _ = this._timeScales[e].firstSeriesBarTime();
                    (void 0 === o.to || null !== _ && _ < o.to) && (o.to = _, o.countBack = 0)
                }
                if (void 0 === o.countBack && (o.countBack = 0), void 0 === o.to && 0 === o.countBack && (o.countBack = 100), this._studiesCache[e][t] = {
                        symbolId: s,
                        resolution: n,
                        studyObject: l,
                        guid: t,
                        type: "series",
                        turnaround: i,
                        dataRange: o,
                        initialDatarange: h && h.initialDatarange || Object.assign({}, o),
                        firstLoadedTimeMs: null,
                        symbolInfo: null,
                        isMain: h && h.isMain || 0 === u,
                        completed: !1
                    }, null === p || p.guid === t || !p.error) {
                    this._updateMainTsBuilder(e), this._updateTimeScaleState(e), TradingView.ChartapiMessagerInstances[e].onSeriesLoading(t, i);
                    var m = this;
                    this._computeStudy(e, l, s, n, t, [], o, D(e, t), (function() {
                        return -1 / 0
                    }), {
                        onDataReadyCallback: function(r, o, l, c) {
                            var h = m._studiesCache[e][t];
                            if (!h) throw Error("This should never happen");
                            if (h.symbolInfo = l, h.firstLoadedTimeMs = c.firstLoadedTimeMs, h.completed = !0, m._updateMainTsBuilder(e), a && m._pointsetsManagers[e].invalidatePointsetsForSymbol(l.full_name, n), 0 !== r.length) {
                                var d = m._symbolIdToSymbolRequestString.get(k(e, s)),
                                    u = m._barsCoefficients(d, n);
                                u.expectedBarsCount && u.barsCount && (u.barsCoefficient = Math.min(Math.max(u.barsCoefficient || 1, parseInt(u.expectedBarsCount / (r.length - u.barsCount) + .5)), 100)), u.barsCount = r.length, m._clearSeriesData(e, t)
                            } else !c.endOfData && h.isMain && setTimeout((function() {
                                m._studiesCache[e] && m._recreateSourcesForDataRange(e, {
                                    countBack: 10
                                })
                            }), 0);
                            g(l), c.endOfData && (m._logMessage("Series has no more data on server: {0}".format(l.full_name)), m._setEndOfData(e, t, i)), 0 === r.length && m._clearSeriesData(e, t), TradingView.ChartapiMessagerInstances[e].onSeriesCompleted(t, i, l.data_status), m._updateTimeScaleState(e)
                        },
                        onRealtimeCallback: function(s, r, n, o, a) {
                            g(a, s), m._timeScales[e].fillIndexesInRows(s);
                            var l = s[s.length - 1];
                            if (r) {
                                if (!m._studiesCache[e][t]) throw Error("This should never happen");
                                m._logMessage("New bar arrived: symbol {0}, bar {1}".format(a.full_name, JSON.stringify(l)))
                            } else m._logMessage("Last bar update: symbol {0}, bar {1}".format(a.full_name, JSON.stringify(l))), TradingView.ChartapiMessagerInstances[e].onDataUpdate(t, i, s, null);
                            m._fireEvent("realtime_tick", s[s.length - 1], !0)
                        },
                        onSymbolErrorCallback: function(t) {
                            m._logMessage("Series symbol resolve error"), TradingView.ChartapiMessagerInstances[e].onSymbolError(s, t || "resolve error"), f(t || "resolve error")
                        },
                        onErrorCallback: function(e) {
                            m._logMessage("Series error: " + e), f(e)
                        },
                        onNonSeriesDataUpdate: function(s, r) {
                            if ("projection" !== s.type) throw new Error("unexpected non-series data type for series " + s.type);
                            var n = m._getSeriesData(e, t);
                            if (null !== n) g(r, 0 === n.length ? void 0 : [n[n.length - 1]], s);
                            else {
                                s = m._prepareSeriesNonSeriesData(e, t, s);
                                TradingView.ChartapiMessagerInstances[e].onDataUpdate(t, i, [], s)
                            }
                        }
                    })
                }

                function g(s, r, o) {
                    var a = [];
                    if (void 0 !== o) {
                        var l = (o.data || []).reduce((function(e, t) {
                            return Math.max(e, t[0] || 0)
                        }), -1);
                        if (null != o.projectionTime)
                            for (var c = 0; c <= l; ++c) a.push(o.projectionTime + c)
                    }
                    var h = null,
                        d = null,
                        u = s ? m._getSymbolExtrapolator(e, s, n) : null;
                    if (void 0 !== r) {
                        var p = r.map((function(e) {
                            return e.timeMs
                        })).concat(a);
                        null !== u && u.replaceBarsTimesTail(p, r.length), d = m._timeScales[e].replaceBarsTimesTail(t, p), h = r
                    } else {
                        var _ = m._getSeriesData(e, t) || [],
                            g = _.map((function(e) {
                                return e.timeMs
                            })).concat(a);
                        null !== u && u.setBarsTimes(g, _.length), d = m._timeScales[e].setSeriesBarsTimes(t, g), h = _
                    }
                    if (m._applyTimeScaleUpdate(e, d), 0 !== h.length || void 0 !== o) {
                        m._timeScales[e].fillIndexesInRows(h);
                        var f = void 0 !== o ? m._prepareSeriesNonSeriesData(e, t, o) : null;
                        TradingView.ChartapiMessagerInstances[e].onDataUpdate(t, i, h, f)
                    }
                }

                function f(s) {
                    var r = m._studiesCache[e][t];
                    r.completed = !0, TradingView.ChartapiMessagerInstances[e].onSeriesError(t, i, s), P.enabled("clear_bars_on_series_error") && (r.isMain ? m.onSessionSeriesError(e) : m._clearSeriesData(e, t))
                }
            }, E.prototype._clearSeriesData = function(e, t) {
                var i = {};
                for (var s in i[t] = {
                        turnaround: this._studiesCache[e][t].turnaround
                    }, this._studiesCache[e]) {
                    var r = this._studiesCache[e][s];
                    "study" === r.type && r.parentId === t && (i[s] = {
                        turnaround: r.turnaround
                    })
                }
                TradingView.ChartapiMessagerInstances[e].onClearData(i)
            }, E.prototype.requestMoreTickmarks = function(e, t) {
                var i = this._timeScales[e];
                i.setMinFutureBarsCount(i.minFutureBarsCount() + t);
                var s = i.firstFutureBarIndex(),
                    r = i.tickMarks(s);
                TradingView.ChartapiMessagerInstances[e].onTickmarksUpdated(s, r)
            }, E.prototype.chartCreateSession = function(e) {
                this._pointsetsManagers[e] = new l, this._timeScales[e] = new a, this._studiesNonSeriesTimes[e] = {}
            }, E.prototype.chartDeleteSession = function(e) {
                this._pointsetsManagers[e].destroy(), delete this._pointsetsManagers[e], this._timeScales[e].destroy(), delete this._timeScales[e], delete this._studiesNonSeriesTimes[e]
            }, E.prototype.removePointset = function(e, t) {
                this._pointsetsManagers[e].removePointset(t)
            }, E.prototype.createPointset = async function(e, t, i, s, r) {
                    var n, o = this._resolvePromisesBySymbolId.get(k(e, i));
                    try {
                        n = (await o).symbolInfo
                    } catch (e) {
                        return
                    }
                    var a = this._getSymbolExtrapolator(e, n, s);
                    if (this._pointsetsManagers[e].createPointset(t, n.full_name, s, r, a), null === this._refreshPointsetsTimerId) {
                        var l = this;
                        this._refreshPointsetsTimerId = setTimeout((function() {
                            l._refreshPointsetsTimerId = null, l._refreshPointsets(l._invalidatedPointsetSessions), l._invalidatedPointsetSessions.clear()
                        }), 0)
                    }
                    this._invalidatedPointsetSessions.add(e)
                }, E.prototype._refreshPointsets = function(e) {
                    var t = this;
                    e.forEach((function(e) {
                        var i = t._studiesCache[e];
                        if (null != i) {
                            var s = null;
                            for (var r in i) {
                                var n = i[r];
                                if ("series" === n.type) {
                                    s = n;
                                    break
                                }
                            }
                            if (null !== s && null != s.symbolInfo) {
                                var o = t._getSymbolExtrapolator(e, s.symbolInfo, s.resolution);
                                t._pointsetsManagers[e].getUpdatesForSymbol(s.symbolInfo.full_name, s.resolution, o, t._timeScales[e]).forEach((function(t, i) {
                                    TradingView.ChartapiMessagerInstances[e].onPointsetDataUpdate(i, null, t)
                                }))
                            }
                        }
                    }))
                }, E.prototype.studiesMetadata = function() {
                    return 0 === this._metainfoCache.length && (this._metainfoCache = JSServer.studyLibrary.map((function(e) {
                            return e.metainfo
                        })), this._metainfoCache.push({
                            palettes: {},
                            inputs: [],
                            plots: [{
                                id: "open",
                                type: "line"
                            }, {
                                id: "high",
                                type: "line"
                            }, {
                                id: "low",
                                type: "line"
                            }, {
                                id: "close",
                                type: "line"
                            }, {
                                id: "volume",
                                type: "line"
                            }],
                            graphics: {},
                            _metainfoVersion: 48,
                            description: "Unnamed Study",
                            format: {
                                type: "inherit"
                            },
                            is_hidden_study: !0,
                            is_price_study: !1,
                            shortDescription: "Unnamed Study",
                            description_localized: "Unnamed Study",
                            id: "BarSetHeikenAshi@tv-prostudies",
                            shortId: "BarSetHeikenAshi",
                            packageId: "tv-basicstudies",
                            version: "13",
                            fullId: "BarSetHeikenAshi@tv-basicstudies-13",
                            productId: "tv-basicstudies",
                            name: "BarSetHeikenAshi@tv-basicstudies"
                        })),
                        this._metainfoCache
                }, E.prototype.searchSymbols = function(e, t, i, s) {
                    this._logMessage("Symbol search requested: search string `{0}`, exchange: `{1}`, type `{2}`".format(e, t, i));
                    var r = this;
                    this._externalDatafeed.searchSymbols(e, t, i, (function(e) {
                        r._logMessage("Symbol search response: {0}".format(JSON.stringify(e))), e.forEach((e => {
                            L(e.logo_urls, e), e.exchange_logo && (e.provider_id = e.exchange_logo)
                        })), s(e)
                    }))
                }, E.prototype.resolveSymbol = function(e, t, i) {
                    var s = this;
                    this._symbolIdToSymbolRequestString.set(k(e, t), i), this._resolvePromisesBySymbolId.set(k(e, t), new Promise((function(r, n) {
                        s._resolveSymbolImpl(i, (function(s) {
                            TradingView.ChartapiMessagerInstances[e].onSymbolResolved(t, s), r({
                                symbolInfo: s,
                                requestedSymbol: i
                            })
                        }), (function(i) {
                            TradingView.ChartapiMessagerInstances[e].onSymbolError(t, i), n(i)
                        }))
                    })))
                }, E.prototype._resolveSymbolImpl = function(e, t, i) {
                    S(e) || console.error("Expect to get symbol encoded string, but got the following instead: " + e);
                    var s = y(e),
                        r = "string" == typeof s.symbol ? s : s.symbol,
                        n = r.symbol,
                        o = r["currency-id"],
                        a = r["unit-id"],
                        l = r.session === C.Regular ? void 0 : r.session;
                    this._resolveSymbolByName(n, {
                        currency: o,
                        unit: a,
                        session: l
                    }, t, i)
                }, E.prototype._resolveSymbolByName = function(e, t, i, s) {
                    var r, n = t && t.currency,
                        o = t && t.unit,
                        a = t && t.session,
                        l = V(e, n, o, a);
                    if (this._resolveRequests[l]) r = this._resolveRequests[l];
                    else {
                        r = this._resolveSymbolInternal(e, n || void 0, o || void 0, a || void 0), this._resolveRequests[l] = r;
                        var c = this;
                        r.then((function(t) {
                            c._resolveRequests[V(e, t.currency_id, t.unit_id, t.subsession_id)] = r, c._resolveRequests[V(b(t, null), t.currency_id, t.unit_id, t.subsession_id)] = r, c._resolveRequests[V(b(t, null), n, o, a)] = r
                        })).catch((function() {}))
                    }
                    r.then(i).catch(s)
                }, E.prototype._resolveSymbolInternal = function(e, t, i, s) {
                    var r = this;
                    return new Promise(function(n, o) {
                        this._logMessage("Symbol resolve requested: `{0}` ".format(e));
                        var a = !0;
                        this._externalDatafeed.resolveSymbol(e, (function(t) {
                            a && console.warn("`resolveSymbol` should return result asynchronously. Use `setTimeout` with 0 interval to execute the callback function."), r._logMessage("Symbol resolved: `{0}`, SymbolInfo in server response {1}".format(e, JSON.stringify(t))),
                                function(e) {
                                    if (e.base_name || (e.base_name = [e.name]), e.legs || (e.legs = [e.name]), e.exchange || (e.exchange = e["exchange-listed"]), e.full_name || (e.full_name = e.ticker || (e.exchange ? e.exchange + ":" + e.name : e.name)), e.pro_name || (e.pro_name = e.full_name), e.data_status || (e.data_status = "streaming"), e.ticker || (e.ticker = e.symbol || e.name), !e.session && e["session-regular"] && (e.session = e["session-regular"]), !e.minmov && e.minmovement && (e.minmov = e.minmovement), e.currency_code && (e.currency_id = e.currency_code), e.original_currency_code && (e.original_currency_id = e.original_currency_code), e.holidays && (e.session_holidays = e.holidays), void 0 !== e.has_no_volume && (e.visible_plots_set = e.has_no_volume ? "ohlc" : "ohlcv"), e.supported_resolutions)
                                        for (var t = 0; t < e.supported_resolutions.length; t++) {
                                            var i = d.parse(e.supported_resolutions[t]);
                                            i.isValid() && (e.supported_resolutions[t] = i.value())
                                        }
                                    if (e.price_sources || (e.price_sources = []),
                                        I && Array.isArray(e.subsessions))
                                        for (let t = 0; t < e.subsessions.length; t++) {
                                            const i = e.subsessions[t];
                                            switch (i["session-display"] = i.session, i.id) {
                                                case C.Regular:
                                                case C.Extended:
                                                    i.private = !1;
                                                    break;
                                                case C.PreMarket:
                                                case C.PostMarket:
                                                    i.private = !0
                                            }
                                        }
                                }(t),
                                function(e) {
                                    function t(e) {
                                        console.warn("SymbolInfo validation: " + e)
                                    }
                                    if (e.has_empty_bars && !f() && t('both has_empty_bars field and featureset "disable_resolution_rebuild" are enabled and may cause data issues (see #3329)'), (void 0 === e.minmov || e.minmov <= 0) && t("minmov must be positive"), (void 0 === e.pricescale || e.pricescale <= 0) && t("pricescale must be positive"), void 0 !== e.name && 0 !== e.name.length || t("name must be non-empty string"), void 0 !== e.session && 0 !== e.session.length || t("session must be non-empty string"), void 0 !== e.holidays && t("field holidays is deprecated, use session_holidays instead"), void 0 !== e.has_no_volume && t("field has_no_volume is deprecated, use visible_plots_set instead"), void 0 === e.timezone || 0 === e.timezone.length ? t("timezone must be non-empty string") : "exchange" !== e.timezone && g(e.timezone) || "UTC" !== e.timezone && t('unsupported timezone "{0}"'.format(e.timezone)), void 0 !== e.intraday_multipliers) {
                                        var i = e.intraday_multipliers;
                                        if (Array.isArray(i))
                                            for (var s = 0; s < i.length; ++s) "string" != typeof i[s] && t('intraday_multipliers[{0}] = "{1}" must be string (now: {2})'.format(s + 1, i[s], typeof i[s]));
                                        else t("intraday_multipliers must be array")
                                    }(e.supported_resolutions || []).filter((function(e) {
                                        return !d.isValid(e)
                                    })).forEach((function(e) {
                                        t("supported_resolutions field contains invalid value: " + e)
                                    })), I || (void 0 !== e.subsessions && t("Symbol info contains subsessions but the pre_post_market_sessions feature is not enabled, so the subsessions will be ignored"), void 0 !== e.subsession_id && t("Symbol info contains a subsession ID but the pre_post_market_sessions feature is not enabled, so the subsession ID will be ignored"))
                                }(t), r._logMessage("Symbol info after post-processing: `{0}`, SymbolInfo {1}".format(e, JSON.stringify(t))), n(t)
                        }), (function(t) {
                            r._logMessage("Symbol resolve failed: `{0}`, reason: `{1}`".format(e, t)), o(t)
                        }), {
                            currencyCode: t,
                            unitId: i,
                            session: s
                        }), a = !1
                    }.bind(this))
                }, E.prototype._createMarketStatusWatchers = function(e, t) {
                    void 0 === this._marketStatusWatchers[e] && (this._marketStatusWatchers[e] = {});
                    var i = this;
                    t.forEach((function(t) {
                        void 0 === i._marketStatusWatchers[e][t] && (i._marketStatusWatchers[e][t] = new s(i._resolveSymbolByName.bind(i), e, t))
                    }))
                }, E.prototype._removeMarketStatusWatchers = function(e) {
                    var t = this;
                    Object.keys(this._marketStatusWatchers[e] || {}).forEach((function(i) {
                        t._marketStatusWatchers[e][i].stop()
                    })), this._marketStatusWatchers[e] = {}
                }, E.prototype._stopQuotesSubscription = function(e) {
                    this._quotesInfo[e].listenerGUID && (this._externalDatafeed.unsubscribeQuotes(this._quotesInfo[e].listenerGUID), this._quotesInfo[e].listenerGUID = void 0), this._removeMarketStatusWatchers(e)
                }, E.prototype._startQuotesSubscription = function(e) {
                    var t = {},
                        i = this;

                    function s(t, s) {
                        var r = i._marketStatusWatchers[e][t.n];
                        t.symbolname = t.n, t.status = t.s, t.values = t.v, t.values.change = t.v.ch,
                            t.values.last_price = t.v.lp, t.values.change_percent = t.v.chp, t.values.current_session = t.v.cs || r && r.marketStatus(), t.values.pricescale = s.pricescale, t.values.minmov = s.minmov, t.values.minmove2 = s.minmove2 || 0, t.values.fractional = s.fractional || !1, L(s.logo_urls, t.values), r && t.v.cs && r.stop(), TradingView.ChartapiMessagerInstances[e].onQuotesData([e].concat([t]))
                    }

                    function r(e) {
                        e.forEach((function(e) {
                            void 0 !== t[e.n] ? null !== t[e.n] && s(e, t[e.n]) : i._resolveSymbolByName(e.n, null, (function(i) {
                                t[e.n] = i, s(e, i)
                            }), (function() {
                                t[e.n] = null
                            }))
                        }))
                    }
                    var n = this._quotesInfo[e].symbols;
                    0 !== n.length && (this._externalDatafeed.getQuotes && !P.enabled("charting_library") ? this._externalDatafeed.getQuotes(n, (function(t) {
                        i._quotesInfo[e] && 0 !== i._quotesInfo[e].symbols.length && (r(t), i._quotesInfo[e].listenerGUID = e, i._externalDatafeed.subscribeQuotes(n, i._quotesInfo[e].fastSymbols, r, i._quotesInfo[e].listenerGUID))
                    }), (function(e) {})) : !this._externalDatafeed.getQuotes && P.enabled("trading_terminal") && setTimeout((function() {
                        r(n.map((function(e) {
                            return {
                                n: e,
                                s: "ok",
                                v: {}
                            }
                        })))
                    })), this._createMarketStatusWatchers(e, n))
                }, E.prototype._restartQuotesSubscription = function(e) {
                    this._stopQuotesSubscription(e), this._startQuotesSubscription(e)
                }, E.prototype.quoteCreateSession = function(e) {
                    this._quotesInfo[e] = {
                        symbols: [],
                        fastSymbols: [],
                        listenerGUID: void 0
                    }
                }, E.prototype.quoteDeleteSession = function(e) {
                    this._stopQuotesSubscription(e), this._quotesInfo[e] = null
                }, E.prototype.quoteSetFields = function(e, t) {}, E.prototype.quoteAddSymbols = function(e, t) {
                    this._quotesInfo[e].symbols = this._filteredSymbols(this._quotesInfo[e].symbols.concat(t)), this._restartQuotesSubscription(e)
                }, E.prototype.quoteRemoveSymbols = function(e, t) {
                    this._quotesInfo[e].symbols = this._quotesInfo[e].symbols.filter((function(e) {
                        return t.indexOf(e) < 0
                    })), this._restartQuotesSubscription(e)
                }, E.prototype.quoteFastSymbols = function(e, t) {
                    this._quotesInfo[e].fastSymbols = this._filteredSymbols(t), this._restartQuotesSubscription(e)
                }, E.prototype.quoteHibernateAll = function(e) {}, E.prototype._stopDepthSubscription = function(e) {
                    this._depthInfo[e].listenerGUID && (this._externalDatafeed.unsubscribeDepth(this._depthInfo[e].listenerGUID), this._depthInfo[e].listenerGUID = void 0)
                }, E.prototype._startDepthSubscription = function(e) {
                    var t = this,
                        i = this._depthInfo[e].symbol;

                    function s(e) {
                        return e.map((function(e) {
                            return {
                                p: e.price,
                                v: e.volume
                            }
                        }))
                    }

                    function r(e) {
                        var t = {};
                        return t.s = i, t.bids = s(e.bids), t.asks = s(e.asks), t
                    }
                    i && this._externalDatafeed.subscribeDepth && (t._depthInfo[e].listenerGUID = this._externalDatafeed.subscribeDepth(i, (function(i) {
                        var s;
                        t._depthInfo[e] && ((s = i).snapshot ? TradingView.ChartapiMessagerInstances[e].onDepthData([e].concat([r(s)])) : TradingView.ChartapiMessagerInstances[e].onDepthUpdate([e].concat([r(s)])))
                    })))
                }, E.prototype._restartDepthSubscription = function(e) {
                    this._stopDepthSubscription(e), this._startDepthSubscription(e)
                }, E.prototype.depthCreateSession = function(e) {
                    this._depthInfo[e] = {
                        symbol: null,
                        listenerGUID: void 0
                    }
                }, E.prototype.depthDeleteSession = function(e) {
                    this._depthInfo[e].symbol = null, this._stopDepthSubscription(e), delete this._depthInfo[e]
                },
                E.prototype.depthSetSymbol = function(e, t) {
                    this._depthInfo[e].symbol = t, this._restartDepthSubscription(e)
                }, E.prototype._filteredSymbols = function(e) {
                    var t = [];
                    return e.forEach((function(e) {
                        e instanceof Object || t.indexOf(e) < 0 && t.push(e)
                    })), t
                }, E.prototype._isEndOfData = function(e, t, i) {
                    var s = e + "!" + t + "@" + i;
                    return !!this._endOfData[s]
                }, E.prototype._setEndOfData = function(e, t, i, s) {
                    var r = e + "!" + t + "@" + i;
                    this._endOfData[r] = !1 !== s
                }, E.prototype.serverTimeOffset = function() {
                    return this._serverTimeOffset
                }, E.prototype.serverTime = function() {
                    return 1e3 * this.getCurrentUTCTime()
                }, E.prototype.getCurrentUTCTime = function() {
                    return (new Date).valueOf() / 1e3 + this._serverTimeOffset
                }, E.prototype.switchTimezone = function(e, t) {
                    this._timeScales[e].setTimezone(t);
                    var i = this._timeScales[e].tickMarks();
                    null !== i && TradingView.ChartapiMessagerInstances[e].onTickmarksUpdated(0, i)
                }, E.prototype._studyCanExtendTimeScale = function(e, t) {
                    const i = this._studiesCache[e][t].metainfo;
                    return P.enabled("studies_extend_time_scale") && i.canExtendTimeScale || P.enabled("secondary_series_extend_time_scale") && "Overlay@tv-basicstudies-1" === i.id
                }, e.exports = E
}