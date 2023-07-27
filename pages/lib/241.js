import { HEADER_TOOLBAR_HEIGHT_EXPANDED } from "./69774";

export function getFavoriteDrawingToolbarPromise() {
  return favoriteDrawingToolbarPromise;
}

export function createFavoriteDrawingToolbar() {
  if (!favoriteDrawingToolbarPromise) {
    //    null === n && (n = Promise.all([i.e(5652), i.e(2666), i.e(3842), i.e(6), i.e(5993), i.e(5649), i.e(2191), i.e(8056), i.e(3502), i.e(6752), i.e(8149), i.e(6639), i.e(9327), i.e(6106), i.e(9916), i.e(1109), i.e(6831), i.e(8049), i.e(962), i.e(3179), i.e(5050), i.e(1890), i.e(5007), i.e(5899), i.e(2306)]).then(i.bind(i, 9629)).then((({

    favoriteDrawingToolbarPromise = Promise.all([
      import(/* webpackChunkName: "chunk1" */ "module1"),
      import(/* webpackChunkName: "chunk2" */ "module2"),
      import(/* webpackChunkName: "chunk3" */ "module3"),
      // ... more imports ...
    ]).then(({ FavoriteDrawingToolbar }) => {
      favoriteDrawingToolbarInstance = new FavoriteDrawingToolbar({
        left: window.innerWidth / 2,
        top: HEADER_TOOLBAR_HEIGHT_EXPANDED + 61,
      });
      return favoriteDrawingToolbarInstance;
    });
  }

  return favoriteDrawingToolbarPromise;
}
