import constants from "./constants.js";

export default class TrackItem {
    constructor(title, artist, album, year, audioSrc, imageSrc) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.year = year;
        this.audioSrc = audioSrc;
        this.imageSrc = imageSrc;
    }
}
