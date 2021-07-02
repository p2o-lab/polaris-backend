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

import {SourceMode} from '@p2olab/polaris-interface';
import {OpcUaDataItem} from '../../../connection';
import {BaseDataAssemblyRuntime} from '../../DataAssemblyController';
import {catDataAssembly} from '../../../../../logging';

export interface SourceModeRuntime extends BaseDataAssemblyRuntime {
	SrcChannel: OpcUaDataItem<boolean>;
	SrcIntAct: OpcUaDataItem<boolean>;
	SrcIntAut: OpcUaDataItem<boolean>;
	SrcIntOp: OpcUaDataItem<boolean>;
	SrcManAct: OpcUaDataItem<boolean>;
	SrcManAut: OpcUaDataItem<boolean>;
	SrcManOp: OpcUaDataItem<boolean>;
}

export class SourceModeController {
	private dAController: any;

	constructor(dAController: any) {
		this.dAController = dAController;
	}

	initialize(){
		this.dAController.communication.SrcChannel = this.dAController.createDataItem('SrcChannel', 'read', 'boolean');
		this.dAController.communication.SrcManAut = this.dAController.createDataItem('SrcManAut', 'read', 'boolean');
		this.dAController.communication.SrcIntAut = this.dAController.createDataItem('SrcIntAut', 'read', 'boolean');
		this.dAController.communication.SrcManOp = this.dAController.createDataItem('SrcManOp', 'write', 'boolean');
		this.dAController.communication.SrcIntOp = this.dAController.createDataItem('SrcIntOp', 'write', 'boolean');
		this.dAController.communication.SrcManAct = this.dAController.createDataItem('SrcManAct', 'read', 'boolean');
		this.dAController.communication.SrcIntAct = this.dAController.createDataItem('SrcIntAct', 'read', 'boolean');
	}

	public getSourceMode(): SourceMode {
		if (this.isExtSource()) {
			return SourceMode.Manual;
		} else if (this.isIntSource()) {
			return SourceMode.Intern;
		}
		return SourceMode.Manual;
	}

	public isSourceMode(expectedSourceMode: SourceMode): boolean {
		switch (expectedSourceMode) {
			case SourceMode.Intern:
				return this.isIntSource();
			case SourceMode.Manual:
				return this.isExtSource();
		}
	}

	public async waitForSourceModeToPassSpecificTest(expectedSourceMode: SourceMode): Promise<void> {
		await this.dAController.subscribe();
		return new Promise((resolve) => {
			if (this.isSourceMode(expectedSourceMode)) {
				resolve();
			} else {
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				const da = this;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.dAController.on('changed', function test(this: any) {
					if (da.isSourceMode(expectedSourceMode)) {
						this.removeListener('OpMode', test);
						resolve();
					}
				});
			}
		});
	}

	/**
	 * Set data assembly to external source mode
	 */
	public async setToExternalSourceMode(): Promise<void> {
		if (!this.isExtSource()) {
			catDataAssembly.trace(`[${this.dAController.name}] Finally to Ext`);
			await this.writeSourceMode(SourceMode.Manual);
			await this.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		}
	}

	public async writeSourceMode(sourceMode: SourceMode): Promise<void> {
		catDataAssembly.debug(`[${this.dAController.name}] Write sourceMode: ${sourceMode}`);
		if (sourceMode === SourceMode.Manual) {
			await this.dAController.communication.SrcManOp.write(true);
		} else if (sourceMode === SourceMode.Intern) {
			await this.dAController.communication.SrcIntOp.write(true);
		}
		catDataAssembly.debug(`[${this.dAController.name}] Setting sourceMode successfully`);
	}

	public isExtSource(): boolean {
		return this.dAController.communication.SrcManAct?.value === true;
	}

	public isIntSource(): boolean {
		return this.dAController.communication.SrcIntAct?.value === true;
	}

}
