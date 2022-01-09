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

import {OperationInterface, OperationOptions, ParameterOptions, ServiceCommand} from '@p2olab/polaris-interface';
import {BaseService, PEAController, Procedure, Service} from '../../../pea';
import {EventEmitter} from 'events';
import {catOperation} from '../../../../logging';

/** Operation used in a [[Step]] of a [[Recipe]] or [[PetrinetState]]
 *
 */
export class Operation {

	private static MAX_RETRIES = 10;
	private static RETRY_DELAY = 500;

	public pea: PEAController | undefined;
	public service: BaseService;
	public procedure!: Procedure | undefined;
	public command!: ServiceCommand;
	public parameterOptions: ParameterOptions[] = [];
	public readonly emitter: EventEmitter;
	private state!: 'executing' | 'completed' | 'aborted';

	constructor(options: OperationOptions, peas: PEAController[]) {
		if (peas) {
			if (options.pea) {
				this.pea = peas.find((p) => p.id === options.pea);
				if (!this.pea) {
					throw new Error(`Could not find PEA ${options.pea} ` +
						`in ${JSON.stringify(peas.map((m) => m.id))}`);
				}
			} else if (peas.length === 1) {
				this.pea = peas[0];
			} else {
				throw new Error(`Operation ${JSON.stringify(options)} has no PEA specified ` +
					'and there is more than one PEAController loaded');
			}
		} else {
			throw new Error('No PEAs specified');
		}

		this.service = this.pea.getService(options.service);
		if (this.service instanceof Service) {
			if (options.procedure) {
				this.procedure = this.service.procedures.find((procedure) => procedure.name === options.procedure);
				if (!this.procedure) {
					throw new Error(`Could not find procedure ${options.procedure} ` +
						`in ${options.service}`);
				}
			} else {
				this.procedure = this.service.getDefaultProcedure();
			}
			if (!this.procedure) {
				throw new Error(`Procedure '${options.procedure}' could not be found in ${this.service.name}.`);
			}
		}
		if (options.command) {
			this.command = options.command;
		}
		if (options.parameter) {
			this.parameterOptions = options.parameter || [];
		}
		this.emitter = new EventEmitter();
	}

	/**
	 * Execute Operation at runtime.
	 *
	 * There are a maximum of Operation.MAX_RETRIES retries of this operation
	 * for example if command can not be executed due to commandEnable.
	 * Between retries there is a delay of Operation.RETRY_DELAY milliseconds.
	 */
	public async execute(): Promise<void> {
		let numberOfTries = 0;
		this.state = 'executing';
		while (this.state === 'executing') {
			catOperation.info(`Perform operation ${this.pea?.id}.${this.service.name}.${this.command}() ` +
				`(Procedure: ${this.procedure ? this.procedure.name : ''})`);
			if (this.service instanceof Service && this.procedure) {
				await this.service.setProcedure(this.procedure);
			}
			if (this.parameterOptions) {
				await this.service.setParameters(this.parameterOptions);
			}
			try {
				await this.service.executeCommand(this.command);
				this.state = 'completed';
				this.emitter.emit('changed', 'completed');
				this.emitter.removeAllListeners('changed');
			} catch (e) {
				numberOfTries++;
				catOperation.debug(`Operation could not be executed due to error: ${(e as Error).message}`);
				if (numberOfTries === Operation.MAX_RETRIES) {
					this.state = 'aborted';
					this.emitter.emit('changed', 'aborted');
					this.emitter.removeAllListeners('changed');
					catOperation.warn('Could not execute operation. Stop restarting');
				} else {
					catOperation.warn(`Could not execute operation. Another try in ${Operation.RETRY_DELAY}ms`);
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					const delay = require('timeout-as-promise');
					await delay(Operation.RETRY_DELAY);
				}
			}
		}

		catOperation.info(`Operation ${this.pea?.id}.${this.service.name}.${this.command}() executed`);
	}

	public stop(): void {
		if (this.state === 'executing') {
			this.state = 'aborted';
		}
	}

	public json(): OperationInterface {
		return {
			pea: this.pea ? this.pea.id : '',
			service: this.service.name,
			procedure: this.procedure ? this.procedure.name : undefined,
			command: this.command,
			parameter: this.parameterOptions,
			state: this.state
		};
	}
}
