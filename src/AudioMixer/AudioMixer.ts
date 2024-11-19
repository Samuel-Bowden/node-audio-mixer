import {type MixerParams, type InputParams, type OmitSomeParams} from '../Types/ParamTypes';

import {Readable} from 'stream';

import {assertHighWaterMark} from '../Asserts/AssertHighWaterMark';

import {MixerUtils} from '../Utils/MixerUtils';
import {AudioInput} from '../AudioInput/AudioInput';
import {RootMeanSquareStats} from '../Stats/RMS';

export class AudioMixer extends Readable {
	rmsStats: RootMeanSquareStats;

	private readonly mixerParams: MixerParams;
	private readonly audioUtils: MixerUtils;

	private readonly delayTimeValue;
	private isWork = false;
	private readonly minInputs;

	private readonly inputs: AudioInput[] = [];

	constructor(params: MixerParams) {
		super();

		this.mixerParams = params;
		this.audioUtils = new MixerUtils(params);

		if (params.delayTime && typeof params.delayTime === 'number') {
			this.delayTimeValue = params.delayTime;
		} else {
			this.delayTimeValue = 1;
		}

		if (params.minInputs && typeof params.minInputs === 'number') {
			this.minInputs = params.minInputs;
		} else {
			this.minInputs = 1;
		}

		this.rmsStats = new RootMeanSquareStats();
	}

	get params(): Readonly<MixerParams> {
		return this.mixerParams;
	}

	set params(params: OmitSomeParams<MixerParams>) {
		Object.assign(this.mixerParams, params);
	}

	drain(): void {
		while (this.inputs.slice(0, this.minInputs).filter(i => i.dataSize >= this.params.highWaterMark!).length === this.minInputs) {
			this._read();
		}
	}

	_read(): void {
		assertHighWaterMark(this.params.bitDepth, this.params.highWaterMark);

		const allInputsSize: number[] = this.inputs.map((input: AudioInput) => input.dataSize)
			.filter(size => size >= (this.params.highWaterMark ?? (this.params.bitDepth / 8)));

		if (allInputsSize.length > 0) {
			const minDataSize: number = this.mixerParams.highWaterMark ?? Math.min(...allInputsSize);

			const availableInputs = this.inputs.filter((input: AudioInput) => input.dataSize >= minDataSize);
			const dataCollection: Uint8Array[] = availableInputs.map((input: AudioInput) => input.getData(minDataSize));

			let mixedData = this.audioUtils.setAudioData(dataCollection)
				.mix()
				.checkVolume()
				.updateRootMeanSquare(this.rmsStats)
				.getAudioData();

			if (this.mixerParams.preProcessData) {
				mixedData = this.mixerParams.preProcessData(mixedData);
			}

			this.unshift(mixedData);

			return;
		}

		if (this.mixerParams.generateSilence) {
			const silentSize = ((this.mixerParams.sampleRate * this.mixerParams.channels) / 1000) * (this.mixerParams.silentDuration ?? this.delayTimeValue);
			const silentData = new Uint8Array(silentSize);

			this.unshift(silentData);
		}

		if (this.isWork) {
			if (this.inputs.length === 0 && this.mixerParams.autoClose) {
				this.destroy();
			}
		}
	}

	_destroy(error: Error, callback: (error?: Error) => void): void {
		if (!this.closed) {
			this.inputs.forEach((input: AudioInput) => {
				input.destroy();
			});
		}

		callback(error);
	}

	public createAudioInput(inputParams: InputParams): AudioInput {
		const audioInput = new AudioInput(inputParams, this.mixerParams, this.removeAudioinput.bind(this));

		this.inputs.push(audioInput);
		this.isWork ||= true;

		this.emit('createInput');

		return audioInput;
	}

	public removeAudioinput(audioInput: AudioInput): boolean {
		const findAudioInput = this.inputs.indexOf(audioInput);

		if (findAudioInput !== -1) {
			this.inputs.splice(findAudioInput, 1);

			this.emit('removeInput');

			return true;
		}

		return false;
	}
}
