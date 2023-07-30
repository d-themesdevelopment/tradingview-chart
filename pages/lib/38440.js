
import {translateMessage} from "./44352.js";
import {DefaultProperty} from "./46100.js";
import {LineDataSource} from "./13087.js";
import {LineToolColorsProperty} from "./68806.js";
import {CustomData} from "./59452.js";


  const commentStr = translateMessage(null, void 0, "Comment");
  class LineToolBalloon extends LineDataSource {
      constructor(e, t, i, s) {
          super(e, t || LineToolBalloon.createProperties(), i, s), this._createPaneView()
      }
      pointsCount() {
          return 1
      }
      name() {
          return "Balloon"
      }
      template() {
          const e = super.template();
          return e.text = this.properties().childs().text.value(), e
      }
      shouldBeRemovedOnDeselect() {
          return "" === this._properties.childs().text.value().trim()
      }
      static createProperties(e) {
          const t = new DefaultProperty("linetoolballoon", e);
          return this._configureProperties(t), t
      }
      _applyTemplateImpl(e) {
          super._applyTemplateImpl(e), this.properties().childs().text.setValue(e.text)
      }
      _getPropertyDefinitionsViewModelClass() {
          return Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 38534)).then((e => e.BalloonDefinitionsViewModel))
      }
      _createPaneView() {
          i.e(1583).then(i.bind(i, 74718)).then((e => {
              this._setPaneViews([new e.BalloonPaneView(this, this._model)])
          }))
      }
      static _configureProperties(e) {
          super._configureProperties(e), e.hasChild("text") || e.addChild("text", new CustomData(commentStr)), e.addExclusion("text"), e.addChild("linesColors", new LineToolColorsProperty([e.childs().borderColor])), e.addChild("textsColors", new LineToolColorsProperty([e.childs().color]))
      }
  }
