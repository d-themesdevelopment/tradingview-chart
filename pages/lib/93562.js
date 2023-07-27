import { ensureNotNull } from 'some-library';
import { TranslatedString } from 'translation-library';
import { UndoCommand } from 'some-library';
import { lineToolsGroupModel } from 'some-library';

const excludeLineToolsFromGroupString = new TranslatedString(
  'Exclude line tools from group {group}',
  t(null, void 0, 'some-translation-key')
);

export class ExcludeLineToolsFromGroupUndoCommand extends UndoCommand {
  constructor(model, group, lineTools) {
    super(excludeLineToolsFromGroupString.format({
      group: group.name(),
    }));

    this._model = model;
    this._groupId = group.id;
    this._groupName = group.name();
    this._lineToolIds = lineTools.map((lineTool) => lineTool.id());
  }

  redo() {
    const group = ensureNotNull(this._model.lineToolsGroupModel().groupForId(this._groupId));
    const lineTools = this._lineToolIds.map((lineToolId) => this._model.dataSourceForId(lineToolId));
    
    group.excludeLineTools(lineTools);

    if (group.lineTools().length === 0) {
      this._model.lineToolsGroupModel().removeGroup(group);
    }
  }

  undo() {
    const lineTools = this._lineToolIds.map((lineToolId) => this._model.dataSourceForId(lineToolId));
    const group = this._model.lineToolsGroupModel().groupForId(this._groupId);

    if (group !== null) {
      group.addLineTools(lineTools);
    } else {
      this._model.lineToolsGroupModel().createGroup(lineTools, this._groupName, this._groupId);
    }
  }
}
