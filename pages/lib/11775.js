
  import {HorizontalLinePaneView} from "./38003.js";
  import {PaneCursorType} from "./PaneCursorType.js";
  import {AreaName, HitTarget, HitTarget} from "./18807.js";
  import {LINESTYLE_SPARSE_DOTTED} from "./79849.js";
  class SeriesWaterlinePaneView extends HorizontalLinePaneView {
      constructor(e) {
          super(), this._getters = e;
          const t = {
              cursorType: PaneCursorType.VerticalResize,
              activeItem: 0,
              areaName: AreaName.SourceItemMove
          };
          this._lineRenderer.setHitTest(new HitTestResult(HitTarget.MovePoint, t)), this._lineRendererData.visible = !0, this._lineRendererData.linestyle = LINESTYLE_SPARSE_DOTTED
      }
      _updateImpl() {
          const {
              baseLevelPercentage: e,
              paneHeight: t,
              color: i
          } = this._getters, s = Math.abs(100 - e());
          this._lineRendererData.y = Math.round(t() * (s / 100)), this._lineRendererData.color = i()
      }
  }
