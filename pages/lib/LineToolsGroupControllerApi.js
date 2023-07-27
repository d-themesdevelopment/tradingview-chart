
import { sortSources } from '<path_to_sortSources_module>';
import { ensureDefined, ensureNotNull, assert } from '<path_to_helper_modules>';
import { isLineTool } from '<path_to_isLineTool_module>';

class LineToolsGroupControllerApi {
  constructor(controller, model) {
    this._controller = controller;
    this._model = model;
  }

  createGroupFromSelection() {
    return this._controller.createGroupFromSelection().id;
  }

  removeGroup(groupId) {
    const group = ensureDefined(this._groupById(groupId));
    this._controller.removeGroup(group);
  }

  groups() {
    return this._controller.groups().map((group) => group.id);
  }

  shapesInGroup(groupId) {
    const group = ensureDefined(this._groupById(groupId));
    return sortSources(group.lineTools()).map((shape) => shape.id());
  }

  excludeShapeFromGroup(groupId, shapeId) {
    const group = ensureDefined(this._groupById(groupId));
    const shape = ensureNotNull(this._model.dataSourceForId(shapeId));
    assert(isLineTool(shape), "Passed shapeId is not a line tool");
    this._controller.excludeLineToolFromGroup(group, shape);
  }

  addShapeToGroup(groupId, shapeId) {
    const group = ensureDefined(this._groupById(groupId));
    const shape = ensureNotNull(this._model.dataSourceForId(shapeId));
    assert(isLineTool(shape), "Passed shapeId is not a line tool");
    this._controller.addLineToolToGroup(group, shape);
  }

  availableZOrderOperations(groupId) {
    const group = ensureDefined(this._groupById(groupId));
    return this._controller.availableZOrderOperations(group);
  }

  bringToFront(groupId) {
    const group = ensureDefined(this._groupById(groupId));
    this._controller.bringToFront(group);
  }

  bringForward(groupId) {
    const group = ensureDefined(this._groupById(groupId));
    this._controller.bringForward(group);
  }

  sendBackward(groupId) {
    const group = ensureDefined(this._groupById(groupId));
    this._controller.sendBackward(group);
  }

  sendToBack(groupId) {
    const group = ensureDefined(this._groupById(groupId));
    this._controller.sendToBack(group);
  }

  insertAfter(groupId, referenceId) {
    const group = ensureDefined(this._groupById(groupId));
    const reference = ensureNotNull(this._groupById(referenceId) || this._model.dataSourceForId(referenceId));
    this._controller.insertAfter(group, reference);
  }

  insertBefore(groupId, referenceId) {
    const group = ensureDefined(this._groupById(groupId));
    const reference = ensureNotNull(this._groupById(referenceId) || this._model.dataSourceForId(referenceId));
    this._controller.insertBefore(group, reference);
  }

  groupVisibility(groupId) {
    return ensureDefined(this._groupById(groupId)).visibility();
  }

  setGroupVisibility(groupId, visibility) {
    const group = ensureDefined(this._groupById(groupId));
    this._controller.setGroupVisibility(group, visibility);
  }

  groupLock(groupId) {
    return ensureDefined(this._groupById(groupId)).locked();
  }

  setGroupLock(groupId, locked) {
    const group = ensureDefined(this._groupById(groupId));
    this._controller.setGroupLock(group, locked);
  }

  getGroupName(groupId) {
    return ensureDefined(this._groupById(groupId)).name();
  }

  setGroupName(groupId, name) {
    const group = ensureDefined(this._groupById(groupId));
    this._controller.setGroupName(group, name);
  }

  canBeGroupped(shapeIds) {
    const shapes = shapeIds.map((shapeId) => ensureNotNull(this._model.dataSourceForId(shapeId)));
    return !shapes.some((shape) => !isLineTool(shape)) && this._controller.canBeGroupped(shapes);
  }

  _groupById(groupId) {
    return this._controller.groups().find((group) => group.id === groupId);
  }
}

export { LineToolsGroupControllerApi };