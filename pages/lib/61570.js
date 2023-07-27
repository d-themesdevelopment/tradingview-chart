import { getLogger } from 'logger-module';
import { LineToolSvgIconBase } from 'line-tool-svg-icon-base-module';
import { DefaultProperty } from 'line-tool-properties-module';
import { getTwemojiUrl, fetch } from 'utility-module';

const logger = getLogger("Chart.LineToolEmoji");

class LineToolEmoji extends LineToolSvgIconBase {
  constructor(source, model, properties, priceScaleId) {
    super(source, model || LineToolEmoji.createProperties(), properties, priceScaleId);
    this.version = 1;
    this._loadViews();
  }

  name() {
    return "Emoji";
  }

  static createProperties(properties) {
    const defaultProperty = new DefaultProperty("linetoolemoji", properties);
    LineToolEmoji._configureProperties(defaultProperty);
    return defaultProperty;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537)
    ]).then(module => module.LineDataSourceDefinitionsViewModel);
  }

  async _loadViews() {
    const emoji = this._properties.childs().emoji.value();
    const twemojiUrl = getTwemojiUrl(emoji, "svg");
    try {
      const [svgText, { EmojiPaneView: EmojiPaneViewModule }, { svgRenderer: svgRendererModule }] = await Promise.all([
        fetch(twemojiUrl).then(response => response.text()),
        import(63451).then(module => module),
        import(50765).then(module => module)
      ]);
      if (!this._isDestroyed) {
        this._svgContent = svgText;
        this._onIconChanged.fire();
        const svgRenderer = svgRendererModule(svgText);
        if (svgRenderer === null) {
          logger.logWarn(`Couldn't create SVG renderer for emoji ${emoji}`);
        }
        else {
          this._setPaneViews([new EmojiPaneViewModule(this, this._model, svgRenderer)]);
        }
      }
    } catch (error) {
      logger.logWarn(`An error occurred while loading emoji content ${emoji}: ${error}`);
    }
  }
}

export { LineToolEmoji };
