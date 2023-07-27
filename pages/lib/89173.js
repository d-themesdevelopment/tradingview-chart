


const TradingViewPro = () => {
    "use strict";
    function TradingViewPro() {
        this.hasPackage = function () {
            return false;
        };
    }
    window.user = {
        is_pro: false,
        settings: {},
    };
    TradingViewPro.prototype.isPaidPro = function () {
        return false;
    };
    TradingViewPro.prototype.isSupportAvailable = function () {
        return false;
    };
    TradingViewPro.prototype.getProduct = function () {
        return {};
    };
    TradingViewPro.prototype.getStudiesOrder = function () {
        return [];
    };

    return new TradingViewPro();
};