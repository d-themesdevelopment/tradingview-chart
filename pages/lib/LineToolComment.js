



import { LineToolComment } from '<path_to_LineToolComment_module>';
import { LineToolBalloon } from '<path_to_LineToolBalloon_module>';
import { DefaultProperty } from '<path_to_DefaultProperty_module>';

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