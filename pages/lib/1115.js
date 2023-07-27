const { isObject, hasProperty, assert } = require("30551");
const { ensureNotNull } = require("./assertions");

function ensureTimePointIndex(e) {
  if (e < 0) {
    throw new Error("TimePointIndexIndex should be a non-negative integer");
  }
  return e;
}

async function unpackNonSeriesData(e) {
  if (e === "") {
    return null;
  }

  const t = JSON.parse(e);

  if (!isObject(t) || typeof t === "function") {
    throw new Error("Non-object content in the non-series envelope");
  }

  if (hasProperty(t, "indexes_replace")) {
    return {
      indexes_replace: true,
    };
  }

  const i = {
    indexes_replace: false,
  };

  if (hasProperty(t, "offsets")) {
    i.offsets = t.offsets;
  }

  if (hasProperty(t, "isUpdate")) {
    if (typeof t.isUpdate !== "boolean") {
      throw new Error('Invalid type of "isUpdate" field');
    }
    i.isUpdate = t.isUpdate;
  }

  if (hasProperty(t, "data")) {
    i.data = t.data;
  }

  if (hasProperty(t, "graphicsCmds")) {
    i.graphicsCmds = (function (e) {
      if (!isObject(e)) {
        throw new Error("Graphics commands should be wrapped in an object");
      }

      if (hasProperty(e, "create") && hasProperty(e, "erase")) {
        const t = e.erase;
        assert(
          Array.isArray(t),
          "Collection of erase commands should be an array"
        );

        for (const e of t) {
          if (!isObject(e) || !hasProperty(e, "action")) {
            throw new Error(
              'Command should be an object with "action" property'
            );
          }
          assert(
            e.action === "all" || e.action === "one",
            'Erase command action should be "all" or "one"'
          );
        }
      }

      return e;
    })(t.graphicsCmds);
  }

  return i;
}

export { ensureTimePointIndex, unpackNonSeriesData };
