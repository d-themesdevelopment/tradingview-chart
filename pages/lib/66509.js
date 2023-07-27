(e, t, i) => {
    "use strict";
    var s = i(57898);
    i(5001);
    var r = i(36298).TranslatedString,
        n = i(50151),
        o = n.assert,
        a = n.ensureDefined,
        l = i(76544).Series,
        c = i(14483),
        h = i(77212).ActionBinder,
        d = i(56840).setValue,
        u = i(14787).TabNames,
        p = i(64358).showGoToDateDialog,
        _ = i(68335),
        m = i(4741),
        g = i(8708).Study,
        f = i(52329).StudyStub,
        v = i(28853).isStudy,
        S = i(13087).LineDataSource,
        y = i(18341),
        b = y.isLineTool,
        w = y.isStudyLineTool,
        P = i(72877).STUDYPLOTDISPLAYTARGET,
        C = i(39347).Action,
        x = i(95059).ACTION_ID,
        T = i(88348),
        I = i(36274).Interval,
        M = i(42960),
        A = M.getDefaultStyle,
        L = M.hasVolume,
        k = i(5894).showSymbolInfoDialog,
        E = i(91280).InvalidationMask,
        D = i(82992).linking,
        V = i(54270).showChangeIntervalDialogAsync,
        B = i(82723).showDialog,
        R = i(38618),
        N = R.availableTimezones,
        O = R.timezoneIsAvailable,
        F = i(90995).toggleHideMode,
        W = i(42856).StudyMetaInfo,
        z = i(51768).trackEvent,
        H = i(38325).lastMouseOrTouchEventInfo,
        U = i(85804);
    const {
        viewportChangeEvent: j
    } = i(28558), {
        SelectPointMode: G
    } = i(88348), {
        ReplayStatus: q
    } = i(99652);
    var $ = i(59224).getLogger("ChartWidget", {
            color: "#606"
        }),
        Y = i(53180).appendEllipsis,
        K = i(19334).addPerfMark,
        Z = i(49152).combineProperty,
        X = i(62417).ChartWidgetBase,
        J = i(49483).CheckMobile.any(),
        Q = i(17133).TIMEFRAMETYPE,
        ee = i(51608).createDeferredPromise,
        te = i(11095).addPlusButtonProperty;
    const ie = c.enabled("show_average_close_price_line_and_label");
    var se = new r("change timezone", i(44352).t(null, void 0, i(20505))),
        re = new r("scale price chart only", i(44352).t(null, void 0, i(99042))),
        ne = new r("stay in drawing mode", i(44352).t(null, void 0, i(52010))),
        oe = (new r("hide all drawing tools", i(44352).t(null, void 0, i(54781))), new r("hide marks on bars", i(44352).t(null, void 0, i(44974)))),
        ae = new r("change symbol last value visibility", i(44352).t(null, void 0, i(53150))),
        le = (new r("change symbol previous close value visibility", i(44352).t(null, void 0, i(12707))), new r("change previous close price line visibility", i(44352).t(null, void 0, i(59883))), new r("change symbol labels visibility", i(44352).t(null, void 0, i(9402)))),
        ce = new r("change indicators name labels visibility", i(44352).t(null, void 0, i(87027))),
        he = new r("change indicators value labels visibility", i(44352).t(null, void 0, i(14922))),
        de = (new r("change bid and ask labels visibility", i(44352).t(null, void 0, i(5100))), new r("change bid and ask lines visibility", i(44352).t(null, void 0, i(32311))), new r("change pre/post market price label visibility", i(44352).t(null, void 0, i(49889))), new r("change pre/post market price line visibility", i(44352).t(null, void 0, i(16750))),
            new r("change high and low price lines visibility", i(44352).t(null, void 0, i(92556)))),
        ue = new r("change high and low price labels visibility", i(44352).t(null, void 0, i(66805))),
        pe = new r("change average close price line visibility", i(44352).t(null, void 0, i(98866))),
        _e = new r("change average close price label visibility", i(44352).t(null, void 0, i(39402))),
        me = new r("change countdown to bar close visibility", i(44352).t(null, void 0, i(58108))),
        ge = new r("change plus button visibility", i(44352).t(null, void 0, i(50190))),
        fe = new r("change price line visibility", i(44352).t(null, void 0, i(67761))),
        ve = new r("unlock {title}", i(44352).t(null, void 0, i(92421))),
        Se = new r("lock {title}", i(44352).t(null, void 0, i(50193))),
        ye = new r("change session breaks visibility", i(44352).t(null, void 0, i(15403))),
        be = i(44352).t(null, void 0, i(15241)),
        we = i(44352).t(null, void 0, i(29404)),
        Pe = i(44352).t(null, void 0, i(44302)),
        Ce = i(44352).t(null, void 0, i(94338));
    e.exports.ChartWidget = class extends X {
        constructor(e, t, i) {
            super(e, t, i), this._options.timeScaleWidget && (this._options.timeScaleWidget.pressedMouseMoveScale = this._options.handleScale.axisPressedMouseMove.time);
            var r = this,
                n = this._options.content,
                o = this._options.readOnly;
            this._removeMaximizeHotkey = null, r._hotkeys = m.createGroup({
                desc: "Chart actions",
                isDisabled: function() {
                    return !r._isActive
                }
            });
            var a = this._options.containsData,
                l = this._options.onWidget,
                c = this._options.onCmeWidget;
            c && $.logWarn("[ChartWidget] 'onCmeWidget' option is depricated");
            var h = this._options.widgetCustomer,
                d = this._options.timezone,
                u = this._options.hideSymbolSearch,
                p = this._options.defSymbol,
                _ = I.isValid(this._options.defInterval) ? this._options.defInterval : void 0,
                g = parseInt(this._options.defStyle),
                f = M.isValidStyle(g) ? g : void 0,
                v = this._options.defSessionId,
                S = void 0 !== this._options.defTimeframe ? "string" == typeof this._options.defTimeframe ? {
                    value: this._options.defTimeframe.toUpperCase(),
                    type: Q.PeriodBack
                } : {
                    ...this._options.defTimeframe,
                    type: Q.TimeRange
                } : void 0;
            this._content = n, this._initialLoading = this._options.initialLoading, this._readOnly = o, this._containsData = a, this._defSymbol = p, this._defInterval = _, this._defTimeframe = S, this._defStyle = f, this._onWidget = !!l, this._compareSymbols = this._options.compareSymbols, this._onWidget && (c ? this._widgetCustomer = "cme" : h && (this._widgetCustomer = h)), this._hideSymbolSearch = u, this._frameTime = 30, this._model = null, this._metaInfo = {}, this._drawRafId = 0, this._compareDialog = this._chartWidgetCollection.getCompareDialogRenderer();
            var y = this._contentSeriesProperties();
            y && (p = y.symbol, _ = y.interval), void 0 === this._options.useUserChartPreferences && (this._options.useUserChartPreferences = !0);
            var b = "chartproperties.mainSeriesProperties",
                w = this._options.useUserChartPreferences ? U.defaults(b) : U.factoryDefaults(b);
            this._properties.mainSeriesProperties.merge(w), this._properties.mainSeriesProperties.hasChild("esdBreaksStyle") && this._properties.mainSeriesProperties.removeProperty("esdBreaksStyle"), _ = _ || w.interval || "D", M.isValidStyle(f) || (f = M.isValidStyle(w.style) ? w.style : A(I.isRange(_))), this._properties.mainSeriesProperties.merge({
                visible: !0,
                symbol: p || DEFAULT_SYMBOL,
                shortName: "",
                timeframe: "",
                onWidget: this._onWidget,
                interval: _,
                currencyId: null,
                unitId: null,
                style: f,
                sessionId: v
            }), this._symbolWV.setValue(this.getSymbol()), this._resolutionWV.setValue(this.getResolution()), this._containsData && this._properties.mainSeriesProperties.merge({
                showCountdown: !1
            }), d && O(d) && this._properties.timezone.setValue(d), this._tagsChanged = new s, this._timingsMeter = null, this._isActive = this._options.isActive, this._options.container.subscribe((function(e) {
                r._setElement(e)
            }), {
                callWithLast: !0
            });
            var P = function() {
                r.resize()
            };
            this._options.width.subscribe(P), this._options.height.subscribe(P), this._options.visible.subscribe(this._updateTimingsMeterState.bind(this)), this._aboutToBeDestroyed = new s, this._actions = null, this._definitionsViewModel = null, this._backgroundTopColorSpawn = null, this._backgroundBottomColorSpawn = null, this._hintDefferedPromise = null, this._activeHint = null
        }
        isInitialized() {
            return Boolean(this._inited)
        }
        compareSymbols() {
            return this._compareSymbols
        }
        async _getChartPropertyDefinitionsViewModel() {
            if (null === this._definitionsViewModel) {
                const {
                    ChartPropertyDefinitionsViewModel: e
                } = await Promise.all([i.e(6196), i.e(4053), i.e(5871), i.e(3986), i.e(3596)]).then(i.bind(i, 73023));
                if (this._isDestroyed) throw new Error("Chart widget already destroyed");
                await new Promise((e => this.withModel(null, e))), null === this._definitionsViewModel && (this._definitionsViewModel = new e(this.model(), this.properties(), this._options))
            }
            return this._definitionsViewModel
        }
        _initMaximizeHotkey(e) {
            var t = this;

            function i(e) {
                e.defaultPrevented || _.modifiersFromEvent(e) === _.Modifiers.Alt && e.stopPropagation()
            }

            function s(e) {
                e.defaultPrevented || _.modifiersFromEvent(e) === _.Modifiers.Alt && (e.preventDefault(), e.stopPropagation(), t.toggleFullscreen())
            }
            return e.addEventListener("mousedown", i, !0), e.addEventListener("click", s, !0),
                function() {
                    e.removeEventListener("mousedown", i, !0), e.removeEventListener("click", s, !0)
                }
        }
        toggleFullscreen() {
            var e = this.getResizerDetacher();
            e.fullscreenable.value() && (e.fullscreen.value() ? e.exitFullscreen() : e.requestFullscreen())
        }
        _beginRequestActive() {
            var e = this._chartWidgetCollection.activeChartWidget.value() !== this;
            if (this._chartWidgetCollection.activeChartWidget.setValue(this), e) {
                const e = H();
                e.isTouch && !e.stylus && this._isLineToolModeExceptBrush() && this.updateCrossHairPositionIfNeeded(), this._justActivated = !0
            }
        }
        _endRequestActive() {
            var e = this;
            this._justActivated && setTimeout((function() {
                e._justActivated = !1
            }), 0)
        }
        _requestActive() {
            this._beginRequestActive(), this._endRequestActive()
        }
        justActivated() {
            return this._justActivated
        }
        setTimezone(e) {
            e && O(e) ? this._properties.timezone.setValue(e) : console.warn("Incorrect timezone: " + JSON.stringify(e))
        }
        getTimezone() {
            return this._properties.timezone.value()
        }
        refreshMarks() {
            this.model().barsMarksSources().forEach((function(e) {
                e.refreshData()
            }))
        }
        clearMarks(e) {
            this.model().barsMarksSources().forEach((function(t) {
                t.clearMarks(e)
            }))
        }
        metaInfoRepository() {
            return this._metaInfoRepository
        }
        _initBackgroundColor() {
            null === this._backgroundTopColorSpawn && (this._backgroundTopColorSpawn = this._model.model().backgroundTopColor().spawn(), this._backgroundTopColorSpawn.subscribe(this._onBackgroundColorChanged.bind(this))), null === this._backgroundBottomColorSpawn && (this._backgroundBottomColorSpawn = this._model.model().backgroundColor().spawn(), this._backgroundBottomColorSpawn.subscribe(this._onBackgroundColorChanged.bind(this)))
        }
        paneWidgets() {
            return this._paneWidgets
        }
        paneByCanvas(e) {
            for (var t = 0; t < this._paneWidgets.length; t++)
                if (this._paneWidgets[t].hasCanvas(e)) return this._paneWidgets[t];
            return null
        }
        paneByState(e) {
            for (var t = 0; t < this._paneWidgets.length; t++)
                if (this._paneWidgets[t].state() === e) return this._paneWidgets[t];
            return null
        }
        timeAxisByCanvas(e) {
            return this._timeAxisWidget.hasCanvas(e) ? this._timeAxisWidget : null
        }
        properties() {
            return this._properties
        }
        readOnly() {
            return this._readOnly
        }
        modelCreated() {
            return this._modelCreated
        }
        updateActions() {
            for (var e = this.actions(), t = this._model.dataSources(), s = !1, r = !1, n = 0, o = t.length; n < o; n++) {
                var a = t[n];
                TradingView.isInherited(a.constructor, S) && a.isUserDeletable() && (s = !0), TradingView.isInherited(a.constructor, g) && a.removeByRemoveAllStudies() && (r = !0), TradingView.isInherited(a.constructor, f) && (r = !0)
            }
            this._readOnly || (e.paneRemoveAllStudies && e.paneRemoveAllStudies.update({
                disabled: !r
            }), e.paneRemoveAllDrawingTools && e.paneRemoveAllDrawingTools.update({
                disabled: !s
            }), e.paneRemoveAllStudiesDrawingTools && e.paneRemoveAllStudiesDrawingTools.update({
                disabled: !r && !s
            }));
            var l = this,
                c = [],
                h = function(e) {
                    return e.id === l.model().model().properties().timezone.value()
                };
            N.forEach((function(e) {
                if (!e.separator) {
                    var t = new C({
                        actionId: x.ChartChangeTimeZone,
                        label: e.title,
                        checkable: !0,
                        checked: h(e),
                        statName: "SetTimeZone",
                        onExecute: function() {
                            l.model().setProperty(l.model().model().properties().timezone, e.id, se)
                        }
                    });
                    c.push(t)
                }
            }), this), e.applyTimeZone.update({
                subItems: c
            }), e.addToWatchlist && (e.addToWatchlist.request(), e.addToWatchlist.updateLabel(this.getSymbol(!0))), e.addToTextNotes && e.addToTextNotes.update({
                label: i(44352).t(null, void 0, i(34810)).format({
                    symbol: this.getSymbol(!0)
                })
            })
        }
        actions() {
            return null === this._actions && this._setActions(), this._actions
        }
        _setActions() {
            this._actions && this._actions.addToWatchlist && (this._actions.addToWatchlist.destroy(), delete this._actions.addToWatchlist);
            var e = this;
            this._hotkeys.add({
                desc: "Maximize",
                hotkey: m.Modifiers.Alt + 13,
                handler: function() {
                    e.toggleFullscreen()
                },
                isDisabled: function() {
                    return !e._options.fullscreenable.value()
                }
            }), this._hotkeys.add({
                desc: "Cancel selection",
                hotkey: 27,
                handler: function() {
                    0 === e.selectPointMode().value() ? e._model.selectionMacro((function(t) {
                        e._cancelCreatingLine(), t.clearSelection()
                    })) : e.cancelRequestSelectPoint()
                },
                isDisabled: function() {
                    var t = 0 === e._model.selection().allSources().length,
                        i = null === e._model.crossHairSource().measurePane().value(),
                        s = 0 === e.selectPointMode().value(),
                        r = t && i && s;
                    return !e._model || r
                }
            }), e.withModel(null, (function() {
                var t = function() {
                    e._hotkeys.promote()
                };
                e._model.onSelectedSourceChanged().subscribe(null, t),
                    e._model.crossHairSource().measurePane().subscribe((e => {
                        null !== e && t()
                    }))
            }));
            var t = new C({
                    actionId: x.ChartScalesReset,
                    label: i(44352).t(null, void 0, i(34301)),
                    icon: i(39267),
                    statName: "ResetChart",
                    onExecute: this.GUIResetScales.bind(this),
                    hotkeyGroup: this._hotkeys,
                    hotkeyHash: m.Modifiers.Alt + 82
                }),
                s = new C({
                    actionId: x.ChartSeriesPriceScaleToggleInvertPriceScale,
                    label: i(44352).t(null, void 0, i(53239)),
                    statName: "Invert Scale",
                    checkable: !0,
                    onExecute: function() {
                        e._model.invertPriceScale(e._model.mainSeries().priceScale())
                    },
                    hotkeyGroup: this._hotkeys,
                    hotkeyHash: m.Modifiers.Alt + 73
                }),
                r = new C({
                    actionId: x.ChartSeriesPriceScaleToggleAutoScale,
                    label: i(44352).t(null, void 0, i(50834)),
                    checkable: !0,
                    onExecute: function() {
                        var t = e._model.mainSeries().priceScale();
                        e._model.togglePriceScaleAutoScaleMode(t), r.update({
                            checked: t.isAutoScale()
                        })
                    }
                }),
                n = new C({
                    actionId: x.ChartScalesToggleLockPriceToBarRatio,
                    label: i(44352).t(null, void 0, i(18219)),
                    checkable: !0,
                    statName: "ToggleLockScale",
                    onExecute: function() {
                        e._model.togglePriceScaleLockScaleMode(e._model.mainSeries().priceScale())
                    }
                }),
                o = new C({
                    actionId: x.ChartSeriesPriceScaleToggleRegular,
                    label: i(44352).t(null, {
                        context: "scale_menu"
                    }, i(72116)),
                    checkable: !0,
                    statName: "ToggleRegularScale",
                    onExecute: function() {
                        var t = e._model.mainSeries().priceScale();
                        e._model.setPriceScaleRegularScaleMode(t), o.update({
                            checked: t.isRegular()
                        })
                    }
                }),
                a = new C({
                    actionId: x.ChartSeriesPriceScaleTogglePercentage,
                    label: i(44352).t(null, void 0, i(51102)),
                    checkable: !0,
                    statName: "TogglePercantage",
                    onExecute: function() {
                        e._model.togglePriceScalePercentageScaleMode(e._model.mainSeries().priceScale())
                    },
                    hotkeyGroup: this._hotkeys,
                    hotkeyHash: m.Modifiers.Alt + 80
                }),
                l = new C({
                    actionId: x.ChartSeriesPriceScaleToggleIndexedTo100,
                    label: i(44352).t(null, void 0, i(20062)),
                    checkable: !0,
                    statName: "ToggleIndexedTo100",
                    onExecute: function() {
                        e._model.togglePriceScaleIndexedTo100ScaleMode(e._model.mainSeries().priceScale())
                    }
                }),
                g = new C({
                    actionId: x.ChartSeriesPriceScaleToggleLogarithmic,
                    label: i(44352).t(null, void 0, i(12285)),
                    statName: "ToggleLogScale",
                    checkable: !0,
                    onExecute: function() {
                        e._model.togglePriceScaleLogScaleMode(e._model.mainSeries().priceScale())
                    },
                    hotkeyGroup: this._hotkeys,
                    hotkeyHash: m.Modifiers.Alt + 76
                }),
                f = new C({
                    actionId: x.ChartUndo,
                    label: i(44352).t(null, void 0, i(81320)),
                    onExecute: function() {
                        z("GUI", "Undo"), e._model.undoHistory().undo()
                    },
                    disabled: !0,
                    hotkeyGroup: this._hotkeys,
                    hotkeyHash: m.Modifiers.Mod + 90
                }),
                v = new C({
                    actionId: x.ChartRedo,
                    label: i(44352).t(null, void 0, i(41615)),
                    onExecute: function() {
                        z("GUI", "Redo"), e._model.undoHistory().redo()
                    },
                    disabled: !0,
                    hotkeyGroup: this._hotkeys,
                    hotkeyHash: m.Modifiers.Mod + 89
                });
            e.withModel(null, (function() {
                e._model.undoHistory().undoStack().onChange().subscribe(e, e.updateUndoRedo), e._model.undoHistory().redoStack().onChange().subscribe(e, e.updateUndoRedo)
            }));
            var S = new C({
                    actionId: x.ChartChangeTimeZone,
                    label: i(44352).t(null, void 0, i(64375)),
                    statName: "TimeZone"
                }),
                y = new C({
                    actionId: x.ChartDialogsShowChangeSymbol,
                    label: Y(i(44352).t(null, void 0, i(28089))),
                    statName: "ChangeSymbol",
                    onExecute: function() {
                        B({
                            defaultValue: ""
                        })
                    }
                });
            d("symboledit.dialog_last_entry", "");
            var b = {
                actionId: x.ChartDialogsShowChangeInterval,
                label: Y(i(44352).t(null, void 0, i(99374))),
                statName: "ChangeInterval",
                onExecute: function() {
                    V({
                        initVal: D.interval.value(),
                        selectOnInit: !0
                    })
                }
            };
            !c.enabled("show_interval_dialog_on_key_press") || this.readOnly() || this._hideSymbolSearch || (b.shortcutHint = ",", b.hotkeyGroup = this._hotkeys, b.hotkeyHash = 188);
            var w, P = new C(b);
            if (!TradingView.onWidget()) {
                if (this._options.addToWatchlistEnabled) {
                    const e = {
                        hotkeyGroup: this._hotkeys
                    };
                    w = new WatchListAction(this, e)
                }
                0
            }
            var I = new C({
                    actionId: x.ChartTimeScaleReset,
                    label: i(44352).t(null, void 0, i(25333)),
                    icon: i(39267),
                    statName: "ResetScale",
                    onExecute: function() {
                        e.model().resetTimeScale()
                    },
                    hotkeyGroup: this._hotkeys,
                    hotkeyHash: m.Modifiers.Mod + m.Modifiers.Alt + 81
                }),
                M = new C({
                    actionId: x.ChartRemoveAllIndicators,
                    label: i(44352).t(null, void 0, i(13951)),
                    statName: "RemoveAllIndicators",
                    onExecute: this.removeAllStudies.bind(this)
                }),
                A = new C({
                    actionId: x.ChartRemoveAllLineTools,
                    label: i(44352).t(null, void 0, i(1434)),
                    statName: "RemoveAllDrawingTools",
                    onExecute: this.removeAllDrawingTools.bind(this)
                }),
                L = new C({
                    actionId: x.ChartRemoveAllIndicatorsAndLineTools,
                    label: i(44352).t(null, void 0, i(97305)),
                    statName: "RemoveAllIndicatorsAndDrawingTools",
                    onExecute: this.removeAllStudiesDrawingTools.bind(this)
                }),
                R = this.chartWidgetCollection(),
                N = new C({
                    actionId: x.ChartApplyIndicatorsToAllCharts,
                    label: i(44352).t(null, void 0, i(95910)),
                    statName: "ApplyIndicatorsToAllCharts",
                    onExecute: function() {
                        R.applyIndicatorsToAllCharts(e)
                    }
                }),
                O = {
                    actionId: x.ChartDialogsShowInsertIndicators,
                    label: Y(i(44352).t(null, void 0, i(98767))),
                    statName: "InsertIndicator",
                    onExecute: function() {
                        e.showIndicators()
                    }
                };
            this._options.indicatorsDialogShortcutEnabled && (O.hotkeyGroup = this._hotkeys, O.hotkeyHash = 191, this._hotkeys.add({
                handler: function() {
                    this.showIndicators()
                }.bind(this),
                desc: "Show insert indicator dialog",
                hotkey: 111
            }));
            var W, H = new C(O),
                U = new C({
                    actionId: x.ChartDialogsShowCompareOrAddSymbol,
                    label: Y(i(44352).t(null, void 0, i(20229))),
                    statName: "CompareOrAddSymbol",
                    onExecute: this.toggleCompareOrAdd.bind(this)
                }),
                G = new C({
                    actionId: x.ChartObjectTreeShow,
                    label: Y(i(44352).t(null, void 0, i(675))),
                    statName: "ObjectsTree",
                    onExecute: this.showObjectsTreePanelOrDialog.bind(this)
                }),
                q = new C({
                    actionId: x.ChartDialogsShowGeneralSettings,
                    label: Y(i(44352).t(null, void 0, i(89517))),
                    icon: i(51983),
                    statName: "ChartProperties",
                    onExecute: function() {
                        e.showGeneralChartProperties()
                    }
                }),
                $ = new C({
                    actionId: x.ChartDialogsShowGeneralSettingsSymbolTab,
                    label: Y(i(44352).t(null, void 0, i(89517))),
                    icon: i(51983),
                    statName: "MainSeriesProperties",
                    onExecute: function() {
                        e.showGeneralChartProperties(u.symbol)
                    }
                }),
                K = new C({
                    actionId: x.ChartSelectedObjectToggleLocked,
                    label: i(44352).t(null, void 0, i(1441)),
                    statName: "ToggleLockSelectedObject",
                    onExecute: this.toggleLockSelectedObject.bind(this)
                }),
                X = new C({
                    actionId: x.ChartSelectedObjectHide,
                    label: i(44352).t(null, void 0, i(31971)),
                    icon: i(84959),
                    statName: "HideSelectedObject",
                    onExecute: this.hideSelectedObject.bind(this)
                });
            c.enabled("property_pages") && (W = new C({
                actionId: x.ChartSelectedObjectShowSettingsDialog,
                label: Y(i(44352).t(null, void 0, i(89517))),
                icon: i(51983),
                statName: "EditSelectedObject",
                onExecute: function() {
                    e.showSelectedSourcesProperties()
                }
            })), this.withModel(null, (function() {
                var t = e.model().mainSeries(),
                    i = t.properties();
                i.priceAxisProperties.subscribe(e, e._updateScalesActions), t.priceScaleAboutToBeChanged().subscribe(e, (function() {
                    i.priceAxisProperties.unsubscribeAll(e)
                })), t.priceScaleChanged().subscribe(e, (function() {
                    i.priceAxisProperties.subscribe(e, e._updateScalesActions), e._updateScalesActions()
                }))
            }));
            var J = new C({
                actionId: x.ChartPriceScaleToggleAutoScaleSeriesOnly,
                label: i(44352).t(null, void 0, i(37207)),
                checkable: !0,
                statName: "ScalePriceChartOnly"
            });
            J.binder = new h(J, this._properties.scalesProperties.scaleSeriesOnly, this.model(), re);
            var Q = this.model().model();
            this._properties.scalesProperties.scaleSeriesOnly.listeners().subscribe(null, (function() {
                Q.recalculateAllPanes(j()), Q.invalidate(E.full())
            }));
            var ee = new C({
                    actionId: x.ChartDrawingToolbarToggleVisibility,
                    label: i(44352).t(null, void 0, i(22903)),
                    checkable: !0,
                    statName: "ToggleDrawingToolbar"
                }),
                se = this._options.isDrawingToolbarVisible;
            se && (se.subscribe((function(e) {
                ee.update({
                    checked: e
                })
            }), {
                callWithLast: !0
            }), ee.update({
                onExecute: function() {
                    se.setValue(!se.value())
                }
            }));
            var ve = new C({
                actionId: "",
                label: i(44352).t(null, void 0, i(93161)),
                checkable: !0,
                statName: "ToggleStayInDrawingMode"
            });
            ve.binder = new h(ve, T.properties().stayInDrawingMode, this.model(), ne), this._hotkeys.add({
                handler: function() {
                    F()
                },
                desc: "Hide all drawing tools",
                hotkey: m.Modifiers.Mod + m.Modifiers.Alt + 72
            });
            var Se = new C({
                actionId: x.ChartMarksToggleVisibility,
                label: i(44352).t(null, void 0, i(2441)),
                checkable: !0,
                statName: "ToggleHideMarksOnBars"
            });
            Se.binder = new h(Se, T.hideMarksOnBars(), this.model(), oe, (function() {
                T.hideMarksOnBars().setValue(this.value())
            }));
            const ye = this.properties().scalesProperties;
            var xe = new C({
                actionId: x.ChartPriceScaleLabelsToggleSeriesLastValueVisibility,
                label: i(44352).t(null, void 0, i(52054)),
                checkable: !0,
                checked: !1,
                statName: "ToggleSymbolLastValue"
            });
            xe.binder = new h(xe, ye.showSeriesLastValue, this.model(), ae);
            var Te = new C({
                actionId: x.ChartPriceScaleLabelsToggleSymbolNameLabelsVisibility,
                label: i(44352).t(null, void 0, i(90932)),
                checkable: !0,
                checked: !1,
                statName: "ToggleSymbolLabels"
            });
            Te.binding = new h(Te, ye.showSymbolLabels, this.model(), le);
            const Ie = Z(((e, t) => e || !1), ye.showStudyLastValue, ye.showFundamentalLastValue);
            var Me = new C({
                actionId: x.ChartPriceScaleLabelsToggleIndicatorsValueLabelsVisibility,
                label: i(44352).t(null, void 0, i(81584)),
                checkable: !0,
                checked: !1,
                statName: "ToggleStudiesAndFundamentalsPriceLabels"
            });
            Me.binder = new h(Me, Ie, this.model(), null, (() => {
                const e = !Ie.value();
                this.model().beginUndoMacro(he), this.model().setProperty(ye.showStudyLastValue, e, null), this.model().endUndoMacro()
            }));
            const Ae = Z(((e, t) => e || !1), ye.showStudyPlotLabels, ye.showFundamentalNameLabel);
            var Le = new C({
                actionId: x.ChartPriceScaleLabelsToggleIndicatorsNameLabelsVisibility,
                label: i(44352).t(null, void 0, i(31485)),
                checkable: !0,
                checked: !1,
                statName: "ToggleStudiesAndFundamentalsNameLabels"
            });
            Le.binding = new h(Le, Ae, this.model(), null, (() => {
                const e = !Ae.value();
                this.model().beginUndoMacro(ce), this.model().setProperty(ye.showStudyPlotLabels, e, null), this.model().endUndoMacro()
            }));
            var ke = this.model().mainSeries().properties().highLowAvgPrice,
                Ee = new C({
                    actionId: x.ChartPriceScaleLabelsToggleHighLowPriceLabelsVisibility,
                    label: i(44352).t(null, void 0, i(60259)),
                    checkable: !0,
                    checked: !1,
                    statName: "ToggleHighLowPriceLabels"
                });
            Ee.binding = new h(Ee, ke.highLowPriceLabelsVisible, this.model(), ue);
            var De = new C({
                actionId: x.ChartLinesToggleHighLowLinesVisibility,
                label: i(44352).t(null, void 0, i(21803)),
                checkable: !0,
                checked: !1,
                statName: "ToggleHighLowPriceLine"
            });
            if (De.binding = new h(De, ke.highLowPriceLinesVisible, this.model(), de), ie) {
                var Ve = new C({
                    actionId: x.ChartPriceScaleLabelsToggleAveragePriceLabelVisibility,
                    label: i(44352).t(null, void 0, i(8975)),
                    checkable: !0,
                    checked: !1,
                    statName: "ToggleAverageClosePriceLabel"
                });
                Ve.binding = new h(Ve, ke.averageClosePriceLabelVisible, this.model(), _e);
                var Be = new C({
                    actionId: x.ChartLinesToggleAverageLineVisibility,
                    label: i(44352).t(null, void 0, i(87899)),
                    checkable: !0,
                    checked: !1,
                    statName: "ToggleAverageClosePriceLine"
                });
                Be.binding = new h(Be, ke.averageClosePriceLineVisible, this.model(), pe)
            }
            var Re = new C({
                actionId: x.ChartPriceScaleToggleCountdownToBarCloseVisibility,
                label: i(44352).t(null, void 0, i(94370)),
                checkable: !0,
                checked: !1,
                statName: "ToggleCountdown"
            });
            Re.binder = new h(Re, this.model().mainSeries().properties().showCountdown, this.model(), me);
            var Ne = new C({
                actionId: x.ChartPriceScaleToggleAddOrderPlusButtonVisibility,
                label: i(44352).t(null, void 0, i(97378)),
                checkable: !0,
                checked: te.value(),
                statName: "ToggleAddOrderPlusButton"
            });
            Ne.binder = new h(Ne, te, this.model(), ge);
            var Oe = null;
            this._options.goToDateEnabled && (Oe = new C({
                actionId: x.ChartDialogsShowGoToDate,
                label: Y(i(44352).t(null, void 0, i(75190))),
                statName: "GoToDate",
                onExecute: function() {
                    var t = e._chartWidgetCollection.activeChartWidget.value();
                    p(t)
                },
                hotkeyGroup: this._hotkeys,
                hotkeyHash: m.Modifiers.Alt + 71
            }));
            var Fe = new C({
                    actionId: x.ChartDialogsShowSymbolInfo,
                    label: Y(i(44352).t(null, void 0, i(65986))),
                    icon: i(37924),
                    checkable: !1,
                    statName: "SymbolInfo",
                    onExecute: function() {
                        var t = e.model().model(),
                            i = t.mainSeries().symbol(),
                            s = t.mainSeries().symbolInfo(),
                            r = t.availableUnits(),
                            n = {
                                symbolInfo: s,
                                showUnit: t.unitConversionEnabled(),
                                unitDescription: e => r.description(e),
                                dateFormatter: t.dateFormatter()
                            };
                        k(i, n)
                    }
                }),
                We = new C({
                    actionId: x.ChartPriceScaleMergeAllScalesToLeft,
                    label: be,
                    statName: "MergeAllScalesToLeft",
                    onExecute: function() {
                        e.model().mergeAllScales("left")
                    }
                }),
                ze = new C({
                    actionId: x.ChartPriceScaleMergeAllScalesToRight,
                    label: we,
                    statName: "MergeAllScalesToRight",
                    onExecute: function() {
                        e.model().mergeAllScales("right")
                    }
                }),
                He = new C({
                    actionId: x.ChartPriceScaleMoveToLeft,
                    label: Pe,
                    statName: "MoveScaleToLeft",
                    onExecute: function() {
                        e.model().mergeAllScales("left")
                    }
                }),
                Ue = new C({
                    actionId: x.ChartPriceScaleMoveToRight,
                    label: Ce,
                    statName: "MoveScaleToRight",
                    onExecute: function() {
                        e.model().mergeAllScales("right")
                    }
                });
            var je = c.enabled("show_object_tree");
            if (this._actions = {
                    chartProperties: q,
                    mainSeriesPropertiesAction: $,
                    timeScaleReset: I,
                    chartReset: t,
                    invertSeriesScale: s,
                    logSeriesScale: g,
                    autoSeriesScale: r,
                    lockSeriesScale: n,
                    regularSeriesScale: o,
                    percentSeriesScale: a,
                    indexedTo100SeriesScale: l,
                    compareOrAdd: U,
                    paneObjectTree: je ? G : void 0,
                    insertIndicator: H,
                    symbolSearch: y,
                    showSymbolInfoDialog: Fe,
                    changeInterval: P,
                    seriesHide: X,
                    studyHide: X,
                    lineToggleLock: K,
                    lineHide: X,
                    scaleSeriesOnly: J,
                    drawingToolbarAction: ee,
                    stayInDrawingModeAction: ve,
                    hideAllMarks: Se,
                    applyTimeZone: S,
                    showCountdown: Re,
                    addPlusButton: Ne,
                    showSeriesLastValue: xe,
                    showHighLowPriceLabels: Ee,
                    showHighLowPriceLines: De,
                    showAverageClosePriceLabel: Ve,
                    showAverageClosePriceLine: Be,
                    showSymbolLabelsAction: Te,
                    showStudyLastValue: Me,
                    showStudyPlotNamesAction: Le,
                    undo: f,
                    redo: v,
                    mergeLeftScalesAction: We,
                    mergeRightScalesAction: ze,
                    moveScaleToLeft: He,
                    moveScaleToRight: Ue,
                    moveChartAction: undefined
                }, w && (this._actions.addToWatchlist = w), !TradingView.onWidget() && c.enabled("text_notes") && (this._actions.addToTextNotes = undefined), null !== Oe && (this._actions.gotoDate = Oe), this.createSessionBreaksActions(), !this.readOnly()) {
                var Ge = new C({
                    actionId: x.ChartSelectedObjectRemove,
                    label: i(44352).t(null, void 0, i(34596)),
                    icon: i(35149),
                    statName: "RemoveSelectedObject",
                    onExecute: function() {
                        var e = this._chartWidgetCollection.activeChartWidget.value();
                        e || (e = this), e.removeSelectedSources()
                    }.bind(this),
                    hotkeyGroup: this._hotkeys,
                    hotkeyHash: _.isMacKeyboard ? 8 : 46
                });
                this._hotkeys.add({
                    handler: function() {
                        this.removeSelectedSources()
                    }.bind(this),
                    desc: "Remove selected source",
                    hotkey: _.isMacKeyboard ? 46 : 8
                }), this._actions.paneRemoveAllStudies = M, this._actions.paneRemoveAllDrawingTools = A, this._actions.paneRemoveAllStudiesDrawingTools = L, this._actions.applyStudiesToAllCharts = N, this._actions.studyRemove = Ge, this._actions.lineRemove = Ge, c.enabled("property_pages") && (this._actions.format = W)
            }
            this._actions.showPriceLine = new C({
                actionId: x.ChartLinesToggleSeriesPriceLineVisibility,
                label: i(44352).t(null, void 0, i(91492)),
                checkable: !0,
                statName: "TogglePriceLine"
            }), this._actions.showPriceLine.binding = new h(this._actions.showPriceLine, this.model().mainSeries().properties().showPriceLine, this.model(), fe), this.readOnly() || (this._hotkeys.add({
                desc: "Draw Horizontal Line here",
                hotkey: m.Modifiers.Alt + 72,
                handler: function() {
                    e.activePaneWidget && e.activePaneWidget.drawRightThere("LineToolHorzLine")
                }
            }), this._hotkeys.add({
                desc: "Draw Horizontal Ray here",
                hotkey: m.Modifiers.Alt + 74,
                handler: function() {
                    e.activePaneWidget && e.activePaneWidget.drawRightThere("LineToolHorzRay")
                }
            }), this._hotkeys.add({
                desc: "Draw Vertical Line here",
                hotkey: m.Modifiers.Alt + 86,
                handler: function() {
                    e.activePaneWidget && e.activePaneWidget.drawRightThere("LineToolVertLine")
                }
            }), this._hotkeys.add({
                desc: "Draw Cross Line here",
                hotkey: m.Modifiers.Alt + 67,
                handler: function() {
                    e.activePaneWidget && e.activePaneWidget.drawRightThere("LineToolCrossLine")
                }
            }), this._hotkeys.add({
                desc: "Draw Trend Line",
                hotkey: m.Modifiers.Alt + 84,
                handler: function() {
                    e.activePaneWidget && T.tool.setValue("LineToolTrendLine")
                }
            }), this._hotkeys.add({
                desc: "Draw Fib Retracement",
                hotkey: m.Modifiers.Alt + 70,
                handler: function() {
                    e.activePaneWidget && T.tool.setValue("LineToolFibRetracement")
                }
            })), this._updateScalesActions()
        }
        options() {
            return this._options
        }
        executeActionById(e) {
            if ("takeScreenshot" === e) return console.warn('Action "takeScreenshot" is deprecated. Use method "takeScreenshot" instead'), void this._chartWidgetCollection.takeScreenshot();
            e in this._actions ? this._actions[e] instanceof C && this._actions[e].execute() : console.warn("Unknown action id: " + e)
        }
        getCheckableActionState(e) {
            if (e in this._actions) {
                var t = this._actions[e];
                if (t instanceof C && t.isCheckable()) return t.isChecked();
                console.warn("Action " + e + " has no state")
            } else console.warn("Unknown action id: " + e);
            return null
        }
        _updateScalesActions() {
            if (null !== this._actions) {
                var e = this.model().mainSeries(),
                    t = e.priceScale(),
                    i = e.properties(),
                    s = t.isLockScale(),
                    r = i.style.value() === l.STYLE_PNF;
                this._actions.percentSeriesScale.update({
                    disabled: s || r,
                    checked: t.isPercentage()
                }), this._actions.logSeriesScale.update({
                    disabled: s || r,
                    checked: t.isLog()
                }), this._actions.regularSeriesScale.update({
                    disabled: s || r,
                    checked: t.isRegular()
                }), this._actions.indexedTo100SeriesScale.update({
                    disabled: s || r,
                    checked: t.isIndexedTo100()
                }), this._actions.invertSeriesScale.update({
                    checked: t.isInverted()
                }), this._actions.lockSeriesScale.update({
                    checked: t.isLockScale()
                }), this._actions.autoSeriesScale.update({
                    checked: t.isAutoScale(),
                    disabled: t.properties().autoScaleDisabled.value()
                })
            }
        }
        removeAllStudies() {
            this._model.removeAllStudies()
        }
        removeAllDrawingTools() {
            this._model.removeAllDrawingTools()
        }
        removeAllStudiesDrawingTools() {
            this._model.removeAllStudiesAndDrawingTools()
        }
        defaultSymbol() {
            return this._defSymbol
        }
        widget() {
            return this._mainDiv
        }
        _onBackgroundColorChanged() {
            for (var e = 0; e < this._paneWidgets.length; e++) this._paneWidgets[e].setCursorForTool();
            this.update(), this.model().model().fullUpdate()
        }
        setTimingsMeter(e) {
            this._timingsMeter = e, this._updateTimingsMeterState()
        }
        ownerDocument() {
            return this._parent.ownerDocument
        }
        _updateTimingsMeterState() {
            var e = this._options.visible.value();
            null !== this._timingsMeter && (e ? this._timingsMeter.startCollect() : this._timingsMeter.stopCollect())
        }
        _createVolumeIfNeeded() {
            var e = c.enabled("create_volume_indicator_by_default") && this._options.addVolume,
                t = !this._content,
                i = c.enabled("charting_library_base"),
                s = c.enabled("create_volume_indicator_by_default_once"),
                r = this._content && !this._content.loading;
            e && (t || i && r && !s) && this._model.mainSeries().dataEvents().symbolResolved().subscribe(this, (function() {
                var e = this;
                setTimeout((function() {
                    var t = e._model.model().mainSeries().symbolInfo();
                    if (t) {
                        var i = L(t);
                        if (!e.containsVolume() && i) {
                            var s = U.factoryDefaults("chartproperties.volumePaneSize"),
                                r = e._model.model().createStudyInserter({
                                    type: "java",
                                    studyId: "Volume@tv-basicstudies"
                                });
                            r.setForceOverlay(c.enabled("volume_force_overlay")), r.setPaneSize(s), c.enabled("hide_volume_ma") && r.setPropertiesState({
                                styles: {
                                    vol_ma: {
                                        display: P.None
                                    }
                                }
                            }), r.insert()
                        } else if (!i && e.containsVolume()) {
                            var n = e.model().dataSources().filter((function(e) {
                                return e instanceof g && "Volume" === e.metaInfo().shortId
                            }))[0];
                            e._model.model().removeSource(n)
                        }
                    }
                }), 0)
            }), s)
        }
        _createSessions(e) {
            var t = this.showGeneralChartProperties.bind(this, u.timezoneSessions);
            e.createSessions(t)
        }
        _createPrePostMarket(e) {}
        _onChartStyleChanged() {
            z("Chart", "Chart Style " + this._model.mainSeries().getStyleShortName().toUpperCase())
        }
        _applyStudiesOverrides() {
            W.overrideDefaults(this._metaInfoRepository.getInternalMetaInfoArray())
        }
        studiesMetaData() {
            return this._model.studiesMetaData()
        }
        getTimeScale() {
            return this._timeAxisWidget
        }
        chartWidgetCollection() {
            return this._chartWidgetCollection
        }
        setSeriesStyle(e, t) {
            this._model.setProperty(e.properties().style, t)
        }
        showObjectsTreePanelOrDialog() {
            var e = !1,
                t = window.widgetbar;
            t && t.isVisible() && (e = "object_tree" === t.setPage("object_tree").name);
            e || this.showObjectsTreeDialog()
        }
        generalPropertiesDefinitions() {
            return this._getChartPropertyDefinitionsViewModel().then((function(e) {
                return e.propertyPages()
            }))
        }
        propertiesDefinitionsForSource(e) {
            return b(e) || v(e) || w(e) ? e.getPropertyDefinitionsViewModel().then((function(e) {
                return null === e ? null : e.propertyPages()
            })).catch((function(e) {
                return $.logWarn(e), null
            })) : Promise.resolve(null)
        }
        toggleCompareOrAdd() {
            this._compareDialog.visible().value() ? this._compareDialog.hide() : this._compareDialog.show()
        }
        showFundamentals(e) {
            this.showIndicators(e, "financials")
        }
        removeSelectedSources() {
            this.removeDataSources(this._model.selection().dataSources())
        }
        removeDataSources(e) {
            var t = e.filter(function(e) {
                return e !== this._model.mainSeries() && e !== this._model.lineBeingCreated() && e.isUserDeletable()
            }.bind(this));
            if (0 !== t.length) {
                var i = null;
                v(t[0]) && (o(1 === t.length, "Cannot remove several studies (no multi select for studies)"), i = t[0]);
                t.find((function(e) {
                    return e.hasAlert.value()
                }));
                i && i.hasChildren() ? showDeleteStudyTreeConfirm(this._model.removeSelectedSources.bind(this._model)) : this._model.removeSelectedSources()
            }
        }
        toggleLockSelectedObject() {
            var e = this._model;
            e.selection().lineDataSources().forEach((function(t) {
                var i = t.properties().frozen.value();
                e.setProperty(t.properties().frozen, !i, (i ? ve : Se).format({
                    title: new r(t.name(), t.title())
                }))
            }))
        }
        showSourceProperties(e, t = null) {
            e === this._model.mainSeries() && (t = u.symbol), this.showChartPropertiesForSource(e, t)
        }
        openSelectedObjectSource(e) {}
        tags() {
            return this._model ? this._model.calculateDefaultTags() : []
        }
        state(e, t, i, s) {
            if (this._model) {
                const r = this._model.state(e, t, i, s);
                return r.chartId = this.id(), r
            }
            return this._content ? this._content : {}
        }
        metaInfo() {
            var e = this._metaInfo;
            return this._model && (e.systemTags = this._model.calculateDefaultTags()), e
        }
        onTagsChanged() {
            return this._tagsChanged
        }
        onModelTagsChanged() {
            this._tagsChanged.fire()
        }
        onAboutToBeDestroyed() {
            return this._aboutToBeDestroyed
        }
        destroy() {
            this._aboutToBeDestroyed.fire(), null !== this._removeMaximizeHotkey && (this._removeMaximizeHotkey(), this._removeMaximizeHotkey = null), 0 !== this._drawRafId && this._parent.ownerDocument.defaultView.cancelAnimationFrame(this._drawRafId), null !== this._backgroundTopColorSpawn && this._backgroundTopColorSpawn.destroy(), null !== this._backgroundBottomColorSpawn && this._backgroundBottomColorSpawn.destroy(),
                null !== this._timingsMeter && (this._timingsMeter.stopCollect(), this._timingsMeter = null);
            for (var e = 0; e < this._paneWidgets.length; e++) this._paneWidgets[e].destroy();
            this._paneWidgets.length = 0;
            for (e = 0; e < this._paneSeparators.length; e++) this._paneSeparators[e].destroy();
            for (var t in this._paneSeparators.length = 0, this._hotkeysListener && this._hotkeysListener.destroy(), this._barsButton && this._barsButton.destroy(), this._controlBarNavigation && (this._controlBarNavigation.destroy(), this._controlBarNavigation = void 0), this._mainDiv && this._mainDiv.remove(), this._actions) {
                var i = this._actions[t];
                i instanceof C && (i.destroy(), i.binder && i.binder.destroy())
            }
            null !== this._timeAxisWidget && (this._timeAxisWidget.destroy(), this._timeAxisWidget = null), null !== this._definitionsViewModel && this._definitionsViewModel.destroy(), this._hotkeys && (this._hotkeys.destroy(), this._hotkeys = null), this._mainDiv.removeEventListener("wheel", this._onWheelBound), window.removeEventListener("keydown:chart_" + this._id, this._keydownEventListener), super.destroy()
        }
        title() {
            return i(44352).t(null, void 0, i(14412))
        }
        symbolProperty() {
            return this._model.mainSeries().properties().shortName ? this._model.mainSeries().properties().shortName : this._model.mainSeries().properties().symbol
        }
        loadContent(e, t) {
            this.screen.show();
            var i = this;
            this.isMaximizedPane() && this.toggleMaximizePane(null);
            var s, r = i._model.model().dataSources(),
                n = i._model.mainSeries(),
                o = i._model.crossHairSource();
            o.clearMeasure();
            for (var a = 0; a < r.length; a++) {
                var l = r[a];
                l !== n && l !== o && i._model.model().removeSource(l, !0)
            }
            this._model.disconnect(), i.activePaneWidget = null, n.purgeSymbolInfo(), e.loading = !0, this._content = e, this._initialLoading = Boolean(t);
            for (a = 0; a < e.panes.length; ++a)
                for (var c = 0; c < e.panes[a].sources.length; ++c)
                    if (e.panes[a].sources[c].state.symbol) {
                        s = e.panes[a].sources[c].state;
                        break
                    } if (!s) throw Error("An error occured while determining main series ion the chart");
            i._properties.mainSeriesProperties.mergeAndFire({
                visible: !0,
                symbol: s.symbol,
                timeframe: "",
                onWidget: i._onWidget,
                interval: s.interval || "D",
                style: s.style
            }), i._init(), i._model.undoHistory().clearStack()
        }
        _contentSeriesProperties() {
            if (this._content)
                for (var e = this._content.panes.length; e-- > 0;)
                    for (var t = this._content.panes[e].sources, i = t.length; i-- > 0;)
                        if ("MainSeries" === t[i].type) return t[i].state
        }
        updateUndoRedo() {
            this._model && (this.actions().undo.update({
                disabled: this._model.undoHistory().undoStack().isEmpty()
            }), this.actions().redo.update({
                disabled: this._model.undoHistory().redoStack().isEmpty()
            }))
        }
        createSessionBreaksActions() {
            var e = new C({
                actionId: x.ChartSessionBreaksToggleVisibility,
                label: i(44352).t(null, void 0, i(59827)),
                checkable: !0,
                statName: "ToggleSessionBreaks"
            });
            e.binder = new h(e, this._model.chartModel().sessions().properties().graphics.vertlines.sessBreaks.visible, this.model(), ye), this._actions.sessionBreaks = e
        }
        updateActionForIntradayOnly(e) {
            e && e instanceof C && e.update({
                disabled: this.model().mainSeries().isDWM()
            })
        }
        containsVolume() {
            return this.model().dataSources().some((function(e) {
                return e instanceof g && "Volume" === e.metaInfo().shortId
            }))
        }
        containsStudyByPredicate(e) {
            return !!this._model && this._model.dataSources().some((function(t) {
                if (!(t instanceof g)) return !1;
                var i = t.metaInfo();
                return e(i)
            }))
        }
        containsStudy(e) {
            return this.containsStudyByPredicate((function(t) {
                return t.id === e || t.fullId === e
            }))
        }
        isSmall() {
            return this._width() < 550 || this._height() < 300
        }
        onWidget() {
            return this._onWidget
        }
        onCmeWidget() {
            return "cme" === this.widgetCustomer()
        }
        widgetCustomer() {
            return this._widgetCustomer
        }
        resize() {
            var e = this._height() + "px",
                t = this._width() + "px";
            this._mainDiv.style.height = e, this._mainDiv.style.width = t, this._elMainTable.style.height = e, this._elMainTable.style.width = t, this._resizeHandler && this._mainDiv && this._resizeHandler()
        }
        applyOverrides(e) {
            var t = {};
            for (var i in e) i.startsWith("mainSeriesProperties.priceAxisProperties") || (t[i] = e[i]);
            if (applyPropertiesOverrides(this.properties(), null, !1, t, null), this._model) {
                applyPropertiesOverrides(this._model.model().properties(), null, !1, t), applyPropertiesOverrides(this._model.mainSeries().properties(), null, !1, t, "mainSeriesProperties"), this._model.model().sessions().applyOverrides(t);
                const e = this._model.chartModel().watermarkSource();
                null !== e && e.applyOverrides(t)
            }
        }
        applyStudiesOverrides(e) {
            W.mergeDefaultsOverrides(e), this._applyStudiesOverrides()
        }
        setActive(e) {
            this._isActive = e, H().isTouch && (e && 0 !== this.selectPointMode().value() ? this.startTrackingMode() : this.exitTrackingMode()), this._paneWidgets.forEach((function(e) {
                e.update()
            })), e || this.model().selectionMacro((function(e) {
                e.clearSelection()
            }))
        }
        isActive() {
            return this._isActive
        }
        selectPointMode() {
            return this._model.model().selectPointMode()
        }
        cancelRequestSelectPoint() {
            this._model.model().cancelRequestSelectPoint(), this._model.model().setReplayStatus(q.Undefined)
        }
        requestSelectPoint(e, t) {
            var i = this;
            return e.selectPointMode === G.Replay && this._model.model().setReplayStatus(q.PointSelect), new Promise((function(s, r) {
                if (a()) {
                    T.resetToCursor(!0), i._model.lineBeingCreated() && i._model.cancelCreatingLine();
                    var n = !1,
                        o = {};
                    i._model.model().onPointSelected().subscribe(o, (function(e, t) {
                        n = !0, i._isVisible.unsubscribe(a), i._hideHint(), s({
                            point: e,
                            pane: t
                        })
                    }), !0), i._model.model().requestSelectPoint(e), i.startTrackingMode(), void 0 !== t && i._showHint(t), i._isVisible.subscribe(a), i.selectPointMode().subscribe((function() {
                        setTimeout((function() {
                            n || (0 === i.selectPointMode().value() && i._hideHint(), i._model.model().onPointSelected().unsubscribeAll(o), i._isVisible.unsubscribe(a), r("cancelled"))
                        }))
                    }), {
                        once: !0
                    })
                }

                function a() {
                    return !!i.isVisible() || (r("Chartwidget must be visible"), i.cancelRequestSelectPoint(), !1)
                }
            }))
        }
        showReplayOrderConfirmationDialog() {
            if (!this.model().isInReplay()) return Promise.resolve()
        }
        _addPerfMark(e) {
            K("ChartWidget." + this._id + "." + e)
        }
        getResizerDetacher() {
            return this._options
        }
        _createHint() {
            if (null === this._hintDefferedPromise) {
                var e = ee();
                this._hintDefferedPromise = e;
                var t = this;
                Promise.all([i.e(6214), i.e(962), i.e(6166)]).then(i.bind(i, 5015)).then((function(i) {
                    e.resolve(new i.ChartEventHintRenderer(t._chartWidgetCollection.getContainer()))
                }))
            }
            return this._hintDefferedPromise ? a(this._hintDefferedPromise).promise : null
        }
        _showHint(e) {
            if (c.enabled("popup_hints"))
                if (null !== this._activeHint) this._activeHint.show(e);
                else {
                    var t = this,
                        i = this._createHint();
                    null !== i && i.then((function(i) {
                        if (null !== i) {
                            if (t._activeHint = i, void 0 === e) return;
                            t._activeHint.show(e)
                        }
                    }))
                }
        }
        _hideHint() {
            null !== this._activeHint && this._activeHint.hide()
        }
    }
}