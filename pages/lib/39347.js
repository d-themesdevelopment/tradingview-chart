import { assert } from "./assertions";
import { createEventEmitter } from "event-utils"; // ! not correct
import { humanReadableHash } from "./3343";
import { guid } from "./36174";

class Action {
  constructor(options, id = guid()) {
    this.type = "action";
    this._destroyed = false;
    this._binding = null;

    assert(options.actionId !== undefined, "actionId must be defined");

    this.id = id;
    this._onUpdate = createEventEmitter();
    this._options = options;

    this.update(options);
  }

  execute() {
    if (this._options.checkable) {
      this.update({ checked: !this._options.checked });
    }

    if (this._options.onExecute) {
      this._options.onExecute(this);
    }
  }

  getLabel() {
    return this._options.label || "";
  }

  getSubItems() {
    return this._options.subItems || [];
  }

  isDisabled() {
    return this._options.disabled === true;
  }

  isActive() {
    return this._options.active === true;
  }

  isCheckable() {
    return this._options.checkable === true;
  }

  isChecked() {
    return this._options.checked === true;
  }

  isLoading() {
    return this._options.loading === true;
  }

  getSize() {
    return this._options.size ?? "normal";
  }

  getPayload() {
    return this._options.payload;
  }

  update(options) {
    if (this._destroyed) return;

    this._unbindShortcut();

    if (options.hotkeyHash) {
      this._options.shortcutHint = humanReadableHash(options.hotkeyHash);
    }

    this._options = { ...this._options, ...options };

    this._bindShortcut();

    this._onUpdate.emit(this);
  }

  onUpdate() {
    return this._onUpdate;
  }

  getState() {
    return {
      actionId: this._options.actionId,
      label: this.getLabel(),
      disabled: this.isDisabled(),
      active: this.isActive(),
      subItems: this.getSubItems(),
      checkable: this.isCheckable(),
      checked: this.isChecked(),
      loading: this.isLoading(),
      size: this.getSize(),
      doNotCloseOnClick: this._options.doNotCloseOnClick || false,
      shortcutHint: this._options.shortcutHint,
      hint: this._options.hint,
      icon: this._options.icon,
      iconChecked: this._options.iconChecked,
      toolbox: this._options.toolbox,
      showToolboxOnHover: this._options.showToolboxOnHover || false,
      statName: this._options.statName,
      name: this._options.name,
      invisibleHotkey: this._options.invisibleHotkey,
      noInteractive: this._options.noInteractive,
    };
  }

  getBinding() {
    return this._binding;
  }

  setBinding(binding) {
    this._binding = binding;
  }

  destroy() {
    this._destroyed = true;
    this._onUpdate.destroy();

    if (this._binding) {
      this._binding.destroy();
    }

    this._unbindShortcut();

    if (this._options.onDestroy) {
      this._options.onDestroy();
    }
  }

  options() {
    return this._options;
  }

  _bindShortcut() {
    if (!this._options.hotkeyGroup || !this._options.hotkeyHash) {
      return;
    }

    const label =
      typeof this._options.label === "string"
        ? this._options.label
        : this._options.name;

    this._hotkeyAction = this._options.hotkeyGroup.add({
      hotkey: this._options.hotkeyHash,
      desc: label,
      handler: () => this.execute(),
      isDisabled: () => this.isDisabled(),
    });
  }

  _unbindShortcut() {
    if (this._hotkeyAction) {
      this._hotkeyAction.destroy();
      delete this._hotkeyAction;
    }
  }
}

class ActionAsync extends Action {
  constructor(actionId, loader, id) {
    super({ actionId }, id);

    this._loader = loader;
    this._loaded = false;
    this._loadingPromise = null;
  }

  loadOptions() {
    if (!this._loadingPromise) {
      this._loadingPromise = this._loader().then((options) => {
        this._loaded = true;
        this.update(options);
      });
    }

    return this._loadingPromise;
  }

  getState() {
    this.loadOptions();
    return super.getState();
  }

  isLoading() {
    return !this.isLoaded();
  }

  isLoaded() {
    return this._loaded;
  }
}

class Separator {
  constructor(hint) {
    this.type = "separator";
    this.id = guid();
    this._hint = hint;
  }

  getHint() {
    return this._hint;
  }
}

class Loader extends Action {
  constructor(actionId) {
    super({ actionId });
  }

  isLoading() {
    return true;
  }

  getSize() {
    return "big";
  }
}

export { Action, ActionAsync, Loader, Separator };
