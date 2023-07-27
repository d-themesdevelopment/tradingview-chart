import { StudyStatusProviderBase, StudyStatusType } from 'study-status-provider-base';
import { PriceDataSource } from 'price-data-source';
import { PriceFormatter } from 'price-formatter';
import { StudyStatusView } from 'study-status-view';

class CustomStudyStatusProvider extends StudyStatusProviderBase {
  text() {
    return this._source.isActualInterval() ? `${this._source.title()} ${this.sourceStatusText()}` : this._source.title();
  }
}

class CustomItemsProvider {
  getItems() {
    return [];
  }

  getValues(e) {
    return [];
  }
}

const defaultFormatter = new PriceFormatter(100);

class StudyStub extends PriceDataSource {
  constructor(model, state, title) {
    super(model);
    this._priceStep = 0.01;
    this._status = {
      type: StudyStatusType.Undefined
    };
    this._statusChanged = new EventManager();
    this._formatter = defaultFormatter;
    this._origState = state;
    this._title = title;
    this._properties = new PropertiesContainer({
      visible: true
    });
    this._statusView = new StudyStatusView(this);
  }

  barColorer() {
    return null;
  }

  properties() {
    return this._properties;
  }

  statusView() {
    return this._statusView;
  }

  legendView() {
    return null;
  }

  state(e) {
    return this._origState;
  }

  setStatus(e) {
    this._status = e;
    this._statusChanged.fire();
  }

  formatter() {
    return this._formatter;
  }

  name() {
    return this._title;
  }

  title() {
    return this._title;
  }

  titleInParts() {
    return [this._title];
  }

  isFailed() {
    return this._status.type === StudyStatusType.Error;
  }

  isLoading() {
    return this._status.type === StudyStatusType.Loading;
  }

  setFailed(e) {
    this.setStatus({
      type: StudyStatusType.Error,
      errorDescription: {
        error: e
      }
    });
    this._model.updateSource(this);
  }

  isSymbolInvalid() {
    return false;
  }

  isActualInterval() {
    return true;
  }

  onIsActualIntervalChange() {
    return new Promise();
  }

  start() {}

  status() {
    return this._status;
  }

  onStatusChanged() {
    return this._statusChanged;
  }

  firstValue() {
    return null;
  }

  currency() {
    return null;
  }

  sessionId() {
    return this._model.mainSeries().sessionId();
  }

  sessionIdChanged() {
    return this._model.mainSeries().sessionIdChanged();
  }

  unit() {
    return null;
  }

  symbolSource() {
    return this._model.mainSeries();
  }

  barsProvider() {
    return this._model.mainSeries();
  }

  valuesProvider() {
    return new CustomItemsProvider();
  }

  statusProvider(e) {
    return new CustomStudyStatusProvider(this, this._model.properties().childs().scalesProperties.childs().textColor);
  }
}

export {
  StudyStub
};