import constants from "./constants.js";
import queueHelper from './queue-helper.js';
import uiController from './ui-controller.js';
import canvasController from './canvas-controller.js';

let isAlreadyInitialize = false;
let audio;
let audioPromise;
let audioVolume = constants.maxAudioVolume;
let currentTime = 0, maxDuration = 0;
let isAudioPlaying = false;

let currAudioLoaded = null;

function execute(request) {
    if (queueHelper.isEmpty()) {
        return;
    }
    request();
}

function updateIsAudioPlaying(isPlaying) {
    isAudioPlaying = isPlaying;
    uiController.updatePlayBtn(isAudioPlaying);
}

function load(src) {
    if (currAudioLoaded === null || currAudioLoaded !== src) {
        audio.setAttribute('src', src);
        currAudioLoaded = src;
        currentTime = 0;
        audio.load();
        uiController.updateDetail(queueHelper.get());
    }
}

const getAudioProgress = function () {
    currentTime = audio.currentTime;
    return Math.floor((currentTime / maxDuration) * 1000) / 10;
};

const init = function () {
    if (!isAlreadyInitialize) {
        isAlreadyInitialize = true;
        audio = $('#base-audio')[0];
        audio.preload = 'metadata';
        audio.volume = audioVolume;

        audio.addEventListener('ended', () => {
            next();
        });

        audio.addEventListener('loadedmetadata', () => {
            maxDuration = audio.duration;
            uiController.updateCurrentTime(currentTime);
            uiController.updateEndTime(maxDuration);
        });
    }
};

const play = function () {
    execute(function () {
        load(queueHelper.get().audioSrc);
        audio.currentTime = currentTime;
        currentTime = 0;
        audioPromise = audio.play();
        updateIsAudioPlaying(true);

        canvasController.drawSpectrum(audio);
    });
};

const pause = function () {
    if (audioPromise) {
        audioPromise.then(function () {
            audio.pause();
            updateIsAudioPlaying(false);
        });
    }
};

const next = function (index = null) {
    if (index === null) {
        queueHelper.next();
    } else {
        queueHelper.setIndex(index);
    }

    load(queueHelper.get().audioSrc);
    currentTime = 0;
    audio.currentTime = currentTime;
    if (isAudioPlaying) {
        play();
    }
};

const prev = function () {
    if (audio.currentTime >= 3) {
        currentTime = 0;
    } else {
        queueHelper.prev();
        load(queueHelper.get().audioSrc);
        currentTime = 0;
    }
    audio.currentTime = currentTime;
    if (isAudioPlaying) {
        play();
    }
};

export default {
    init: init,
    play: play,
    pause: pause,
    next: next,
    prev: prev,
    isPlaying: function () {
        return isAudioPlaying;
    },
    setAudioVolume: function (value) {
        let targetVolume = (value / 100) * constants.maxAudioVolume;
        audio.volume = targetVolume;
        audioVolume = targetVolume;
    },
    getAudioVolume: function () {
        return (audioVolume * 100) / constants.maxAudioVolume;
    },
    getAudioProgress: getAudioProgress,
    setCurrentTime: function (value) {
        audio.currentTime = value;
        currentTime = value;
    },
    getCurrentTime: function () {
        return currentTime;
    },
    getMaxDuration: function () {
        return maxDuration;
    }
}
