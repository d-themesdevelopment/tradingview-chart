
export function isCFDSymbol(symbolType, symbolCategory) {
    return (symbolCategory?.includes("cfd") && ["commodity", "futures", "index", "stock", "fund"].includes(symbolType)) || symbolType === "cfd";
}
