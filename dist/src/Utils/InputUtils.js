"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputUtils = void 0;
const ModifiedDataView_1 = require("../ModifiedDataView/ModifiedDataView");
const AssertChannelsCount_1 = require("../Asserts/AssertChannelsCount");
const _hangeVolume_1 = require("./AudioUtils/\u0421hangeVolume");
const ChangeIntType_1 = require("./AudioUtils/ChangeIntType");
const ChangeBitDepth_1 = require("./AudioUtils/ChangeBitDepth");
const _hangeSampleRate_1 = require("./AudioUtils/\u0421hangeSampleRate");
const _hangeChannelsCount_1 = require("./AudioUtils/\u0421hangeChannelsCount");
const ChangeEndianness_1 = require("./AudioUtils/ChangeEndianness");
const UpdateRMS_1 = require("./AudioUtils/UpdateRMS");
class InputUtils {
    constructor(inputParams, mixerParams) {
        this.emptyData = new Uint8Array(0);
        this.audioInputParams = inputParams;
        this.audioMixerParams = mixerParams;
        this.changedParams = { ...this.audioInputParams };
        this.audioData = new ModifiedDataView_1.ModifiedDataView(this.emptyData.buffer);
    }
    setAudioData(audioData) {
        this.audioData = new ModifiedDataView_1.ModifiedDataView(audioData.buffer);
        this.changedParams = { ...this.audioInputParams };
        return this;
    }
    updateRootMeanSquare(rms) {
        (0, UpdateRMS_1.updateRootMeanSquare)(this.audioData, this.changedParams, rms);
        return this;
    }
    checkIntType() {
        if (Boolean(this.changedParams.unsigned) !== Boolean(this.audioMixerParams.unsigned)) {
            (0, ChangeIntType_1.changeIntType)(this.audioData, this.changedParams, this.audioMixerParams.unsigned);
        }
        return this;
    }
    checkBitDepth() {
        if (this.changedParams.bitDepth !== this.audioMixerParams.bitDepth) {
            this.audioData = (0, ChangeBitDepth_1.changeBitDepth)(this.audioData, this.changedParams, this.audioMixerParams);
        }
        return this;
    }
    checkSampleRate() {
        if (this.changedParams.sampleRate !== this.audioMixerParams.sampleRate) {
            this.audioData = (0, _hangeSampleRate_1.changeSampleRate)(this.audioData, this.changedParams, this.audioMixerParams);
        }
        return this;
    }
    checkChannelsCount() {
        if (this.changedParams.channels !== this.audioMixerParams.channels) {
            (0, AssertChannelsCount_1.assertChannelsCount)(this.changedParams.channels);
            this.audioData = (0, _hangeChannelsCount_1.changeChannelsCount)(this.audioData, this.changedParams, this.audioMixerParams);
        }
        return this;
    }
    checkVolume() {
        const volume = this.changedParams.volume ?? 100;
        if (volume < 100) {
            (0, _hangeVolume_1.changeVolume)(this.audioData, this.changedParams);
        }
        return this;
    }
    checkEndianness() {
        if (this.changedParams.endianness !== this.audioMixerParams.endianness) {
            (0, ChangeEndianness_1.changeEndianness)(this.audioData, this.changedParams, this.audioMixerParams);
        }
        return this;
    }
    getAudioData() {
        return new Uint8Array(this.audioData.buffer);
    }
}
exports.InputUtils = InputUtils;
