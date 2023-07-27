
import { randomHashN } from '36174';
import { Event, ensureNotNull } from '57898';

function isVisible(lineTool) {
  return lineTool.properties().visible.value();
}

function isHidden(lineTool) {
  return !isVisible(lineTool);
}

class LineToolsGroup {
  constructor(lineTools, name, id) {
    this._instanceId = randomHashN(6);
    this._onChanged = new Event();
    this._lineToolsSet = new Set();
    this._lineTools = [...lineTools];
    this._lineToolsSet = new Set(this._lineTools);
    this._name = name;
    this.id = id || randomHashN(6);
  }

  instanceId() {
    return this._instanceId;
  }

  lineTools() {
    return this._lineTools;
  }

  name() {
    return this._name;
  }

  setName(name) {
    this._doAndFireOnChange(() => {
      this._name = name;
    });
  }

  isActualSymbol() {
    return this._lineTools.length > 0 && this._lineTools[0].isActualSymbol() && this._lineTools[0].isActualCurrency() && this._lineTools[0].isActualUnit();
  }

  symbol() {
    return this._lineTools[0].symbol();
  }

  currencyId() {
    return this._lineTools[0].properties().childs().currencyId.value() ?? null;
  }

  unitId() {
    return this._lineTools[0].properties().childs().unitId.value() ?? null;
  }

  sharingMode() {
    return this._lineTools[0].sharingMode();
  }

  share(enable) {
    this._lineTools.forEach((lineTool) => lineTool.share(enable));
  }

  containsLineTool(lineTool) {
    return this._lineToolsSet.has(lineTool);
  }

  addLineTools(lineTools) {
    this._doAndFireOnChange((changedLineTools) => {
      lineTools.forEach((lineTool) => this._lineToolsSet.add(lineTool));
      this._lineTools.push(...lineTools);
      changedLineTools.push(...lineTools.map((lineTool) => lineTool.id()));
    });
  }

  excludeLineTool(lineTool) {
    this._doAndFireOnChange((changedLineTools) => {
      this._lineToolsSet.delete(lineTool);
      const index = this._lineTools.indexOf(lineTool);
      this._lineTools.splice(index, 1);
      changedLineTools.push(lineTool.id());
    });
  }

  excludeLineTools(lineTools) {
    this._doAndFireOnChange((changedLineTools) => {
      const excludedSet = new Set(lineTools);
      lineTools.forEach((lineTool) => this._lineToolsSet.delete(lineTool));
      this._lineTools = this._lineTools.filter((lineTool) => !excludedSet.has(lineTool));
      changedLineTools.push(...lineTools.map((lineTool) => lineTool.id()));
    });
  }

  state() {
    return {
      id: this.id,
      name: this._name,
      tools: this._lineTools.map((lineTool) => lineTool.id()),
    };
  }

  visibility() {
    const hasVisibleLineTool = this._lineTools.some(isVisible);
    const hasHiddenLineTool = this._lineTools.some(isHidden);

    if (hasVisibleLineTool && !hasHiddenLineTool) {
      return 'Visible';
    } else if (hasHiddenLineTool && !hasVisibleLineTool) {
      return 'Invisible';
    } else {
      return 'Partial';
    }
  }

  locked() {
    const hasLockedLineTool = this._lineTools.some((lineTool) => lineTool.properties().frozen.value());
    const hasUnlockedLineTool = this._lineTools.some((lineTool) => !lineTool.properties().frozen.value());

    if (hasLockedLineTool && !hasUnlockedLineTool) {
      return 'Locked';
    } else if (hasUnlockedLineTool && !hasLockedLineTool) {
      return 'Unlocked';
    } else {
      return 'Partial';
    }
  }

  isActualInterval() {
    const hasActualIntervalLineTool = this._lineTools.some((lineTool) => lineTool.isActualInterval());
    const hasNotActualIntervalLineTool = this._lineTools.some((lineTool) => !lineTool.isActualInterval());

    if (hasActualIntervalLineTool && !hasNotActualIntervalLineTool) {
      return 'IsActualInterval';
    } else if (hasNotActualIntervalLineTool && !hasActualIntervalLineTool) {
      return 'IsNotActualInterval';
    } else {
      return 'Partial';
    }
  }

  onChanged() {
    return this._onChanged;
  }

  static fromState(dataSources, state) {
    const lineTools = [];
    for (const toolId of state.tools) {
      const tool = dataSources.dataSourceForId(toolId);
      if (tool !== null) {
        lineTools.push(tool);
      }
    }
    return lineTools.length > 0 ? new LineToolsGroup(lineTools, state.name, state.id) : null;
  }

  _doAndFireOnChange(callback) {
    const changedLineTools = [];
    const oldVisibility = this.visibility();
    const oldLocked = this.locked();
    const oldTitle = this.name();
    const oldIsActualInterval = this.isActualInterval();

    callback(changedLineTools);

    this._onChanged.fire({
      affectedLineTools: changedLineTools,
      visibilityChanged: oldVisibility !== this.visibility(),
      lockedChanged: oldLocked !== this.locked(),
      titleChanged: oldTitle !== this.name(),
      isActualIntervalChanged: oldIsActualInterval !== this.isActualInterval(),
    });
  }
}

export { LineToolsGroup };
