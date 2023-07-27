(e, t, i) => {
    "use strict";
    var s, r = i(85898).StudyError,
        n = i(78071),
        o = i(60062).SessionStage,
        a = i(36274).Interval,
        l = i(77475).createDwmAligner,
        c = i(77475).createTimeToBarTimeAligner,
        h = i(27856).decodeExtendedSymbol,
        d = i(27856).encodeExtendedSymbolOrGetSimpleSymbolString,
        u = i(66846).SubsessionId,
        p = i(73241).PrePostMarketBarIdentifier,
        _ = i(32923).SessionSpec,
        m = 1e-10,
        g = "undefined" != typeof window ? window : i.g,
        f = g.PineJsCalendar ? g.PineJsCalendar : i(41249),
        v = i(60156),
        S = i(94421).extrapolateBarsFrontToTime,
        y = {};

    function b(e, t, i, s, r) {
        var n = r,
            o = 0;
        if (isNaN(e.get(t - 1))) return {
            index: NaN,
            value: NaN
        };
        for (var a = 0; a < t; ++a) s(e.get(a), n) && (o = a, n = e.get(a));
        return {
            index: o,
            value: n
        }
    }
    y.max_series_default_size = 10001, y.n = function(e) {
        return e.symbol.index + 1
    }, y.nz = function(e, t) {
        return t = t || 0, isFinite(e) ? e : t
    }, y.na = function(e) {
        return 0 === arguments.length ? NaN : isNaN(e) ? 1 : 0
    }, y.isZero = function(e) {
        return Math.abs(e) <= 1e-10
    }, y.toBool = function(e) {
        return isFinite(e) && !y.isZero(e)
    }, y.eq = function(e, t) {
        return y.isZero(e - t)
    }, y.neq = function(e, t) {
        return !y.eq(e, t)
    }, y.ge = function(e, t) {
        return y.isZero(e - t) || e > t
    }, y.gt = function(e, t) {
        return !y.isZero(e - t) && e > t
    }, y.lt = function(e, t) {
        return !y.isZero(e - t) && e < t
    }, y.le = function(e, t) {
        return y.isZero(e - t) || e < t
    }, y.and = function(e, t) {
        return isNaN(e) || isNaN(t) ? NaN : y.isZero(e) || y.isZero(t) ? 0 : 1
    }, y.or = function(e, t) {
        return isNaN(e) || isNaN(t) ? NaN : y.isZero(e) && y.isZero(t) ? 0 : 1
    }, y.not = function(e) {
        return isNaN(e) ? NaN : y.isZero(e) ? 1 : 0
    }, y.eps = function() {
        return m
    }, y.greaterOrEqual = function(e, t, i) {
        return t - e < (i || m)
    }, y.lessOrEqual = function(e, t, i) {
        return e - t < (i || m)
    }, y.equal = function(e, t, i) {
        return Math.abs(e - t) < (i || m)
    }, y.greater = function(e, t, i) {
        return e - t > (i || m)
    }, y.less = function(e, t, i) {
        return t - e > (i || m)
    }, y.compare = function(e, t, i) {
        return y.equal(e, t, i) ? 0 : y.greater(e, t, i) ? 1 : -1
    }, y.max = Math.max, y.min = Math.min, y.pow = Math.pow, y.abs = Math.abs, y.log = Math.log, y.log10 = function(e) {
        return Math.log(e) / Math.LN10
    }, y.sqrt = Math.sqrt, y.sign = function(e) {
        return isNaN(e) ? NaN : y.isZero(e) ? 0 : e > 0 ? 1 : -1
    }, y.exp = Math.exp, y.sin = Math.sin, y.cos = Math.cos, y.tan = Math.tan, y.asin = Math.asin, y.acos = Math.acos, y.atan = Math.atan, y.floor = Math.floor, y.ceil = Math.ceil, y.round = Math.round, y.avg = function(e, t, i, s, r, n) {
        if (2 === arguments.length) return (e + t) / 2;
        for (var o = 0, a = 0; a < arguments.length; a++) o += arguments[a];
        return o / arguments.length
    }, y.open = function(e) {
        return e.symbol.open
    }, y.high = function(e) {
        return e.symbol.high
    }, y.low = function(e) {
        return e.symbol.low
    }, y.close = function(e) {
        return e.symbol.close
    }, y.hl2 = function(e) {
        return (e.symbol.high + e.symbol.low) / 2
    }, y.hlc3 = function(e) {
        return (e.symbol.high + e.symbol.low + e.symbol.close) / 3
    }, y.ohlc4 = function(e) {
        return (e.symbol.open + e.symbol.high + e.symbol.low + e.symbol.close) / 4
    }, y.volume = function(e) {
        return e.symbol.volume
    }, y.updatetime = function(e) {
        return e.symbol.updatetime
    }, y.time = function(e) {
        return e.symbol.bartime()
    }, y.period = function(e) {
        return e.symbol.period
    }, y.tickerid = function(e) {
        return e.symbol.tickerid
    }, y.currencyCode = function(e) {
        return e.symbol.currencyCode
    }, y.unitId = function(e) {
        return e.symbol.unitId
    }, y.ticker = function(e) {
        return e.symbol.ticker
    }, y.interval = function(e) {
        return e.symbol.interval
    }, y.isdwm = function(e) {
        return e.symbol.isdwm()
    }, y.isintraday = function(e) {
        return !e.symbol.isdwm()
    }, y.isdaily = function(e) {
        return "D" === e.symbol.resolution
    }, y.isweekly = function(e) {
        return "W" === e.symbol.resolution
    }, y.ismonthly = function(e) {
        return "M" === e.symbol.resolution
    }, y.year = function(e) {
        return y.timepart(e.symbol, f.YEAR, arguments[1])
    }, y.month = function(e) {
        return y.timepart(e.symbol, f.MONTH, arguments[1])
    }, y.weekofyear = function(e) {
        return y.timepart(e.symbol, f.WEEK_OF_YEAR, arguments[1])
    }, y.dayofmonth = function(e) {
        return y.timepart(e.symbol, f.DAY_OF_MONTH, arguments[1])
    }, y.dayofweek = function(e) {
        return y.timepart(e.symbol, f.DAY_OF_WEEK, arguments[1])
    }, y.hour = function(e) {
        return y.timepart(e.symbol, f.HOUR_OF_DAY, arguments[1])
    }, y.minute = function(e) {
        return y.timepart(e.symbol, f.MINUTE, arguments[1])
    }, y.second = function(e) {
        return y.timepart(e.symbol, f.SECOND, arguments[1])
    }, y.add_days_considering_dst = function(e, t, i) {
        return f.add_days_considering_dst(f.get_timezone(e), t, i)
    }, y.selectSessionBreaks = function(e, t) {
        if (y.isdwm(e) || void 0 === e.symbol.session.timezone) return [];
        var i = v.newBarBuilder(e.symbol.period, e.symbol.session),
            s = [],
            r = t.length;
        if (i.moveTo(t[r - 1]), 1 === r && i.startOfBar(0) === t[0]) s.push(t[0]);
        else {
            for (var n = r - 2; n >= 0; --n) {
                var o = t[n];
                if (!(o >= i.startOfBar(0))) {
                    i.moveTo(o);
                    var a = t[n + 1];
                    s.push(a)
                }
            }
            s.reverse()
        }
        return s
    }, y.selectPreAndPostMarketTimes = function(e, t) {
        if (y.isdwm(e) || void 0 === e.symbol.session.timezone) return {
            preMarket: [],
            postMarket: []
        };
        if (null === e.symbol.regularSubsession || null === e.symbol.preMarketSubsession || null === e.symbol.postMarketSubsession) return {
            preMarket: [],
            postMarket: []
        };
        return new p(e.symbol.timezone, e.symbol.preMarketSubsession, e.symbol.postMarketSubsession).getPreAndPostMarketTimes(t)
    }, y.iff = function(e, t, i) {
        return y.not(e) ? i : t
    }, y.rising = function(e, t) {
        for (var i = 1; i < t + 1; ++i)
            if (e.get(i) > e.get(0)) return 0;
        return 1
    }, y.falling = function(e, t) {
        for (var i = 1; i < t + 1; ++i)
            if (e.get(i) < e.get(0)) return 0;
        return 1
    }, y.timepart = function(e, t, i) {
        var s = f.utc_to_cal(e.timezone, i || e.bartime());
        return f.get_part(s, t)
    }, y.rsi = function(e, t) {
        return y.isZero(t) ? 100 : y.isZero(e) ? 0 : 100 - 100 / (1 + e / t)
    }, y.sum = function(e, t, i) {
        var s = i.new_var(),
            r = y.nz(e.get()) + y.nz(s.get(1)) - y.nz(e.get(t));
        return s.set(r), r
    }, y.sma = function(e, t, i) {
        var s = y.sum(e, t, i);
        return y.na(e.get(t - 1)) ? NaN : s / t
    }, y.smma = function(e, t, i) {
        var s = i.new_var(e),
            r = y.sma(s, t, i),
            n = i.new_var(),
            o = (n.get(1) * (t - 1) + e) / t;
        return n.set(y.na(n.get(1)) ? r : o), n.get(0)
    }, y.rma = function(e, t, i) {
        var s = y.sum(e, t, i),
            r = t - 1,
            n = e.get(r),
            o = i.new_var(),
            a = o.get(1),
            l = e.get(),
            c = y.na(n) ? NaN : y.na(a) ? s / t : (l + a * r) / t;
        return o.set(c), c
    }, y.fixnan = function(e, t) {
        var i = t.new_var();
        return isNaN(e) ? i.get(1) : (i.set(e), e)
    }, y.tr = function(e, t) {
        1 === arguments.length && (t = e, e = void 0);
        var i = void 0 !== e && !!e,
            s = t.new_var(y.close(t)),
            r = s.get(1);
        return i && isNaN(r) && (r = y.close(t)), y.max(y.max(y.high(t) - y.low(t), y.abs(y.high(t) - r)), y.abs(y.low(t) - r))
    }, y.atr = function(e, t) {
        var i = t.new_var(y.tr(t));
        return y.rma(i, e, t)
    }, y.ema = function(e, t, i) {
        var s = y.sum(e, t, i),
            r = i.new_var(),
            n = e.get(0),
            o = e.get(t - 1),
            a = r.get(1),
            l = y.na(o) ? NaN : y.na(a) ? s / t : 2 * (n - a) / (t + 1) + a;
        return r.set(l), l
    }, y.wma = function(e, t, i) {
        for (var s = 0, r = t = Math.round(t); r >= 0; r--) {
            s += (t - r) * e.get(r)
        }
        return 2 * s / (t * (t + 1))
    }, y.vwma = function(e, t, i) {
        var s = i.new_var(y.volume(i)),
            r = i.new_var(e.get(0) * y.volume(i));
        return y.sma(r, t, i) / y.sma(s, t, i)
    }, y.swma = function(e, t) {
        return (e.get(0) + 2 * e.get(1) + 2 * e.get(2) + e.get(3)) / 6
    }, y.supertrend = function(e, t, i) {
        var s = y.atr(t, i),
            r = i.new_var(s).get(1),
            n = y.hl2(i),
            o = n + s * e,
            a = n - s * e,
            l = y.close(i),
            c = i.new_var(l).get(1),
            h = i.new_var(),
            d = y.nz(h.get(1)),
            u = i.new_var(),
            p = y.nz(u.get(1));
        a = y.gt(a, d) || y.lt(c, d) ? a : d, h.set(a), o = y.lt(o, p) || y.gt(c, p) ? o : p, u.set(o);
        var _ = y.na(),
            m = i.new_var(),
            g = m.get(1),
            f = -1 === (_ = y.na(r) ? 1 : g === p ? l > o ? -1 : 1 : l < a ? 1 : -1) ? a : o;
        return m.set(f), [f, _]
    }, y.lowestbars = function(e, t, i) {
        return -b(e, t, 0, (function(e, t) {
            return y.lt(e, t)
        }), Number.MAX_VALUE).index
    }, y.lowest = function(e, t, i) {
        return b(e, t, 0, (function(e, t) {
            return y.lt(e, t)
        }), Number.MAX_VALUE).value
    }, y.highestbars = function(e, t, i) {
        return -b(e, t, 0, (function(e, t) {
            return y.gt(e, t)
        }), Number.NEGATIVE_INFINITY).index
    }, y.highest = function(e, t, i) {
        return b(e, t, 0, (function(e, t) {
            return y.gt(e, t)
        }), Number.NEGATIVE_INFINITY).value
    }, y.cum = function(e, t) {
        var i = t.new_var(),
            s = y.nz(i.get(1)) + e;
        return i.set(s), s
    }, y.accdist = function(e) {
        var t = y.high(e),
            i = y.low(e),
            s = y.close(e),
            r = y.volume(e);
        return y.cum(s === t && s === i || t === i ? 0 : r * (2 * s - i - t) / (t - i), e)
    }, y.correlation = function(e, t, i, s) {
        var r = y.sma(e, i, s),
            n = y.sma(t, i, s),
            o = s.new_var(e.get() * t.get());
        return (y.sma(o, i, s) - r * n) / Math.sqrt(y.variance2(e, r, i) * y.variance2(t, n, i))
    }, y.stoch = function(e, t, i, s, r) {
        var n = y.highest(t, s),
            o = y.lowest(i, s);
        return y.fixnan(100 * (e.get() - o) / (n - o), r)
    }, y.tsi = function(e, t, i, s) {
        var r = s.new_var(y.change(e)),
            n = s.new_var(y.abs(y.change(e))),
            o = s.new_var(y.ema(r, i, s)),
            a = s.new_var(y.ema(n, i, s));
        return y.ema(o, t, s) / y.ema(a, t, s)
    }, y.cross = function(e, t, i) {
        if (isNaN(e) || isNaN(t)) return !1;
        var s, r = i.new_var((s = e - t) < 0 ? -1 : 0 === s ? 0 : 1);
        return !isNaN(r.get(1)) && r.get(1) !== r.get()
    }, y.linreg = function(e, t, i) {
        for (var s = 0, r = 0, n = 0, o = 0, a = 0; a < t; ++a) {
            var l = e.get(a),
                c = t - 1 - a + 1;
            s += c, r += l, n += c * c, o += l * c
        }
        var h = (t * o - s * r) / (t * n - s * s);
        return r / t - h * s / t + h + h * (t - 1 - i)
    }, y.sar = function(e, t, i, s) {
        var r = s.new_var(),
            n = s.new_var(),
            o = s.new_var(),
            a = y.high(s),
            l = y.low(s),
            c = y.close(s),
            h = s.new_var(a),
            d = s.new_var(l),
            u = s.new_var(c),
            p = s.new_var(),
            _ = p.get(1),
            m = n.get(1),
            g = o.get(1);
        n.set(m), o.set(g);
        var f = !1,
            v = d.get(1),
            S = d.get(2),
            b = h.get(1),
            w = h.get(2),
            P = u.get(),
            C = u.get(1);
        2 === y.n(s) && (y.greater(P, C) ? (r.set(1), o.set(h.get()), _ = v, g = h.get()) : (r.set(-1), o.set(d.get()), _ = b, g = d.get()), f = !0, n.set(e), m = e);
        var x = _ + m * (g - _);
        return 1 === r.get() ? y.greater(x, d.get()) && (f = !0, r.set(-1), x = Math.max(h.get(), o.get()), o.set(d.get()), n.set(e)) : y.less(x, h.get()) && (f = !0, r.set(1), x = Math.min(d.get(), o.get()), o.set(h.get()), n.set(e)), f || (1 === r.get() ? y.greater(h.get(), o.get()) && (o.set(h.get()), n.set(Math.min(n.get() + t, i))) : y.less(d.get(), o.get()) && (o.set(d.get()), n.set(Math.min(n.get() + t, i)))),
            1 === r.get() ? (x = Math.min(x, v), y.n(s) > 2 && (x = Math.min(x, S))) : (x = Math.max(x, b), y.n(s) > 2 && (x = Math.max(x, w))), p.set(x), x
    }, y.alma = function(e, t, i, s) {
        for (var r = Math.floor(i * (t - 1)), n = t / s * (t / s), o = [], a = 0, l = 0; l < t; ++l) {
            var c = Math.exp(-1 * Math.pow(l - r, 2) / (2 * n));
            a += c, o.push(c)
        }
        for (l = 0; l < t; ++l) o[l] /= a;
        var h = 0;
        for (l = 0; l < t; ++l) h += o[l] * e.get(t - l - 1);
        return h
    }, y.wvap = function(e, t) {
        return e.get() - e.get(1)
    }, y.change = function(e) {
        return e.get() - e.get(1)
    }, y.roc = function(e, t) {
        var i = e.get(t);
        return 100 * (e.get() - i) / i
    }, y.dev = function(e, t, i) {
        var s = y.sma(e, t, i);
        return y.dev2(e, t, s)
    }, y.dev2 = function(e, t, i) {
        for (var s = 0, r = 0; r < t; r++) {
            var n = e.get(r);
            s += y.abs(n - i)
        }
        return s / t
    }, y.stdev = function(e, t, i) {
        var s = y.variance(e, t, i);
        return y.sqrt(s)
    }, y.variance = function(e, t, i) {
        var s = y.sma(e, t, i);
        return y.variance2(e, s, t)
    }, y.variance2 = function(e, t, i) {
        for (var s = 0, r = 0; r < i; r++) {
            var n = e.get(r),
                o = y.abs(n - t);
            s += o * o
        }
        return s / i
    }, y.percentrank = function(e, t) {
        if (y.na(e.get(t - 1))) return NaN;
        for (var i = 0, s = e.get(), r = 1; r < t; r++) {
            var n = e.get(r);
            y.ge(s, n) && i++
        }
        return 100 * i / t
    }, y.createNewSessionCheck = function(e) {
        if (void 0 === e.symbol.session.timezone) return function() {
            return !1
        };
        var t = v.newBarBuilder(e.symbol.period, e.symbol.session);
        return function(e) {
            return t.indexOfBar(e) === o.POST_SESSION && (t.moveTo(e), !0)
        }
    }, y.error = function(e) {
        throw new r(e)
    }, y.dmi = function(e, t, i) {
        var s = i.new_var(y.high(i)),
            r = i.new_var(y.low(i)),
            n = y.change(s),
            o = -y.change(r),
            a = i.new_var(y.na(n) || y.na(o) ? y.na() : y.and(y.gt(n, o), y.gt(n, 0)) ? n : 0),
            l = i.new_var(y.na(o) ? y.na() : y.and(y.gt(o, n), y.gt(o, 0)) ? o : 0),
            c = y.atr(e, i),
            h = y.fixnan(100 * y.rma(a, e, i) / c, i),
            d = y.fixnan(100 * y.rma(l, e, i) / c, i),
            u = h + d;
        y.isZero(u) && (u += 1);
        var p = Math.abs(h - d) / u * 100,
            _ = i.new_var(p),
            m = y.rma(_, t, i),
            g = i.new_var(m);
        return [h, d, p, m, (g.get(0) + g.get(e - 1)) / 2]
    };
    class w {
        constructor(e, t, i, s, r) {
            this._areaRight = e, this._areaLeft = t, this._pivotType = i, this._series = s, this._currentIndex = r.new_var(0), this._currentValue = r.new_var(NaN), this._pivotIndex = r.new_var(-1), this._index = y.n(r), this._isNewBar = r.symbol.isNewBar;
            var n = this._currentIndex.get(1),
                o = this._currentValue.get(1),
                a = this._pivotIndex.get(1);
            this._index > 1 && (this._currentIndex.set(n), this._currentValue.set(o), this._pivotIndex.set(a))
        }
        isPivotFound() {
            return -1 !== this._pivotIndex.get()
        }
        pivotIndex() {
            return this._pivotIndex.get()
        }
        currentValue() {
            return this._currentValue.get()
        }
        pivotType() {
            return this._pivotType
        }
        reset() {
            this._currentValue.set(NaN), this._currentIndex.set(0), this._pivotIndex.set(-1)
        }
        isRightSideOk(e) {
            return e - this._currentIndex.get() === this._areaRight
        }
        isViolate(e, t) {
            if (e < 1 || isNaN(this._currentValue.get())) return !0;
            var i = this._series.get(this._index - e);
            return !!isNaN(i) || (i === this._currentValue.get() ? t : this._pivotType === w.HIGH ? i > this._currentValue.get() : i < this._currentValue.get())
        }
        processPoint(e) {
            this.isViolate(e, !1) && (this._currentValue.set(this._series.get()), this._currentIndex.set(e))
        }
        isRestartNeeded(e) {
            return e - this._currentIndex.get() > this._areaRight
        }
        update() {
            if (this._isNewBar && this.isPivotFound() && this.reset(), this.processPoint(this._index), this.isRightSideOk(this._index)) {
                if (-1 === this._pivotIndex.get()) {
                    for (var e = !0, t = 0; t < this._areaLeft; ++t)
                        if (this.isViolate(this._currentIndex.get() - 1 - t, !0)) {
                            e = !1;
                            break
                        } e && this._pivotIndex.set(this._currentIndex.get())
                }
            } else - 1 !== this._pivotIndex.get() && this._pivotIndex.set(-1);
            if (this.isRestartNeeded(this._index)) {
                this.reset();
                for (t = 0; t <= this._areaRight; ++t) this.processPoint(this._index - this._areaRight + t)
            }
        }
    }
    w.LOW = 0, w.HIGH = 1;
    class P {
        constructor(e, t, i) {
            this._deviation = e;
            var s = i.new_var(y.high(i)),
                r = i.new_var(y.low(i));
            s.get(2 * t + 1), r.get(2 * t + 1), this._pivotHigh = new w(t, t, w.HIGH, s, i), this._pivotLow = new w(t, t, w.LOW, r, i), this._lastVal = i.new_var(NaN), this._lastIndex = i.new_var(-1), this._lastType = i.new_var(), this._index = y.n(i), this._isNewBar = i.symbol.isNewBar, this._isBarClosed = i.symbol.isBarClosed;
            var n = this._lastIndex.get(1),
                o = this._lastVal.get(1),
                a = this._lastType.get(1);
            this._index > 1 && this.addPivot(n, o, a), this.processPivot(this._pivotHigh), this.processPivot(this._pivotLow)
        }
        addPivot(e, t, i) {
            this._lastIndex.set(e), this._lastVal.set(t), this._lastType.set(i)
        }
        updatePivot(e, t) {
            this._lastIndex.set(e), this._lastVal.set(t)
        }
        lastPrice() {
            return this._lastVal.get()
        }
        lastIndex() {
            return this._lastIndex.get()
        }
        addPoint(e, t, i) {
            if (isNaN(this._lastVal.get())) this.addPivot(e, t, i);
            else {
                var s = this._lastVal.get();
                if (this._lastType.get() !== i) Math.abs(s - t) / t > this._deviation && this.addPivot(e, t, i);
                else(i === w.HIGH ? t > s : t < s) && this.updatePivot(e, t)
            }
        }
        processPivot(e) {
            e.update(), this._isBarClosed && e.isPivotFound() && this.addPoint(e.pivotIndex(), e.currentValue(), e.pivotType())
        }
    }
    y.zigzag = function(e, t, i) {
        return new P(e, t, i).lastPrice()
    }, y.zigzagbars = function(e, t, i) {
        var s = new P(e, t, i);
        return -1 === s.lastIndex() ? NaN : s.lastIndex() - y.n(i)
    };
    class C {
        constructor(e) {
            this.symbol = e, this.vars = [], this.vars_index = 0, this.ctx = [], this.ctx_index = 0, this.minimumAdditionalDepth = null
        }
        new_sym(e, t, i, s, r) {
            return this.symbol.script.add_sym(e, t, i, s, r)
        }
        select_sym(e) {
            this.symbol = this.symbol.script.get_sym(e)
        }
        is_main_symbol(e) {
            return void 0 !== e && e === this.symbol.script.get_sym(0)
        }
        new_var(e) {
            var t = this.vars;
            t.length <= this.vars_index && t.push(new x(this.symbol));
            var i = t[this.vars_index++];
            return arguments.length > 0 && i.set(e), i
        }
        new_unlimited_var(e) {
            var t = this.vars;
            t.length <= this.vars_index && t.push(new T(this.symbol));
            var i = t[this.vars_index++];
            return arguments.length > 0 && i.set(e), i
        }
        new_ctx() {
            return this.ctx.length <= this.ctx_index && this.ctx.push(new C(this.symbol)), this.ctx[this.ctx_index++]
        }
        prepare(e) {
            this.ctx_index = 0, this.vars_index = 0;
            for (var t = 0; t < this.vars.length; t++) this.vars[t].prepare(e);
            for (var i = 0; i < this.ctx.length; i++) this.ctx[i].prepare(e)
        }
        maxAdditionalDepth() {
            if (null !== this.minimumAdditionalDepth) return this.minimumAdditionalDepth;
            for (var e = 0, t = 0; t < this.vars.length; t++) {
                var i = this.vars[t].mindepth;
                !isNaN(i) && i > e && (e = i)
            }
            return e
        }
        stop() {
            this.symbol = null, this.vars = null
        }
        setMinimumAdditionalDepth(e) {
            this.minimumAdditionalDepth = e
        }
    }
    class x {
        constructor(e) {
            this.mindepth = 0, this.original = NaN, this.modified = !1, this.symbol = e
        }
        valueOf() {
            return this.get(0)
        }
        get(e) {
            return isNaN(e) && (e = 0), e = e || 0, this.hist ? e >= this.hist.length ? (console.error("not enough depth: " + this),
                NaN) : this._get(e) : (this.mindepth = y.max(this.mindepth, e), NaN)
        }
        _get(e) {
            var t = this.hist_pos - e;
            return t < 0 && (t += this.hist.length), this.hist[t]
        }
        set(e) {
            this.hist && (this.hist[this.hist_pos] = e, this.modified = !0)
        }
        prepare(e) {
            e === this.symbol && (e.isNewBar ? (this.original = this.get(0), !this.modified && this.hist || this.add_hist()) : this.set(this.original), this.modified = !1)
        }
        add_hist() {
            if (!this.hist) {
                var e = y.na(this.mindepth) ? y.max_series_default_size : y.max(this.mindepth + 1, 1);
                e = Math.round(e);
                for (var t = new Array(e), i = 0; i < e; i++) t[i] = NaN;
                this.hist = t, this.hist_pos = -1
            }
            this.hist_pos = Math.min(this.hist_pos + 1, this.hist.length), this.hist_pos === this.hist.length && (this.hist_pos = this.hist.length - 1, this.hist.shift(), this.hist.push(NaN)), this.hist[this.hist_pos] = this.original
        }
        adopt(e, t, i) {
            this.hist || (this.mindepth = NaN);
            var s = t.get(),
                r = e.indexOf(s);
            if (0 !== i) {
                var n = t.get(1);
                if (!y.na(n)) r = r === e.indexOf(n) ? -1 : r
            }
            return r < 0 ? NaN : this._get(r)
        }
        indexOf(e) {
            if (!this.hist) return this.mindepth = NaN, -1;
            if (y.na(e)) return -1;
            var t = this.hist.length,
                i = this.symbol.index + 1,
                s = Math.min(t, i),
                r = n.upperbound_int(this.hist, e, 0, s);
            return 0 === r ? -1 : s - r
        }
    }
    class T extends x {
        add_hist() {
            if (this.hist || (this.hist = new Float64Array(2e3), this.hist_pos = -1), this.hist_pos = this.hist_pos + 1, this.hist_pos === this.hist.length) {
                var e = new Float64Array(2 * this.hist.length);
                e.set(this.hist), this.hist = e
            }
            this.hist[this.hist_pos] = this.original
        }
    }
    class I {
        constructor(e, t, i, s, r, n, o) {
            var l = h(e);
            const c = "string" == typeof l.symbol ? l : l.symbol;
            this.ticker = c.symbol, this.currencyCode = i || c["currency-id"], this.unitId = s || c["unit-id"], this.subsessionId = o || c.session;
            var u = c["currency-id"] !== this.currencyCode || c["unit-id"] !== this.unitId;
            c["currency-id"] = this.currencyCode, c["unit-id"] = this.unitId, u && (e = d(l)), this.tickerid = e;
            var p = a.parse(t);
            this.resolution = p.letter(), this.interval = p.multiplier(), this.period = p.value(), this.index = -1, this.time = NaN, this.open = NaN, this.high = NaN, this.low = NaN, this.close = NaN, this.volume = NaN, this.updatetime = NaN, this.isNewBar = !1, this.isBarClosed = !1, this.session = new v.SessionInfo("Etc/UTC", "24x7"), this.regularSubsession = null, this.preMarketSubsession = null, this.postMarketSubsession = null, this.script = r, this.isAdditionalDepthAllowed = void 0 === l.type || l.type.includes("BarSetHeikenAshi"), n && this.set_symbolinfo(n)
        }
        set_symbolinfo(e) {
            if (e || console.error("WARN: symbolinfo isn't defined for " + this.tickerid), this.info = e, this.minTick = e.minmov / e.pricescale, this.currencyCode = e.currency_code, this.unitId = e.unit_id, this.subsessionId = e.subsession_id, this.timezone = f.get_timezone(e.timezone), this.session.init(e.timezone, e.session, e.session_holidays, e.corrections), void 0 !== e.subsessions) {
                const t = e.subsessions.find((e => e.id === u.Regular)),
                    i = e.subsessions.find((e => e.id === u.PreMarket)),
                    s = e.subsessions.find((e => e.id === u.PostMarket));
                void 0 !== t && (this.regularSubsession = new _(e.timezone, t.session, e.session_holidays, t["session-correction"])), void 0 !== i && (this.preMarketSubsession = new _(e.timezone, i.session, e.session_holidays, i["session-correction"])),
                    void 0 !== s && (this.postMarketSubsession = new _(e.timezone, s.session, e.session_holidays, s["session-correction"]))
            }
        }
        isdwm() {
            return "" !== this.resolution && "S" !== this.resolution && "T" !== this.resolution
        }
        enable_dwm_aligning(e, t) {
            this.dwm_aligner = v.newBarBuilder(this.period, e, t)
        }
        bartime() {
            var e = this.time;
            if (!this.isdwm() || isNaN(e)) return e;
            var t = f.utc_to_cal(this.timezone, e);
            return this.session.spec.correctTradingDay(t), f.cal_to_utc(this.timezone, t)
        }
        lastbar(e) {
            if (!isNaN(e.time)) {
                var t = e.time;
                this.dwm_aligner && (this.dwm_aligner.moveTo(t), t = this.dwm_aligner.startOfBar(0));
                var i = this.time !== t;
                i && this.index >= 0 && !this.isBarClosed && (this.isNewBar = !1, this.isBarClosed = !0, this.script.calc(this)), this.time = t, this.open = e.open, this.high = e.high, this.low = e.low, this.close = e.close, this.volume = e.volume, this.updatetime = e.updatetime, this.isNewBar = i, this.isBarClosed = e.isBarClosed, this.isLastBar = e.isLastBar, this.isNewBar && (this.index++, this.isFirstBar = 0 === this.index), this.script.calc(this)
            }
        }
    }
    class M {
        constructor(e, t, i, s, r, n, o, a, l, c, h) {
            this.body = n, this.symbols = [], this.runner = r, this.inputCallback = a, this.out = o, this.nonseriesOut = l, this.ctx = new C(this.add_sym(e, t, i, s, c, h)), this.init()
        }
        calc(e) {
            var t = this.ctx,
                i = this.body;
            t.prepare(e);
            var s = i.main(t, this.inputCallback, e);
            if (s && "composite" === s.type)
                for (let e = 0; e < s.data.length; ++e) this._processResult(s.data[e]);
            else this._processResult(s)
        }
        _processResult(e) {
            var t = this.ctx,
                i = this;
            this.out && e && (!isNaN(t.symbol.time) || e.nonseries) && (e.nonseries ? ("projection" === e.type && (e.projectionTime = t.symbol.time), this.nonseriesOut(t.symbol, e)) : e.bars ? e.bars.forEach((function(e) {
                i.out(t.symbol, e)
            })) : this.out(t.symbol, e))
        }
        init() {
            var e = this.ctx,
                t = this.body;
            t.init && t.init(e, this.inputCallback), t.main(e, this.inputCallback)
        }
        add_sym(e, t, i, s, r, n) {
            var o = this.runner.add_sym(e, t, i, s, this, r, n);
            return this.symbols.push(o), o.isdwm() && this.symbols.length > 1 && o.enable_dwm_aligning(this.symbols[0].session, o.session), o
        }
        maxAdditionalDepth() {
            return this.symbols[0].isAdditionalDepthAllowed ? this.ctx.maxAdditionalDepth() : 0
        }
        stop() {
            this.symbols = null, this.ctx.stop(), this.ctx = null
        }
        get_sym(e) {
            return this.symbols[e]
        }
    }
    class A {
        constructor(e) {
            this.symbols = [], this.barsets = [], this.subscription = [], this.host = e, this.isRecalculated = !1, this.isStarted = !1, this.start()
        }
        add_sym(e, t, i, s, r, n, o) {
            var a = new I(e, t, i, s, r, n, o);
            return this.symbols.push(a), a
        }
        get_sym(e) {
            return this.symbols[e]
        }
        out(e, t) {
            if (this.nonseriesUpdate) {
                var i = Object.assign({}, this.nonseriesUpdate);
                t.splice(0, 0, e.time), i.lastBar = t, this.host.nonseriesOut(e, i)
            } else this.host.out(e, t)
        }
        start() {
            this.isStarted = !0;
            var e = this.host;
            this._script = new M(e.tickerid, e.period, e.currencyCode, e.unitId, this, e.body, this.out.bind(this), e.input, e.nonseriesOut, e.symbolInfo, e.subsessionId);
            var t = this,
                i = [],
                s = this.symbols,
                r = Object.assign({}, e.dataRange, {
                    countBack: e.dataRange.countBack + t._script.maxAdditionalDepth()
                }),
                n = s[0];

            function o(t, s, r) {
                i.push(A.feed.subscribe(t.tickerid, t.currencyCode, t.unitId, t.period, r, e.onErrorCallback, e.symbolInfo, e.sessionId, s, e.forceAlignBars, t.subsessionId))
            }

            function h(i, s) {
                "series" === (s.nonseries ? "nonseries" : "series") ? t.update(i, s): s.lastBar ? (t.nonseriesUpdate = s, s.lastBar.isLastBar = !0, t.symbols[0].lastbar(s.lastBar), t.nonseriesUpdate = null) : e.nonseriesOut(p, s)
            }

            function d() {
                return r
            }
            o(n, d, (function(e) {
                !e.nonseries && Number.isFinite(e.firstLoadedTimeMs) && function(e) {
                    function i(i, s) {
                        var r = c(i, s)(e),
                            n = l(i, s);
                        return null !== n && (r = n.timeToExchangeTradingDay(r)), {
                            to: r,
                            countBack: t._script.maxAdditionalDepth()
                        }
                    }
                    for (var r = 1; r < s.length; r++) {
                        var d = s[r],
                            u = d.period;
                        a.isEqual(u, n.period) || o(d, i.bind(null, u), h.bind(null, r))
                    }
                }(e.firstLoadedTimeMs), h(0, e)
            }));
            for (var u = 1; u < s.length; u++) {
                var p = s[u];
                a.isEqual(p.period, n.period) && o(p, d, h.bind(null, u))
            }
            this.subscription = i
        }
        stop() {
            var e = this.subscription;
            if (e || this._script) {
                for (var t = 0; t < e.length; t++) A.feed.unsubscribe(e[t]);
                this.subscription = null, this._script.stop(), this._script = null, this.symbols = null, this.isStarted = !1
            } else console.warn("Recurring script engine stop happened.")
        }
        update(e, t) {
            if (t) {
                var i = this.symbols[e];
                if (this.isRecalculated) {
                    var s = t.bar(t.count() - 1);
                    s.isBarClosed = t.isLastBarClosed(), s.isLastBar = !0, i.lastbar(s)
                } else this.barsets[e] || (this.barsets[e] = t, i.set_symbolinfo(t.symbolinfo()), this.recalc())
            } else console.error("Unexpected barset = null")
        }
        recalc() {
            for (var e = this.symbols, t = 0; t < e.length; t++)
                if (!this.barsets[t]) return;
            try {
                for (var i = e.length - 1; i >= 0; i--)
                    for (var s = e[i], r = this.barsets[i], n = r.count(), o = 0; o < n; o++) {
                        var a = r.bar(o);
                        a.isLastBar = o === n - 1, a.isBarClosed = !a.isLastBar || r.isLastBarClosed(), s.lastbar(a)
                    }
                this.isRecalculated = !0, this.barsets[0] && this.barsets[0].endOfData && this.host.setNoMoreData(), this.host.recalc(this, {
                    endOfData: this.barsets[0].endOfData,
                    firstLoadedTimeMs: this.barsets[0].firstLoadedTimeMs,
                    emptyBarCount: this.barsets[0].emptyBarCount()
                })
            } catch (e) {
                if (!e.studyError) throw e;
                this.host.onErrorCallback(e.message)
            }
        }
    }
    A.feed = {
        subscribe: function(e, t, i, s, r) {
            console.error("must be initialized with setupFeed")
        },
        unsubscribe: function(e) {
            console.error("must be initialized with setupFeed")
        }
    };
    e.exports.Std = y, e.exports.Series = x, e.exports.Symbol = I, e.exports.SymbolInfo = class {
        constructor(e, t) {
            this.timezone = e || "America/New_York", this.session = t || "0000-0000"
        }
    }, e.exports.StudyEngine = class {
        constructor(e) {
            this.runner = new A(e)
        }
        stop() {
            this.runner.stop()
        }
        isStarted() {
            return this.runner.isStarted
        }
    }, e.exports.BarSet = class {
        constructor(e, t) {
            this.info = e, this.bars = t || [], this.isBarClosed = !0, this.firstLoadedTimeMs = 0 !== this.bars.length ? this.bars[0].time : 1 / 0, this._emptyBarCount = 0, this._lastBarIsEmpty = !1
        }
        symbolinfo() {
            return this.info
        }
        isLastBarClosed() {
            return this.isBarClosed
        }
        setLastBarClosed(e) {
            this.isBarClosed = e
        }
        bar(e) {
            return this.bars[e]
        }
        count() {
            return this.bars.length
        }
        emptyBarCount() {
            return this._emptyBarCount
        }
        add(e, t, i) {
            void 0 === i && (i = !1);
            var s = e,
                r = this.bars,
                n = r.length,
                o = s.time,
                a = 0 === n ? NaN : r[n - 1].time;
            0 === n || a < o ? (r.push(s), i && (this._emptyBarCount += 1, this._lastBarIsEmpty = !0)) : a === o ? (i !== this._lastBarIsEmpty && (this._emptyBarCount += i ? 1 : -1, this._lastBarIsEmpty = i),
                r[n - 1] = s) : console.error("time order violation, prev: " + new Date(a).toUTCString() + ", cur: " + new Date(o).toUTCString()), this.isBarClosed = !!t
        }
    }, e.exports.OHLCV = class {
        main(e) {
            return [y.open(e), y.high(e), y.low(e), y.close(e), y.volume(e), y.updatetime(e)]
        }
    }, e.exports.BarBuilder = class {
        constructor(e, t) {
            this.period = e, this.generateEmptyBars = !!t
        }
        init(e) {
            this.bb = v.newBarBuilder(this.period, e.symbol.session), this.bbEmptyBars = this.generateEmptyBars ? v.newBarBuilder(this.period, e.symbol.session) : void 0, e.setMinimumAdditionalDepth(0)
        }
        extrapolate(e, t) {
            return isNaN(e) || isNaN(t) ? void 0 : S(this.bbEmptyBars, e, t, Number.MAX_SAFE_INTEGER, !0).times
        }
        main(e) {
            var t = e.symbol.time,
                i = this.bb.alignTime(t),
                s = e.new_var(i),
                r = y.na(i),
                n = s.get(1),
                o = y.na(n) ? 1 : y.neq(i, n),
                a = e.new_var(),
                l = e.new_var(),
                c = e.new_var(),
                h = e.new_var(),
                d = a.get(1),
                u = l.get(1),
                p = c.get(1),
                _ = h.get(1),
                m = r ? NaN : o ? y.open(e) : d,
                g = r ? NaN : o ? y.high(e) : y.max(y.high(e), u),
                f = r ? NaN : o ? y.low(e) : y.min(y.low(e), p),
                v = r ? NaN : y.close(e),
                S = r ? NaN : o ? y.volume(e) : y.volume(e) + _,
                b = r ? NaN : t,
                w = e.symbol.isBarClosed && this.bb.isLastBar(0, t),
                P = this.generateEmptyBars && o ? this.extrapolate(n, i) : void 0,
                C = e.new_var(y.close(e)).get(1),
                x = P instanceof Array ? C : NaN;
            return a.set(m), l.set(g), c.set(f), h.set(S), [i, m, g, f, v, S, b, w, P, x]
        }
    }, e.exports.setupFeed = function(e) {
        A.feed = e
    }, e.exports.getVolumeProfileResolutionForPeriod = function(e, t, i, r) {
        return void 0 !== s ? s(e, t, i, r) : e
    }, e.exports.overwriteVolumeProfileResolutionForPeriodGetter = function(e) {
        s = e
    }
}