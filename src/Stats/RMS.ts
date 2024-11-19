export class RootMeanSquareStats {
	sumOfSquares: number;
	count: number;

	constructor() {
		this.sumOfSquares = 0;
		this.count = 0;
	}

	update(sample: number) {
		this.sumOfSquares += sample ** 2;
		this.count += 1;
	}

	getRootMeanSquare() {
		return Math.sqrt(this.sumOfSquares / this.count);
	}

	reset() {
		this.sumOfSquares = 0;
		this.count = 0;
	}
}