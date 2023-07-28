import { getLogger } from "log"; // ! not correct
import { lowerbound, upperbound } from "./78071";

const log = getLogger("Chart.PlotList");
const CACHE_SIZE = 30;

function getIndex(row) {
  return row.index;
}

export function getValue(row) {
  return row.value[0];
}

class PlotList {
  constructor(plotFunctions = null, emptyValuePredicate = null) {
    this._items = [];
    this._start = 0;
    this._end = 0;
    this._shareRead = false;
    this._minMaxCache = new Map();
    this._rowSearchCacheByIndex = new Map();
    this._rowSearchCacheByIndexWithoutEmptyValues = new Map();
    this._rowSearchCacheByTime = new Map();
    this._rowSearchCacheByTimeWithoutEmptyValues = new Map();
    this._plotFunctions = plotFunctions || new Map();
    this._emptyValuePredicate = emptyValuePredicate;
  }

  clear() {
    this._items = [];
    this._start = 0;
    this._end = 0;
    this._shareRead = false;
    this._minMaxCache.clear();
    this._invalidateSearchCaches();
  }

  first() {
    return this.size() > 0 ? this._items[this._start] : null;
  }

  last() {
    return this.size() > 0 ? this._items[this._end - 1] : null;
  }

  firstIndex() {
    return this.size() > 0 ? this._indexAt(this._start) : null;
  }

  lastIndex() {
    return this.size() > 0 ? this._indexAt(this._end - 1) : null;
  }

  size() {
    return this._end - this._start;
  }

  isEmpty() {
    return this.size() === 0;
  }

  contains(index) {
    return this.search(index, PlotRowSearchMode.Exact) !== null;
  }

  valueAt(index) {
    const row = this.search(index);
    return row !== null ? row.value : null;
  }

  add(index, value) {
    if (this._shareRead) {
      log.logDebug("add: readonly collection modification attempt");
      return false;
    }

    const newRow = {
      index,
      value,
    };

    const existingIndex = this._nonCachedSearch(
      index,
      PlotRowSearchMode.Exact,
      getIndex
    );
    if (existingIndex === null) {
      this._items.splice(this._lowerBound(index, getIndex), 0, newRow);
      this._start = 0;
      this._end = this._items.length;
      this._invalidateSearchCaches();
      return true;
    }

    this._items[existingIndex] = newRow;
    return false;
  }

  search(index, mode = PlotRowSearchMode.Exact) {
    return this._searchImpl(
      index,
      mode,
      this._rowSearchCacheByIndex,
      this._rowSearchCacheByIndexWithoutEmptyValues,
      getIndex
    );
  }

  searchByTime(time, mode = PlotRowSearchMode.Exact) {
    return this._searchImpl(
      time,
      mode,
      this._rowSearchCacheByTime,
      this._rowSearchCacheByTimeWithoutEmptyValues,
      getValue
    );
  }

  fold(callback, initialValue) {
    let result = initialValue;
    for (let i = this._start; i < this._end; i++) {
      result = callback(this._indexAt(i), this._valueAt(i), result);
    }
    return result;
  }

  findFirst(predicate, maxCount) {
    const endIndex =
      maxCount !== undefined
        ? Math.min(this._start + maxCount, this._end)
        : this._end;
    for (let i = this._start; i < endIndex; i++) {
      const index = this._indexAt(i);
      const value = this._valueAt(i);
      if (predicate(index, value)) {
        return { index, value };
      }
    }
    return null;
  }

  findLast(predicate, maxCount) {
    const startIndex =
      maxCount !== undefined
        ? Math.max(this._end - maxCount, this._start)
        : this._start;
    for (let i = this._end - 1; i >= startIndex; i--) {
      const index = this._indexAt(i);
      const value = this._valueAt(i);
      if (predicate(index, value)) {
        return { index, value };
      }
    }
    return null;
  }

  each(callback) {
    for (let i = this._start; i < this._end; i++) {
      if (callback(this._indexAt(i), this._valueAt(i))) {
        break;
      }
    }
  }

  reduce(callback, initialValue) {
    let result = initialValue;
    for (let i = this._start; i < this._end; i++) {
      result = callback(result, this._indexAt(i), this._valueAt(i));
    }
    return result;
  }

  range(start, end) {
    const newList = new PlotList(
      this._plotFunctions,
      this._emptyValuePredicate
    );
    newList._items = this._items;
    newList._start = this._lowerBound(start, getIndex);
    newList._end = this._upperBound(end);
    newList._shareRead = true;
    return newList;
  }

  plottableRange(includeLastPoint) {
    const newList = new PlotList(
      this._plotFunctions,
      this._emptyValuePredicate
    );
    newList._items = this._items;
    newList._start = this._upperBound(UNPLOTTABLE_TIME_POINT_INDEX);
    newList._end = this._end;
    newList._shareRead = true;
    if (includeLastPoint && newList._start > this._start) {
      newList._start -= 1;
    }
    return newList;
  }

  rangeIterator(start, end) {
    const lower = this._lowerBound(start, getIndex);
    const upper = this._upperBound(end);
    if (lower === upper) {
      return {
        hasNext: () => false,
        next: () => {
          throw new Error("Invalid operation");
        },
      };
    }

    let current = lower - 1;
    return {
      hasNext: () => current < upper - 1,
      next: () => {
        current += 1;
        return this._items[current];
      },
    };
  }

  minMaxOnRangeCached(start, end, plotNames) {
    if (this.isEmpty()) {
      return null;
    }

    let result = null;
    for (const plotName of plotNames) {
      result = mergeMinMax(
        result,
        this._minMaxOnRangeCachedImpl(
          start - plotName.offset,
          end - plotName.offset,
          plotName.name
        )
      );
    }
    return result;
  }

  minMaxOnRange(start, end, plotName) {
    if (this.isEmpty()) {
      return null;
    }

    let result = null;
    for (const item of this._plotFunctions) {
      result = mergeMinMax(
        result,
        this._minMaxOnRange(start - item.offset, end - item.offset, item.name)
      );
    }
    return result;
  }

  merge(rows) {
    if (this._shareRead) {
      log.logDebug("merge: readonly collection modification attempt");
      return null;
    }

    if (rows.length === 0) {
      return null;
    }

    this._invalidateSearchCaches();
    this._minMaxCache.clear();

    if (this.isEmpty() || rows[rows.length - 1].index < this._items[0].index) {
      return this._prepend(rows);
    }

    if (rows[0].index > this._items[this._items.length - 1].index) {
      return this._append(rows);
    }

    if (
      rows.length === 1 &&
      rows[0].index === this._items[this._items.length - 1].index
    ) {
      this._updateLast(rows[0]);
      return rows[0];
    }

    return this._merge(rows);
  }

  addTail(rows, updateLastRow = false) {
    if (rows.length === 0) {
      return;
    }

    let startIndex = 0;
    if (updateLastRow && this._end - this._start > 0) {
      startIndex = 1;
      this._items[this._end - this._start - 1].value = rows[0].value;
    }

    for (let i = startIndex; i < rows.length; i++) {
      const newRow = rows[i];
      const lastIndex = this.lastIndex();
      if (lastIndex === null) {
        log.logError("Can't add tail to the empty plot list");
        break;
      }
      this.add(lastIndex + 1, newRow.value);
    }

    this._invalidateSearchCaches();
  }

  move(moves) {
    if (this._shareRead) {
      log.logDebug("move: readonly collection modification attempt");
      return;
    }

    if (moves.length === 0) {
      return;
    }

    const tempItems = this._items.slice();

    for (const move of moves) {
      const oldIndex = this._binarySearch(move.old, getIndex);
      if (oldIndex !== null && tempItems[oldIndex] !== undefined) {
        if (move.new === INVALID_TIME_POINT_INDEX) {
          tempItems[oldIndex] = undefined;
        } else {
          tempItems[oldIndex] = {
            index: move.new,
            value: tempItems[oldIndex].value,
          };

          const newIndex = this._binarySearch(move.new, getIndex);
          if (newIndex !== null) {
            const newEntry = tempItems[newIndex];
            if (newEntry !== undefined && newEntry.index === move.new) {
              tempItems[newIndex] = undefined;
            }
          }
        }
      }
    }

    this._items = tempItems
      .filter((item) => item !== undefined)
      .sort((a, b) => a.index - b.index);
    this._invalidateSearchCaches();
    this._minMaxCache.clear();
    this._start = 0;
    this._end = this._items.length;
  }

  remove(index) {
    if (this._shareRead) {
      log.logDebug("remove: readonly collection modification attempt");
      return null;
    }

    const foundIndex = this._nonCachedSearch(
      index,
      PlotRowSearchMode.NearestRight,
      getIndex
    );
    if (foundIndex === null) {
      return null;
    }

    const removedItems = this._items.splice(foundIndex);
    this._end = this._items.length;
    this._minMaxCache.clear();
    this._invalidateSearchCaches();
    return removedItems.length > 0 ? removedItems[0] : null;
  }

  state() {
    const data = this._items.slice(this._start, this._end);
    return {
      start: 0,
      end: data.length,
      data,
    };
  }

  restoreState(state) {
    if (state) {
      this._start = state.start;
      this._end = state.end;
      this._shareRead = false;
      this._items = state.data;
      this._minMaxCache.clear();
      this._invalidateSearchCaches();
    } else {
      this.clear();
    }
  }

  _indexAt(index) {
    return this._items[index].index;
  }

  _valueAt(index) {
    return this._items[index].value;
  }

  _length() {
    return this._items.length;
  }

  _searchImpl(value, mode, cache, cacheWithoutEmptyValues, getKey) {
    const cacheMap =
      mode === PlotRowSearchMode.Exact ? cache : cacheWithoutEmptyValues;
    const cacheKey =
      mode === PlotRowSearchMode.Exact
        ? value
        : 10000 * (mode + 1) + getKey(value);

    let cachedResult = cacheMap.get(value);
    if (cachedResult !== undefined) {
      const result = cachedResult.get(cacheKey);
      if (result !== undefined) {
        return result;
      }
    }

    const searchIndex = this._nonCachedSearch(value, mode, getKey);
    if (searchIndex === null) {
      return null;
    }

    const result = {
      index: this._indexAt(searchIndex),
      value: this._valueAt(searchIndex),
    };

    if (cachedResult === undefined) {
      cachedResult = new Map();
      cacheMap.set(value, cachedResult);
    }

    cachedResult.set(cacheKey, result);
    return result;
  }

  _nonCachedSearch(value, mode, getKey) {
    const lowerBound = this._lowerBound(value, getKey);
    const isValueEmpty =
      this._emptyValuePredicate !== undefined &&
      (lowerBound === this._end || value !== getKey(this._items[lowerBound]));
    if (isValueEmpty && mode !== PlotRowSearchMode.Exact) {
      switch (mode) {
        case PlotRowSearchMode.NearestLeft:
          return this._searchNearestLeft(lowerBound);
        case PlotRowSearchMode.NearestRight:
          return this._searchNearestRight(lowerBound);
        default:
          throw new TypeError("Unknown search mode");
      }
    }

    if (
      getKey !== undefined &&
      isValueEmpty &&
      mode === PlotRowSearchMode.Exact
    ) {
      return null;
    }

    if (isValueEmpty || mode === PlotRowSearchMode.Exact) {
      return lowerBound;
    }

    switch (mode) {
      case PlotRowSearchMode.NearestLeft:
        return this._nonEmptyNearestLeft(lowerBound, getKey);
      case PlotRowSearchMode.NearestRight:
        return this._nonEmptyNearestRight(lowerBound, getKey);
      default:
        throw new TypeError("Unknown search mode");
    }
  }

  _nonEmptyNearestRight(index, getKey) {
    const isEmpty = this._emptyValuePredicate;
    const value = getKey !== undefined ? getKey : getValue;

    while (index < this._end && isEmpty(this._valueAt(index), value)) {
      index += 1;
    }

    return index === this._end ? null : index;
  }

  _nonEmptyNearestLeft(index, getKey) {
    const isNotEmpty = this._emptyValuePredicate !== undefined;
    const value = getKey !== undefined ? getKey : getValue;

    while (index >= this._start && isNotEmpty(this._valueAt(index), value)) {
      index -= 1;
    }

    return index < this._start ? null : index;
  }

  _searchNearestLeft(index) {
    if (index === this._start) {
      return null;
    }
    return index - 1;
  }

  _searchNearestRight(index) {
    const result = index !== this._end ? index : null;
    return result;
  }

  _binarySearch(value, getKey) {
    const lowerBound = this._lowerBound(value, getKey);
    return lowerBound !== this._end && value === getKey(this._items[lowerBound])
      ? lowerBound
      : null;
  }

  _lowerBound(value, getKey) {
    return lowerbound(
      this._items,
      value,
      (item, key) => getKey(item) < key,
      this._start,
      this._end
    );
  }

  _upperBound(value) {
    return upperbound(
      this._items,
      value,
      (item, key) => item.index > key,
      this._start,
      this._end
    );
  }

  _plotMinMax(start, end, plotName) {
    let result = null;
    const plotFunction = this._plotFunctions.get(plotName);
    if (plotFunction === undefined) {
      throw new Error(`Plot "${plotName}" is not registered`);
    }

    for (let i = start; i < end; i++) {
      const value = plotFunction(this._valueAt(i));
      if (value !== null && !Number.isNaN(value)) {
        if (result === null) {
          result = {
            min: value,
            max: value,
          };
        } else {
          result.min = Math.min(result.min, value);
          result.max = Math.max(result.max, value);
        }
      }
    }

    return result;
  }

  _invalidateCacheForRow(row) {
    const cacheIndex = Math.floor(row.index / CACHE_SIZE);
    this._minMaxCache.forEach((cache) => cache.delete(cacheIndex));
  }

  _prepend(rows) {
    assert(!this._shareRead, "collection should not be readonly");
    assert(rows.length !== 0, "plotRows should not be empty");

    this._invalidateSearchCaches();
    this._minMaxCache.clear();

    this._items = rows.concat(this._items);
    this._start = 0;
    this._end = this._items.length;

    return rows[0];
  }

  _append(rows) {
    assert(!this._shareRead, "collection should not be readonly");
    assert(rows.length !== 0, "plotRows should not be empty");

    this._invalidateSearchCaches();
    this._minMaxCache.clear();

    this._items = this._items.concat(rows);
    this._start = 0;
    this._end = this._items.length;

    return rows[0];
  }

  _updateLast(row) {
    assert(!this.isEmpty(), "plot list should not be empty");

    const lastRow = this._items[this._end - 1];
    assert(
      lastRow.index === row.index,
      "last row index should match new row index"
    );

    this._invalidateCacheForRow(row);
    this._invalidateSearchCaches();
    this._items[this._end - 1] = row;
  }

  _merge(rows) {
    assert(!this._shareRead, "collection should not be readonly");
    assert(rows.length !== 0, "plotRows should not be empty");

    this._invalidateSearchCaches();
    this._minMaxCache.clear();

    const prependIndex = this._binarySearch(rows[0].index, getIndex);
    const appendIndex = this._binarySearch(
      rows[rows.length - 1].index,
      getIndex
    );
    const prependCount = prependIndex !== null ? prependIndex - this._start : 0;
    const appendCount = appendIndex !== null ? this._end - appendIndex : 0;

    this._items.splice(
      prependIndex !== null ? prependIndex : 0,
      prependCount,
      ...rows
    );
    if (prependCount < rows.length && appendCount > 0) {
      this._items.splice(prependCount + rows.length, appendCount);
    }

    this._start = 0;
    this._end = this._items.length;

    return rows[0];
  }

  _invalidateSearchCaches() {
    this._rowSearchCacheByIndex.clear();
    this._rowSearchCacheByIndexWithoutEmptyValues.clear();
    this._rowSearchCacheByTime.clear();
    this._rowSearchCacheByTimeWithoutEmptyValues.clear();
  }

  _minMaxOnRangeCachedImpl(start, end, plotName) {
    const minMaxCache = this._minMaxCache.get(plotName);
    if (minMaxCache !== undefined) {
      const minMax = minMaxCache.get(start);
      if (minMax !== undefined) {
        return minMax;
      }
    }

    const minMax = this._plotMinMax(start, end, plotName);

    if (minMaxCache === undefined) {
      const newCache = new Map();
      newCache.set(start, minMax);
      this._minMaxCache.set(plotName, newCache);
    } else {
      minMaxCache.set(start, minMax);
    }

    return minMax;
  }
}

function mergeMinMax(e, t) {
  if (null === e) return t;
  if (null === t) return e;
  return {
    min: Math.min(e.min, t.min),
    max: Math.max(e.max, t.max),
  };
}

function mergePlotRows(e, t) {
  const i = (function (e, t) {
      const i = e.length,
        s = t.length;
      let r = i + s,
        n = 0,
        o = 0;
      for (; n < i && o < s; )
        e[n].index < t[o].index
          ? n++
          : e[n].index > t[o].index
          ? o++
          : (n++, o++, r--);
      return r;
    })(e, t),
    s = new Array(i);
  let r = 0,
    n = 0;
  const o = e.length,
    a = t.length;
  let l = 0;
  for (; r < o && n < a; )
    e[r].index < t[n].index
      ? ((s[l] = e[r]), r++)
      : e[r].index > t[n].index
      ? ((s[l] = t[n]), n++)
      : ((s[l] = t[n]), r++, n++),
      l++;
  for (; r < o; ) (s[l] = e[r]), r++, l++;
  for (; n < a; ) (s[l] = t[n]), n++, l++;
  return s;
}

export default PlotList;
