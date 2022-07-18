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
import {DataAssemblyDataItems} from '../../DataAssembly';
import {catDataAssembly} from '../../../../../logging';
import {BaseServiceEvents} from '../../../serviceSet';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../dataItem/DataItemFactory';
import {UnitSettingsRuntime} from '../unitSettings/UnitSettings';

export type ServiceOpModeRuntime = DataAssemblyDataItems & {
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
 * Events emitted by [[ServiceOpMode]]
 */
export interface ServiceOpModeEvents {
	changed: {
		opMode: OperationMode;
		stateChannel: boolean;
	};
}

type ServiceOpModeEmitter = StrictEventEmitter<EventEmitter, ServiceOpModeEvents>;

export class ServiceOpMode extends (EventEmitter as new () => ServiceOpModeEmitter) {

	public readonly dataItems!: ServiceOpModeRuntime;

	constructor(requiredDataItems: Required<ServiceOpModeRuntime>) {
		super();

		this.dataItems = requiredDataItems;


		this.dataItems.StateChannel.on('changed', () => {
			this.emit('changed', {opMode: this.getServiceOperationMode(), stateChannel: this.dataItems.StateChannel.value});
		});
		// TODO: Always two of them will change in parallel --> Smart way to just emit one event?
		this.dataItems.StateOffAct.on('changed', () => {
			this.emit('changed', {opMode: this.getServiceOperationMode(), stateChannel: this.dataItems.StateChannel.value});
		});
		this.dataItems.StateOpAct.on('changed', () => {
			this.emit('changed', {opMode: this.getServiceOperationMode(), stateChannel: this.dataItems.StateChannel.value});
		});
		this.dataItems.StateAutAct.on('changed', () => {
			this.emit('changed', {opMode: this.getServiceOperationMode(), stateChannel: this.dataItems.StateChannel.value});
		});
	}

	public getServiceOperationMode(): OperationMode {
		if (this.isOfflineState()) {
			return OperationMode.Offline;
		} else if (this.isOperatorState()) {
			return OperationMode.Operator;
		} else if (this.isAutomaticState()) {
			return OperationMode.Automatic;
		}
		return OperationMode.Offline;
	}

	public isServiceOpMode(expectedOpMode: OperationMode): boolean {
		switch (expectedOpMode) {
			case OperationMode.Automatic:
				return this.isAutomaticState();
			case OperationMode.Operator:
				return this.isOperatorState();
			case OperationMode.Offline:
				return this.isOfflineState();
		}
	}

	public async waitForServiceOpModeToPassSpecificTest(expectedOpMode: OperationMode): Promise<void> {
		return new Promise((resolve) => {
			if (this.isServiceOpMode(expectedOpMode)) {
				resolve();
			} else {
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				const da = this;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				da.on('changed', function test(this: any) {
					if (da.isServiceOpMode(expectedOpMode)) {
						this.removeListener('ServiceOpMode', test);
						resolve();
					}
				});
			}
		});
	}

	/**
	 * Set service data assembly to automatic operation mode
	 *
	 */
	public async setToAutomaticOperationMode(): Promise<void> {
		catDataAssembly.info(`Current ServiceOpMode = ${this.getServiceOperationMode()}`);
		if (!this.isAutomaticState()) {
			this.writeOpMode(OperationMode.Automatic);
			await this.waitForServiceOpModeToPassSpecificTest(OperationMode.Automatic);
		}
		catDataAssembly.info(`Current ServiceOpMode = ${this.getServiceOperationMode()}`);
	}

	/**
	 * Set service data assembly to operator operation mode
	 *
	 */
	public async setToOperatorOperationMode(): Promise<void> {
		catDataAssembly.info(`Current ServiceOpMode = ${this.getServiceOperationMode()}`);
		if (!this.isOperatorState()) {
			this.writeOpMode(OperationMode.Operator);
			await this.waitForServiceOpModeToPassSpecificTest(OperationMode.Operator);
		}
		catDataAssembly.info(`Current ServiceOpMode = ${this.getServiceOperationMode()}`);
	}

	/**
	 * Set service data assembly to offline operation mode
	 *
	 */
	public async setToOfflineOperationMode(): Promise<void> {
		catDataAssembly.debug(`Current ServiceOpMode = ${this.getServiceOperationMode()}`);
		if (!this.isOfflineState()) {
			this.writeOpMode(OperationMode.Offline);
			await this.waitForServiceOpModeToPassSpecificTest(OperationMode.Offline);
		}
		catDataAssembly.debug(`Current ServiceOpMode = ${this.getServiceOperationMode()}`);
	}

	private async writeOpMode(opMode: OperationMode): Promise<void> {
		catDataAssembly.debug(`Write opMode: ${opMode}`);
		if (opMode === OperationMode.Automatic) {
			await this.dataItems.StateAutOp.write(true);
		} else if (opMode === OperationMode.Operator) {
			await this.dataItems.StateOpOp.write(true);
		} else if (opMode === OperationMode.Offline) {
			await this.dataItems.StateOffOp.write(true);
		}
		catDataAssembly.debug('Setting opMode successfully');
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
