import {WatchedValue} from "./58275.js";

            const DEFAULT_STATUS_COLOR = "#9598a1",
                DEFAULT_STATUS_VISIBLE = !1,
                DEFAULT_STATUS_TOOLTIP = null,
                DEFAULT_STATUS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"></svg>';
            class CustomStatus {
                constructor(e) {
                    this._visible = new WatchedValue(DEFAULT_STATUS_VISIBLE), this._tooltip = new WatchedValue(DEFAULT_STATUS_TOOLTIP), this._icon = new WatchedValue(DEFAULT_STATUS_ICON), this._color = new WatchedValue(DEFAULT_STATUS_COLOR), this._tooltipContent = new WatchedValue(null), this._symbol = e
                }
                symbol() {
                    return this._symbol
                }
                tooltip() {
                    return this._tooltip
                }
                icon() {
                    return this._icon
                }
                color() {
                    return this._color
                }
                visible() {
                    return this._visible
                }
                tooltipContent() {
                    return this._tooltipContent
                }
            }
            class CustomStatusModel {
                constructor() {
                    this._symbolCustomStatuses = new Map
                }
                getSymbolCustomStatus(e) {
                    if (this._symbolCustomStatuses.has(e)) return this._symbolCustomStatuses.get(e);
                    const t = new CustomStatus(e);
                    return this._symbolCustomStatuses.set(e, t), t
                }
                hideAll() {
                    for (const e of this._symbolCustomStatuses.values()) e.visible().setValue(!1)
                }
                static getInstance() {
                    return null === this._instance && (this._instance = new CustomStatusModel), this._instance
                }
            }
            CustomStatusModel._instance = null
        