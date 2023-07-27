import { isSymbolSource as _isSymbolSource } from "./18611";
import { symbolUnitConvertibleGroupsIfExist as _symbolUnitConvertibleGroupsIfExist } from "42960"; // ! not correct

function unitConvertibleGroups(e, t, i) {
  const convertibleGroups = _symbolUnitConvertibleGroupsIfExist(e, true);
  if (convertibleGroups !== null) {
    return convertibleGroups;
  } else {
    const unitGroup = i.unitGroupById(t);
    return unitGroup === null ? [] : [unitGroup];
  }
}

function sourceNewUnitOnPinningToPriceScale(e, t, i, r) {
  let newUnit = null;
  if (i.unitConversionEnabled() && _isSymbolSource(e)) {
    const availableUnits = i.availableUnits();
    const unitInfo = t.unit(availableUnits);
    const sourceUnit = e.unit();
    const convertibleGroups =
      sourceUnit === null
        ? []
        : unitConvertibleGroups(e.symbolInfo(), sourceUnit, availableUnits);

    if (
      unitInfo !== null &&
      unitInfo.selectedUnit !== null &&
      !unitInfo.allUnitsAreOriginal &&
      unitInfo.selectedUnit !== sourceUnit &&
      ((r && sourceUnit === null) ||
        (sourceUnit !== null &&
          availableUnits.convertible(sourceUnit, convertibleGroups)))
    ) {
      newUnit = unitInfo.selectedUnit;
    }
  }
  return newUnit;
}

export { sourceNewUnitOnPinningToPriceScale, unitConvertibleGroups };
