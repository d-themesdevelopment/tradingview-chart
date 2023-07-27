


import { reactive, readonly } from 'some-library'; // Replace 'some-library' with the actual library you're using

function createWVFromGetterAndSubscriptions(getter, subscriptions) {
  const value = reactive(getter());
  const subscribers = {};

  subscriptions.forEach((subscription) => {
    subscription.subscribe(subscribers, () => {
      value.setValue(getter());
    });
  });

  return readonly().spawn(() => {
    subscriptions.forEach((subscription) => {
      subscription.unsubscribeAll(subscribers);
    });
  });
}

export { createWVFromGetterAndSubscriptions };
