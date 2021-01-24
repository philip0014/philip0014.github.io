import Node from './node.js';

export default class Queue {
    constructor() {
        this._head = null;
        this._tail = null;
    }

    peek() {
        return this._head.value;
    }

    empty() {
        return this._head === null;
    }

    push(value) {
        let node = new Node(value);
        if (this._head == null) {
            this._head = node;
            this._tail = node;
        } else {
            node.prev = this._tail;
            this._tail.next = node;
            this._tail = node;
        }
    }

    pop() {
        if (this._head == null) return;
        if (this._head === this._tail) {
            this._head = null;
            this._tail = null;
        } else {
            this._head = this._head.next;
            this._head.prev = null;
        }
    }
}
