

const { getLogger } = require(59224);
const { clone, merge } = require(1722);
const { InsertionErrorCode } = require(59744);

const logger = getLogger("Chart.Studies.StudyInserter");

class StudyInserter {
  constructor(studyDescriptor, studyMetaInfoRepository, inserterImpl) {
    this._studyDescriptor = studyDescriptor;
    this._studyMetaInfoRepository = studyMetaInfoRepository;
    this._inserterImpl = inserterImpl;
    this._parentSources = [];
    this._propsState = undefined;
    this._preferredPriceScale = undefined;
    this._allowChangeCurrency = false;
    this._allowChangeUnit = false;
    this._paneSize = undefined;
    this._forceOverlay = false;
    this._targetPriceScaleMode = undefined;
  }

  setParentSources(parentSources) {
    this._parentSources = parentSources;
  }

  setPaneSize(paneSize) {
    this._paneSize = paneSize;
  }

  setPreferredPriceScale(preferredPriceScale) {
    this._preferredPriceScale = preferredPriceScale;
  }

  setAllowChangeCurrency(allowChangeCurrency) {
    this._allowChangeCurrency = allowChangeCurrency;
  }

  setAllowChangeUnit(allowChangeUnit) {
    this._allowChangeUnit = allowChangeUnit;
  }

  setForceOverlay(forceOverlay) {
    this._forceOverlay = forceOverlay;
  }

  setPropertiesState(propsState) {
    this._propsState = propsState;
  }

  setTargetPriceScaleMode(targetPriceScaleMode) {
    this._targetPriceScaleMode = targetPriceScaleMode;
  }

  async insert(customizeInputs, insertionOptions) {
    let stub = null;
    const canCreateStub = this._inserterImpl.createStub && this._inserterImpl.removeStub;
    if (canCreateStub) {
      stub = this._inserterImpl.createStub();
    }

    let studyMetaInfo;
    let stubRemoved = true;
    try {
      studyMetaInfo = await this._studyMetaInfoRepository.findById(this._studyDescriptor);
    } catch (error) {
      logger.logWarn(`Cannot get study ${JSON.stringify(this._studyDescriptor)}`);
      return Promise.reject(InsertionErrorCode.CannotGetMetainfo);
    } finally {
      if (stub !== null) {
        stubRemoved = this._inserterImpl.removeStub(stub);
      }
    }

    if (!stubRemoved) {
      return Promise.reject(InsertionErrorCode.StubWasRemoved);
    }

    if (insertionOptions && insertionOptions.cancelled) {
      return Promise.reject(InsertionErrorCode.Cancelled);
    }

    if (!this._canApplyStudyToParent(studyMetaInfo)) {
      return Promise.reject(InsertionErrorCode.StudyCannotBeChild);
    }

    const defaultInputs = { ...studyMetaInfo.defaults.inputs };
    let customInputs = {};
    if (customizeInputs) {
      const propertyRootName = StudyMetaInfo.getStudyPropertyRootName(studyMetaInfo);
      const defaultCustomInputs = clone(defaults(propertyRootName).inputs);
      merge(customInputs, defaultCustomInputs.inputs);
      const { inputs, parentSources = [] } = await customizeInputs(customInputs, studyMetaInfo.inputs, studyMetaInfo);
      customInputs = inputs;
      this._parentSources = parentSources;
    }

    if (insertionOptions && insertionOptions.cancelled) {
      return Promise.reject(InsertionErrorCode.Cancelled);
    }

    const study = this._insertStudy(studyMetaInfo, customInputs);
    if (study === null) {
      return Promise.reject(InsertionErrorCode.Unknown);
    }

    await study.startPromise;
    return study;
  }

  _insertStudy(studyMetaInfo, customInputs) {
    return this._inserterImpl.createStudy(
      studyMetaInfo,
      customInputs,
      null,
      this._propsState,
      this._forceOverlay,
      this._parentSources,
      this._preferredPriceScale,
      this._allowChangeCurrency,
      this._allowChangeUnit,
      this._paneSize,
      this._targetPriceScaleMode
    );
  }

  _canApplyStudyToParent(studyMetaInfo) {
    return this._parentSources.length === 0 || StudyMetaInfo.canBeChild(studyMetaInfo);
  }
}

module.exports = {
  StudyInserter,
};