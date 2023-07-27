import { createWVFromGetterAndSubscription, createWVFromGetterAndSubscriptions } from 'subscriptionUtils';
import { combineProperty } from 'propertyUtils';

function createWVFromProperty(property) {
  return createWVFromGetterAndSubscription(() => property.value(), property);
}

combineProperty;
createWVFromGetterAndSubscription;
createWVFromGetterAndSubscriptions;
createWVFromProperty;