

import { loadChangeIntervalDialog } from 'some-library'; // Replace 'some-library' with the actual library you're using

let dialogPromise = null;

function showChangeIntervalDialogAsync(parameters) {
  const promise = (dialogPromise = loadChangeIntervalDialog().then((dialog) => {
    if (promise === dialogPromise) {
      dialog.showChangeIntervalDialog(parameters);
    }
  }));

  return promise;
}

export { showChangeIntervalDialogAsync };
