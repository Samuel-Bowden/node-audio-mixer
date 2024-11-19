"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const src_1 = require("../../src");
const maxCodeLength = 4;
const randomNumber = (min, max) => Math.floor((Math.random() * (max - min)) + min);
const mixer = new src_1.AudioMixer({
    sampleRate: 48000,
    bitDepth: 16,
    channels: 1,
});
const outputFile = (0, fs_1.createWriteStream)('./code.pcm');
mixer.pipe(outputFile);
function getNextNumber(maxNumberLength, currentNumber) {
    if (currentNumber > maxNumberLength) {
        setTimeout(() => {
            mixer.destroy();
        }, 100);
        return;
    }
    const randomizedNumber = randomNumber(1, 9);
    const numberSound = (0, fs_1.createReadStream)(`./sounds/count/${randomizedNumber}.pcm`);
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
getNextNumber(maxCodeLength, 1);
