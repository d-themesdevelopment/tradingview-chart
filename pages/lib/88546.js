import { enabled as naEnabled } from '<path_to_na_string_module>';
import { t } from '<path_to_i18n_module>';

const notAvailable = naEnabled('use_na_string_for_not_available_values')
  ? t(null, undefined, require('<path_to_na_string_translation_file>'))
  : "∅";
