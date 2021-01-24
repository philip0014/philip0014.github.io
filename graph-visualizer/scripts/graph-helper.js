import constants from "./constants.js";
import globals from "./globals.js";
import animationHelper from './animation-helper.js';
import numberUtils from './number-utils.js';

import PriorityQueue from "./priority-queue.js";
import Point from "./point.js";
import Queue from "./queue.js";
import Stack from "./stack.js";

export default {
    aStar: async function (start, end, withHeuristic = true, heuristicFunction = this.euclideanDistance) {
        let isPathFound = false;
        let visited = [];
        let totalCost = [];
        let prevs = [];
        for (let i = 0; i < globals.gridLengthY(); i++) {
            let visitedElements = [];
            let totalCostElements = [];
            let prevsElements = [];
            for (let j = 0; j < globals.gridLengthX(); j++) {
                visitedElements.push(false);
                totalCostElements.push(Infinity);
                prevsElements.push(null);
            }
            visited.push(visitedElements);
            totalCost.push(totalCostElements);
            prevs.push(prevsElements);
        }

        totalCost[start.y][start.x] = 0;
        let comparator = (a, b) => a.cost < b.cost;
        if (withHeuristic) {
            comparator = (a, b) => a.hCost < b.hCost;
        }
        let pq = new PriorityQueue(comparator);
        pq.push({cost: 0, hCost: heuristicFunction(start, end), parent: null, curr: start});
        while (!pq.empty()) {
            let cost = pq.peek().cost;
            let curr = pq.peek().curr;
            let parent = pq.peek().parent;
            pq.pop();

            if (visited[curr.y][curr.x]) continue;
            prevs[curr.y][curr.x] = parent;
            totalCost[curr.y][curr.x] = cost;
            visited[curr.y][curr.x] = true;

            animationHelper.addClassToPoint(curr, constants.CLASS_VISITED);
            if (curr.x === end.x && curr.y === end.y) {
                isPathFound = true;
                break;
            }

            await animationHelper.sleep(constants.DELTA_TIME);

            for (let i = 0; i < 4; i++) {
                let toX = curr.x + constants.DX[i];
                let toY = curr.y + constants.DY[i];
                if (toX >= 0 && toX < globals.gridLengthX()
                    && toY >= 0 && toY < globals.gridLengthY()
                    && !animationHelper.hasClassAtPoint(new Point(toX, toY), constants.CLASS_WALL)) {
                    let toCost = cost + 1;
                    let toHeuristicCost = 0;
                    if (withHeuristic) {
                        toHeuristicCost = heuristicFunction({x: toX, y: toY}, end);
                    }
                    if (toCost + toHeuristicCost < totalCost[toY][toX]) {
                        pq.push({cost: toCost, hCost: toCost + toHeuristicCost, parent: curr, curr: new Point(toX, toY)});
                    }
                }
            }
        }
        return {isPathFound: isPathFound, prevs: prevs};
    },
    dijkstra: async function (start, end) {
        return this.aStar(start, end, false);
    },
    bfs: async function (start, end) {
        let queue = new Queue();
        let visited = [];
        let prevs = [];
        for (let i = 0; i < globals.gridLengthY(); i++) {
            let visitedElements = [];
            let prevsElements = [];
            for (let j = 0; j < globals.gridLengthX(); j++) {
                visitedElements.push(false);
                prevsElements.push(null);
            }
            visited.push(visitedElements);
            prevs.push(prevsElements);
        }

        queue.push({parent: null, curr: start});
        let isPathFound = false;
        while (!queue.empty()) {
            let curr = queue.peek().curr;
            let parent = queue.peek().parent;
            queue.pop();

            if (visited[curr.y][curr.x]) continue;
            prevs[curr.y][curr.x] = parent;
            visited[curr.y][curr.x] = true;

            animationHelper.addClassToPoint(curr, constants.CLASS_VISITED);
            if (curr.x === end.x && curr.y === end.y) {
                isPathFound = true;
                break;
            }

            await animationHelper.sleep(constants.DELTA_TIME);

            for (let i = 0; i < 4; i++) {
                let toX = curr.x + constants.DX[i];
                let toY = curr.y + constants.DY[i];
                if (toX >= 0 && toX < globals.gridLengthX()
                    && toY >= 0 && toY < globals.gridLengthY()
                    && !animationHelper.hasClassAtPoint(new Point(toX, toY), constants.CLASS_WALL)) {
                    queue.push({parent: curr, curr: new Point(toX, toY)});
                }
            }
        }
        return {isPathFound: isPathFound, prevs: prevs};
    },
    dfsMaze: async function () {
        let map = [];
        for (let i = 0; i < globals.gridLengthY(); i++) {
            let mapElements = [];
            for (let j = 0; j < globals.gridLengthX(); j++) {
                let curr = new Point(j, i);
                mapElements.push(1);
                if (!animationHelper.hasClassAtPoint(curr, constants.CLASS_BIRD)
                    && !animationHelper.hasClassAtPoint(curr, constants.CLASS_FOOD)) {
                    animationHelper.addClassToPoint(curr, constants.CLASS_WALL);
                }
            }
            map.push(mapElements);
        }

        let stack = new Stack();
        let startPositions = [
            new Point(1, 1),
            new Point(globals.gridLengthX() - 2, 1),
            new Point(1, globals.gridLengthY() - 2),
            new Point(globals.gridLengthX() - 2, globals.gridLengthY() - 2),
        ];
        stack.push({prev: null, curr: startPositions[numberUtils.random(0, 4)]});

        while (!stack.empty()) {
            let curr = stack.peek().curr;
            let prev = stack.peek().prev;
            stack.pop();

            if (map[curr.y][curr.x] === 0 || map[curr.y][curr.x] === -1) continue;
            if (prev !== null) {
                let dx = (curr.x - prev.x) / 2;
                let dy = (curr.y - prev.y) / 2;
                let midPoint = new Point(curr.x - dx, curr.y - dy);
                map[midPoint.y][midPoint.x] = 0;
                animationHelper.removeClassFromPoint(midPoint, constants.CLASS_WALL);
            }
            map[curr.y][curr.x] = 0;
            animationHelper.removeClassFromPoint(curr, constants.CLASS_WALL);

            await animationHelper.sleep(constants.DELTA_TIME);

            // randomize direction
            let yates = numberUtils.fisherYates(0, 4);
            for (let i = 0; i < 4; i++) {
                let toX = curr.x + (constants.DX[yates[i]] * 2);
                let toY = curr.y + (constants.DY[yates[i]] * 2);
                if (toX >= 0 && toX < globals.gridLengthX()
                    && toY >= 0 && toY < globals.gridLengthY()) {
                    stack.push({prev: curr, curr: new Point(toX, toY)});
                }
            }
        }
    },
    kruskalMaze: async function () {
        let edges = [];
        let parent = [];
        for (let i = 0; i < globals.gridLengthY(); i++) {
            let parentElements = [];
            for (let j = 0; j < globals.gridLengthX(); j++) {
                let curr = new Point(j, i);
                parentElements.push(curr);
                if (!animationHelper.hasClassAtPoint(curr, constants.CLASS_BIRD)
                    && !animationHelper.hasClassAtPoint(curr, constants.CLASS_FOOD)) {
                    animationHelper.addClassToPoint(curr, constants.CLASS_WALL);
                }

                if (curr.x % 2 !== 0 && curr.y % 2 !== 0) {
                    for (let i = 0; i < 4; i++) {
                        let toX = curr.x + (constants.DX[i] * 2);
                        let toY = curr.y + (constants.DY[i] * 2);
                        if (toX >= 0 && toX < globals.gridLengthX()
                            && toY >= 0 && toY < globals.gridLengthY()) {
                            edges.push({n1: curr, n2: new Point(toX, toY)});
                        }
                    }
                }
            }
            parent.push(parentElements);
        }

        const getParent = (x, y) => {
            if (parent[y][x].x === x && parent[y][x].y === y) return parent[y][x];
            return parent[y][x] = getParent(parent[y][x].x, parent[y][x].y);
        };

        let yates = numberUtils.fisherYates(0, edges.length);
        for (let i = 0; i < yates.length; i++) {
            let n1 = edges[yates[i]].n1;
            let n2 = edges[yates[i]].n2;

            // disjoint set
            if (getParent(n1.x, n1.y) !== getParent(n2.x, n2.y)) {
                let parentN1 = getParent(n1.x, n1.y);
                let parentN2 = getParent(n2.x, n2.y);
                parent[parentN1.y][parentN1.x] = getParent(parentN2.x, parentN2.y);

                let dx = (n1.x - n2.x) / 2;
                let dy = (n1.y - n2.y) / 2;
                let midPoint = new Point(n1.x - dx, n1.y - dy);
                animationHelper.removeClassFromPoint(n1, constants.CLASS_WALL);
                animationHelper.removeClassFromPoint(n2, constants.CLASS_WALL);
                animationHelper.removeClassFromPoint(midPoint, constants.CLASS_WALL);

                await animationHelper.sleep(constants.DELTA_TIME);
            }
        }
    },
    euclideanDistance: function (a, b) {
        let dx = (b.x - a.x);
        let dy = (b.y - a.y);
        return Math.sqrt(dx * dx + dy * dy);
    },
    manhattanDistance: function (a, b) {
        return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    }
}
