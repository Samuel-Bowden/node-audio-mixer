import {type MixerParams, type InputParams, type OmitSomeParams} from '../Types/ParamTypes';

import {Readable} from 'stream';

import {assertHighWaterMark} from '../Asserts/AssertHighWaterMark';

import {MixerUtils} from '../Utils/MixerUtils';
import {AudioInput} from '../AudioInput/AudioInput';
import Stats from '../Utils/Stats';

export class AudioMixer extends Readable {
	stats: Stats;

	private readonly mixerParams: MixerParams;
	private readonly audioUtils: MixerUtils;

	private readonly delayTimeValue;
	private isWork = false;

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

		this.stats = new Stats(params.bitDepth, params.channels);
	}

	get params(): Readonly<MixerParams> {
		return this.mixerParams;
	}

	set params(params: OmitSomeParams<MixerParams>) {
		Object.assign(this.mixerParams, params);
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
				.updateStats(this.stats)
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
