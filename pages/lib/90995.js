import { tradingService } from 'some-library';
import { t } from 'translation-library';

import { hideAllDrawings, hideAllIndicators } from 'some-library';
import { ensureNotNull } from 'some-library';
import { setValue, getValue } from 'some-library';
import { hideStateChange } from 'some-library';

let hideOptionsMap = null;

export function getHideOptions() {
  if (hideOptionsMap !== null) {
    return hideOptionsMap;
  }

  const tradingSvc = tradingService();
  hideOptionsMap = new Map([
    [
      'drawings',
      {
        label: t(null, void 0, 'Hide Drawing Tools'),
        dataName: 'hide-drawing-tools',
        tooltip: {
          active: t(null, void 0, 'Hide drawings'),
          inactive: t(null, void 0, 'Show drawings'),
        },
        getBoxedValue: () => hideAllDrawings(),
        trackLabel: 'hide drawings',
      },
    ],
    [
      'indicators',
      {
        label: t(null, void 0, 'Hide Indicators'),
        dataName: 'hide-indicators',
        tooltip: {
          active: t(null, void 0, 'Hide indicators'),
          inactive: t(null, void 0, 'Show indicators'),
        },
        getBoxedValue: () => hideAllIndicators(),
        trackLabel: 'hide indicators',
      },
    ],
    [
      'positions',
      {
        label: t(null, void 0, 'Hide Positions'),
        dataName: 'hide-positions-and-orders',
        tooltip: {
          active: t(null, void 0, 'Hide positions and orders'),
          inactive: t(null, void 0, 'Show positions and orders'),
        },
        getBoxedValue: () => ensureNotNull(tradingSvc).showTradedSources,
        inverted: true,
        trackLabel: 'hide positions',
      },
    ],
    [
      'all',
      {
        label: t(null, void 0, 'Hide All'),
        dataName: 'hide-all',
        tooltip: {
          active: tradingSvc ? t(null, void 0, 'Hide all') : t(null, void 0, 'Please login to hide all'),
          inactive: tradingSvc ? t(null, void 0, 'Show all') : t(null, void 0, 'Please login to show all'),
        },
        trackLabel: 'hide all',
      },
    ],
  ]);

  if (!tradingSvc) {
    hideOptionsMap.delete('positions');
  }

  return hideOptionsMap;
}

export function toggleHideMode(mode) {
  const hideMode = mode ? mode : getSavedHideMode();
  const allHidden = areAllHidden();

  let isActive = !allHidden;

  if (hideMode === 'all') {
    applyToAllOptions((option, key, inverted) => {
      option.setValue(inverted ? !isActive : isActive);
      isActive = inverted ? !option.value() : option.value();
    });

    hideStateChange.fire({
      hideMode: hideMode,
      isActive: isActive,
    });
  } else {
    applyToAllOptions((option, key, inverted) => {
      if (key === hideMode) {
        const newValue = tradingSvc ? !isActive : !option.value();
        option.setValue(newValue);
        isActive = inverted ? !newValue : newValue;
      } else {
        option.setValue(Boolean(inverted));
      }
    });

    hideStateChange.fire({
      hideMode: hideMode,
      isActive: isActive,
    });
  }

  return isActive;
}

export function getSavedHideMode() {
  const savedMode = getValue('ChartToolsHideMode', 'drawings');
  const hideOptions = getHideOptions();

  if (hideOptions.has(savedMode)) {
    return savedMode;
  }

  return 'drawings';
}

function areAllHidden() {
  let allHidden = true;

  applyToAllOptions((option) => {
    const value = option.value();
    allHidden = allHidden && value;
  });

  return allHidden;
}

function applyToAllOptions(callback) {
  getHideOptions().forEach((option, key) => {
    const boxedValue = option.getBoxedValue?.();
    if (boxedValue) {
      callback(boxedValue, key, option.inverted);
    }
  });
}
