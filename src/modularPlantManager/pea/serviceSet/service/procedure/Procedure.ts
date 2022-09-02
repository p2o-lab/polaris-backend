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
	ParameterInfo,
	ProcedureInfo,
	ProcedureOptions
} from '@p2olab/polaris-interface';
import {
	DataAssemblyFactory,
	IndicatorElement, InputElement,
	ServParam
} from '../../../dataAssembly';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catProcedure} from '../../../../../logging';
import {IDProvider} from '../../../../_utils';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataAssemblyModel, ProcedureModel} from '@p2olab/pimad-interface';

export interface ProcedureEvents {
	parameterChanged: {
		parameter: ParameterInfo;
		parameterType: 'parameter' | 'processValueIn' | 'processValueOut' | 'reportValue';
	};
}

type ProcedureEmitter = StrictEventEmitter<EventEmitter, ProcedureEvents>;

export class Procedure extends (EventEmitter as new() => ProcedureEmitter) {

	public readonly id = IDProvider.generateIdentifier();
	public readonly procedureId: number;

	public readonly name: string;
	public readonly selfCompleting: boolean;
	public readonly processValuesIn: InputElement[] = [];
	public readonly processValuesOut: IndicatorElement[] = [];
	public readonly reportParameters: IndicatorElement[] = [];
	public readonly procedureParameters: ServParam[] = [];
	private readonly logger: Category;

	constructor(options: ProcedureModel, connectionHandler: ConnectionHandler) {
		super();

		const procedureId = parseInt(options?.attributes.find(a => a.name === 'ProcedureID')!.value);

		if (!Procedure.validProcedureId(procedureId)){
			throw new Error(`The procedure id should be Int and greater than 0 - got ${procedureId}`);
		}
		this.procedureId = procedureId;
		this.name = options.name;
		this.selfCompleting = options?.attributes.find(a => a.name === 'ProcedureID')?.value === 'true';
		if (options.parameters) {
			this.procedureParameters = options.parameters
				.map((daOptions: DataAssemblyModel) => DataAssemblyFactory.create(daOptions, connectionHandler) as ServParam);
		}
		if (options.processValuesIn) {
			this.processValuesIn = options.processValuesIn
				.map((daOptions: DataAssemblyModel) => DataAssemblyFactory.create(daOptions, connectionHandler) as InputElement);
		}
		if (options.processValuesOut) {
			this.processValuesOut = options.processValuesOut
				.map((daOptions: DataAssemblyModel) => DataAssemblyFactory.create(daOptions, connectionHandler) as IndicatorElement);
		}
		if (options.reportValues) {
			this.reportParameters = options.reportValues
				.map((daOptions: DataAssemblyModel) => DataAssemblyFactory.create(daOptions, connectionHandler) as IndicatorElement);
		}
		this.logger = catProcedure;
	}

	public async subscribe(): Promise<Procedure> {
		this.logger.debug(`Subscribe to procedure ${this.name}: ${JSON.stringify(this.procedureParameters.map((p) => p.name))}`);
		await Promise.all([
			this.procedureParameters.map((p) => {
				p.on('changed',
					() => this.emit('parameterChanged', {parameter: p.toJson(), parameterType: 'parameter'}));
				return p.subscribe();
			}),
			this.processValuesIn.map((p) => {
				p.on('changed',
					() => this.emit('parameterChanged', {parameter: p.toJson(), parameterType: 'processValueIn'}));
				return p.subscribe();
			}),
			this.processValuesOut.map((p) => {
				p.on('changed',
					() => this.emit('parameterChanged', {parameter: p.toJson(), parameterType: 'processValueOut'}));
				return p.subscribe();
			}),
			this.reportParameters.map((p) => {
				p.on('changed',
					() => this.emit('parameterChanged', {parameter: p.toJson(), parameterType: 'reportValue'}));
				return p.subscribe();
			})
		]);
		this.logger.debug(`Subscribed to procedure ${this.name}`);
		return this;
	}

	public unsubscribe(): void {
		this.procedureParameters.forEach((p) => p.unsubscribe());
		this.processValuesIn.forEach((p) => p.unsubscribe());
		this.processValuesOut.forEach((p) => p.unsubscribe());
		this.reportParameters.forEach((p) => p.unsubscribe());
	}

	public toJson(): ProcedureInfo {
		return {
			id: this.id,
			procedureId: this.procedureId,
			name: this.name,
			isSelfCompleting: this.selfCompleting,
			procedureParameters: this.procedureParameters.map((p) => p.toJson()),
			processValuesIn: this.processValuesIn.map((p) => p.toJson()),
			processValuesOut: this.processValuesOut.map((p) => p.toJson()),
			reportParameters: this.reportParameters.map((p) => p.toJson())
		};
	}

	getDataAssemblyJson(): DataAssemblyOptions[] {
		const result: DataAssemblyOptions[] = [];
		this.processValuesIn.forEach((inputElement) => result.push(inputElement.toDataAssemblyOptionsJson()));
		this.processValuesOut.forEach((indicatorElement) => result.push(indicatorElement.toDataAssemblyOptionsJson()));
		this.reportParameters.forEach((indicatorElement) => result.push(indicatorElement.toDataAssemblyOptionsJson()));
		this.procedureParameters.forEach((serviceParameter) => result.push(serviceParameter.toDataAssemblyOptionsJson()));
		return result;
	}

	private static validProcedureId(valueToCheck: number): boolean {
		return (Number.isInteger(valueToCheck) && valueToCheck > 0);
	}

	getDataAssemblyInfo(): {dataItems: {name: string, value: string}[], metaModelRef: string, name: string}[] {
		const result: {dataItems: {name: string, value: string}[], metaModelRef: string, name: string}[] = [];
		this.processValuesIn.forEach((inputElement) => result.push(inputElement.getDataAssemblyInfo()));
		this.processValuesOut.forEach((indicatorElement) => result.push(indicatorElement.getDataAssemblyInfo()));
		this.reportParameters.forEach((indicatorElement) => result.push(indicatorElement.getDataAssemblyInfo()));
		this.procedureParameters.forEach((serviceParameter) => result.push(serviceParameter.getDataAssemblyInfo()));
		return result;
	}
}
