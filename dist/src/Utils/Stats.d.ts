import { type BitDepth } from '../Types/AudioTypes';
export declare class StatsPeriod {
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
export default class Stats {
    maxRange: number;
    periods: Map<string, StatsPeriod>;
    constructor(bitDepth: BitDepth);
    update(sample: number): void;
}
