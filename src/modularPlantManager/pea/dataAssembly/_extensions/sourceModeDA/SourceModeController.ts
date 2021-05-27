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

//import {SourceModeController} from '@p2olab/polaris-interface';
import {OpcUaDataItem} from '../../../connection';
import {BaseDataAssemblyRuntime, DataAssemblyController} from '../../DataAssemblyController';
import {Constructor} from '../_helper';
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
	private srcChannel: OpcUaDataItem<boolean>;
	private srcIntAct: OpcUaDataItem<boolean>;
	private srcIntAut: OpcUaDataItem<boolean>;
	private srcIntOp: OpcUaDataItem<boolean>;
	private srcManAct: OpcUaDataItem<boolean>;
	private srcManAut: OpcUaDataItem<boolean>;
	private srcManOp: OpcUaDataItem<boolean>;

	constructor(dAController: any) {
		this.srcChannel = dAController.createDataItem('SrcChannel', 'read', 'boolean');
		this.srcManAut = dAController.createDataItem('SrcManAut', 'read', 'boolean');
		this.srcIntAut = dAController.createDataItem('SrcIntAut', 'read', 'boolean');
		this.srcManOp = dAController.createDataItem('SrcManOp', 'write', 'boolean');
		this.srcIntOp = dAController.createDataItem('SrcIntOp', 'write', 'boolean');
		this.srcManAct = dAController.createDataItem('SrcManAct', 'read', 'boolean');
		this.srcIntAct = dAController.createDataItem('SrcIntAct', 'read', 'boolean');
	}

	initializeSourceMode(dAController: any){
		dAController.communication.SrcChannel = this.srcChannel;
		dAController.communication.SrcManAut = this.srcManAut;
		dAController.communication.SrcIntAut = this.srcIntAut;
		dAController.communication.SrcManOp = this.srcManOp;
		dAController.communication.SrcIntOp = this.srcIntOp;
		dAController.communication.SrcManAct = this.srcManAct;
		dAController.communication.SrcIntAct = this.srcIntAct;
	}

/*		public getSourceMode(): SourceModeController {
			if (this.isExtSource()) {
				return SourceModeController.Manual;
			} else if (this.isIntSource()) {
				return SourceModeController.Intern;
			}
			return SourceModeController.Manual;
		}

		public isSourceMode(expectedSourceMode: SourceModeController): boolean {
			switch (expectedSourceMode) {
				case SourceModeController.Intern:
					return this.isIntSource();
				case SourceModeController.Manual:
					return this.isExtSource();
			}
		}

		public async waitForSourceModeToPassSpecificTest(expectedSourceMode: SourceModeController): Promise<void> {
			await this.subscribe();
			return new Promise((resolve) => {
				if (this.isSourceMode(expectedSourceMode)) {
					resolve();
				} else {
					// eslint-disable-next-line @typescript-eslint/no-this-alias
					const da = this;
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					this.on('changed', function test(this: any) {
						if (da.isSourceMode(expectedSourceMode)) {
							this.removeListener('OpMode', test);
							resolve();
						}
					});
				}
			});
		}

		/!**
		 * Set data assembly to external source mode
		 *!/
		public async setToExternalSourceMode(): Promise<void> {
			if (!this.isExtSource()) {
				catDataAssembly.trace(`[${this.name}] Finally to Ext`);
				await this.writeSourceMode(SourceModeController.Manual);
				await this.waitForSourceModeToPassSpecificTest(SourceModeController.Manual);
			}
		}

		public async writeSourceMode(sourceMode: SourceModeController): Promise<void> {
			catDataAssembly.debug(`[${this.name}] Write sourceMode: ${sourceMode}`);
			if (sourceMode === SourceModeController.Manual) {
				await this.communication.SrcManOp.write(true);
			} else if (sourceMode === SourceModeController.Intern) {
				await this.communication.SrcIntOp.write(true);
			}
			catDataAssembly.debug(`[${this.name}] Setting sourceMode successfully`);
		}

		public isExtSource(): boolean {
			return this.communication.SrcManAct?.value === true;
		}

		public isIntSource(): boolean {
			return this.communication.SrcIntAct?.value === true;
		}*/

}
