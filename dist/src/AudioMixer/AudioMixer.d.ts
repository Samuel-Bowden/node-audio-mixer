import { type MixerParams, type InputParams, type OmitSomeParams } from '../Types/ParamTypes';
import { Readable } from 'stream';
import { AudioInput } from '../AudioInput/AudioInput';
import Stats from '../Utils/Stats';
export declare class AudioMixer extends Readable {
    stats: Stats;
    private readonly mixerParams;
    private readonly audioUtils;
    private readonly delayTimeValue;
    private isWork;
    private readonly minInputs;
    private readonly inputs;
    constructor(params: MixerParams);
    get params(): Readonly<MixerParams>;
    set params(params: OmitSomeParams<MixerParams>);
    drain(): void;
    _read(): void;
    _destroy(error: Error, callback: (error?: Error) => void): void;
    createAudioInput(inputParams: InputParams): AudioInput;
    removeAudioinput(audioInput: AudioInput): boolean;
}
