export const PlDisplay = {
    Money: 0,
    Pips: 1,
    Percentage: 2
  };
  
  export const TradedGroupHorizontalAlignment = {
    Left: 0,
    Center: 1,
    Right: 2
  };
  
  export const tradingPreferencesDefault = {
    showPositions: false,
    positionPL: {
      visibility: false,
      display: PlDisplay.Money
    },
    bracketsPL: {
      visibility: false,
      display: PlDisplay.Money
    },
    showOrders: false,
    showExecutions: false,
    showExecutionsLabels: false,
    showReverse: false,
    extendLeft: false,
    lineLength: 0,
    horizontalAlignment: TradedGroupHorizontalAlignment.Right,
    lineWidth: 0,
    lineStyle: 0
  };
  
  export const CustomSourceLayer = {
    Background: 0,
    Foreground: 1,
    Topmost: 2
  };
  
  