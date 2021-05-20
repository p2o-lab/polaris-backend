/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
	DataAssemblyOptions,
	InputElementOptions,
	ParameterInterface,
	ParameterOptions
} from '@p2olab/polaris-interface';
import {Parameter} from '../../../recipe';
import {DataItem, OpcUaConnection} from '../../connection';
import {PEAController} from '../../PEAController';
import {
	WQCDA, WQCRuntime
} from '../_extensions';
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../DataAssemblyController';
import {catDataAssembly} from '../../../../logging';

export type InputElementRuntime = BaseDataAssemblyRuntime & WQCRuntime;

export class InputElement extends WQCDA(DataAssemblyController) {
	public parameterRequest: Parameter | undefined;
	public requestedValue = '';

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);
	}

	/**
	 * Set parameter on PEAController
	 * @param paramValue
	 * @param {string} variable
	 */
	public async setParameter(paramValue: string | number, variable?: string): Promise<void> {
		const dataItem: DataItem<any> | undefined = (variable) ?
			this.communication[variable as keyof InputElementOptions] : this.defaultWriteDataItem;
		catDataAssembly.debug(`Set Parameter: ${this.name} (${variable}) -> ${JSON.stringify(paramValue)}`);
		await dataItem?.write(paramValue);
	}

	public async setValue(p: ParameterOptions, peas: PEAController[]): Promise<void> {
		catDataAssembly.debug(`set value: ${JSON.stringify(p)}`);
		if (p.value) {
			this.requestedValue = p.value.toString();

			if (this.parameterRequest) {
				this.parameterRequest.unlistenToScopeArray();

				if (this.parameterRequest.eventEmitter) {
					this.parameterRequest.eventEmitter.removeListener('changed', this.setParameter);
				}
			}

			this.parameterRequest = new Parameter(p, peas);

			const value = this.parameterRequest.getValue();
			catDataAssembly.trace(`calculated value: ${value}`);
			await this.setParameter(+value);

			if (this.parameterRequest.options.continuous) {
				catDataAssembly.trace('Continuous parameter change');
				this.parameterRequest.listenToScopeArray()
					.on('changed', (data) => this.setParameter(data));
			}
		}
	}

	public toJson(): ParameterInterface {
		return {
			name: this.name,
			value: this.getDefaultWriteValue(),
			type: this.defaultWriteDataItemType,
			timestamp: this.getLastDefaultWriteValueUpdate(),
			readonly: false
		};
	}
}
