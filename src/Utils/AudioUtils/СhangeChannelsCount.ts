
import {type InputParams, type MixerParams} from '../../Types/ParamTypes';
import {type IntType, type BitDepth} from '../../Types/AudioTypes';

import {ModifiedDataView} from '../../ModifiedDataView/ModifiedDataView';
import {isLittleEndian} from '../General/IsLittleEndian';
import {getMethodName} from '../General/GetMethodName';

export function changeChannelsCount(audioData: ModifiedDataView, inputParams: InputParams, mixerParams: MixerParams): ModifiedDataView {
	const bytesPerElement = mixerParams.bitDepth / 8;

	const isLe = isLittleEndian(inputParams.endianness);

	const dataSize = Math.round(audioData.byteLength * mixerParams.channels / inputParams.channels);

	const allocData = new Uint8Array(dataSize);
	const allocDataView = new ModifiedDataView(allocData.buffer);

	const getSampleMethod: `get${IntType}${BitDepth}` = `get${getMethodName(inputParams.bitDepth, inputParams.unsigned)}`;
	const setSampleMethod: `set${IntType}${BitDepth}` = `set${getMethodName(mixerParams.bitDepth, mixerParams.unsigned)}`;

	for (let oldPosition = 0, newPosition = 0; oldPosition < audioData.byteLength; oldPosition += bytesPerElement) {
		const sample = audioData[getSampleMethod](oldPosition, isLe);

		const nextPosition = newPosition + (bytesPerElement * mixerParams.channels);

		for (newPosition; newPosition < nextPosition; newPosition += bytesPerElement) {
			allocDataView[setSampleMethod](newPosition, sample, isLe);
		}
	}

	inputParams.channels = mixerParams.channels;

	return allocDataView;
}
