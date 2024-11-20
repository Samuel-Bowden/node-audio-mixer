"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsPeriod = void 0;
const GetValueRange_1 = require("../Utils/General/GetValueRange");
class StatsPeriod {
    constructor(maxRange) {
        this.sumOfSquares = 0;
        this.count = 0;
        this.peakValue = 0;
        this.maxRange = maxRange;
    }
    update(sample) {
        this.sumOfSquares += sample ** 2;
        this.count += 1;
        this.peakValue = Math.max(this.peakValue, Math.abs(sample));
    }
    get rootMeanSquare() {
        return Math.sqrt(this.sumOfSquares / this.count) / this.maxRange;
    }
    get peak() {
        return this.peakValue / this.maxRange;
    }
    reset() {
        this.sumOfSquares = 0;
        this.count = 0;
        this.peakValue = 0;
    }
}
exports.StatsPeriod = StatsPeriod;
class Stats {
    constructor(bitDepth) {
        this.maxRange = (0, GetValueRange_1.getValueRange)(bitDepth).max;
        this.periods = new Map();
        this.periods.set('short', new StatsPeriod(this.maxRange));
        this.periods.set('long', new StatsPeriod(this.maxRange));
    }
    update(sample) {
        this.periods.forEach(p => {
            p.update(sample);
        });
    }
}
exports.default = Stats;
