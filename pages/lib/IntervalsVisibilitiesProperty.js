
import { IntervalsVisibilitiesProperty as BaseIntervalsVisibilitiesProperty } from 59452;

class IntervalsVisibilitiesProperty extends BaseIntervalsVisibilitiesProperty {
  state(state) {
    return super.state(state);
  }

  storeStateIfUndefined() {
    return false;
  }
}

export default IntervalsVisibilitiesProperty;
