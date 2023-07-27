

import { getJSON, setJSON, onSync } from './56840.js'; // Replace 'some-library' with the actual library you're using

const watermarkPropertyDefaults = {
  visibility: false,
  color: 'rgba(80, 83, 94, 0.25)'
};

let watermarkPropertyInstance = null;

function createWatermarkProperty() {
  if (watermarkPropertyInstance === null) {
    watermarkPropertyInstance = Object.assign({}, watermarkPropertyDefaults, getJSON('symbolWatermark'));

    onSync.subscribe(null, () => {
      if (watermarkPropertyInstance !== null) {
        watermarkPropertyInstance.mergeAndFire(getWatermarkPropertyState());
      }
    });

    watermarkPropertyInstance.listeners().subscribe(null, () => {
      if (watermarkPropertyInstance !== null) {
        setJSON('symbolWatermark', watermarkPropertyInstance.state());
      }
    });
  }

  return watermarkPropertyInstance;
}

function restoreWatermarkPropertyDefaults() {
  if (watermarkPropertyInstance !== null) {
    watermarkPropertyInstance.mergeAndFire(watermarkPropertyDefaults);
  }
}

export {
  createWatermarkProperty as watermarkProperty,
  restoreWatermarkPropertyDefaults
};