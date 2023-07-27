import { assert } from "<path_to_utils_module>";
import { createVisibilityController } from "<path_to_createVisibilityController_module>";

export const navigationButtonsVisibilityKey = "NavigationButtons.visibility";

const {
  property: { property, availableValues, actualBehavior },
} = createVisibilityController(navigationButtonsVisibilityKey);

export { property, availableValues, actualBehavior };
