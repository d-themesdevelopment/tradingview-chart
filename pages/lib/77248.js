

import { assert } from '<path_to_utils_module>';

function firstReplacedByBatsExchange(e) {
  return null;
}

function isEod(e, t) {
  return null;
}

function isYield(e) {
  return false;
}

function isDelay(e) {
  return e !== undefined && e > 0;
}

function withoutRealtime(e) {
  return (
    (e.type === 'index' && ['DJ', 'JSE', 'BELEX'].includes(e.listed_exchange))
    || (e.type === 'futures' && ['NZX'].includes(e.listed_exchange))
  );
}

async function getExchange(e) {
  return null;
}

export {
  firstReplacedByBatsExchange,
  isEod,
  isYield,
  isDelay,
  withoutRealtime,
  getExchange,
};