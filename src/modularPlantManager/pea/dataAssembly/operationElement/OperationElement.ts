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

import {DataAssemblyOptions, ParameterInterface, ParameterOptions} from '@p2olab/polaris-interface';
import {DataItem, DynamicDataItem, OpcUaConnection} from '../../connection';
import {OSLevelRuntime} from '../baseFunction';
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../DataAssemblyController';
import {PEAController} from '../../PEAController';
import {catDataAssembly} from '../../../../logging';
import {OSLevel} from '../baseFunction';
import {ParameterRequest} from '../ParameterRequest';

export type OperationElementRuntime = BaseDataAssemblyRuntime & OSLevelRuntime

export class OperationElement extends DataAssemblyController {

	public communication!: OperationElementRuntime;
	// TODO: This creates a circular dependency as parameter also imports OperationElement
	public parameterRequest: ParameterRequest | undefined;
	public requestedValue = '';
	public readonly osLevel: OSLevel;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.osLevel = new OSLevel(this);
	}


	/**
	 * Set parameter on PEAController
	 * @param paramValue
	 * @param {string} variable
	 */
	public async setParameter(paramValue: number | string, variable?: string): Promise<void> {
		const dataItem: DataItem<number | string> | undefined = (variable) ?
			this.communication[variable as keyof OperationElementRuntime] : this.defaultWriteDataItem;
		catDataAssembly.debug(`Set Parameter: ${this.name} (${variable}) -> ${JSON.stringify(paramValue)}`);
		await (dataItem as DynamicDataItem<any>)?.write(paramValue);
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

			this.parameterRequest = new ParameterRequest(p, peas);

			const value = this.parameterRequest.getValue();
			catDataAssembly.trace(`calculated value: ${value}`);
			await this.setParameter(value as number);

			if (this.parameterRequest.continuous) {
				catDataAssembly.trace('Continuous parameter change');
				this.parameterRequest.listenToScopeArray()
					.on('changed', (data: any) => this.setParameter(data));
			}
		}
	}

	public toJson(): ParameterInterface {
		return {
			name: this.name,
			value: this.getDefaultWriteValue(),
			type: this.defaultWriteDataItemType,
			readonly: false,
			timestamp: this.getLastDefaultWriteValueUpdate(),
			requestedValue: this.requestedValue
		};
	}
}
