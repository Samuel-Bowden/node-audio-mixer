import {type BitDepth} from '../Types/AudioTypes';
import {getValueRange} from '../Utils/General/GetValueRange';

export class StatsPeriod {
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

export default class Stats {
	maxRange: number;
	periods: Map<string, StatsPeriod>;

	constructor(bitDepth: BitDepth) {
		this.maxRange = getValueRange(bitDepth).max;

		this.periods = new Map();
		this.periods.set('short', new StatsPeriod(this.maxRange));
		this.periods.set('long', new StatsPeriod(this.maxRange));
	}

	update(sample: number) {
		this.periods.forEach(p => {
			p.update(sample);
		});
	}
}
