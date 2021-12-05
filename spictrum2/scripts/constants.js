const backgroundColor = "#212121";

export default {
    // classes
    classActive: "active",
    classHide: "hide",
    classInvisible: "invisible",
    classPlaylistContainerHide: "playlist-container-hide",
    classPopupContainerHide: "popup-container-hide",

    // material design icons
    mdiDelete: "mdi-delete",
    mdiPlay: "mdi-play-circle",
    mdiPause: "mdi-pause-circle",
    mdiVolumeMute: "mdi-volume-mute",
    mdiVolumeMedium: "mdi-volume-medium",
    mdiVolumeHigh: "mdi-volume-high",

    // messages
    messageApplicationNotSupported: "This application is not supported on this browser.",
    messageFileNotSupported: "File not supported! Try to upload mp3 file instead.",
    messageItemRelease: "Release to Upload File",
    messageItemDragDrop: "Upload Your Audio File",
    messageCannotDelete: "Cannot delete currently played song.",

    // canvases
    canvasPadding: 40,
    canvasFreqScale: 1,
    canvasMaxFreqScale: 1,
    canvasMaxFreq: 255,
    canvasDistanceBetweenLines: 2,
    canvasBgColor: backgroundColor,
    canvasLineWidth: 2,
    canvasMinBarSize: 1,
    canvasFftSize: (1 << 10),

    // duration
    durationShort: 2000,
    durationLong: 3500,

    // others
    maxAudioVolume: 0.4,
    backgroundColor: backgroundColor,
    defaultImage: "./assets/audio_default_image.jpg"
}
