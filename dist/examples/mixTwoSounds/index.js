"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const src_1 = require("../../src");
const mixer = new src_1.AudioMixer({
    sampleRate: 48000,
    bitDepth: 16,
    channels: 1,
    autoClose: true,
});
const inputNature = mixer.createAudioInput({
    sampleRate: 44100,
    bitDepth: 16,
    channels: 1,
});
const inputCampfire = mixer.createAudioInput({
    sampleRate: 44100,
    bitDepth: 16,
    channels: 1,
    volume: 35,
});
const writeStream = (0, fs_1.createWriteStream)('./mixed.pcm');
const natureSound = (0, fs_1.createReadStream)('./sounds/nature/nature.pcm');
const campFireSound = (0, fs_1.createReadStream)('./sounds/nature/campfire.pcm');
mixer.pipe(writeStream);
natureSound.pipe(inputNature);
campFireSound.pipe(inputCampfire);
