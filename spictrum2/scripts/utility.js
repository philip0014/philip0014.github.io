// Reference: https://jsfiddle.net/002v98LL/
const interpolateColor = function (color1, color2, factor) {
    if (arguments.length < 3) {
        factor = 0.5;
    }
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};

export default {
    rgbToHex: function (r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },
    hexToRgb: function (hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ]
    },
    msToString: function (duration) {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        // hours = (hours < 10) ? "0" + hours : hours;
        // minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        if (hours < 1) {
            return minutes + ":" + seconds;
        }
        return hours + ":" + minutes + ":" + seconds;
    },
    interpolateColor: interpolateColor,
    interpolateColors: function (color1, color2, steps) {
        const stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];

        for(let i = 0; i < steps; i++) {
            interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
        }

        return interpolatedColorArray;
    }
}
