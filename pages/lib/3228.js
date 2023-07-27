import { createVisibilityController } from "./29542";
import { navigationButtonsVisibilityKey } from "./78159";

const {
  property: n,
  availableValues: o,
  actualBehavior: a,
} = createVisibilityController(
  "PaneButtons.visibility",
  navigationButtonsVisibilityKey
);

export { n as property, o as availableValues, a as actualBehavior };
