(e, t, i) => {
  "use strict";
  i.r(t),
    i.d(t, {
      createStudy: () => ce,
      isESDStudy: () => ae,
      isFundamentalStudy: () => isFundamental,
      isRollDatesStudy: () => le,
      isStudy: () => se,
      isStudyStrategy: () => re,
      isStudyStub: () => isStudyStub,
      studyColorRotationMode: () => he,
      useSameColorRotationComparator: () => ue,
    });
  var s = i(14483),
    r = i(42856),
    n = i(8708),
    o = i(50151),
    a = i(26426),
    l = i(27714),
    c = i(74359);
  class h {
    constructor(e, t, i, s) {
      (this._priceAxisFontSize = 11),
        (this._prices = []),
        (this._labelWidth = 0),
        (this._pixelRatioParams = e),
        this._recreateCanvasAndContext(
          (0, l.size)({
            width: 0,
            height: 0,
          })
        ),
        this.reset({
          font: t,
          fontSize: i,
          backColors: s,
        });
    }
    destroy() {
      delete this._canvas, delete this._cache;
    }
    canvas() {
      return this._canvas;
    }
    reset(e) {
      (this._renderParams = e),
        (this._prices = []),
        (this._cache.font = e.fontSize + "px " + e.font),
        (this._labelWidth = [
          "P",
          "S1",
          "R1",
          "S2",
          "R2",
          "S3",
          "R3",
          "S4",
          "R4",
          "S5",
          "R5",
          "/",
        ].reduce((e, t) => {
          const i = this._cache.measureText(t).width;
          return Math.max(i, e);
        }, 0));
    }
    rowHeight() {
      return this._priceAxisFontSize + 4;
    }
    labelRectByIndex(e) {
      return {
        left: 0,
        top: Math.round(this._topByIndex(e)),
        width: Math.round(this._labelWidth + 4),
        height: Math.round(this._renderParams.fontSize + 8),
      };
    }
    setPrices(e) {
      let t = !1;
      const i = (e, t) => {
        const i = void 0 === e,
          s = void 0 === t;
        return (
          ((!i && !s) || i === s) &&
          (0, o.ensureDefined)(e).formatted ===
            (0, o.ensureDefined)(t).formatted
        );
      };
      if (e.length !== this._prices.length) t = !0;
      else
        for (let s = 0; s < this._prices.length; s++)
          if (!i(this._prices[s], e[s])) {
            t = !0;
            break;
          }
      if (t) {
        const t = this._labelWidth + 6,
          i = this._renderParams.fontSize,
          s = Math.max(e.length, 22) * (i + 8);
        this._recreateCanvasAndContext(
          (0, l.size)({
            width: t,
            height: s,
          })
        ),
          (this._prices = e),
          this._cache.save(),
          (0, c.drawScaled)(
            this._cache,
            this._pixelRatioParams.horizontalPixelRatio,
            this._pixelRatioParams.verticalPixelRatio,
            () => {
              this._cache.translate(0.5, 0.5),
                (this._cache.font =
                  this._renderParams.fontSize +
                  "px " +
                  this._renderParams.font),
                (this._cache.textBaseline = "middle");
              for (let e = 0; e < this._prices.length; e++) {
                if (!this._prices[e]) continue;
                const t = [
                  "P",
                  "S1",
                  "R1",
                  "S2",
                  "R2",
                  "S3",
                  "R3",
                  "S4",
                  "R4",
                  "S5",
                  "R5",
                ][e];
                (this._cache.fillStyle = this._renderParams.backColors[e]),
                  this._cache.fillText(t, 0, this._centerByIndex(e)),
                  this._cache.fillText("/", 0, this._centerByIndex(e + 11));
              }
            }
          ),
          this._cache.restore(),
          (this._prices = e);
      }
    }
    _recreateCanvasAndContext(e) {
      (this._canvas = document.createElement("canvas")),
        (this._canvas.width =
          e.width * this._pixelRatioParams.horizontalPixelRatio),
        (this._canvas.height =
          e.height * this._pixelRatioParams.verticalPixelRatio),
        (this._cache = (0, o.ensureNotNull)(this._canvas.getContext("2d")));
    }
    _centerByIndex(e) {
      return Math.round((e + 0.5) * (this._renderParams.fontSize + 8));
    }
    _topByIndex(e) {
      return Math.round(e * (this._renderParams.fontSize + 8));
    }
  }
  var d = i(46501),
    u = i(42275),
    p = i(87095);
  const _ = ["P", "S1", "R1", "S2", "R2", "S3", "R3", "S4", "R4", "S5", "R5"];
  class m extends u.PriceAxisView {
    constructor(e, t) {
      super(), (this._source = e), (this._data = t);
      const i = t.name;
      this._completeName = "P" === i.toUpperCase() ? "P" : `S${i[1]}/R${i[1]}`;
    }
    _updateRendererData(e, t, i) {
      (e.visible = !1), (t.visible = !1);
      const s = this._source.properties().childs();
      if (!s.visible.value()) return;
      const r = this._completeName,
        n = s.levelsStyle.childs().visibility.childs();
      if (!n[r] || !n[r].value()) return;
      const o = this._source.model().timeScale(),
        a = this._source.priceScale();
      if (
        o.isEmpty() ||
        null === o.visibleBarsStrictRange() ||
        (null !== a && a.isEmpty())
      )
        return;
      const l = this._source.customData();
      if (!l || !l.pivots) return;
      const c = this._source.pricesView().prices()[
        _.indexOf(this._data.name.toUpperCase())
      ];
      if (!c) return;
      (i.background = (0, p.resetTransparency)(c.color)),
        (i.textColor = this.generateTextColor(i.background)),
        (i.coordinate = c.coordinate),
        (i.floatCoordinate = c.coordinate);
      const h = this._source
        .model()
        .properties()
        .childs()
        .scalesProperties.childs();
      h.showStudyLastValue.value() &&
        ((e.text = c.formatted), (e.visible = !0)),
        h.showStudyPlotLabels.value() &&
          ((t.text = this._source.priceLabelText(this._data.name)),
          (t.visible = !0));
    }
  }
  var g = i(43493),
    f = i(88318),
    v = i(90830),
    S = i(86094);
  const y = ["p", "s1", "r1", "s2", "r2", "s3", "r3", "s4", "r4", "s5", "r5"],
    b = {
      P: "P",
      S1: "S1/R1",
      S2: "S2/R2",
      S3: "S3/R3",
      S4: "S4/R4",
      S5: "S5/R5",
      R1: "S1/R1",
      R2: "S2/R2",
      R3: "S3/R3",
      R4: "S4/R4",
      R5: "S5/R5",
    };
  class w {
    constructor(e) {
      (this._visiblePivots = new Set()),
        (this._invidated = !0),
        (this._prices = []),
        (this._source = e);
    }
    visiblePivots() {
      return this._visiblePivots;
    }
    update() {
      this._invidated = !0;
    }
    prices() {
      return (
        this._invidated && (this._updateImpl(), (this._invidated = !1)),
        this._prices
      );
    }
    _updateImpl() {
      this._visiblePivots.clear();
      const e = this._source.model(),
        t = this._source.priceScale();
      if (null === t) return;
      if (e.timeScale().isEmpty() || t.isEmpty()) return;
      const i = e.timeScale().visibleBarsStrictRange();
      if (null === i) return;
      if (!this._source.customData() || !this._source.customData().pivots)
        return;
      const s = e
        .mainSeries()
        .bars()
        .search(i.lastBar(), S.PlotRowSearchMode.NearestLeft);
      if (null === s) return;
      const r = this._source.indexes();
      if (!r) return;
      const n = s.index,
        o = this._source.customData().pivots,
        a = this._source.properties().childs(),
        l = this._source.firstValue();
      for (let e = 0; e < o.length; e++) {
        if (!o[e]) continue;
        const i = r[o[e].startIndex],
          s = r[o[e].endIndex],
          c = a.inputs.childs().showHistoricalPivots.value();
        if (i <= n && (s >= n || c)) {
          this._visiblePivots.add(o[e]), (this._prices = []);
          for (let i = 0; i < y.length; i++) {
            const s = y[i],
              r = o[e][s];
            if (void 0 === r || null === l) continue;
            const n = t.priceToCoordinate(r, l),
              c = s.toUpperCase(),
              h = b[c],
              d = a.levelsStyle.childs().colors.childs()[h].value();
            this._prices.push({
              formatted: t.formatPrice(r, l),
              price: r,
              coordinate: n,
              color: d,
            });
          }
        }
      }
    }
  }
  var P = i(86441),
    C = i(79849),
    x = i(19266),
    T = i(74997),
    I = i(18807),
    M = i(59590);
  class A extends M.BitmapCoordinatesPaneRenderer {
    constructor(e, t, i) {
      super(),
        (this._drawRects = []),
        (this._cacheProvider = e),
        (this._point = t),
        (this._label = i);
    }
    hitTest(e) {
      for (const t of this._drawRects)
        if (
          e.x >= t.left &&
          e.x <= t.left + t.width &&
          e.y >= t.top &&
          e.y <= t.top + t.height
        )
          return new I.HitTestResult(I.HitTarget.Regular);
      return null;
    }
    _drawImpl(e) {
      const t = this._cacheProvider(e),
        { horizontalPixelRatio: i, verticalPixelRatio: s, context: r } = e;
      this._drawRects = [];
      const n = (e) => {
          const n = t.labelRectByIndex(e),
            o = {
              left: Math.round(this._point.x - n.width + a),
              top: Math.round(this._point.y - n.height / 2),
              width: n.width,
              height: n.height,
            };
          return (
            r.drawImage(
              t.canvas(),
              Math.round(n.left * i),
              Math.round(n.top * s),
              n.width * i,
              n.height * s,
              Math.round(o.left * i),
              Math.round(o.top * s),
              o.width * i,
              o.height * s
            ),
            this._drawRects.push(o),
            n.width
          );
        },
        o = this._label.split("/");
      let a = 0;
      for (let e = 0; e < o.length; e++) {
        const t = [
          "P",
          "S1",
          "R1",
          "S2",
          "R2",
          "S3",
          "R3",
          "S4",
          "R4",
          "S5",
          "R5",
        ].indexOf(o[e]);
        e > 0 && (a += n(t + 11) / 2), (a += n(t) / 2);
      }
    }
  }

  function L(e) {
    return "P" === e ? e : "S" + e[1] + "/R" + e[1];
  }

  function k(e, t, i) {
    const s = t;
    void 0 === e[s]
      ? (e[s] = {
          text: i,
          ids: [L(i)],
        })
      : ((e[s].text += "/" + i), e[s].ids.push(L(i)));
  }
  class E {
    constructor(e, t) {
      (this._pivots = []),
        (this._invalidated = !0),
        (this._renderer = new x.CompositeRenderer()),
        (this._model = e),
        (this._source = t),
        (this._cacheProvider = this._source.getCache.bind(this._source));
    }
    update(e) {
      this._invalidated = !0;
    }
    renderer(e, t) {
      return (
        this._invalidated && (this._updateImpl(t, e), (this._invalidated = !1)),
        this._renderer
      );
    }
    _updateImpl(e, t) {
      this._renderer.clear();
      const i = this._source.ownerSource();
      if (null === i) return;
      this._source.pricesView().prices(), (this._pivots = []);
      const s = this._source.customData();
      if (!s || !s.pivots) return;
      const r = this._source.properties().childs();
      if (!r.visible.value()) return;
      const n = s.pivots,
        a = this._source.indexes(),
        l = this._model.timeScale(),
        c = this._source.priceScale(),
        h = i.firstValue();
      if (!c || c.isEmpty() || l.isEmpty() || !n || !a || null === h) return;
      const d = (0, o.ensureNotNull)(l.visibleBarsStrictRange()),
        u = d.firstBar(),
        p = d.lastBar();
      for (let e = 0; e < n.length; e++) {
        if (!n[e]) continue;
        const t = a[n[e].startIndex],
          i = a[n[e].endIndex];
        if (i < u || t > p) continue;
        const s = {},
          o = r.levelsStyle.childs().visibility.childs();
        o.P.value() && k(s, n[e].p, "P"),
          o["S1/R1"].value() && (k(s, n[e].s1, "S1"), k(s, n[e].r1, "R1")),
          o["S2/R2"].value() && (k(s, n[e].s2, "S2"), k(s, n[e].r2, "R2")),
          o["S3/R3"].value() && (k(s, n[e].s3, "S3"), k(s, n[e].r3, "R3")),
          o["S4/R4"].value() && (k(s, n[e].s4, "S4"), k(s, n[e].r4, "R4")),
          o["S5/R5"].value() && (k(s, n[e].s5, "S5"), k(s, n[e].r5, "R5"));
        const d = l.indexToCoordinate(t),
          _ = l.indexToCoordinate(i);
        for (const t of Object.keys(s)) {
          const i = parseFloat(t),
            r = c.priceToCoordinate(i, h);
          this._pivots.push({
            x1: d,
            x2: _,
            y: r,
            label: s[t].text,
            labelIds: s[t].ids,
            src: n[e],
          });
        }
      }
      const _ = r.levelsStyle.childs().colors,
        m = r.levelsStyle.childs().widths,
        g = this._source.visiblePivots();
      for (let e = 0; e < this._pivots.length; e++) {
        const t = this._pivots[e];
        if (!g.has(t.src)) continue;
        const i = {
            color: _.childs()[t.labelIds[0]].value(),
            linewidth: m.childs()[t.labelIds[0]].value(),
            linestyle: C.LINESTYLE_SOLID,
            y: t.y,
            left: t.x1,
            right: t.x2,
          },
          s = new T.HorizontalLineRenderer();
        s.setData(i),
          s.setHitTest(new I.HitTestResult(I.HitTarget.Regular)),
          this._renderer.append(s),
          r.levelsStyle.childs().showLabels.value() &&
            this._renderer.append(
              new A(this._cacheProvider, new P.Point(t.x1, t.y), t.label)
            );
      }
    }
  }
  var D = i(34256);
  class V extends a.NonSeriesStudy {
    constructor(e, t, i, s) {
      super(e, t, i, s),
        (this._cache = null),
        (this._cachedPixelRatioParams = null);
      const r = ["P", "S1/R1", "S2/R2", "S3/R3", "S4/R4", "S5/R5"],
        n = this.properties().childs().levelsStyle.childs().visibility;
      for (let e = 0; e < r.length; e++)
        n.childs()
          [r[e]].listeners()
          .subscribe(this, () => this.processHibernate());
    }
    pricesView() {
      return this._pricesView;
    }
    indexes() {
      return this._indexes;
    }
    properties() {
      return this._properties;
    }
    getCache(e) {
      if (
        null === this._cache ||
        null == this._cachedPixelRatioParams ||
        ((t = e),
        (i = this._cachedPixelRatioParams),
        t.horizontalPixelRatio !== i.horizontalPixelRatio ||
          t.verticalPixelRatio !== i.verticalPixelRatio)
      ) {
        this._cache && this._cache.destroy();
        const t = this._getActualCacheParams(),
          i = {
            horizontalPixelRatio: e.horizontalPixelRatio,
            verticalPixelRatio: e.verticalPixelRatio,
          };
        (this._cache = new h(i, t.font, t.fontSize, t.backColors)),
          this._cache.setPrices(
            (0, o.ensureNotNull)(this._pricesView).prices()
          ),
          (this._cachedPixelRatioParams = i),
          this._cache.reset(t);
      }
      var t, i;
      return this._cache;
    }
    priceLabelText(e) {
      return this._metaInfo.shortDescription + ":" + e.toUpperCase();
    }
    updateAllViews(e) {
      super.updateAllViews(e), this._pricesView.update();
    }
    visiblePivots() {
      return this._pricesView.visiblePivots();
    }
    isVisible() {
      if (
        !this.properties().childs().visible.value() ||
        !this.isActualInterval()
      )
        return !1;
      const e = ["P", "S1/R1", "S2/R2", "S3/R3", "S4/R4", "S5/R5"],
        t = this.properties().childs().levelsStyle.childs().visibility;
      for (let i = 0; i < e.length; i++)
        if (t.childs()[e[i]].value()) return !0;
      return !1;
    }
    stop() {
      super.stop(),
        this._cache && (this._cache.destroy(), (this._cache = null));
    }
    priceRange(e, t) {
      var i;
      const s =
        null === (i = this.customData()) || void 0 === i ? void 0 : i.pivots;
      if (!s || !this._indexes) return null;
      if (!this.priceScale()) return null;
      const r = s,
        n = this._indexes;
      let o = null;
      for (let i = 0; i < r.length; i++) {
        if (!r[i]) continue;
        const s = n[r[i].startIndex];
        if (n[r[i].endIndex] < e || s > t) continue;
        const a = [],
          l = this.properties()
            .childs()
            .levelsStyle.childs()
            .visibility.childs();
        l.P.value() && a.push(r[i].p),
          l["S1/R1"].value() && a.push(r[i].s1, r[i].r1),
          l["S2/R2"].value() && a.push(r[i].s2, r[i].r2),
          l["S3/R3"].value() && a.push(r[i].s3, r[i].r3),
          l["S4/R4"].value() && a.push(r[i].s4, r[i].r4),
          l["S5/R5"].value() && a.push(r[i].s5, r[i].r5);
        for (let e = 0; e < a.length; e++)
          a[e] &&
            (null === o
              ? (o = new D.PriceRange(a[e], a[e]))
              : o.apply(a[e], a[e]));
      }
      const a = this.priceScale();
      return a && a.isLog() && o
        ? new D.PriceRange(
            a.priceToLogical(o.minValue()),
            a.priceToLogical(o.maxValue())
          )
        : o;
    }
    _createViews() {
      this._cache && (this._cache.destroy(), (this._cache = null)),
        (this._priceAxisViews = []);
      const e = [
        "P",
        "S1",
        "R1",
        "S2",
        "R2",
        "S3",
        "R3",
        "S4",
        "R4",
        "S5",
        "R5",
      ];
      (this._paneViews.length = 0), (this._labelPaneViews = []);
      const t = new E(this._model, this);
      this._paneViews.push(t);
      for (let t = 0; t < e.length; t++) {
        const i = new m(this, {
          name: e[t],
        });
        this._priceAxisViews.push(i),
          this._labelPaneViews.push(
            new g.PanePriceAxisView(i, this, this._model)
          );
      }
      this._dataWindowView ||
        (this._dataWindowView = new f.StudyDataWindowView(this, this._model)),
        this._statusView || (this._statusView = new v.StudyStatusView(this)),
        (this._legendView = null),
        (this._pricesView = new w(this));
    }
    _postProcessGraphics() {}
    _getActualCacheParams() {
      const e = this.properties().childs(),
        t = e.levelsStyle.childs().colors.childs();
      return {
        font: d.CHART_FONT_FAMILY,
        fontSize: e.fontsize.value(),
        backColors: [
          t.P.value(),
          t["S1/R1"].value(),
          t["S1/R1"].value(),
          t["S2/R2"].value(),
          t["S2/R2"].value(),
          t["S3/R3"].value(),
          t["S3/R3"].value(),
          t["S4/R4"].value(),
          t["S4/R4"].value(),
          t["S5/R5"].value(),
          t["S5/R5"].value(),
        ],
      };
    }
  }
  var B = i(64063),
    R = i(8561),
    N = i(43583),
    O = i(52329),
    F = i(44352);
  const W = s.enabled("hide_main_series_symbol_from_indicator_legend");
  class z extends n.Study {
    constructor(e, t, i, s) {
      super(e, t, i, s),
        (0, o.ensureDefined)(this.properties().childs().styles.childs().vol_ma)
          .childs()
          .display.subscribe(this, () => this.invalidateTitleCache());
    }
    base() {
      return 1;
    }
    destroy() {
      (0, o.ensureDefined)(this.properties().childs().styles.childs().vol_ma)
        .childs()
        .display.listeners()
        .unsubscribeAll(this),
        super.destroy();
    }
    showOnTopOnHovering() {
      return !1;
    }
    _titleInputs() {
      const e = {
        symbolsForDisplay: !0,
        skipHiddenInputs: !0,
        fakeInputsForDisplay: !0,
        asObject: !1,
        skipOptionalEmptySymbolInputs: W,
      };
      return 0 !==
        (0, o.ensureDefined)(this.properties().childs().styles.childs().vol_ma)
          .childs()
          .display.value()
        ? this.inputs(e)
        : this.inputs({
            ...e,
            skippedInputs: ["length"],
          });
    }
    _titleInParts(e, t, i, s) {
      const r = super._titleInParts(e, t, i, s),
        n = this._getVolumeUnit();
      return n && (r[0] += ` · ${n}`), r;
    }
    _getVolumeUnit() {
      const e = this.symbolSource().symbolInfo();
      return e
        ? (function (e) {
            switch (e.volume_type) {
              case "base":
                return e.base_currency;
              case "quote":
                return e.currency;
              case "tick":
                return F.t(null, void 0, i(30973));
            }
          })({
            ...e,
            currency: e.original_currency_code || e.currency_code,
          })
        : void 0;
    }
  }
  var H = i(58275),
    U = i.n(H),
    j = i(59452),
    G = i.n(j),
    q = i(42960),
    $ = i(97121);
  class Y extends n.Study {
    constructor(e, t, i, s) {
      super(
        e,
        (function (e) {
          return (
            e.hasChild("currencyId") ||
              e.addChild("currencyId", new (G())(null)),
            e.hasChild("unitId") || e.addChild("unitId", new (G())(null)),
            e.addExclusion("currencyId"),
            e.addExclusion("unitId"),
            e
          );
        })(t),
        i,
        s
      ),
        (this._isActingAsSymbolSource = new (U())(!1)),
        (this._symbolHibernated = new (U())(!1)),
        (this._symbolResolvingActive = new (U())(!1)),
        (this._realignToolsLastParams = null),
        (this._onIsActingAsSymbolSourceChanged = () => {
          this._realignLineToolsIfParamsChanged();
        }),
        this._recalculateIsActingAsSymbolSource(),
        this._isActingAsSymbolSource.subscribe(
          this._onIsActingAsSymbolSourceChanged
        );
      const r = this.properties().childs().inputs.childs().symbol;
      this._previousSymbolInputValue = r.value();
    }
    destroy() {
      this._isActingAsSymbolSource.unsubscribe(
        this._onIsActingAsSymbolSourceChanged
      ),
        super.destroy();
    }
    isActingAsSymbolSource() {
      return this._isActingAsSymbolSource.readonly();
    }
    properties() {
      return this._properties;
    }
    symbol() {
      return this._isActingAsSymbolSource.value()
        ? this.properties().childs().inputs.childs().symbol.value()
        : this.symbolSource().symbol();
    }
    interval() {
      return this.model().mainSeries().interval();
    }
    style() {
      return this._firstSourceOrSeries().symbolSource().style();
    }
    currency() {
      return this._isActingAsSymbolSource.value()
        ? this.properties().childs().currencyId.value() || null
        : this.symbolSource().currency();
    }
    unit() {
      return this._isActingAsSymbolSource.value()
        ? this.properties().childs().unitId.value() || null
        : this.symbolSource().unit();
    }
    setSymbolParams(e) {
      this._setSymbolParamsInternal(e);
    }
    setSymbol(e) {
      this.setSymbolParams({
        symbol: e,
      });
    }
    symbolInfo() {
      if (!this._isActingAsSymbolSource.value())
        return super.symbolSource().symbolInfo();
      if (void 0 === this._resolvedSymbols) return null;
      const e = this.symbol(),
        t = this._getSymbolForResolve(e);
      return this._resolvedSymbols[t] || null;
    }
    symbolSource() {
      return this._isActingAsSymbolSource.value() ? this : super.symbolSource();
    }
    symbolResolved() {
      return this.symbolsResolved();
    }
    symbolResolvingActive() {
      return this._symbolResolvingActive;
    }
    symbolHibernated() {
      return this._symbolHibernated;
    }
    isVisible() {
      const e = super.isVisible();
      return this._symbolHibernated.setValue(!e), e;
    }
    symbolSameAsCurrent(e) {
      return (0, $.symbolSameAsCurrent)(e, this.symbolInfo());
    }
    setCurrency(e) {
      this.setSymbolParams({
        currency: e,
      });
    }
    isConvertedToOtherCurrency() {
      return (0, q.isConvertedToOtherCurrency)(this.symbolInfo());
    }
    setUnit(e) {
      this.setSymbolParams({
        unit: e,
      });
    }
    isConvertedToOtherUnit() {
      return (0, q.isConvertedToOtherUnit)(
        this.symbolInfo(),
        this._model.unitConversionEnabled()
      );
    }
    setInterval(e) {}
    setStyle(e) {}
    symbolTitle(e, t) {
      return this.title(!0, {}, !1, e);
    }
    measureUnitId() {
      return (0, q.measureUnitId)(this.symbolInfo());
    }
    bars() {
      return super.data();
    }
    dataUpdated() {
      return this._dataUpdated;
    }
    _onPropertiesChanged() {
      this._recalculateIsActingAsSymbolSource(),
        super._onPropertiesChanged(),
        this._realignLineToolsIfParamsChanged();
    }
    async _tryChangeInputs() {
      var e;
      const t = this._resolvedSymbolsByInput[this.symbol()] || null;
      (0, $.symbolSameAsCurrent)(this._previousSymbolInputValue, t) ||
        this._setSymbolParamsInternal({
          currency: null,
          unit: null,
        }),
        await super._tryChangeInputs(),
        (this._formatter = null),
        null === (e = this.priceScale()) || void 0 === e || e.updateFormatter(),
        (this._previousSymbolInputValue = this.properties()
          .childs()
          .inputs.childs()
          .symbol.value());
    }
    _getSymbolObject(e) {
      const t = {
          symbol: e,
        },
        i = this.currency();
      null !== i && (t["currency-id"] = i);
      const s = this.unit();
      return (
        this._model.unitConversionEnabled() && null !== s && (t["unit-id"] = s),
        t
      );
    }
    _getSymbolForApi(e) {
      return (0, q.symbolForApi)(this._resolvedSymbolsByInput[e] || null, e);
    }
    _onSymbolResolved(e, t, i) {
      super._onSymbolResolved(e, t, i),
        this._recreatePriceFormattingDependencies();
      const s =
        t === this.symbol()
          ? (0, q.extractSymbolNameFromSymbolInfo)(i, this.symbol())
          : null;
      null !== s && (this._previousSymbolInputValue = s);
      const r = (0, q.symbolCurrency)(i),
        n = (0, q.symbolUnit)(i, this._model.unitConversionEnabled());
      this._setSymbolParamsInternal(
        {
          symbol: null != s ? s : void 0,
          currency: r,
          unit: n,
        },
        i
      ),
        this._symbolResolvingActive.setValue(!1);
    }
    _onSymbolResolvingStart() {
      super._onSymbolResolvingStart(), this._symbolResolvingActive.setValue(!0);
    }
    _onSymbolError() {
      super._onSymbolError(), this._symbolResolvingActive.setValue(!1);
    }
    _onCurrencyMayChange() {
      this.isActingAsSymbolSource()
        ? super._onCurrencyMayChange()
        : this._onCurrencyChanged();
    }
    _recalculateIsActingAsSymbolSource() {
      var e, t;
      const i =
        null !==
          (t =
            "" !==
            (null === (e = this._currencySourceSymbolInputProperty) ||
            void 0 === e
              ? void 0
              : e.value())) &&
        void 0 !== t &&
        t;
      this._isActingAsSymbolSource.setValue(i);
    }
    _setSymbolParamsInternal(e, t) {
      const { symbol: i, currency: s, unit: r } = e,
        n = this.properties().childs(),
        o = n.inputs.childs().symbol.value(),
        a = n.currencyId.value(),
        l = n.unitId.value();
      if (
        (void 0 !== i &&
          i !== o &&
          n.inputs.childs().symbol.setValueSilently(i),
        void 0 !== s && s !== a && n.currencyId.setValueSilently(s),
        void 0 !== r && r !== l && n.unitId.setValueSilently(r),
        t)
      )
        (this._resolvedSymbolsByInput[this.symbol()] = t),
          (this._resolvedSymbols[this._getSymbolForResolve(this.symbol())] = t),
          (this._realignToolsLastParams = null);
      else {
        const e = this.symbolInfo();
        null !== e &&
          (n.currencyId.setValueSilently((0, q.symbolCurrency)(e)),
          n.unitId.setValueSilently(
            (0, q.symbolUnit)(e, this._model.unitConversionEnabled())
          ));
      }
      n.inputs.childs().symbol.value() !== o &&
        n.inputs.childs().symbol.listeners().fire(n.inputs.childs().symbol),
        n.currencyId.value() !== a &&
          n.currencyId.listeners().fire(n.currencyId),
        n.unitId.value() !== l && n.unitId.listeners().fire(n.unitId),
        this._realignLineToolsIfParamsChanged();
    }
    _realignLineToolsIfParamsChanged() {
      const e = this.symbol(),
        t = this.interval(),
        i = this.currency(),
        s = this.unit();
      (null !== this._realignToolsLastParams &&
        this._realignToolsLastParams.symbol === e &&
        this._realignToolsLastParams.interval === t &&
        this._realignToolsLastParams.currency === i &&
        this._realignToolsLastParams.unit === s) ||
        (this._model.realignLineTools(this),
        (this._realignToolsLastParams = {
          symbol: e,
          interval: t,
          currency: i,
          unit: s,
        }));
    }
  }
  class K extends u.PriceAxisView {
    constructor(e, t) {
      super(), (this._source = e), (this._styleId = t);
    }
    _updateRendererData(e, t, i) {
      var s;
      e.visible = !1;
      const r = this._source.priceScale(),
        n = this._source.properties().childs();
      if (!r || r.isEmpty() || !n.visible.value()) return;
      const o =
        null ===
          (s = this._source
            .properties()
            .childs()
            .graphics.childs().horizlines) || void 0 === s
          ? void 0
          : s.childs()[this._styleId].childs();
      if (
        !(
          o &&
          o.visible &&
          o.visible.value() &&
          this._isLabelVisibleAccordinglyToProperties()
        )
      )
        return;
      const a = this._source.model().timeScale().logicalRange(),
        l = this._source.firstValue();
      if (null === l || null === a) return;
      const c = {
          price: NaN,
          time: -1 / 0,
        },
        h = this._source.graphics().horizlines().get(this._styleId);
      if (void 0 === h) return;
      for (const e of h) {
        if (void 0 === e.level) continue;
        const t = a.contains(e.startIndex, !0);
        (t === a.contains(e.endIndex, !0) && 0 !== t) ||
          (c.time < e.endIndex && ((c.time = e.endIndex), (c.price = e.level)));
      }
      if (isNaN(c.price)) return;
      const d = (0, p.resetTransparency)(o.color.value());
      (i.background = d),
        (i.textColor = this.generateTextColor(d)),
        (i.coordinate = r.priceToCoordinate(c.price, l)),
        (e.text = r.formatPrice(c.price, l, !0)),
        (e.visible = !0);
    }
    _isLabelVisibleAccordinglyToProperties() {
      return (
        !!this._source
          .model()
          .properties()
          .childs()
          .scalesProperties.childs()
          .showStudyLastValue.value() &&
        this._source.properties().childs().showLabelsOnPriceScale.value()
      );
    }
  }
  var Z = i(39871);
  class X extends n.Study {
    preferredZOrder() {
      return 0;
    }
    async _createGraphicsPaneViews() {
      var e;
      const t = this.metaInfo().graphics,
        s = this.model(),
        r = [],
        n = this._needExtendToBarsEnding();
      if (t.hhists) {
        const { HHistPaneView: t } = await i.e(507).then(i.bind(i, 21335)),
          o =
            null ===
              (e = this.properties().childs().graphics.childs().polygons) ||
            void 0 === e
              ? void 0
              : e.childs();
        r.push(new t(this, s, void 0, null == o ? void 0 : o.histBoxBg, n));
      }
      if (t.horizlines) {
        const { HorizLinePaneView: e } = await i.e(507).then(i.bind(i, 13369));
        r.push(new e(this, s, void 0, n));
      }
      return r;
    }
    _createGraphicsPriceAxisViews() {
      var e;
      return Object.keys(
        null !== (e = this.metaInfo().graphics.horizlines) && void 0 !== e
          ? e
          : {}
      ).map((e) => new K(this, e));
    }
    _createStudyPlotPaneView(e) {
      return new Z.StudyPlotPaneView(
        this,
        this._series,
        this._model,
        e,
        this._needExtendToBarsEnding()
      );
    }
    _apiInputs() {
      return {
        ...super._apiInputs(),
        mapRightBoundaryToBarStartTime:
          !!this._needExtendToBarsEnding() || void 0,
      };
    }
    _needExtendToBarsEnding() {
      var e;
      return (
        void 0 !==
        (null === (e = this.metaInfo().defaults.inputs) || void 0 === e
          ? void 0
          : e.mapRightBoundaryToBarStartTime)
      );
    }
  }
  class J extends X {
    priceRange(e, t) {
      let i = !1;
      this.graphics()
        .hhists()
        .forEach((e, t) => {
          var s;
          i =
            i ||
            (0, o.ensureDefined)(
              null ===
                (s = this.properties().childs().graphics.childs().hhists) ||
                void 0 === s
                ? void 0
                : s.childs()[t]
            ).value();
        });
      const s = (function (e, t, i, s) {
        let r = null;
        return (
          e.forEach((e, s) => {
            e.forEach((e) => {
              e.firstBarTime <= i &&
                e.lastBarTime >= t &&
                (null === r
                  ? (r = {
                      low: {
                        l: e.priceLow,
                        h: e.priceHigh,
                      },
                      high: {
                        h: e.priceHigh,
                      },
                    })
                  : (e.priceLow < r.low.l &&
                      ((r.low.l = e.priceLow), (r.low.h = e.priceHigh)),
                    (r.high.h = Math.max(r.high.h, e.priceHigh))));
            });
          }),
          null === r
            ? null
            : s
            ? new D.PriceRange(r.low.l - 0.8 * (r.low.h - r.low.l), r.high.h)
            : new D.PriceRange(r.low.l, r.high.h)
        );
      })(this.graphics().hhists(), e, t, i);
      if (null === s) return null;
      const r = (0, o.ensureNotNull)(this.priceScale());
      return r.isLog()
        ? new D.PriceRange(
            r.priceToLogical(s.minValue()),
            r.priceToLogical(s.maxValue())
          )
        : s;
    }
  }
  const Q = "study_Internal$STD;Fund_";

  function ee(e) {
    const t = "study_" + (e.classId || e.shortId);
    return t.startsWith(Q) ? Q : t;
  }

  function te(e, t = "shift", i) {
    return {
      studyConstructor: e,
      colorRotationMode: t,
      colorRotationComparator: i,
    };
  }
  const ie = {
    study_PivotPointsStandard: te(V),
    study_Overlay: te(B.study_Overlay, "loop"),
    study_Compare: te(R.StudyCompare, "loop"),
    study_Volume: te(z),
    study_VbPVisible: te(
      class extends J {
        alertCreationAvailable() {
          return new (U())(!1).readonly();
        }
        _needExtendToBarsEnding() {
          return !1;
        }
      }
    ),
    study_ScriptWithDataOffset: te(N.study_ScriptWithDataOffset),
  };
  s.enabled("moving_average_study_changable_currency_unit") &&
    (ie["study_Moving Average"] = te(Y));
  for (const e in ie)
    ie.hasOwnProperty(e) && (TradingView[e] = ie[e].studyConstructor);

  function se(e) {
    return e instanceof n.Study;
  }

  function re(e) {
    return false;
  }

  function isStudyStub(e) {
    return e instanceof O.StudyStub;
  }

  function isFundamental(e) {
    return e instanceof Fundamental;
  }

  function ae(e) {
    return false;
  }

  function le(e) {
    return false;
  }

  function ce(e, t, i, s, r) {
    const o = ee(s),
      a = new (o in ie ? ie[o].studyConstructor : n.Study)(e, t, i, s);
    return void 0 !== r && a.setId(r), a;
  }

  function he(e) {
    const t = ee(e);
    return t in ie
      ? ie[t].colorRotationMode
      : void 0 === e.pine || r.StudyMetaInfo.isStandardPine(e.id)
      ? 1 !== e.plots.length
        ? "shift"
        : "loop"
      : null;
  }

  function de(e, t) {
    return (
      e.id === t.id &&
      ((s = t),
      ((i = e).pine ? i.pine.version : void 0) ===
        (s.pine ? s.pine.version : void 0))
    );
    var i, s;
  }

  function ue(e) {
    const t = ee(e);
    if (t in ie) {
      const e = ie[t].colorRotationComparator;
      if (void 0 !== e) return e;
    }
    return de;
  }
};
