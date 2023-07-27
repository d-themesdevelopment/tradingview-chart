import { LineToolPriceAxisView } from './LineToolPriceAxisView.js'; // Replace './path/to/line-tool-price-axis-view' with the correct import path

class PositionAveragePriceAxisView extends LineToolPriceAxisView {
    _formatPrice(price, fractionDigits) {
        return this._source.formatter().format(price);
    }
}

// Export the PositionAveragePriceAxisView class
export default PositionAveragePriceAxisView;
