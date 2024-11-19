"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootMeanSquareStats = void 0;
class RootMeanSquareStats {
    constructor() {
        this.sumOfSquares = 0;
        this.count = 0;
    }
    update(sample) {
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
exports.RootMeanSquareStats = RootMeanSquareStats;
