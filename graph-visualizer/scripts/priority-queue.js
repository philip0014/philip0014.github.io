export default class PriorityQueue {
    constructor(comparator = (a, b) => a < b) {
        this._heap = [];
        this._comparator = comparator;
    }

    peek() {
        return this._heap[0];
    }

    empty() {
        return this._heap.length === 0;
    }

    push(value) {
        this._heap.push(value);
        let last = this._heap.length - 1;
        while (last > 0 && this._compare(last, this._parent(last))) {
            this._swap(last, this._parent(last));
            last = this._parent(last);
        }
    }

    pop() {
        let result = this._heap[0];
        let last = this._heap.length - 1;
        if (last > 0) {
            this._swap(0, last);
        }
        this._heap.pop();

        let node = 0;
        while ((this._left(node) < this._heap.length && this._compare(this._left(node), node))
            || (this._right(node) < this._heap.length && this._compare(this._right(node), node))) {
            let maxChild = (this._right(node) < this._heap.length && this._compare(this._right(node), this._left(node)))
                ? this._right(node)
                : this._left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
        return result;
    }

    _compare(a, b) {
        return this._comparator(this._heap[a], this._heap[b]);
    }

    _swap(a, b) {
        let temp = this._heap[a];
        this._heap[a] = this._heap[b];
        this._heap[b] = temp;
    }

    _parent(node) {
        return ((node + 1) >> 1) - 1;
    }

    _left(node) {
        return (node << 1) + 1;
    }

    _right(node) {
        return (node + 1) << 1;
    }
}
