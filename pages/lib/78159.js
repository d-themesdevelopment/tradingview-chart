import { createVisibilityController } from "./29542.js";

export const navigationButtonsVisibilityKey = "NavigationButtons.visibility";

const {
  property: { property, availableValues, actualBehavior },
} = createVisibilityController(navigationButtonsVisibilityKey);

export { property, availableValues, actualBehavior };
