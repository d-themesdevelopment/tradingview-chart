function migrateMetaInfoAndPropState(metaInfo, propState) {
    const serverMetaInfoVersion = StudyMetaInfo.versionOf(metaInfo);
    const migratedMetaInfo = metaInfo;
    if (migratedMetaInfo._serverMetaInfoVersion === undefined) {
      migratedMetaInfo._serverMetaInfoVersion = serverMetaInfoVersion;
    }
  
    const isPennantOrWedgeStudy =
      metaInfo.id === "PennantCP@tv-basicstudies" || metaInfo.id === "WedgeCP@tv-basicstudies";
  
    for (const migrator of formatMigrators) {
      if ((serverMetaInfoVersion < 0 || serverMetaInfoVersion >= migrator.targetMetaInfoVersion()) && !isPennantOrWedgeStudy) {
        migrator.migrateMetaInfo(migratedMetaInfo);
        if (propState !== undefined) {
          migrator.migratePropState(propState);
        }
        assert(migratedMetaInfo._metainfoVersion === migrator.targetMetaInfoVersion());
      }
    }
  }
  
  module.exports = {
    migrateMetaInfoAndPropState,
  };