
"use strict";

const { CommonJsonStoreService } = require(68456);

class FavoriteStudyTemplateService extends CommonJsonStoreService {
  constructor(storageKey, eventEmitter) {
    super(storageKey, eventEmitter, "FAVORITE_STUDY_TEMPLATES_CHANGED", "StudyTemplates.quicks", []);
  }

  remove(template) {
    this.set(this.get().filter((t) => t !== template));
  }
}