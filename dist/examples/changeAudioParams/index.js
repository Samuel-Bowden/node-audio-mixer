"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const src_1 = require("../../src");
const writeFile = (0, fs_1.createWriteStream)('./campfire.pcm');
const mixer = new src_1.AudioMixer({
    sampleRate: 48000,
    bitDepth: 24,
    channels: 2,
    autoClose: true,
});
const audioInput = mixer.createAudioInput({
    sampleRate: 48000,
    bitDepth: 16,
    channels: 1,
});
const campfireSound = (0, fs_1.createReadStream)('./sounds/nature/campfire.pcm');
mixer.pipe(writeFile);
campfireSound.pipe(audioInput);
