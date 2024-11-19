"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const src_1 = require("../../src");
const countTo = 5;
const mixer = new src_1.AudioMixer({
    sampleRate: 48000,
    bitDepth: 16,
    channels: 1,
});
const outputFile = (0, fs_1.createWriteStream)('./count.pcm');
mixer.pipe(outputFile);
function getNextNumber(maxNumberLength, currentNumber) {
    if (currentNumber > maxNumberLength) {
        setTimeout(() => {
            mixer.destroy();
        }, 100);
        return;
    }
    const numberSound = (0, fs_1.createReadStream)(`./sounds/count/${currentNumber}.pcm`);
    const audioInput = mixer.createAudioInput({
        sampleRate: 48000,
        bitDepth: 16,
        channels: 1,
    });
    numberSound.pipe(audioInput);
    mixer.once('removeInput', () => {
        getNextNumber(maxNumberLength, currentNumber + 1);
    });
}
getNextNumber(countTo, 1);
