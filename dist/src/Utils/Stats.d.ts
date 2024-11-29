import { type BitDepth } from '../Types/AudioTypes';
export declare class ChannelStatsPeriod {
    sumOfSquares: number;
    count: number;
    peakValue: number;
    maxRange: number;
    constructor(maxRange: number);
    update(sample: number): void;
    get rootMeanSquare(): number;
    get peak(): number;
    reset(): void;
}
export declare class StatsPeriod {
    channels: ChannelStatsPeriod[];
    constructor(maxRange: number, channels: number);
    update(sample: number, channel: number): void;
    reset(): void;
}
export default class Stats {
    maxRange: number;
    periods: Map<string, StatsPeriod>;
    currentChannel: number;
    channels: number;
    constructor(bitDepth: BitDepth, channels: number);
    update(sample: number): void;
}
