import { hasEodSymbols } from './79982.js'; // Replace './path/to/symbols' with the correct import path

const excludedIndexExchanges = ["DJ", "JSE", "BELEX"];
const excludedFuturesExchanges = ["NZX"];

// Function to check if the exchange is the first replaced by Bats
function firstReplacedByBatsExchange(exchange) {
    return null;
}

// Function to check if the symbol is an EOD (End of Day) symbol
function isEod(symbol, exchangeType) {
    return hasEodSymbols(symbol.full_name) || exchangeType === 6;
}

// Function to check if the symbol is of type 'yield'
function isYield(symbol) {
    return symbol.typespecs?.includes("yield") ?? false;
}

// Function to check if the symbol has delay
function isDelay(delay) {
    return typeof delay !== "undefined" && delay > 0;
}

// Function to check if the symbol should be without realtime data
function witoutRealtime(symbol) {
    return (symbol.type === "index" && excludedIndexExchanges.includes(symbol.listed_exchange)) ||
           (symbol.type === "futures" && excludedFuturesExchanges.includes(symbol.listed_exchange));
}

// Asynchronous function to get the exchange
async function getExchange(exchange) {
    return null;
}

// Export the functions
export {
    firstReplacedByBatsExchange,
    getExchange,
    isDelay,
    isEod,
    isYield,
    witoutRealtime
};
