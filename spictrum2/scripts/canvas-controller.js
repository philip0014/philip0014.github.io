import utility from "./utility.js";
import constants from "./constants.js";
import animationController from "./animation-controller.js";

let canvasContainer;
let canvas;

let canvasW, canvasH;
let midX, midY;
let canvasContext, audioContext;

let contextSrc, analyzer;
let bufferLength, freqArray;

let freqScale;

let colorSteps = [];
// let colorGradient = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff'];
// let colorGradient = ['#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf', '#fdffb6', '#ffd6a5', '#ffadad'];
let colorGradient = ['#725bff', '#4d90fe', '#49eefe', '#80ff65', '#faff5e', '#feaf51', '#ff5757'].reverse();

function generateColorSteps(step) {
    if (colorSteps.length !== step) {
        colorSteps = [];
        let targetStep = (step / (colorGradient.length - 1));
        for (let i = 0; i < colorGradient.length - 1; i++) {
            let res = utility.interpolateColors(
                utility.hexToRgb(colorGradient[i]),
                utility.hexToRgb(colorGradient[i + 1]),
                targetStep
            );
            res.length = targetStep;
            colorSteps = colorSteps.concat(res);
        }
    }
}

function drawLine(src, dst, color) {
    canvasContext.beginPath();
    canvasContext.moveTo(src.x, src.y);
    canvasContext.lineTo(dst.x, dst.y);
    canvasContext.lineWidth = constants.canvasLineWidth;
    canvasContext.strokeStyle = color;
    canvasContext.stroke();
    canvasContext.closePath();
}

function canvasResize() {
    canvasW = canvasContainer[0].offsetWidth;
    canvasH = canvasContainer[0].offsetHeight;

    canvas[0].width = canvasW;
    canvas[0].height = canvasH;

    midX = canvasW / 2;
    midY = canvasH / 2;

    freqScale = Math.min(canvasH / (2 * (constants.canvasMaxFreq + constants.canvasPadding)), constants.canvasMaxFreqScale);
}

function draw() {
    analyzer.getByteFrequencyData(freqArray);

    canvasContext.fillStyle = constants.canvasBgColor;
    canvasContext.fillRect(0, 0, canvasW, canvasH);

    let lineCount = Math.min(
        Math.floor(bufferLength / 2),
        Math.floor(((canvasW - (constants.canvasPadding * 2)) / constants.canvasDistanceBetweenLines) / 2)
    );
    // make lineCount divisible by (colorGradient.length - 1)
    lineCount -= (lineCount % (colorGradient.length - 1));
    generateColorSteps(lineCount);

    let currXR = Math.floor(midX) + (constants.canvasDistanceBetweenLines / 2);
    let currXL = Math.floor(midX) - (constants.canvasDistanceBetweenLines / 2);
    let targetY = Math.floor(midY);
    for (let i = 0; i < lineCount; i++) {
        let scaledFreq = Math.floor(freqArray[i] * freqScale);
        let lineColor = utility.rgbToHex(colorSteps[i][0], colorSteps[i][1], colorSteps[i][2]);

        if (scaledFreq === 0) {
            drawLine({x: currXR, y: targetY - constants.canvasMinBarSize}, {x: currXR, y: targetY + constants.canvasMinBarSize}, lineColor);
            drawLine({x: currXL, y: targetY - constants.canvasMinBarSize}, {x: currXL, y: targetY + constants.canvasMinBarSize}, lineColor);
        } else {
            drawLine({x: currXR, y: targetY - scaledFreq}, {x: currXR, y: targetY + scaledFreq}, lineColor);
            drawLine({x: currXL, y: targetY - scaledFreq}, {x: currXL, y: targetY + scaledFreq}, lineColor);
        }

        currXR += constants.canvasDistanceBetweenLines;
        currXL -= constants.canvasDistanceBetweenLines;
    }
}

export default {
    init: function () {
        canvasContainer = $('#canvas-container');
        canvas = $('#main-canvas');

        canvasResize();

        canvasContext = canvas[0].getContext("2d");
        canvasContext.fillStyle = constants.canvasBgColor;
        canvasContext.fillRect(0, 0, canvasW, canvasH);

        window.addEventListener('resize', () => {
            canvasResize();

            canvasContext.fillStyle = constants.canvasBgColor;
            canvasContext.fillRect(0, 0, canvasW, canvasH);
        });

        animationController.subscribe(draw);
    },
    drawSpectrum: function (audio) {
        if (!audioContext) {
            let AudioContext = window.AudioContext || window.webkitAudioContext || false;
            if (!AudioContext) {
                alert(constants.messageApplicationNotSupported);
                return;
            }

            audioContext = new AudioContext;
            contextSrc = audioContext.createMediaElementSource(audio);
            analyzer = audioContext.createAnalyser();

            contextSrc.connect(analyzer);
            analyzer.connect(audioContext.destination);
            analyzer.fftSize = constants.canvasFftSize;

            bufferLength = analyzer.frequencyBinCount;
            freqArray = new Uint8Array(bufferLength);
            bufferLength *= 2;
        }

        animationController.startAnimation();
    }
}
