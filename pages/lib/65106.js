export function getSymbolSearchCompleteOverrideFunction() {
    return symbol => {
      return Promise.resolve({
        symbol: symbol,
        name: symbol
      });
    };
  }
  
  let symbolSearchCompleteOverrideFunction = getSymbolSearchCompleteOverrideFunction();
  
  export function setSymbolSearchCompleteOverrideFunction(func) {
    symbolSearchCompleteOverrideFunction = func;
  }