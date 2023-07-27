import { WatchedObject } from '83669';

class AppliedTimeFrame {
  constructor(e) {
    this._appliedTimeFrame = new WatchedObject(null);
    this._appliedTimeFrameInfo = null;
    this._appliedTimeFrameChangedBound = this._appliedTimeFrameChanged.bind(this);
    this._model = e;
    e.mainSeries().dataEvents().seriesTimeFrame().subscribe(this, this._onSeriesTimeFrame);
    this._appliedTimeFrame.subscribe(this._appliedTimeFrameChangedBound);
  }

  destroy() {
    this._appliedTimeFrame.unsubscribe(this._appliedTimeFrameChangedBound);
    this._model.timeScale().logicalRangeChanged().unsubscribeAll(this);
    this._model.mainSeries().dataEvents().seriesTimeFrame().unsubscribeAll(this);
  }

  appliedTimeFrame() {
    return this._appliedTimeFrame;
  }

  _appliedTimeFrameChanged() {
    this._model.timeScale().logicalRangeChanged().unsubscribe(this, this._invalidateAppliedTimeFrame);
  }

  _onSeriesTimeFrame(e, t, i, s) {
    if (s) {
      const e = this._model.timeScale();
      this._appliedTimeFrameInfo = {
        logicalRange: e.logicalRange(),
        baseIndex: e.baseIndex()
      };
      e.logicalRangeChanged().subscribe(this, this._invalidateAppliedTimeFrame);
    }
  }

  _invalidateAppliedTimeFrame() {
    if (null === this._appliedTimeFrameInfo) return;
    const e = this._model.timeScale();
    const t = e.logicalRange();
    const i = e.baseIndex();
    const s = this._appliedTimeFrameInfo.logicalRange;
    const r = this._appliedTimeFrameInfo.baseIndex;
    if (
      null === t ||
      null === s ||
      Math.abs(i - t.left() - (r - s.left())) >= 0.01 ||
      Math.abs(i - t.right() - (r - s.right())) >= 0.01
    ) {
      this._appliedTimeFrame.setValue(null);
    }
  }
}

export { AppliedTimeFrame };

