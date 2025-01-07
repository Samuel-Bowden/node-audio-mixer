import {type BitDepth} from '../Types/AudioTypes';
import {getValueRange} from '../Utils/General/GetValueRange';

export class ChannelStatsPeriod {
	sumOfSquares: number;
	count: number;
	peakValue: number;
	maxRange: number;

	constructor(maxRange: number) {
		this.sumOfSquares = 0;
		this.count = 0;
		this.peakValue = 0;
		this.maxRange = maxRange;
	}

	update(sample: number) {
		this.sumOfSquares += sample ** 2;
		this.count += 1;
		this.peakValue = Math.max(this.peakValue, Math.abs(sample));
	}

	get rootMeanSquare(): number {
		if (this.count === 0) {
			return 0;
		}

		return Math.sqrt(this.sumOfSquares / this.count) / this.maxRange;
	}

	get peak(): number {
		return this.peakValue / this.maxRange;
	}

	reset() {
		this.sumOfSquares = 0;
		this.count = 0;
		this.peakValue = 0;
	}
}

export class StatsPeriod {
	channels: ChannelStatsPeriod[];

	constructor(maxRange: number, channels: number) {
		this.channels = Array.from({length: channels}, () => new ChannelStatsPeriod(maxRange));
	}

	update(sample: number, channel: number) {
		this.channels[channel].update(sample);
	}

	reset() {
		this.channels.forEach(c => {
			c.reset();
		});
	}
}

export default class Stats {
	maxRange: number;
	periods: Map<string, StatsPeriod>;
	currentChannel = 0;
	channels: number;

	constructor(bitDepth: BitDepth, channels: number) {
		this.maxRange = getValueRange(bitDepth).max;
		this.channels = channels;

		this.periods = new Map();
		['short', 'long'].forEach(name => {
			this.periods.set(name, new StatsPeriod(this.maxRange, channels));
		});
	}

	update(sample: number) {
		this.periods.forEach(p => {
			p.update(sample, this.currentChannel);
		});
		this.currentChannel += 1;
		this.currentChannel %= this.channels;
	}
}
