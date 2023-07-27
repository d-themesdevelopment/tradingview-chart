



const { Action, ActionAsync, Separator } = require(39347);
const { globalCloseMenu } = require(59064);

let rendererFactory = null;
let itemsProcessor = null;

const ContextMenuManager = {
  createAction: (config) => new Action({ ...config, actionId: 'Chart.CustomActionId' }),
  createAsyncAction: (config) => new ActionAsync('Chart.CustomActionId', config),
  createSeparator: () => new Separator(),

  createMenu: async (items, options = { menuName: '' }, callback) => {
    let renderer;
    if (rendererFactory !== null) {
      items = await rendererFactory(items, ContextMenuManager);
    }
    const removeMenu = () => {
      const index = items.indexOf(renderer);
      if (index !== -1) {
        items.splice(index, 1);
      }
      if (typeof callback !== 'undefined') {
        callback();
      }
    };
    if (rendererFactory !== null) {
      renderer = await rendererFactory(items, options, removeMenu);
      closeMenu();
    } else {
      const { ContextMenuRenderer } = await Promise.all([
        require.ensure([], (require) => require(3842), '3842'),
        require.ensure([], (require) => require(5649), '5649'),
        require.ensure([], (require) => require(3502), '3502'),
        require.ensure([], (require) => require(6752), '6752'),
        require.ensure([], (require) => require(8149), '8149'),
        require.ensure([], (require) => require(6639), '6639'),
        require.ensure([], (require) => require(9916), '9916'),
        require.ensure([], (require) => require(6831), '6831'),
        require.ensure([], (require) => require(962), '962'),
        require.ensure([], (require) => require(3179), '3179'),
        require.ensure([], (require) => require(5899), '5899'),
        require.ensure([], (require) => require(1584), '1584'),
      ]).then(require.bind(null, 20323));

      renderer = new ContextMenuRenderer(items, options, removeMenu, closeMenu);
    }
    items.push(renderer);
    return renderer;
  },

  showMenu: (items, target, options = {}, callback, callbackArg) => {
    return ContextMenuManager.createMenu(items, options, callback, callbackArg).then((menu) => menu.show(target));
  },

  setCustomRendererFactory: (factory) => {
    rendererFactory = factory;
  },

  setCustomItemsProcessor: (processor) => {
    itemsProcessor = processor;
  },

  hideAll: closeMenu,

  getShown: () => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].isShown()) {
        return items[i];
      }
    }
    return null;
  },
};

module.exports = {
  ContextMenuManager,
};
