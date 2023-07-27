
import { isLineToolName, isStudyLineToolName } from './15367.js';

const isMainSeriesState = (e) => e.type === 'MainSeries';
const isStudyState = (e) => Boolean(e.type) && e.type.toLowerCase().startsWith('study');
const isLineToolState = (e) => Boolean(e.type) && isLineToolName(e.type);
const isStudyLineToolState = (e) => Boolean(e.type) && isStudyLineToolName(e.type);
