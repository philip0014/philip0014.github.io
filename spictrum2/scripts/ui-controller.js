import utility from "./utility.js";
import constants from "./constants.js";
import audioController from "./audio-controller.js";
import animationController from "./animation-controller.js";
import queueHelper from './queue-helper.js';

let headerContainer, headerBackground;
let imageThumbnail;
let titleContainer, artistContainer, bullContainer, yearContainer;
let playBtn, nextBtn, prevBtn;
let playlistBtn, playlistContainer, playlistMain;
let audioSliderContainer, audioSlider, currentTime, endTime;
let popupContainer;

let volumeSlider, volumeBtn;

let colorThief;
let prevSliderValue = null;
let isSliderChanging = false;
let proposedTime = null;
let prevAudioVolume = 100;

let targetIdFilter = [
    'audio-picker',
    'show-playlist',
    'playlist-item-image-overlay',
    'playlist-item-delete-overlay'
];

function initHeaderControl() {
    headerContainer = $('#header-container');
    headerBackground = $('#header-bg');

    imageThumbnail = $('#image-thumbnail');

    titleContainer = $('#title-container');
    artistContainer = $('#artist-container');
    bullContainer = $('#bull-container');
    yearContainer = $('#year-container');

    imageThumbnail[0].addEventListener('load', function() {
        imageThumbnail.removeClass(constants.classHide);
        let bgColorRGB = colorThief.getPalette(imageThumbnail[0], 2, 10)[1];
        let bgColorHex = utility.rgbToHex(bgColorRGB[0], bgColorRGB[1], bgColorRGB[2]);
        headerContainer.css({
            'background-color': bgColorHex
        });
    });
}

function initAudioControlBtn() {
    playBtn = $('#play-btn');
    nextBtn = $('#next-btn');
    prevBtn = $('#prev-btn');

    playBtn.click(() => {
        if (!queueHelper.isEmpty()) {
            if (audioController.isPlaying()) {
                audioController.pause();
            } else {
                audioController.play();
            }
        }
    });

    nextBtn.click(() => {
        if (!queueHelper.isEmpty()) {
            audioController.next();
        }
    });

    prevBtn.click(() => {
        if (!queueHelper.isEmpty()) {
            audioController.prev();
        }
    });
}

function initAudioControl() {
    initAudioControlBtn();

    audioSliderContainer = $('#audio-slider-container');
    audioSlider = $('#audio-slider');
    currentTime = $('#current-time');
    endTime = $('#end-time');

    audioSlider[0].addEventListener('pointerdown', () => {
        isSliderChanging = true;
    });

    audioSlider[0].addEventListener('pointerup', () => {
        isSliderChanging = false;
        if (proposedTime !== null) {
            audioController.setCurrentTime(proposedTime);
        }
    });

    audioSlider[0].addEventListener('touchstart', () => {
        isSliderChanging = true;
    });

    audioSlider[0].addEventListener('touchend', () => {
        isSliderChanging = false;
        if (proposedTime !== null) {
            audioController.setCurrentTime(proposedTime);
        }
    });

    audioSlider[0].addEventListener('input', () => {
        if (isSliderChanging) {
            let value = audioSlider.val();
            audioSlider.css({
                'background': 'linear-gradient(to right, #f6f6f6 0%, #f6f6f6 ' + value + '%, #636363 ' + value + '%, #636363 100%)'
            });
            proposedTime = (value / 100) * audioController.getMaxDuration();
            updateCurrentTime(proposedTime);
        }
    });
}

function initPlaylistControl() {
    playlistBtn = $('#show-playlist');
    playlistContainer = $('#playlist-container');
    playlistMain = $('#playlist-main');

    playlistBtn.click(() => {
        playlistContainer.toggleClass(constants.classPlaylistContainerHide);
    });
}

function initVolumeControl() {
    volumeSlider = $('#volume-slider');
    volumeBtn = $('#volume-btn');

    volumeSlider[0].addEventListener('input', () => {
        let value = volumeSlider.val();
        volumeSlider.css({
            'background': 'linear-gradient(to right, #f6f6f6 0%, #f6f6f6 ' + value + '%, #636363 ' + value + '%, #636363 100%)'
        });
        changeAudioVolume(value);
    });

    volumeBtn.click(() => {
        if (audioController.getAudioVolume() === 0) {
            changeAudioVolume(prevAudioVolume);
        } else {
            prevAudioVolume = audioController.getAudioVolume();
            changeAudioVolume(0);
        }
    });
}

function initBaseDocumentControl() {
    document.onclick = function(e) {
        let shouldHideContainer = true;
        targetIdFilter.forEach(filter => {
            if (e.target.id.includes(filter)) {
                shouldHideContainer = false;
            }
        });

        if (!playlistContainer[0].contains(e.target) && shouldHideContainer) {
            playlistContainer.addClass(constants.classPlaylistContainerHide);
        }
    };
}

function initPopupControl() {
    popupContainer = $('#popup-container');
}

function updateAudioSlider(value) {
    if (isNaN(value)) return;

    if (prevSliderValue === null || prevSliderValue !== value) {
        prevSliderValue = value;
        audioSlider.val(value);
        audioSlider.css({
            'background': 'linear-gradient(to right, #f6f6f6 0%, #f6f6f6 ' + value + '%, #636363 ' + value + '%, #636363 100%)'
        });
    }
}

function changeAudioVolume(value) {
    updateVolumeSlider(value);
    audioController.setAudioVolume(value);

    if (value > 50) {
        volumeBtn.removeClass(constants.mdiVolumeMute);
        volumeBtn.removeClass(constants.mdiVolumeMedium);
        volumeBtn.addClass(constants.mdiVolumeHigh);
    } else if (value > 0) {
        volumeBtn.removeClass(constants.mdiVolumeMute);
        volumeBtn.removeClass(constants.mdiVolumeHigh);
        volumeBtn.addClass(constants.mdiVolumeMedium);
    } else {
        volumeBtn.removeClass(constants.mdiVolumeMedium);
        volumeBtn.removeClass(constants.mdiVolumeHigh);
        volumeBtn.addClass(constants.mdiVolumeMute);
    }
}

function updateVolumeSlider(value) {
    volumeSlider.val(value);
    volumeSlider.css({
        'background': 'linear-gradient(to right, #f6f6f6 0%, #f6f6f6 ' + value + '%, #636363 ' + value + '%, #636363 100%)'
    });
}

const updatePlaylist = function (trackQueue) {
    playlistMain.text("");
    for (let i = 0; i < trackQueue.length; i++) {
        let currTrack = trackQueue[i];
        let imageSrc = currTrack.imageSrc;
        if (imageSrc == null) {
            imageSrc = constants.defaultImage;
        }

        let playlistItemImage = $(`
            <div id="playlist-item-image-${i}" class="playlist-item-image">
                <div id="playlist-item-image-overlay-${i}" class="playlist-item-image-overlay">
                    <i id="playlist-item-delete-overlay-${i}" class="mdi ${constants.mdiDelete} icon-m"></i>
                </div>
                <img src="${imageSrc}" alt="${currTrack.title}">
            </div>
        `);
        playlistItemImage.click(() => {
            queueHelper.remove(i);
        });

        let playlistItemDetail = $(`
            <div class="playlist-item-detail">
                <div class="playlist-item-title" title="${currTrack.title}">${currTrack.title}</div>
                <div title="${currTrack.artist}">${currTrack.artist}</div>
            </div>
        `);
        playlistItemDetail.click(() => {
            audioController.next(i);
        });

        let playlistItem = $(`
            <div class="playlist-item"></div>
        `);
        playlistItem.append(playlistItemImage);
        playlistItem.append(playlistItemDetail);
        playlistMain.append(playlistItem);
    }
};

const updateCurrentTime = function (value) {
    currentTime.text(utility.msToString(value * 1000));
};

let popupLatestTimeoutId;

export default {
    init: function () {
        // Color Thief reference: https://lokeshdhakar.com/projects/color-thief/
        colorThief = new ColorThief();

        initHeaderControl();
        initAudioControl();
        initPlaylistControl();
        initVolumeControl();
        initBaseDocumentControl();
        initPopupControl();

        animationController.subscribe(function () {
            if (!isSliderChanging) {
                updateAudioSlider(audioController.getAudioProgress());
                updateCurrentTime(audioController.getCurrentTime());
            }
        });
    },
    updateDetail: function (trackItem) {
        if (trackItem.imageSrc) {
            imageThumbnail.attr('src', trackItem.imageSrc);
        } else {
            imageThumbnail.addClass(constants.classHide);
            headerContainer.css({
                'background-color': constants.backgroundColor
            });
        }

        titleContainer.text(trackItem.title);
        artistContainer.text(trackItem.artist);
        yearContainer.text(trackItem.year);

        if (trackItem.artist !== '' && trackItem.year !== '') {
            bullContainer.removeClass(constants.classHide);
        } else {
            bullContainer.addClass(constants.classHide);
        }
    },
    updatePlayBtn: function (isPlaying) {
        if (isPlaying) {
            playBtn.removeClass(constants.mdiPlay);
            playBtn.addClass(constants.mdiPause);
        } else {
            playBtn.removeClass(constants.mdiPause);
            playBtn.addClass(constants.mdiPlay);
        }
    },
    showSlider: function () {
        audioSliderContainer.removeClass(constants.classInvisible);
    },
    updateCurrentTime: updateCurrentTime,
    updateEndTime: function (value) {
        endTime.text(utility.msToString(value * 1000));
    },
    updatePlaylist: updatePlaylist,
    popToast: function (message, duration = constants.durationShort) {
        popupContainer.text(message);
        popupContainer.removeClass(constants.classPopupContainerHide);

        let timeoutId = setTimeout(function() {
            if (timeoutId === popupLatestTimeoutId) {
                popupContainer.addClass(constants.classPopupContainerHide);
            }
        }, duration);
        popupLatestTimeoutId = timeoutId;
    }
}
