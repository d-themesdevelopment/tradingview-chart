// Define a function to set classes for TradingView
function setTradingViewClasses() {
    "use strict";
    window.TradingView = window.TradingView || {};

    // Function to require all modules from the provided module context
    window.requireAll = function (context) {
        return context.keys().map(context);
    };

    // Call the setClasses function from module with ID 32563
    require(32563).setClasses();

    // Install the module with ID 56186
    require(56186).install();

    // Load other modules
    require(95374);
    require(49483);
    require(1722);
    require(42053);
    require(11417);
    require(54358);
    require(56696);
    require(56840);
}

// Call the setTradingViewClasses function to execute the code
setTradingViewClasses();
