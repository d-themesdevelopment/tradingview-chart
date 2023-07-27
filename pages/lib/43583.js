import { assert } from 'utils';
import { clone } from 'geometry';
import { Study } from 'study';
import { PlotList } from 'plotData';
import { studyPlotFunctionMap, studyEmptyPlotValuePredicate } from 'studyHelpers';

class DataOffsetRebuilder {
  constructor(strategyPlotIndex, targetPlotIndex, startIndex) {
    this._strategyPlotIndex = strategyPlotIndex;
    this._targetPlotIndex = targetPlotIndex;
    this._startIndex = startIndex;
  }

  rebuildData(data) {
    const targetIndex = this._targetPlotIndex + 1;
    const strategyIndex = this._strategyPlotIndex + 1;
    let prevData = null;
    let prevValue = null;

    data.range(this._startIndex || data.firstIndex(), data.lastIndex()).each((index, row) => {
      const targetValue = row[targetIndex];
      const strategyValue = row[strategyIndex] ? Math.round(row[strategyIndex]) : null;

      if (row[targetIndex] === null || row[strategyIndex] === null) {
        return;
      }

      if (!strategyValue || strategyValue > 0) {
        return false;
      }

      const newIndex = index + strategyValue;
      const newData = {
        pointIndex: newIndex,
        value: targetValue
      };

      if (prevData) {
        if (prevData.pointIndex !== newData.pointIndex) {
          if (newIndex >= 0) {
            data.valueAt(newIndex)[targetIndex] = targetValue;
          }

          let isBetween = false;
          if (prevValue && targetValue) {
            isBetween = (prevValue <= prevData.value && prevData.value <= targetValue) ||
              (prevValue >= prevData.value && prevData.value >= targetValue);
          }

          if (isBetween) {
            if (prevData.pointIndex >= 0) {
              data.valueAt(prevData.pointIndex)[targetIndex] = null;
            }
          } else {
            prevValue = prevData.value;
          }

          prevData = newData;
        }
      } else {
        prevData = newData;
      }

      return false;
    });
  }
}

class ScriptWithDataOffset extends Study {
  constructor(id, instance, metaInfo, inputOverrides) {
    super(id, instance, metaInfo, inputOverrides);
    this._underlyingData = new PlotList(studyPlotFunctionMap(metaInfo), studyEmptyPlotValuePredicate);
  }

  clearData() {
    super.clearData();
    this._underlyingData.clear();
  }

  _mergeData(data) {
    this._invalidateLastNonEmptyPlotRowCache();

    const initialIndex = this._underlyingData.firstIndex();
    this._underlyingData.merge(data);

    if (initialIndex !== this._underlyingData.firstIndex()) {
      this.m_data = new PlotList(studyPlotFunctionMap(this._metaInfo), studyEmptyPlotValuePredicate);
    }

    const lastIndex = this.m_data.lastIndex();

    this._underlyingData.range(lastIndex, this._underlyingData.lastIndex()).each((index, row) => {
      this.m_data.add(index, clone(row));
      return false;
    });

    this._plotsForStrategyProcessing().forEach((plot) => {
      new DataOffsetRebuilder(plot.strategyIndex, plot.targetIndex, lastIndex).rebuildData(this.m_data);
    });
  }

  _plotsForStrategyProcessing() {
    const plots = [];

    this._metaInfo.plots.forEach((plot, index) => {
      if (plot.type === 'dataoffset') {
        const targetIndex = this._metaInfo.plots.findIndex(p => p.id === plot.target);
        assert(targetIndex >= 0, `Target plot not found for strategy plot ${plot.id}`);

        const data = {
          strategyIndex: index,
          targetIndex: targetIndex
        };

        plots.push(data);
      }
    });

    return plots;
  }
}

export {
  ScriptWithDataOffset
};