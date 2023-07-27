import { enabled } from './14483.js';
import { translateMessage } from './44352.js';

const notAvailable = enabled('use_na_string_for_not_available_values')
  ? translateMessage(null, undefined, "n/a"))
  : "∅";
