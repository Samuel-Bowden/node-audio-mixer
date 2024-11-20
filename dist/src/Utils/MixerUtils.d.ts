import { type AudioUtils } from '../Types/AudioUtils';
import { type MixerParams } from '../Types/ParamTypes';
import type Stats from './Stats';
export declare class MixerUtils implements AudioUtils {
    private readonly audioMixerParams;
    private changedParams;
    private dataCollection;
    private readonly emptyData;
    private mixedData;
    constructor(mixerParams: MixerParams);
    setAudioData(audioData: Uint8Array[]): this;
    mix(): this;
    checkVolume(): this;
    updateStats(stats: Stats): this;
    getAudioData(): Uint8Array;
}
