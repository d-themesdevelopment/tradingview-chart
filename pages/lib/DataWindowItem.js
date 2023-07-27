


class DataWindowItem {
    constructor(id, title, value, unimportant = false) {
        this._visible = true;
        this._id = id;
        this._title = title;
        this._value = value;
        this._unimportant = unimportant;
    }

    id() {
        return this._id;
    }

    title() {
        return this._title;
    }

    setTitle(title) {
        this._title = title;
    }

    text() {
        return this._value;
    }

    value() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
    }

    visible() {
        return this._visible;
    }

    setVisible(visible) {
        this._visible = visible;
    }

    color() {
        return this._color;
    }

    setColor(color) {
        this._color = color;
    }

    unimportant() {
        return this._unimportant;
    }
}

class DataWindowView {
    constructor() {
        this._items = [];
        this._header = "";
        this._title = "";
    }

    header() {
        return this._header;
    }

    title() {
        return this._title;
    }

    items() {
        return this._items;
    }

    update() {}
}