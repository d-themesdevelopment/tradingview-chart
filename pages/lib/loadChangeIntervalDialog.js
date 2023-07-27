"use strict";

function loadChangeIntervalDialog() {
  return Promise.all([
    import(/* webpackChunkName: "chunk-name" */ "module-1"),
    import(/* webpackChunkName: "chunk-name" */ "module-2"),
    import(/* webpackChunkName: "chunk-name" */ "module-3"),
    import(/* webpackChunkName: "chunk-name" */ "module-4"),
    import(/* webpackChunkName: "chunk-name" */ "module-5"),
    import(/* webpackChunkName: "chunk-name" */ "module-6"),
    import(/* webpackChunkName: "chunk-name" */ "module-7")
  ]).then((result) => result[0]);
}
