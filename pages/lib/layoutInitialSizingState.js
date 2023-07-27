
import { default as _isArray } from '3308';
import '50151';

function createSubstate(state) {
  return state.map((item) => {
    if (_isArray(item)) {
      return {
        percent: 1 / state.length,
        substate: createSubstate(item.slice(1)),
      };
    } else {
      return {
        percent: 1 / state.length,
      };
    }
  });
}

function layoutInitialSizingState(state) {
  return createSubstate(state.slice(1));
}

export { layoutInitialSizingState };