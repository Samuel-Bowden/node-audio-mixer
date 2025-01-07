"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsPeriod = exports.ChannelStatsPeriod = void 0;
const GetValueRange_1 = require("../Utils/General/GetValueRange");
class ChannelStatsPeriod {
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
        if (this.count === 0) {
            return 0;
        }
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
exports.ChannelStatsPeriod = ChannelStatsPeriod;
class StatsPeriod {
    constructor(maxRange, channels) {
        this.channels = Array.from({ length: channels }, () => new ChannelStatsPeriod(maxRange));
    }
    update(sample, channel) {
        this.channels[channel].update(sample);
    }
    reset() {
        this.channels.forEach(c => {
            c.reset();
        });
    }
}
exports.StatsPeriod = StatsPeriod;
class Stats {
    constructor(bitDepth, channels) {
        this.currentChannel = 0;
        this.maxRange = (0, GetValueRange_1.getValueRange)(bitDepth).max;
        this.channels = channels;
        this.periods = new Map();
        ['short', 'long'].forEach(name => {
            this.periods.set(name, new StatsPeriod(this.maxRange, channels));
        });
    }
    update(sample) {
        this.periods.forEach(p => {
            p.update(sample, this.currentChannel);
        });
        this.currentChannel += 1;
        this.currentChannel %= this.channels;
    }
}
exports.default = Stats;
