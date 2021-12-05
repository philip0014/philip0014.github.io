import constants from "./constants.js";
import uiController from './ui-controller.js';
import audioController from './audio-controller.js';
import canvasController from './canvas-controller.js';
import queueHelper from './queue-helper.js';

import TrackItem from './trackItem.js';

$(document).ready(() => {
    // File browser
    const audioPicker = $('#audio-picker');
    const browseFileBtn = $('#browse-file-btn');
    const addToPlaylistBtn = $('#add-to-playlist');
    const fileDragArea = $('#file-drag-area');
    const fileUploaderDetail = $('#file-uploader-detail');
    const dragText = $('#drag-text');

    const initAction = function () {
        browseFileBtn.click(() => {
            audioController.init();
            audioPicker[0].click();
        });

        addToPlaylistBtn.click(() => {
            audioController.init();
            audioPicker[0].click();
        });

        audioPicker.change(() => {
            processFile(audioPicker[0].files);
        });

        function processFile(files) {
            if (files.length === 1) {
                let file = files[0];
                if (file.type.startsWith("audio")) {
                    jsmediatags.read(file, {
                        onSuccess: onMediaTagSuccess(file),
                        onError: onMediaTagError(file)
                    });
                } else {
                    uiController.popToast(constants.messageFileNotSupported, constants.durationLong);
                    fileDragArea.removeClass(constants.classActive);
                    dragText.text(constants.messageItemDragDrop);
                }
            } else {
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    if (file.type.startsWith("audio")) {
                        jsmediatags.read(file, {
                            onSuccess: onMediaTagSuccess(file),
                            onError: onMediaTagError(file)
                        });
                    }
                }
            }
        }

        fileDragArea[0].addEventListener("dragover", (event) => {
            event.preventDefault();
            fileDragArea.addClass(constants.classActive);
            dragText.text(constants.messageItemRelease);
        });

        fileDragArea[0].addEventListener("dragleave", () => {
            fileDragArea.removeClass(constants.classActive);
            dragText.text(constants.messageItemDragDrop);
        });

        fileDragArea[0].addEventListener("drop", (event) => {
            event.preventDefault();
            audioController.init();
            fileDragArea.removeClass(constants.classActive);
            dragText.text(constants.messageItemDragDrop);
            processFile(event.dataTransfer.files);
        });
    };

    uiController.init();
    canvasController.init();

    initAction();

    function onMediaTagSuccess(file) {
        return (tag) => {
            let picture = tag.tags.picture;
            let imageSrc = undefined;
            if (picture !== undefined) {
                let img64String = "";
                for (let j = 0; j < picture.data.length; j++) {
                    img64String += String.fromCharCode(picture.data[j]);
                }
                imageSrc = "data:" + picture.format + ";base64," + window.btoa(img64String);
            }

            queueHelper.add(
                new TrackItem(
                    tag.tags.title === undefined ? file.name.substr(0, file.name.lastIndexOf('.')) : tag.tags.title,
                    tag.tags.artist === undefined ? '' : tag.tags.artist,
                    tag.tags.album === undefined ? '' : tag.tags.album,
                    tag.tags.year === undefined ? '' : tag.tags.year,
                    URL.createObjectURL(file),
                    imageSrc
                )
            );
            if (queueHelper.size() === 1) {
                fileUploaderDetail.addClass(constants.classHide);
                uiController.showSlider();
                audioController.play();
            }
        };
    }

    function onMediaTagError(file) {
        return (error) => {
            queueHelper.add(
                new TrackItem(
                    file.name.substr(0, file.name.lastIndexOf('.')),
                    '',
                    '',
                    '',
                    URL.createObjectURL(file),
                    undefined
                )
            );
            if (queueHelper.size() === 1) {
                audioController.play();
            }
        }
    }
});
