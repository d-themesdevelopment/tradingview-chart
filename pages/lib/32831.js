  import {ensureDefined} from "./assertions.js";
  import {LineDataSource} from "./13087.js";
  import {getHexColorByName} from "./48891.js";
  import {StdTheme} from "./StdTheme.js";
  import {commonLineToolPropertiesStateKeys} from "./commonLineToolPropertiesStateKeys.js";
  import {LineToolColorsProperty} from "./68806.js";
  import {extractAllPropertiesKeys, factoryDefaultsForCurrentTheme} from "./13637.js";
  import {CustomData} from "./59452.js";
  import {LineDataSourceThemedProperty} from "./77680.js";
  import {sourceChangeEvent} from "./28558.js";

  const priceNoteBaseProperties = {
          intervalsVisibilities: {
              ...commonLineToolPropertiesStateKeys.intervalsVisibilitiesDefaults
          },
          showLabel: !1,
          horzLabelsAlign: "center",
          vertLabelsAlign: "top",
          fontSize: 14,
          bold: !1,
          italic: !1,
          priceLabelFontSize: 12,
          priceLabelBold: !1,
          priceLabelItalic: !1
      },
      primaryColor = getHexColorByName("color-tv-blue-500"),
      themedColors = {
          lineColor: primaryColor,
          textColor: primaryColor,
          priceLabelBackgroundColor: primaryColor,
          priceLabelBorderColor: primaryColor,
          priceLabelTextColor: getHexColorByName("color-white")
      },
      themedDefaults = new Map([
          [StdTheme.Light, themedColors],
          [StdTheme.Dark, themedColors]
      ]);

      const allPropertiesKeys = [
        ...extractAllPropertiesKeys(
          ensureDefined(themedDefaults.get(StdTheme.Light))
        ),
        ...extractAllPropertiesKeys(priceNoteBaseProperties),
        ...commonLineToolPropertiesStateKeys,
        "text",
      ];

  class LineToolPriceNoteProperty extends LineDataSourceThemedProperty {
      constructor(e, t, i, r, n) {
          var o;
          super(e, t, i, r, allPropertiesKeys, n), this._textProperty = new CustomData(null !== (o = null == n ? void 0 : n.text) && void 0 !== o ? o : ""), this.addChild("text", this._textProperty), this.addChild("linesColors", new LineToolColorsProperty([ensureDefined(this.child("lineColor"))])), this.addChild("backgroundsColors", new LineToolColorsProperty([ensureDefined(this.child("priceLabelBackgroundColor"))])), this.addChild("textsColors", new LineToolColorsProperty([ensureDefined(this.child("priceLabelTextColor"))]))
      }
      template() {
          return {
              ...super.template(),
              text: this._textProperty.value()
          }
      }
      static create(e) {
          return new this("linetoolpricenote", (() => factoryDefaultsForCurrentTheme(priceNoteBaseProperties, themedDefaults)), S, v, e)
      }
  }
  class LineToolPriceNote extends LineDataSource {
      constructor(e, t, s, r) {
          super(e, t || LineToolPriceNote.createProperties(), s, r), this._labelMovingDelta = null, i.e(1583).then(i.bind(i, 29734)).then((t => {
              this._setPaneViews([new t.PriceNotePaneView(this, e)])
          }))
      }
      pointsCount() {
          return 2
      }
      name() {
          return "Price Note"
      }
      template() {
          return this._properties.template()
      }
      startMoving(e, t, i) {
          if (1 === t) {
              if (this.isSourceHidden()) return;
              const i = ensureDefined(e.logical),
                  r = this.points()[1];
              this._labelMovingDelta = {
                  index: r.index - i.index,
                  price: r.price - i.price
              }, this.startChanging(t, i)
          } else this._labelMovingDelta = null, super.startMoving(e, t, i)
      }
      move(e, t, i) {
          if (null !== this._labelMovingDelta) {
              const t = ensureDefined(e.logical),
                  r = {
                      index: t.index + this._labelMovingDelta.index,
                      price: t.price + this._labelMovingDelta.price
                  };
              this.setPoint(1, r, i), this.updateAllViews(sourceChangeEvent(this.id()))
          } else super.move(e, t, i)
      }
      endMoving(e, t, i) {
          return null !== this._labelMovingDelta ? (this._labelMovingDelta = null, this.endChanging(!1, e)) : super.endMoving(e, t, i)
      }
      static createProperties(e) {
          const t = LineToolPriceNoteProperty.create(e);
          return this._configureProperties(t), t
      }
      _applyTemplateImpl(e) {
          super._applyTemplateImpl(e), this.properties().childs().text.setValue(e.text)
      }
      async _getPropertyDefinitionsViewModelClass() {
          return Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 11980)).then((e => e.PriceNoteDefinitionsViewModel))
      }
      _snapTo45DegreesAvailable() {
          return !0
      }
      static _addCollectedProperties(e) {}
  }
