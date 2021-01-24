import stringUtils from "./string-utils.js";
import constants from "./constants.js";

export default {
    hasClassAtPoint: function (point, className) {
        return $(stringUtils.toId(point.x, point.y)).hasClass(className);
    },
    addClassToPoint: function (point, className) {
        $(stringUtils.toId(point.x, point.y)).addClass(className);
    },
    removeClassFromPoint: function (point, className) {
        $(stringUtils.toId(point.x, point.y)).removeClass(className);
    },
    removeClassesFromPoint: function (point, ...classNames) {
        let currCol = $(stringUtils.toId(point.x, point.y));
        for (let i = 0; i < classNames.length; i++) {
           currCol.removeClass(classNames[i]);
        }
    },
    toggleClassAtId: function (id, className) {
        $('#' + id).toggleClass(className);
    },
    drawPath: async function (end, prevs, animationSpeed = constants.DELTA_TIME) {
        let path = [];
        path.push(end);
        let curr = prevs[end.y][end.x];
        while (curr !== null) {
            path.push(curr);
            curr = prevs[curr.y][curr.x];
        }

        let resultPath = path.reverse();
        for (let i = 0; i < resultPath.length; i++) {
            this.removeClassFromPoint(resultPath[i], constants.CLASS_VISITED);
            this.addClassToPoint(resultPath[i], constants.CLASS_PATH);
            await this.sleep(animationSpeed);
        }
        return resultPath;
    },
    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
