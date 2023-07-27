



export class StudyStatusView extends StatusView {
    constructor(statusProvider) {
        super(statusProvider.statusProvider());
    }

    color() {
        return this._statusProvider.color();
    }

    getSplitTitle() {
        return this._statusProvider.getSplitTitle();
    }

    update() {
        this._text = this._statusProvider.text();
    }
}