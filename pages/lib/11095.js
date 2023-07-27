// ! not correct

(e, t, i) => {
  "use strict";
  i.d(t, {
    addPlusButtonProperty: () => addPlusButtonProperty,
    restoreAddPlusButtonSettingsValue: () => restoreAddPlusButtonSettingsValue,
    showPlusButtonOnCursor: () => showPlusButtonOnCursor,
  });

  var s = i(4741);
  var r = i(56840);
  var n = i(59680);
  var o = i(58275);

  const ADD_PLUS_BUTTON_SETTING_KEY = "add_plus_button";

  function isAltPlusModPressed() {
    const keyboardState = s.keyboardPressedKeysState.value();
    return (
      keyboardState !== undefined &&
      Boolean(keyboardState.modifiers & (s.Modifiers.Alt | s.Modifiers.Mod)) &&
      (keyboardState.code === undefined ||
        keyboardState.altOrOptionCode() ||
        keyboardState.controlOrMetaCode())
    );
  }

  const plusButtonState = new (i.n(o)())(isAltPlusModPressed());
  s.keyboardPressedKeysState.subscribe(() => {
    plusButtonState.setValue(isAltPlusModPressed());
  });

  const showPlusButtonOnCursor = plusButtonState.readonly();

  function getAddPlusButtonSetting() {
    return r.getBool(ADD_PLUS_BUTTON_SETTING_KEY, true);
  }

  const addPlusButtonProperty = n.createPrimitiveProperty(
    getAddPlusButtonSetting()
  );

  function restoreAddPlusButtonSettingsValue() {
    addPlusButtonProperty.setValue(true);
    r.remove(ADD_PLUS_BUTTON_SETTING_KEY);
  }

  r.onSync.subscribe(() => {
    addPlusButtonProperty.setValue(getAddPlusButtonSetting());
  });

  addPlusButtonProperty.subscribe(() => {
    r.setValue(ADD_PLUS_BUTTON_SETTING_KEY, addPlusButtonProperty.value());
  });
};
