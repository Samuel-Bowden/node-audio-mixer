import {type InputParams, type MixerParams} from '../../Types/ParamTypes';
import {type ModifiedDataView} from '../../ModifiedDataView/ModifiedDataView';
import {type IntType, type BitDepth} from '../../Types/AudioTypes';

import {isLittleEndian} from '../General/IsLittleEndian';
import {getMethodName} from '../General/GetMethodName';
import {type RMSStats} from '../../Stats/RMS';

export function updateRMS(audioData: ModifiedDataView, params: InputParams | MixerParams, rms: RMSStats): void {
	const bytesPerElement = params.bitDepth / 8;

	const isLe = isLittleEndian(params.endianness);

	const getSampleMethod: `get${IntType}${BitDepth}` = `get${getMethodName(params.bitDepth, params.unsigned)}`;

	for (let index = 0; index < audioData.byteLength; index += bytesPerElement) {
		const sample = audioData[getSampleMethod](index, isLe);

		rms.update(sample);
	}
}
