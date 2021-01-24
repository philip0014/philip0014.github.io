const PX = 'px';
const COL_ID_SPLIT = '-';

export default {
    px: function (value) {
        return value + PX;
    },
    x: function (colId) {
        return colId.split(COL_ID_SPLIT)[1];
    },
    y: function (colId) {
        return colId.split(COL_ID_SPLIT)[0];
    },
    toId: function (x, y) {
        return `#${y}-${x}`;
    }
}
