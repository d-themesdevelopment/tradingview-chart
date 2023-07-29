  import {ensureNotNull, ensureDefined} from "./assertions.js";
  import {distanceToSegment} from "./4652.js";
  import {LineEnd} from "./LineEnd.js"
  import {HitTestResult, HitTarget} from "./18807.js";
  import {setLineStyle, addHorizontalLineToPath, addVerticalLineToPath, addLineToPath} from "./68441.js";
  import {getArrowPoints, interactionTolerance, extendAndClipLineSegment} from "./45197.js";
  import {addExclusionArea} from "./74359.js";
  import {LINESTYLE_SOLID} from "./79849.js";
  
  function drawCircle(e, t, i, s, r) {
      t.save(), t.fillStyle = "#000000", t.beginPath(), t.arc(e.x * r, e.y * r, i * r, 0, 2 * Math.PI, !1), t.fill(), s.strokeWidth && (t.lineWidth = s.strokeWidth, t.stroke()), t.restore()
  }

  function drawArrow(e, t, i, s, r, n = !1) {
      if (t.subtract(e).length() < 1) return;
      const o = getArrowPoints(e, t, s, n, !0).slice(0, 2);
      let a = null;
      for (let e = 0; e < o.length; ++e) {
          const t = o[e][0],
              s = o[e][1];
          (null === a || a.subtract(t).length() > 1) && i.moveTo(t.x * r, t.y * r), i.lineTo(s.x * r, s.y * r), a = s
      }
  }
  class TrendLineRenderer {
      constructor() {
          this._data = null, this._hittest = new HitTestResult(HitTarget.MovePoint)
      }
      setData(e) {
          this._data = e
      }
      setHitTest(e) {
          this._hittest = e
      }
      draw(e, t) {
          const i = this._data;
          if (null === i) return;
          if ("points" in i && i.points.length < 2) return;
          const s = t.pixelRatio;
          void 0 !== i.excludeBoundaries && (e.save(), addExclusionArea(e, t, i.excludeBoundaries)), e.lineCap = i.linestyle === LINESTYLE_SOLID ? "round" : "butt", e.lineJoin = "round", e.strokeStyle = i.color, e.lineWidth = Math.max(1, Math.floor(i.linewidth * s)), setLineStyle(e, i.linestyle);
          const r = i.points[0],
              n = i.points[1];
          let o = [];
          e.beginPath(), i.overlayLineEndings ? o = [r.clone(), n.clone()] : this._drawEnds(e, [r, n], i.linewidth, s);
          const l = this._extendAndClipLineSegment(r, n, t);
          null !== l && i.linewidth > 0 && (l[0].x === l[1].x ? addVerticalLineToPath(e, Math.round(l[0].x * s), l[0].y * s, l[1].y * s) : l[0].y === l[1].y ? addHorizontalLineToPath(e, Math.round(l[0].y * s), l[0].x * s, l[1].x * s) : addLineToPath(e, l[0].x * s, l[0].y * s, l[1].x * s, l[1].y * s)), i.overlayLineEndings && this._drawEnds(e, o, i.linewidth, s), e.stroke(), void 0 !== i.excludeBoundaries && e.restore()
      }
      hitTest(e, t) {
          const i = this._data;
          if (null === i) return null;
          if ("points" in i && i.points.length < 2) return null;
          const s = interactionTolerance().line,
              n = i.points[0],
              o = i.points[1],
              a = this._extendAndClipLineSegment(n, o, t);
          if (null !== a) {
              if (distanceToSegment(a[0], a[1], e).distance <= s) return this._hittest
          }
          return null
      }
      _extendAndClipLineSegment(e, t, i) {
          const r = ensureNotNull(this._data);
          return extendAndClipLineSegment(e, t, i.cssWidth, i.cssHeight, r.extendleft, r.extendright)
      }
      _drawEnds(e, t, i, r) {
          const o = t[0],
              a = t[1],
              l = ensureNotNull(this._data);
          switch (l.leftend) {
              case LineEnd.Arrow:
                  drawArrow(a, o, e, i, r);
                  break;
              case LineEnd.Circle:
                  drawCircle(o, e, i, ensureDefined(l.endstyle), r)
          }
          switch (l.rightend) {
              case LineEnd.Arrow:
                  drawArrow(o, a, e, i, r);
                  break;
              case LineEnd.Circle:
                  drawCircle(a, e, i, ensureDefined(l.endstyle), r)
          }
      }
  }
