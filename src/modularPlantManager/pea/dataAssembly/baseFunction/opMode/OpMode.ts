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

import {OperationMode} from '@p2olab/polaris-interface';
import {DataItem} from '../../../connection';
import {BaseDataAssemblyRuntime} from '../../DataAssemblyController';
import {catDataAssembly} from '../../../../../logging';
import {BaseServiceEvents} from '../../../serviceSet';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';

export type OpModeRuntime = BaseDataAssemblyRuntime & {
	StateChannel: DataItem<boolean>;
	StateOffAut: DataItem<boolean>;
	StateOpAut: DataItem<boolean>;
	StateAutAut: DataItem<boolean>;
	StateOffOp: DataItem<boolean>;
	StateOpOp: DataItem<boolean>;
	StateAutOp: DataItem<boolean>;
	StateOpAct: DataItem<boolean>;
	StateAutAct: DataItem<boolean>;
	StateOffAct: DataItem<boolean>;
};

/**
 * Events emitted by [[OpMode]]
 */
export interface OpModeEvents extends BaseServiceEvents {
	changed: {
		opMode: OperationMode;
		stateChannel: boolean;
	};
}

type OpModeEmitter = StrictEventEmitter<EventEmitter, OpModeEvents>;

export class OpMode extends (EventEmitter as new() => OpModeEmitter) {

	private dAController: any;

	constructor(dAController: any) {
		super();
		this.dAController = dAController;
		this.initialize();
	}

	private initialize(): void {
		this.dAController.communication.StateChannel = this.dAController.createDataItem('StateChannel', 'boolean');

		this.dAController.communication.StateOffAut = this.dAController.createDataItem('StateOffAut', 'boolean');
		this.dAController.communication.StateOpAut = this.dAController.createDataItem('StateOpAut', 'boolean');
		this.dAController.communication.StateAutAut = this.dAController.createDataItem('StateAutAut', 'boolean');

		this.dAController.communication.StateOffOp = this.dAController.createDataItem('StateOffOp', 'boolean', 'write');
		this.dAController.communication.StateOpOp = this.dAController.createDataItem('StateOpOp', 'boolean', 'write');
		this.dAController.communication.StateAutOp = this.dAController.createDataItem('StateAutOp', 'boolean', 'write');

		this.dAController.communication.StateOffAct = this.dAController.createDataItem('StateOffAct', 'boolean');
		this.dAController.communication.StateOpAct = this.dAController.createDataItem('StateOpAct',  'boolean');
		this.dAController.communication.StateAutAct = this.dAController.createDataItem('StateAutAct', 'boolean');

		this.dAController.communication.StateChannel.on('changed', () => {
			this.emit('changed', {opMode: this.getOperationMode(), stateChannel: this.dAController.communication.StateChannel.value});
		});
		// TODO: Always two of them will change in parallel --> Smart way to just emit one event?
		this.dAController.communication.StateOffAct.on('changed', () => {
			this.emit('changed', {opMode: this.getOperationMode(), stateChannel: this.dAController.communication.StateChannel.value});
		});
		this.dAController.communication.StateOpAct.on('changed', () => {
			this.emit('changed', {opMode: this.getOperationMode(), stateChannel: this.dAController.communication.StateChannel.value});
		});
		this.dAController.communication.StateAutAct.on('changed', () => {
			this.emit('changed', {opMode: this.getOperationMode(), stateChannel: this.dAController.communication.StateChannel.value});
		});
	}

	public getOperationMode(): OperationMode {
		if (this.isOfflineState()) {
			return OperationMode.Offline;
		} else if (this.isOperatorState()) {
			return OperationMode.Operator;
		} else if (this.isAutomaticState()) {
			return OperationMode.Automatic;
		}
		return OperationMode.Offline;
	}

	public isOpMode(expectedOpMode: OperationMode): boolean {
		switch (expectedOpMode) {
			case OperationMode.Automatic:
				return this.isAutomaticState();
			case OperationMode.Operator:
				return this.isOperatorState();
			case OperationMode.Offline:
				return this.isOfflineState();
		}
	}

	public async waitForOpModeToPassSpecificTest(expectedOpMode: OperationMode): Promise<void> {
		await this.dAController.subscribe();
		return new Promise((resolve) => {
			if (this.isOpMode(expectedOpMode)) {
				resolve();
			} else {
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				const da = this;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.dAController.on('changed', function test(this: any) {
					if (da.isOpMode(expectedOpMode)) {
						this.removeListener('OpMode', test);
						resolve();
					}
				});
			}
		});
	}

	/**
	 * Set data assembly to automatic operation mode
	 *
	 */
	public async setToAutomaticOperationMode(): Promise<void> {
		// TODO: introduce resolve reject mechanism
		catDataAssembly.info(`[${this.dAController.name}] Current opMode = ${this.getOperationMode()}`);
		if (this.isOfflineState()) {
			catDataAssembly.trace(`[${this.dAController.name}] First go to Manual state`);
			this.writeOpMode(OperationMode.Operator);
			await this.waitForOpModeToPassSpecificTest(OperationMode.Operator);
			catDataAssembly.info(`[${this.dAController.name}] New opMode = ${this.getOperationMode()}`);
		}

		if (this.isOperatorState()) {
			catDataAssembly.trace(`[${this.dAController.name}] Then to automatic`);
			this.writeOpMode(OperationMode.Automatic);
			await this.waitForOpModeToPassSpecificTest(OperationMode.Automatic);
			catDataAssembly.info(`[${this.dAController.name}] New opMode = ${this.getOperationMode()}`);
		}
	}

	/**
	 * Set data assembly to operator operation mode
	 *
	 */
	public async setToOperatorOperationMode(): Promise<void> {
		if (!this.isOperatorState()) {
			this.writeOpMode(OperationMode.Operator);
			await this.waitForOpModeToPassSpecificTest(OperationMode.Operator);
		}
	}

	/**
	 * Set data assembly to offline operation mode
	 *
	 */
	public async setToOfflineOperationMode(): Promise<void> {
		catDataAssembly.info(`[${this.dAController.name}] Current opMode = ${this.getOperationMode()}`);
		if (this.isAutomaticState()) {
			catDataAssembly.trace(`[${this.dAController.name}] First go to Manual state`);
			this.writeOpMode(OperationMode.Operator);
			await this.waitForOpModeToPassSpecificTest(OperationMode.Operator);
		}
		catDataAssembly.info(`[${this.dAController.name}] Current opMode = ${this.getOperationMode()}`);

		if (this.isOperatorState()) {
			catDataAssembly.trace(`[${this.dAController.name}] Then to offline`);
			this.writeOpMode(OperationMode.Offline);
			await this.waitForOpModeToPassSpecificTest(OperationMode.Offline);
		}
		catDataAssembly.info(`[${this.dAController.name}] Current opMode = ${this.getOperationMode()}`);
	}

	public async writeOpMode(opMode: OperationMode): Promise<void> {
		catDataAssembly.info(`[${this.dAController.name}] Write opMode: ${opMode}`);
		if (opMode === OperationMode.Automatic) {
			await this.dAController.communication.StateAutOp.write(true);
		} else if (opMode === OperationMode.Operator) {
			await this.dAController.communication.StateOpOp.write(true);
		} else if (opMode === OperationMode.Offline) {
			await this.dAController.communication.StateOffOp.write(true);
		}
		catDataAssembly.info(`[${this.dAController.name}] OpMode changed successfully`);
	}

	public isOfflineState(): boolean {
		return this.dAController.communication.StateOffAct.value;
	}

	public isAutomaticState(): boolean {
		return this.dAController.communication.StateAutAct.value;
	}

	public isOperatorState(): boolean {
		return this.dAController.communication.StateOpAct.value;
	}
}
