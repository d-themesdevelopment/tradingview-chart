export function errorToString(e) {
    if (void 0 === e) return "";
    if (e instanceof Error) {
        let t = e.message;
        return e.stack && (t += " " + e.stack), t;
    }
    return "string" == typeof e ? e.toString() : JSON.stringify(e);
}