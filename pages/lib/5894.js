function showSymbolInfoDialog(symbol, options) {
    Promise.all([
      import(/* webpackChunkName: "chunk1" */ './module1'),
      import(/* webpackChunkName: "chunk2" */ './module2'),
      import(/* webpackChunkName: "chunk3" */ './module3'),
      import(/* webpackChunkName: "chunk4" */ './module4'),
      import(/* webpackChunkName: "chunk5" */ './module5'),
      import(/* webpackChunkName: "chunk6" */ './module6')
    ]).then((modules) => {
      const dialogModule = modules[0];
      dialogModule.showSymbolInfoDialog(symbol != null ? symbol : null, options);
    });
  }
  
  export { showSymbolInfoDialog };
  