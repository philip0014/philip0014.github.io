let containerW, containerH;
let paddingW, paddingH;
let gridLengthX, gridLengthY;

let generatePathAllowed = true;
let generateMazeAllowed = true;
let editingAllowed = true;
let wallCreatorMode = false;
let clearAllowed = true;

let birdPos, foodPos;

export default {
    setContainerW: function(value) {
        containerW = value;
    },
    containerW: function () {
        return containerW;
    },
    setContainerH: function(value) {
        containerH = value;
    },
    containerH: function () {
        return containerH;
    },

    setPaddingW: function(value) {
        paddingW = value;
    },
    paddingW: function () {
        return paddingW;
    },
    setPaddingH: function(value) {
        paddingH = value;
    },
    paddingH: function () {
        return paddingH;
    },

    setGridLengthX: function(value) {
        gridLengthX = value;
    },
    gridLengthX: function () {
        return gridLengthX;
    },
    setGridLengthY: function(value) {
        gridLengthY = value;
    },
    gridLengthY: function () {
        return gridLengthY;
    },

    setGeneratePathAllowed: function (value) {
        generatePathAllowed = value;
    },
    isGeneratePathAllowed: function () {
        return generatePathAllowed;
    },
    setGenerateMazeAllowed: function (value) {
        generateMazeAllowed = value;
    },
    isGenerateMazeAllowed: function () {
        return generateMazeAllowed;
    },
    setEditingAllowed: function (value) {
        editingAllowed = value;
    },
    isEditingAllowed: function () {
        return editingAllowed;
    },
    setWallCreatorMode: function (value) {
        wallCreatorMode = value;
    },
    isWallCreatorMode: function () {
        return wallCreatorMode;
    },
    setClearAllowed: function (value) {
        clearAllowed = value;
    },
    isClearAllowed: function () {
        return clearAllowed;
    },

    setBirdPos: function(value) {
        birdPos = value;
    },
    birdPos: function () {
        return birdPos;
    },
    setFoodPos: function(value) {
        foodPos = value;
    },
    foodPos: function() {
        return foodPos;
    }
}
