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
	ParameterInterface,
	ProcedureInterface,
	ProcedureOptions
} from '@p2olab/polaris-interface';
import {OpcUaConnection} from '../../../connection';
import {
	DataAssemblyControllerFactory,
	IndicatorElement, InputElement,
	ServParam
} from '../../../dataAssembly';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catProcedure} from '../../../../../logging';

export interface ProcedureEvents {
	parameterChanged: {
		parameter: ParameterInterface;
		parameterType: 'parameter' | 'processValueIn' | 'processValueOut' | 'reportValue';
	};
}

type ProcedureEmitter = StrictEventEmitter<EventEmitter, ProcedureEvents>;

export class Procedure extends (EventEmitter as new() => ProcedureEmitter) {
	public readonly id: string;
	public readonly name: string;
	public readonly defaultProcedure: boolean;
	public readonly selfCompleting: boolean;
	public readonly processValuesIn: InputElement[] = [];
	public readonly processValuesOut: IndicatorElement[] = [];
	public readonly reportParameters: IndicatorElement[] = [];
	public readonly parameters: ServParam[] = [];
	private readonly logger: Category;

	constructor(options: ProcedureOptions, connection: OpcUaConnection) {
		super();
		this.id = options.id;
		this.name = options.name;
		this.defaultProcedure = options.isDefault;
		this.selfCompleting = options.isSelfCompleting;
		if (options.parameters) {
			this.parameters = options.parameters.map((daOptions: DataAssemblyOptions) => DataAssemblyControllerFactory.create(daOptions, connection) as ServParam);
		}
		if (options.processValuesIn) {
			this.processValuesIn = options.processValuesIn.map((daOptions: DataAssemblyOptions) => DataAssemblyControllerFactory.create(daOptions, connection) as InputElement);
		}
		if (options.processValuesOut) {
			this.processValuesOut = options.processValuesOut.map((daOptions: DataAssemblyOptions) => DataAssemblyControllerFactory.create(daOptions, connection) as IndicatorElement);
		}
		if (options.reportParameters) {
			this.reportParameters = options.reportParameters
				.map((daOptions: DataAssemblyOptions) => DataAssemblyControllerFactory.create(daOptions, connection) as IndicatorElement);
		}
		this.logger = catProcedure;
	}

	public async subscribe(): Promise<Procedure> {
		this.logger.debug(`Subscribe to procedure ${this.name}: ${JSON.stringify(this.parameters.map((p) => p.name))}`);
		await Promise.all([
			this.parameters.map((param) => {
				param.on('changed',
					() => this.emit('parameterChanged', {parameter: param.toJson(), parameterType: 'parameter'}));
				return param.subscribe();
			}),
			this.processValuesIn.map((pv) => {
				pv.on('changed',
					() => this.emit('parameterChanged', {parameter: pv.toJson(), parameterType: 'processValueIn'}));
				return pv.subscribe();
			}),
			this.processValuesOut.map((pv) => {
				pv.on('changed',
					() => this.emit('parameterChanged', {parameter: pv.toJson(), parameterType: 'processValueOut'}));
				return pv.subscribe();
			}),
			this.reportParameters.map((param) => {
				param.on('changed',
					() => this.emit('parameterChanged', {parameter: param.toJson(), parameterType: 'reportValue'}));
				return param.subscribe();
			})
		]);
		this.logger.debug(`Subscribed to procedure ${this.name}`);
		return this;
	}

	public unsubscribe(): void {
		this.parameters.forEach((param) => param.unsubscribe());
		this.processValuesIn.forEach((pv) => pv.unsubscribe());
		this.processValuesOut.forEach((pv) => pv.unsubscribe());
		this.reportParameters.forEach((pv) => pv.unsubscribe());
	}

	public toJson(): ProcedureInterface {
		return {
			id: this.id,
			name: this.name,
			isDefault: this.defaultProcedure,
			isSelfCompleting: this.selfCompleting,
			parameters: this.parameters.map((param) => param.toJson()),
			processValuesIn: this.processValuesIn.map((param) => param.toJson()),
			processValuesOut: this.processValuesOut.map((param) => param.toJson()),
			reportParameters: this.reportParameters.map((param) => param.toJson())
		};
	}
}
