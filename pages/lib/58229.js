import { studyIdString } from 'some-module';
import { ensureNotNull, assert, isNumber, merge, clone } from 'some-other-module';
import { StudyLineDataSource, createDefaultsState, prepareStudyPropertiesForLoadChart } from 'some-study-module';
import { createPropertiesFromStudyMetaInfoAndState } from 'some-properties-module';
import { sourceChangeEvent } from 'some-event-module';
import { isStudyGraphicsEmpty } from 'some-utils-module';
import { StudyLineDataSourceDefinitionsViewModel } from 'some-view-models-module';
import { e } from 'some-async-module';

const VbPFixedStudyId = studyIdString("VbPFixed", "tv-volumebyprice");

function modifyStyles(styles) {
  if (styles) {
    modifyStyle(styles.developingPoc);
    modifyStyle(styles.developingVAHigh);
    modifyStyle(styles.developingVALow);
  }
}

function modifyStyle(style) {
  if (style !== undefined && style.visible !== undefined) {
    style.display = style.visible ? 15 : 0;
    delete style.visible;
  }
}

class LineToolVbPFixed extends StudyLineDataSource {
  constructor(model, options, state, context, updateHandler) {
    const studyMetaInfo = state || model.studyMetaInfoRepository().findByIdSync({
      type: "java",
      studyId: VbPFixedStudyId
    });

    super(model, studyMetaInfo, "vbpfixed_", options || LineToolVbPFixed.createProperties(model), context, updateHandler);
    this._createPaneViews().then((paneViews) => {
      this._setPaneViews(paneViews);
    });

    this.clearData();
  }

  pointsCount() {
    return 2;
  }

  boundToSymbol() {
    return false;
  }

  offset(pointIndex) {
    return 0;
  }

  getMinFirstBarIndexForPlot() {
    return -Infinity;
  }

  calcIsActualSymbol() {
    this._isActualSymbol = true;
    this._isActualCurrency = true;
    this._isActualUnit = true;
    this.calcIsActualInterval();
  }

  cloneable() {
    return false;
  }

  isSynchronizable() {
    return false;
  }

  isPlotVisibleAt(plotIndex, visibility) {
    return (this.properties().childs().styles.childs()[plotIndex].childs().display.value() & visibility) === visibility;
  }

  preferredZOrder() {
    return 0;
  }

  static createProperties(model, state) {
    const studyPropertyRootName = 'some-property';
    const studyMetaInfo = ensureNotNull(model.studyMetaInfoRepository().findByIdSync({
      type: "java",
      studyId: VbPFixedStudyId
    }));

    const defaultState = createDefaultsState(true, studyPropertyRootName, [], model.studyVersioning());

    return LineToolVbPFixed.createPropertiesFromStudyMetaInfoAndState(studyMetaInfo, studyMetaInfo, merge(clone(defaultState), state || {}), model.studyVersioning());
  }

  static createPropertiesFromStudyMetaInfoAndState(studyMetaInfo, parentStudyMetaInfo, state, studyVersioning) {
    const preparedProperties = prepareStudyPropertiesForLoadChart(studyMetaInfo, parentStudyMetaInfo, state, studyVersioning, modifyStyles);
    return this._configureProperties(preparedProperties);
  }

  static studyId() {
    return VbPFixedStudyId;
  }

  _studyInputs(points) {
    assert(points.length === 2, "all the line tool points should be defined");
    const [point1, point2] = points;

    const maxIndex = Math.max(point1.index, point2.index);
    const lastBarIndex = this._model.mainSeries().bars().lastIndex();

    const firstBarTime = this._getPointTime(point1.index <= point2.index ? point1 : point2, true);
    const lastBarTime = this._getPointTime(point2.index >= point1.index ? point2 : point1, true);

    if (firstBarTime === null || lastBarTime === null) {
      this._subscribeApplyInputsOnSeriesCompleted();
      return null;
    }

    return {
      ...this.properties().childs().inputs.state(),
      first_bar_time: 1000 * firstBarTime,
      last_bar_time: 1000 * lastBarTime,
      subscribeRealtime: lastBarIndex === maxIndex,
      mapRightBoundaryToBarStartTime: this._needExtendToBarsEnding() || undefined
    };
  }

  _isReady() {
    return !isStudyGraphicsEmpty(this.graphics());
  }

  async _getPropertyDefinitionsViewModelClass() {
    const { StudyLineDataSourceDefinitionsViewModel } = await Promise.all([
      e(7201),
      e(6196),
      e(5871),
      e(3986),
      e(8167),
      e(607)
    ]).then(bind(null, 56059));

    return StudyLineDataSourceDefinitionsViewModel;
  }

  _onDataUpdated() {
    this._updateAnchors();
    this.updateAllViews(sourceChangeEvent(this.id()));
    this._model.updateSource(this);
  }

  _updateAnchors() {
    const anchors = this._calculateAnchors();
    if (!anchors) return;

    const [{ index: firstIndex, price: firstPrice }, { index: secondIndex, price: secondPrice }] = anchors;

    if (this._timePoint.length) {
      this._timePoint[0].price = firstPrice;
      this._timePoint[1].price = secondPrice;
    }

    if (this._points.length) {
      const timeScale = this.model().timeScale();
      const firstTime = timeScale.indexToTimePoint(firstIndex);
      const secondTime = timeScale.indexToTimePoint(secondIndex);

      this._points[0] = {
        index: firstIndex,
        price: firstPrice,
        time: isNumber(firstTime) ? new Date(1000 * firstTime) : undefined
      };

      this._points[1] = {
        index: secondIndex,
        price: secondPrice,
        time: isNumber(secondTime) ? new Date(1000 * secondTime) : undefined
      };
    }
  }

  _calculateAnchors() {
    let lowestPrice = null;
    let highestPrice = null;
    let firstBarTime = null;
    let lastBarTime = null;

    this.graphics().hhists().forEach((hhist) => {
      hhist.forEach((item) => {
        const { priceLow, priceHigh, firstBarTime: itemFirstBarTime, lastBarTime: itemLastBarTime } = item;

        if ((lowestPrice === null) || (priceLow < lowestPrice)) {
          lowestPrice = priceLow;
        }

        if ((highestPrice === null) || (priceHigh > highestPrice)) {
          highestPrice = priceHigh;
        }

        if ((firstBarTime === null) || (itemFirstBarTime < firstBarTime)) {
          firstBarTime = itemFirstBarTime;
        }

        if ((lastBarTime === null) || (itemLastBarTime > lastBarTime)) {
          lastBarTime = itemLastBarTime;
        }
      });
   

 });

    if ((lowestPrice !== null) && (highestPrice !== null) && (lastBarTime !== null) && (firstBarTime !== null)) {
      return [{
        price: highestPrice,
        index: firstBarTime
      }, {
        price: lowestPrice,
        index: lastBarTime
      }];
    }
  }

  _updateAnchorsPrice() {
    const anchors = this._calculateAnchors();
    if (!anchors) return;

    const [{ price: highestPrice }, { price: lowestPrice }] = anchors;

    if (this._timePoint.length) {
      this._timePoint[0].price = highestPrice;
      this._timePoint[1].price = lowestPrice;
    }

    if (this._points.length) {
      this._points[0].price = highestPrice;
      this._points[1].price = lowestPrice;
    }
  }

  async _createPaneViews() {
    const paneViews = [];
    const { graphics, plots } = this._metaInfo;
    const needExtendToBarsEnding = this._needExtendToBarsEnding();

    if (graphics.hhists) {
      const { HHistPaneView } = await e(507).then(bind(null, 21335));
      const polygons = this.properties().childs().graphics.childs().polygons?.childs();

      paneViews.push(new HHistPaneView(this, this._model, undefined, polygons?.histBoxBg, needExtendToBarsEnding));
    }

    if (graphics.horizlines) {
      const { HorizLinePaneView } = await e(507).then(bind(null, 13369));
      paneViews.push(new HorizLinePaneView(this, this._model, undefined, needExtendToBarsEnding));
    }

    if (plots.length > 0) {
      paneViews.push(this._createStudyPlotPaneView(plots[0].id, needExtendToBarsEnding));
    }

    if (plots.length > 1) {
      paneViews.push(this._createStudyPlotPaneView(plots[1].id, needExtendToBarsEnding));
    }

    if (plots.length > 2) {
      paneViews.push(this._createStudyPlotPaneView(plots[2].id, needExtendToBarsEnding));
    }

    return paneViews;
  }

  _createStudyPlotPaneView(plotId, needExtendToBarsEnding) {
    return new StudyPlotPaneView(this, this._model.mainSeries(), this._model, plotId, needExtendToBarsEnding);
  }

  _needExtendToBarsEnding() {
    return this.metaInfo().defaults.inputs?.mapRightBoundaryToBarStartTime !== undefined;
  }
}

export {
  LineToolVbPFixed
};