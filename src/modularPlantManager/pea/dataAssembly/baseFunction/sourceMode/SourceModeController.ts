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
import {DataItem} from '../../dataItem/DataItem';
import {catDataAssembly} from '../../../../../logging';
import {BaseServiceEvents} from '../../../serviceSet';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../dataItem/DataItemFactory';

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
	SrcChannel: DataItem<boolean>;
	SrcIntAct: DataItem<boolean>;
	SrcIntAut: DataItem<boolean>;
	SrcIntOp: DataItem<boolean>;
	SrcManAct: DataItem<boolean>;
	SrcManAut: DataItem<boolean>;
	SrcManOp: DataItem<boolean>;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super();

		this.SrcChannel = DataItemFactory.create(getDataItemModel(options, 'SrcChannel'), connectionHandler);
		this.SrcManAut = DataItemFactory.create(getDataItemModel(options, 'SrcManAut'), connectionHandler);
		this.SrcIntAut = DataItemFactory.create(getDataItemModel(options, 'SrcIntAut'), connectionHandler);
		this.SrcManOp = DataItemFactory.create(getDataItemModel(options, 'SrcManOp'), connectionHandler);
		this.SrcIntOp = DataItemFactory.create(getDataItemModel(options, 'SrcIntOp'), connectionHandler);
		this.SrcManAct = DataItemFactory.create(getDataItemModel(options, 'SrcManAct'), connectionHandler);
		this.SrcIntAct = DataItemFactory.create(getDataItemModel(options, 'SrcIntAct'), connectionHandler);

		this.SrcChannel.on('changed', () => {
			this.emit('changed', {sourceMode: this.getSourceMode(), sourceChannel: this.SrcChannel.value});
		});
		// TODO: Always two of them will change in parallel --> Smart way to just emit one event?
		// Even if there are just inverted options both can be 0 initially, to not miss a change both were added here
		this.SrcIntAct.on('changed', () => {
			this.emit('changed', {sourceMode: this.getSourceMode(), sourceChannel: this.SrcChannel.value});
		});
		this.SrcManAct.on('changed', () => {
			this.emit('changed', {sourceMode: this.getSourceMode(), sourceChannel: this.SrcChannel.value});
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
				this.on('changed', function test(this: any) {
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
			catDataAssembly.trace('Change SourceMode to Manual');
			await this.writeSourceMode(SourceMode.Manual);
			await this.waitForSourceModeToPassSpecificTest(SourceMode.Manual);
		}
	}

	/**
	 * Set data assembly to internal source mode
	 */
	public async setToInternalSourceMode(): Promise<void> {
		if (this.isInternalSourceMode()) {
			catDataAssembly.trace('Change SourceMode to Internal');
			await this.writeSourceMode(SourceMode.Intern);
			await this.waitForSourceModeToPassSpecificTest(SourceMode.Intern);
		}
	}

	private async writeSourceMode(sourceMode: SourceMode): Promise<void> {
		catDataAssembly.debug(`Write SourceMode: ${sourceMode}`);
		if (sourceMode === SourceMode.Manual) {
			await this.SrcManOp.write(true);
		} else if (sourceMode === SourceMode.Intern) {
			await this.SrcIntOp.write(true);
		}
		catDataAssembly.debug('Set SourceMode successfully');
	}

	public isManualSourceMode(): boolean {
		return this.SrcManAct?.value === true;
	}

	public isInternalSourceMode(): boolean {
		return this.SrcIntAct?.value === true;
	}

}
