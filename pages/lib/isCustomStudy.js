
"use strict";

const customStudyList = {
  VbPFixed: true,
  PivotPointsStandard: true,
  VbPVisible: true
};

function isCustomStudy(studyName) {
  return studyName in customStudyList;
}