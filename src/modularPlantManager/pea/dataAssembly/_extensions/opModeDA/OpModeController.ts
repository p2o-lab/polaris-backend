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
import {OpcUaDataItem} from '../../../connection';
import {BaseDataAssemblyRuntime} from '../../DataAssemblyController';
import {catDataAssembly} from '../../../../../logging';

export type OpModeRuntime = BaseDataAssemblyRuntime & {
	StateChannel: OpcUaDataItem<boolean>;
	StateOffAut: OpcUaDataItem<boolean>;
	StateOpAut: OpcUaDataItem<boolean>;
	StateAutAut: OpcUaDataItem<boolean>;
	StateOffOp: OpcUaDataItem<boolean>;
	StateOpOp: OpcUaDataItem<boolean>;
	StateAutOp: OpcUaDataItem<boolean>;
	StateOpAct: OpcUaDataItem<boolean>;
	StateAutAct: OpcUaDataItem<boolean>;
	StateOffAct: OpcUaDataItem<boolean>;
};

export class OpModeController {

	private dAController: any;

	constructor(dAController: any) {
		this.dAController = dAController;
		this.initialize();
	}

	private initialize(): void {
		this.dAController.communication.StateChannel = this.dAController.createDataItem('StateChannel', 'read', 'boolean');

		this.dAController.communication.StateOffAut = this.dAController.createDataItem('StateOffAut', 'read', 'boolean');
		this.dAController.communication.StateOpAut = this.dAController.createDataItem('StateOpAut', 'read', 'boolean');
		this.dAController.communication.StateAutAut = this.dAController.createDataItem('StateAutAut', 'read', 'boolean');

		this.dAController.communication.StateOffOp = this.dAController.createDataItem('StateOffOp', 'write', 'boolean');
		this.dAController.communication.StateOpOp = this.dAController.createDataItem('StateOpOp', 'write', 'boolean');
		this.dAController.communication.StateAutOp = this.dAController.createDataItem('StateAutOp', 'write', 'boolean');

		this.dAController.communication.StateOffAct = this.dAController.createDataItem('StateOffAct', 'read', 'boolean');
		this.dAController.communication.StateOpAct = this.dAController.createDataItem('StateOpAct', 'read', 'boolean');
		this.dAController.communication.StateAutAct = this.dAController.createDataItem('StateAutAct', 'read', 'boolean');
	}

	public getOperationMode(): OperationMode {
		if (this.isOffState()) {
			return OperationMode.Offline;
		} else if (this.isManualState()) {
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
				return this.isManualState();
			case OperationMode.Offline:
				return this.isOffState();
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
	 * Set data assembly to automatic operation mode and source to external source
	 *
	 */
	public async setToAutomaticOperationMode(): Promise<void> {
		catDataAssembly.info(`[${this.dAController.name}] Current opMode = ${this.getOperationMode()}`);
		if (this.isOffState()) {
			catDataAssembly.trace(`[${this.dAController.name}] First go to Manual state`);
			this.writeOpMode(OperationMode.Operator);
			await this.waitForOpModeToPassSpecificTest(OperationMode.Operator);
		}
		catDataAssembly.info(`[${this.dAController.name}] Current opMode = ${this.getOperationMode()}`);

		if (this.isManualState()) {
			catDataAssembly.trace(`[${this.dAController.name}] Then to automatic`);
			this.writeOpMode(OperationMode.Automatic);
			await this.waitForOpModeToPassSpecificTest(OperationMode.Automatic);
		}
		catDataAssembly.info(`[${this.dAController.name}] Current opMode = ${this.getOperationMode()}`);
	}

	public async setToOperatorOperationMode(): Promise<void> {
		if (!this.isManualState()) {
			this.writeOpMode(OperationMode.Operator);
			await this.waitForOpModeToPassSpecificTest(OperationMode.Operator);
		}
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
		catDataAssembly.info(`[${this.dAController.name}] Setting opMode successfully`);
	}

	public isOffState(): boolean {
		return this.dAController.communication.StateOffAct.value === true;
	}

	public isAutomaticState(): boolean {
		return this.dAController.communication.StateAutAct.value === true;
	}

	public isManualState(): boolean {
		return this.dAController.communication.StateOpAct.value === true;
	}
}
