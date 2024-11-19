export declare class RootMeanSquareStats {
    sumOfSquares: number;
    count: number;
    constructor();
    update(sample: number): void;
    getRootMeanSquare(): number;
    reset(): void;
}
