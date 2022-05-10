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

import {ServiceSourceMode, SourceMode} from '@p2olab/polaris-interface';
import {DataItem} from '../../../connection';
import {catDataAssembly} from '../../../../../logging';
import {BaseServiceEvents} from '../../../serviceSet';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';

export type SourceModeRuntime = {
	SrcChannel: DataItem<boolean>;
	SrcIntAct: DataItem<boolean>;
	SrcIntAut: DataItem<boolean>;
	SrcIntOp: DataItem<boolean>;
	SrcManAct: DataItem<boolean>;
	SrcManAut: DataItem<boolean>;
	SrcManOp: DataItem<boolean>;
}

/**
 * Events emitted by [[SourceMode]]
 */
export interface SourceModeEvents extends BaseServiceEvents {
	changed: {
		sourceMode: SourceMode;
		sourceChannel: boolean;
	};
}
type SourceModeEmitter = StrictEventEmitter<EventEmitter, SourceModeEvents>;

export class SourceModeController extends (EventEmitter as new () => SourceModeEmitter) {
	private dAController: any;

	constructor(dAController: any) {
		super();
		this.dAController = dAController;
		this.initialize();
	}

	private initialize(): void {
		this.dAController.communication.SrcChannel = this.dAController.createDataItem('SrcChannel', 'boolean');
		this.dAController.communication.SrcManAut = this.dAController.createDataItem('SrcManAut', 'boolean');
		this.dAController.communication.SrcIntAut = this.dAController.createDataItem('SrcIntAut', 'boolean');
		this.dAController.communication.SrcManOp = this.dAController.createDataItem('SrcManOp', 'boolean', 'write');
		this.dAController.communication.SrcIntOp = this.dAController.createDataItem('SrcIntOp', 'boolean', 'write');
		this.dAController.communication.SrcManAct = this.dAController.createDataItem('SrcManAct', 'boolean');
		this.dAController.communication.SrcIntAct = this.dAController.createDataItem('SrcIntAct','boolean');

		this.dAController.communication.SrcChannel.on('changed', () => {
			this.emit('changed', {sourceMode: this.getSourceMode(), sourceChannel: this.dAController.communication.SrcChannel.value});
		});
		// TODO: Always two of them will change in parallel --> Smart way to just emit one event?
		// Even if there are just inverted options both can be 0 initially, to not miss a change both were added here
		this.dAController.communication.SrcIntAct.on('changed', () => {
			this.emit('changed', {sourceMode: this.getSourceMode(), sourceChannel: this.dAController.communication.SrcChannel.value});
		});
		this.dAController.communication.SrcExtAct.on('changed', () => {
			this.emit('changed', {sourceMode: this.getSourceMode(), sourceChannel: this.dAController.communication.SrcChannel.value});
		});
	}

	public getSourceMode(): SourceMode {
		if (this.isManualSourceMode()) {
			return SourceMode.Manual;
		} else if (this.isInternalSourceMode()) {
			return SourceMode.Intern;
		}
		return SourceMode.Manual;
	}

	public isSourceMode(expectedSourceMode: SourceMode): boolean {
		switch (expectedSourceMode) {
			case SourceMode.Intern:
				return this.isInternalSourceMode();
			case SourceMode.Manual:
				return this.isManualSourceMode();
		}
	}

	public async waitForSourceModeToPassSpecificTest(expectedSourceMode: SourceMode): Promise<void> {
		await this.dAController.subscribe();
		return new Promise((resolve, reject) => {
			if (this.isSourceMode(expectedSourceMode)) {
				resolve();
			} else {
				setTimeout(() => {
					reject('Timeout: SourceMode did not change');
				}, 3000);
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
	 * Set data assembly to manual source mode
	 */
	public async setToManualSourceMode(): Promise<void> {
		if (this.isInternalSourceMode()) {
			catDataAssembly.trace(`[${this.dAController.name}] Change SourceMode to Manual`);
			await this.writeSourceMode(SourceMode.Manual);
			await this.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		}
	}

	/**
	 * Set data assembly to internal source mode
	 */
	public async setToInternalSourceMode(): Promise<void> {
		if (this.isInternalSourceMode()) {
			catDataAssembly.trace(`[${this.dAController.name}] Change SourceMode to Internal`);
			await this.writeSourceMode(SourceMode.Intern);
			await this.waitForSourceModeToPassSpecificTest(SourceMode.Intern);
		}
	}

	private async writeSourceMode(sourceMode: SourceMode): Promise<void> {
		catDataAssembly.debug(`[${this.dAController.name}] Write SourceMode: ${sourceMode}`);
		if (sourceMode === SourceMode.Manual) {
			await this.dAController.communication.SrcManOp.write(true);
		} else if (sourceMode === SourceMode.Intern) {
			await this.dAController.communication.SrcIntOp.write(true);
		}
		catDataAssembly.debug(`[${this.dAController.name}] Changed SourceMode successfully`);
	}

	public isManualSourceMode(): boolean {
		return this.dAController.communication.SrcManAct?.value === true;
	}

	public isInternalSourceMode(): boolean {
		return this.dAController.communication.SrcIntAct?.value === true;
	}

}
