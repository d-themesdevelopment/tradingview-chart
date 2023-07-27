
import { Std } from 74649;

class ChartStyleStudyBuilder {
  main(data) {
    const open = data.new_var(Std.open(data));
    const close = data.new_var(Std.close(data));
    const prevOpen = open.get(1);
    const prevClose = close.get(1);
    const ohlc4 = Std.ohlc4(data);

    const average = Std.na(prevOpen) ? (Std.open(data) + Std.close(data)) / 2 : (prevOpen + prevClose) / 2;
    open.set(average);
    close.set(ohlc4);

    const high = Std.max(Std.high(data), Std.max(average, ohlc4));
    const low = Std.min(Std.low(data), Std.min(average, ohlc4));
    const volume = Std.volume(data);

    const symbol = data.symbol;
    return [symbol.time, average, high, low, ohlc4, volume, symbol.updatetime, symbol.isBarClosed];
  }
}


function getChartStyleStudy(builderType) {
    if (builderType.startsWith("BarSetHeikenAshi@tv-basicstudies-")) {
      return new ChartStyleStudyBuilder();
    }
  
    const errorMessage = `Unknown builder type: ${builderType}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  export { getChartStyleStudy };