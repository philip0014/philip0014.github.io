export default class Stack {
    constructor() {
        this._items = [];
    }

    peek() {
        return this._items[this._items.length - 1];
    }

    empty() {
        return this._items.length === 0;
    }

    push(value) {
        this._items.push(value);
    }

    pop() {
        this._items.pop();
    }

}
