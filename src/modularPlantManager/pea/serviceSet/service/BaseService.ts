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
	BaseServiceInterface,
	CommandEnableInfo, OperationMode,
	ParameterInterface,
	ParameterOptions,
	ServiceCommand, ServiceSourceMode
} from '@p2olab/polaris-interface';
import {Parameter} from '../../../recipe';
import {PEA} from '../../PEA';
import {ServiceState} from './enum';

import {EventEmitter} from 'events';
import {timeout} from 'promise-timeout';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Procedure} from './procedure/Procedure';
import {catService} from '../../../../logging';
import {IDProvider} from '../../../_utils';
import {DataAssemblyEvents} from '../../dataAssembly';

/**
 * Events emitted by [[BaseService]]
 */
export interface BaseServiceEvents extends DataAssemblyEvents {
	/**
	 * Notify when the [[Service] changes its state
	 * @event state
	 */
	state: ServiceState;
	/**
	 * Notify when commandEnableNode changes
	 * @event commandEnable
	 */
	commandEnable: CommandEnableInfo;
	/**
	 * whenever a commandNode is executed from the POL
	 * @event commandExecuted
	 */
	commandExecuted: {
		procedure: Procedure;
		command: ServiceCommand;
		parameter: ParameterInterface[];
		scope?: [];
	};

	parameterChanged: {
		procedure?: Procedure;
		parameter: ParameterInterface;
		parameterType: 'parameter' | 'processValueIn' | 'processValueOut' | 'reportValue';
	};
	opMode: OperationMode;
	sourceMode: ServiceSourceMode;
	osLevel: number;
	procedure: {
		requestedProcedure: number | undefined,
		currentProcedure: number | undefined,
	};
}

type BaseServiceEmitter = StrictEventEmitter<EventEmitter, BaseServiceEvents>;

export abstract class BaseService extends (EventEmitter as new() => BaseServiceEmitter) {

	public readonly id = IDProvider.generateIdentifier();

	protected constructor() {
		super();
	}

	public get qualifiedName(): string {
		return this.name;
	}

	public abstract get state(): ServiceState;

	public abstract get commandEnable(): CommandEnableInfo

	// name of the base service
	protected _name!: string;

	public get name(): string {
		return this._name;
	}

	protected _lastStatusChange: Date = new Date();

	public get lastStatusChange(): Date {
		return this._lastStatusChange;
	}

	// is base service self completing
	protected _selfCompleting = false;

	protected set selfCompleting(value: boolean) {
		this._selfCompleting = value;
	}

	public abstract json(): BaseServiceInterface;

	public abstract setParameters(parameters: Array<Parameter | ParameterOptions>, peaSet?: PEA[]): Promise<void>;

	/**
	 * allow commandEnable to execute specified command
	 * @param {ServiceCommand} command
	 * @returns {Promise<boolean>}
	 */
	public isCommandExecutable(command: ServiceCommand): boolean {
		const controlEnable: CommandEnableInfo = this.commandEnable;
		catService.debug(`[${this.qualifiedName}] ControlEnable: ${JSON.stringify(controlEnable)}`);
		return controlEnable[command];
	}

	/**
	 * Execute commandNode
	 *
	 * @param {ServiceCommand} command
	 * @returns {Promise<boolean>}
	 */
	public async executeCommand(command: ServiceCommand): Promise<void> {
		//TODO: this check does not work properly
	/*	if (!this.isCommandExecutable(command)) {
			catService.info(`[${this.qualifiedName}] ControlOp does not allow command ${command}`);
			throw new Error(`[${this.qualifiedName}] ControlOp does not allow command ${command}`);
		}*/
		let result;
		if (command === ServiceCommand.start) {
			result = this.start();
		} else if (command === ServiceCommand.stop) {
			result = this.stop();
		} else if (command === ServiceCommand.reset) {
			result = this.reset();
		} else if (command === ServiceCommand.complete) {
			result = this.complete();
		} else if (command === ServiceCommand.abort) {
			result = this.abort();
		} else if (command === ServiceCommand.unhold) {
			result = this.unhold();
		} else if (command === ServiceCommand.pause) {
			result = this.pause();
		} else if (command === ServiceCommand.resume) {
			result = this.resume();
		} else if (command === ServiceCommand.restart) {
			result = this.restart();
		} else if (command === ServiceCommand.hold) {
			result = this.hold();
		} else {
			throw new Error(`Command ${command} can not be interpreted`);
		}
		return result;
	}

	/**
	 * resolve when service changes to expectedState
	 * @param {string} expectedState
	 * @returns {Promise<void>}
	 */
	public waitForStateChange(expectedState: string): Promise<void> {
		return new Promise((resolve) => {
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const service = this;
			service.on('state', function test(state) {
				if (ServiceState[state] === expectedState) {
					service.removeListener('state', test);
					resolve();
				}
			});
		});
	}

	/**
	 * resolve when service changes to expectedState
	 * rejects after ms milliseconds
	 * @param {string} expectedState
	 * @param {number} ms           max time before promise is rejected
	 * @returns {Promise<void>}
	 */
	public async waitForStateChangeWithTimeout(expectedState: string, ms = 1000): Promise<void> {
		return timeout(this.waitForStateChange(expectedState), ms);
	}

	public abstract start(): Promise<void>;

	public abstract stop(): Promise<void>;

	public abstract reset(): Promise<void>;

	public abstract complete(): Promise<void>;

	public abstract abort(): Promise<void>;

	public abstract hold(): Promise<void>;

	public abstract unhold(): Promise<void>;

	public abstract pause(): Promise<void>;

	public abstract resume(): Promise<void>;

	public abstract restart(): Promise<void>;
}
