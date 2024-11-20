import { type AudioUtils } from '../Types/AudioUtils';
import { type InputParams, type MixerParams } from '../Types/ParamTypes';
import type Stats from './Stats';
export declare class InputUtils implements AudioUtils {
    private readonly audioInputParams;
    private readonly audioMixerParams;
    private changedParams;
    private readonly emptyData;
    private audioData;
    constructor(inputParams: InputParams, mixerParams: MixerParams);
    setAudioData(audioData: Uint8Array): this;
    updateStats(stats: Stats): this;
    checkIntType(): this;
    checkBitDepth(): this;
    checkSampleRate(): this;
    checkChannelsCount(): this;
    checkVolume(): this;
    checkEndianness(): this;
    getAudioData(): Uint8Array;
}
