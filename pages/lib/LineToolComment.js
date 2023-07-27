import { LineToolBalloon } from './38440.js';
import { DefaultProperty } from './46100.js';

class LineToolComment extends LineToolBalloon {
  constructor(model, lineOptions, text, callback) {
    super(model, lineOptions || LineToolComment.createProperties(), text, callback);
  }

  name() {
    return "Comment";
  }

  static createProperties(lineOptions) {
    const property = new DefaultProperty("linetoolcomment", lineOptions);
    LineToolComment._configureProperties(property);
    return property;
  }

  _createPaneView() {
    import(1583).then(import.bind(import, 37662)).then((CommentPaneView) => {
      this._setPaneViews([new CommentPaneView.default(this, this._model)]);
    });
  }
}

export { LineToolComment };