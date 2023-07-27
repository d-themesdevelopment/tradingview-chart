


function createDeferredPromise() {
    let e, t;
    return {
        promise: new Promise(((i, s) => {
            e = i, t = s
        })),
        reject: t,
        resolve: e
    }
  }