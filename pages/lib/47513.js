import { ensureNotNull } from './assertions.js';
import { UndoCommand } from './UndoCommand.js';
import {translateMessage} from "./44352.js";
import {isLineTool} from "./18341.js";

import { TranslatedString } from './TranslatedString.js';
import { isStudy } from './28853.js';
import { closeSourcesSet } from './closeSourcesSet.js';
import { getLogger } from './59224.js';
import { ExcludeLineToolsFromGroupUndoCommand } from './93562.js';

class RemoveSourcesCommand extends UndoCommand {
  constructor({ title, chartModel, lineDataSourceIds }) {
    super(title);
    this._excludeLineToolsFromGroupUndoCommands = [];
    this._undoState = [];
    this._chartModel = chartModel;
    this._lineDataSourceIds = lineDataSourceIds;
  }

  redo() {
    const lineDataSources = this._lineDataSourceIds.map((id) => ensureNotNull(this._chartModel.dataSourceForId(id)));
    this._groupLineToolsByGroups(lineDataSources).forEach((lineTools, group) => {
      const undoCommand = new ExcludeLineToolsFromGroupUndoCommand(this._chartModel, group, lineTools);
      undoCommand.redo();
      this._excludeLineToolsFromGroupUndoCommands.push(undoCommand);
    });

    lineDataSources.forEach((dataSource) => {
      this._undoState.push({
        state: dataSource.state(false),
        paneIndex: this._chartModel.panes().indexOf(ensureNotNull(this._chartModel.paneForSource(dataSource))),
        sharingMode: dataSource.sharingMode().value(),
      });
      this._chartModel.removeSource(dataSource);
    });
  }

  undo() {
    for (let state = this._undoState.shift(); state; state = this._undoState.shift()) {
      const restoredSource = this._chartModel.restoreSource(false, state.paneIndex, null, state.state, null);
      restoredSource?.share(state.sharingMode);
    }

    this._excludeLineToolsFromGroupUndoCommands.forEach((command) => command.undo());
  }

  _groupLineToolsByGroups(lineDataSources) {
    const lineToolsGroupModel = this._chartModel.lineToolsGroupModel();
    return lineDataSources.reduce((groups, lineDataSource) => {
      const group = lineToolsGroupModel.groupForLineTool(lineDataSource);
      if (group !== null) {
        const tools = groups.get(group) || [];
        tools.push(lineDataSource);
        groups.set(group, tools);
      }
      return groups;
    }, new Map());
  }
}

const logger = getLogger("Chart.RemoveSourcesCommand");
const REMOVE_SOURCES_TRANSLATION = new TranslatedString(
  "remove line data sources",
  translateMessage(null, void 0,  "remove line data sources")
);

class RemoveSourcesCommand extends UndoCommand {
  constructor(chartModel, sources, options) {
    super(options);
    this._removeLineDataSourcesUndoCommand = null;
    this._initialPriceScaleMode = null;

    const [sourceIds, lineDataSourceIds] = closeSourcesSet(chartModel, sources).reduce(
      (result, source) => {
        if (isLineTool(source)) {
          result[1].push(source.id());
        } else {
          result[0].push(source.id());
        }
        return result;
      },
      [[], []]
    );

    this._chartModel = chartModel;
    this._sourceIds = sourceIds;
    this._lineDataSourceIds = lineDataSourceIds;
    this._sourceStates = [];
    this._paneIndexes = [];
    this._priceScalePositionIds = [];
    this._paneStates = [];
    this._restorePanes = [];

    const [firstSource] = sources;
    if (sources.length === 1 && isStudy(firstSource)) {
      this._initialPriceScaleMode = ensureNotNull(firstSource.priceScale()).mode();
    }
  }

  removedIds() {
    return [...this._sourceIds, ...this._lineDataSourceIds];
  }

  redo() {
    const panesCount = this._chartModel.panes().length;
    const sources = this._sourceIds.map((id) => ensureNotNull(this._chartModel.dataSourceForId(id)));

    this._sourceStates = sources.map((source) => ensureNotNull(source.state(false)));

    const panes = sources.map((source) => ensureNotNull(this._chartModel.paneForSource(source)));
    this._paneIndexes = panes.map((pane) => this._chartModel.panes().indexOf(pane));

    if (this._lineDataSourceIds.length > 0) {
      this._removeLineDataSourcesUndoCommand = new RemoveLineDataSourcesUndoCommand({
        title: REMOVE_SOURCES_TRANSLATION,
        chartModel: this._chartModel,
        lineDataSourceIds:this._lineDataSourceIds
      });
      this._removeLineDataSourcesUndoCommand.redo();
    }

    this._priceScalePositionIds = sources.map((source, index) => {
      const priceScale = source.priceScale();
      if (priceScale === null) return null;

      const position = panes[index].priceScalePosition(priceScale);
      return {
        id: priceScale.id(),
        position,
        priceScaleIndex: panes[index].priceScaleIndex(priceScale, position),
      };
    });

    const uniquePaneIndexes = new Set();
    this._paneStates = sources.map((source, index) => {
      const paneIndex = this._paneIndexes[index];
      if (uniquePaneIndexes.has(paneIndex)) {
        return panes[index].state(false, true);
      }
      uniquePaneIndexes.add(paneIndex);
      return null;
    });

    this._restorePanes = sources

.map((source) => this._chartModel.removeSource(source));
  }

  undo() {
    const restoredSources = [];
    for (let i = this._sourceStates.length - 1; i >= 0; i--) {
      const source = this._chartModel.restoreSource(
        this._restorePanes[i],
        this._paneIndexes[i],
        this._paneStates[i],
        this._sourceStates[i],
        this._priceScalePositionIds[i]
      );
      if (source) {
        restoredSources.push(source);
      }
    }

    if (
      restoredSources.some((source, index) => source.id() !== this._sourceIds[restoredSources.length - index - 1])
    ) {
      logger.logError("Source was restored improperly - source ids do not match");
    }

    if (this._initialPriceScaleMode !== null) {
      ensureNotNull(restoredSources[0].priceScale()).setMode(this._initialPriceScaleMode);
    }

    this._removeLineDataSourcesUndoCommand?.undo();
  }
}

export { RemoveSourcesCommand };