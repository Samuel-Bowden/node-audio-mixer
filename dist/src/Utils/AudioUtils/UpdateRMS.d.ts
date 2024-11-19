import { type InputParams, type MixerParams } from '../../Types/ParamTypes';
import { type ModifiedDataView } from '../../ModifiedDataView/ModifiedDataView';
import { type RootMeanSquareStats } from '../../Stats/RMS';
export declare function updateRootMeanSquare(audioData: ModifiedDataView, params: InputParams | MixerParams, rms: RootMeanSquareStats): void;
