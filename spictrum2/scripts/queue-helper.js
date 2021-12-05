import constants from "./constants.js";
import uiController from "./ui-controller.js";

let trackQueue = [];
let indexPlaying = 0;

export default {
    isEmpty: function () {
        return trackQueue.length === 0;
    },
    size: function () {
        return trackQueue.length;
    },
    get: function () {
        return trackQueue[indexPlaying];
    },
    setIndex: function (index) {
        indexPlaying = index;
    },
    next: function () {
        indexPlaying = (indexPlaying + 1) % trackQueue.length;
        return trackQueue[indexPlaying];
    },
    prev: function () {
        indexPlaying -= 1;
        if (indexPlaying < 0) indexPlaying = trackQueue.length - 1;
        return trackQueue[indexPlaying];
    },
    add: function (trackItem) {
        if (trackItem != null) {
            trackQueue.push(trackItem);
            uiController.updatePlaylist(trackQueue);
        }
    },
    remove: function (index) {
        if (index === indexPlaying) {
            uiController.popToast(constants.messageCannotDelete);
            return;
        }

        if(index < indexPlaying && index >= 0){
            indexPlaying -= 1;
        }

        trackQueue.splice(index, 1);
        uiController.updatePlaylist(trackQueue);
    }
}
