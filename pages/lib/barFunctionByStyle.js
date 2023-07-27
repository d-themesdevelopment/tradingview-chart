import { barFunction } from './13497.js';

function barFunctionByStyle(style, name = null) {
  switch (style) {
    case 12:
      return barFunction('low', 'low', 'close');
    case 2:
    case 14:
    case 15:
    case 3:
    case 10:
    case 13:
      return barFunction(name !== null ? name : 'close');
    default:
      return barFunction('close', 'open');
  }
}