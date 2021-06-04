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

import {ServiceSourceMode} from '@p2olab/polaris-interface';
import {OpcUaDataItem} from '../../../connection';
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../../DataAssemblyController';
import {Constructor} from '../_helper';
import {catDataAssembly} from '../../../../../logging';

export interface ServiceSourceModeRuntime extends BaseDataAssemblyRuntime {
	SrcChannel: OpcUaDataItem<boolean>;
	SrcIntAct: OpcUaDataItem<boolean>;
	SrcIntAut: OpcUaDataItem<boolean>;
	SrcIntOp: OpcUaDataItem<boolean>;
	SrcExtAct: OpcUaDataItem<boolean>;
	SrcExtAut: OpcUaDataItem<boolean>;
	SrcExtOp: OpcUaDataItem<boolean>;
}


export class ServiceSourceModeController{


	private dAController: any;

	constructor(dAController: any) {
		this.dAController = dAController;
	}

	setCommunication(){
		this.dAController.communicationsrcChannel = this.dAController.createDataItem('SrcChannel', 'read', 'boolean');

		this.dAController.communicationsrcExtAut = this.dAController.createDataItem('SrcExtAut', 'read', 'boolean');
		this.dAController.communicationsrcIntAut = this.dAController.createDataItem('SrcIntAut', 'read', 'boolean');

		this.dAController.communicationsrcExtOp = this.dAController.createDataItem('SrcExtOp', 'write', 'boolean');
		this.dAController.communicationsrcIntOp = this.dAController.createDataItem('SrcIntOp', 'write', 'boolean');

		this.dAController.communicationsrcExtAct = this.dAController.createDataItem('SrcExtAct', 'read', 'boolean');
		this.dAController.communicationsrcIntAct = this.dAController.createDataItem('SrcIntAct', 'read', 'boolean');
	}

	public getServiceSourceMode(): ServiceSourceMode {
		if (this.isExtSource()) {
			return ServiceSourceMode.Extern;
		} else if (this.isIntSource()) {
			return ServiceSourceMode.Intern;
		}
		return ServiceSourceMode.Extern;
	}

	public isServiceSourceMode(expectedServiceSourceMode: ServiceSourceMode): boolean {
		switch (expectedServiceSourceMode) {
			case ServiceSourceMode.Intern:
				return this.isIntSource();
			case ServiceSourceMode.Extern:
				return this.isExtSource();
		}
	}

	public async waitForServiceSourceModeToPassSpecificTest(expectedServiceSourceMode: ServiceSourceMode): Promise<unknown> {
		await this.dAController.subscribe();
		return new Promise((resolve) => {
			if (this.isServiceSourceMode(expectedServiceSourceMode)) {
				resolve();
			} else {
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				const da = this;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.dAController.on('changed', function test(this: any) {
					if (da.isServiceSourceMode(expectedServiceSourceMode)) {
						this.removeListener('OpMode', test);
						resolve();
					}
				});
			}
		});
	}

	/**
	 * Set data assembly to external ServiceSourceMode
	 */
	public async setToExternalServiceSourceMode(): Promise<void> {
		if (!this.isExtSource()) {
			catDataAssembly.trace(`[${this.dAController.name}] Finally to Ext`);
			await this.writeServiceSourceMode(ServiceSourceMode.Extern);
			await this.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
		}
	}

	public async writeServiceSourceMode(serviceSourceMode: ServiceSourceMode): Promise<void> {
		catDataAssembly.debug(`[${this.dAController.name}] Write serviceSourceMode: ${serviceSourceMode}`);
		if (serviceSourceMode === ServiceSourceMode.Extern) {
			await this.dAController.communication.SrcExtOp.write(true);
		} else if (serviceSourceMode === ServiceSourceMode.Intern) {
			await this.dAController.communication.SrcIntOp.write(true);
		}
		catDataAssembly.debug(`[${this.dAController.name}] Setting serviceSourceMode successfully`);
	}

	public isExtSource(): boolean {
		return this.dAController.communication.SrcExtAct.value === true;
	}

	public isIntSource(): boolean {
		return this.dAController.communication.SrcIntAct.value === true;
	}
}
