
const { t } = require('44352');

function getStudyInputsInfo(study) {
  if (typeof study.inputs === 'undefined') {
    return [];
  }

  return study.inputs.map((input) => ({
    ...input,
    id: input.id,
    localizedName: typeof input.name !== 'undefined' ? t(input.name, { context: 'input' }, require(88601)) : '',
  }));
}

module.exports = {
  getStudyInputsInfo,
};