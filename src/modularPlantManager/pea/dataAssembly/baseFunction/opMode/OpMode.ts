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
import {DataItem} from '../../dataItem/DataItem';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';

export type OpModeRuntime = {
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
export interface OpModeEvents {
	changed: {
		opMode: OperationMode;
		stateChannel: boolean;
	};
}

type OpModeEmitter = StrictEventEmitter<EventEmitter, OpModeEvents>;

export class OpMode extends (EventEmitter as new() => OpModeEmitter) {

	public readonly dataItems!: OpModeRuntime;

	constructor(requiredDataItems: Required<OpModeRuntime>) {
		super();

		this.dataItems = requiredDataItems;


		this.dataItems.StateChannel.on('changed', () => {
			this.emit('changed', {opMode: this.getOperationMode(), stateChannel: this.dataItems.StateChannel.value});
		});
		// TODO: Always two of them will change in parallel --> Smart way to just emit one event?
		this.dataItems.StateOffAct.on('changed', () => {
			this.emit('changed', {opMode: this.getOperationMode(), stateChannel: this.dataItems.StateChannel.value});
		});
		this.dataItems.StateOpAct.on('changed', () => {
			this.emit('changed', {opMode: this.getOperationMode(), stateChannel: this.dataItems.StateChannel.value});
		});
		this.dataItems.StateAutAct.on('changed', () => {
			this.emit('changed', {opMode: this.getOperationMode(), stateChannel: this.dataItems.StateChannel.value});
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
		return new Promise((resolve) => {
			if (this.isOpMode(expectedOpMode)) {
				resolve();
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.on('changed', function test(this: any) {
					if (this.isOpMode(expectedOpMode)) {
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
		if (this.isOfflineState()) {
			this.writeOpMode(OperationMode.Operator).then();
			await this.waitForOpModeToPassSpecificTest(OperationMode.Operator);
		}

		if (this.isOperatorState()) {
			this.writeOpMode(OperationMode.Automatic).then();
			await this.waitForOpModeToPassSpecificTest(OperationMode.Automatic);
		}
	}

	/**
	 * Set data assembly to operator operation mode
	 *
	 */
	public async setToOperatorOperationMode(): Promise<void> {
		if (!this.isOperatorState()) {
			this.writeOpMode(OperationMode.Operator).then();
			await this.waitForOpModeToPassSpecificTest(OperationMode.Operator);
		}
	}

	/**
	 * Set data assembly to offline operation mode
	 *
	 */
	public async setToOfflineOperationMode(): Promise<void> {
		if (this.isAutomaticState()) {
			this.writeOpMode(OperationMode.Operator).then();
			await this.waitForOpModeToPassSpecificTest(OperationMode.Operator);
		}

		if (this.isOperatorState()) {
			this.writeOpMode(OperationMode.Offline).then();
			await this.waitForOpModeToPassSpecificTest(OperationMode.Offline);
		}
	}

	public async writeOpMode(opMode: OperationMode): Promise<void> {
		if (opMode === OperationMode.Automatic) {
			await this.dataItems.StateAutOp.write(true);
		} else if (opMode === OperationMode.Operator) {
			await this.dataItems.StateOpOp.write(true);
		} else if (opMode === OperationMode.Offline) {
			await this.dataItems.StateOffOp.write(true);
		}
	}

	public isOfflineState(): boolean {
		return this.dataItems.StateOffAct.value;
	}

	public isAutomaticState(): boolean {
		return this.dataItems.StateAutAct.value;
	}

	public isOperatorState(): boolean {
		return this.dataItems.StateOpAct.value;
	}
}
