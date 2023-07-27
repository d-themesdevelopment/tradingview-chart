"use strict";

import { writable } from 'path/to/writable'; // Assuming 'writable' is the correct module

function createWVFromGetterAndSubscription(getter, subscription) {
  const writableValue = new writable(getter());
  const unsubscribeHandler = {};

  subscription.subscribe(unsubscribeHandler, () => {
    writableValue.setValue(getter());
  });

  return writableValue.readonly().spawn(() => {
    subscription.unsubscribeAll(unsubscribeHandler);
  });
}
