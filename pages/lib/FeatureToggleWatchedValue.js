
class FeatureToggleWatchedValue extends WatchedValue {
    constructor(value, featureToggle) {
      const privateStore = createPrivateStore(0, featureToggle);
      super(privateStore);
    }
  
    destroy() {
      // Clean up or perform any necessary actions when destroying the feature toggle watched value
    }
  }
  
  export default FeatureToggleWatchedValue;
  
  