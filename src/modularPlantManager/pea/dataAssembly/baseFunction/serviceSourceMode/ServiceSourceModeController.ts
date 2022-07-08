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
import {DataItem} from '../../dataItem/DataItem';
import {catDataAssembly} from '../../../../../logging';
import {BaseServiceEvents} from '../../../serviceSet';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../dataItem/DataItemFactory';

export interface ServiceSourceModeRuntime {
	SrcChannel: DataItem<boolean>;
	SrcIntAct: DataItem<boolean>;
	SrcIntAut: DataItem<boolean>;
	SrcIntOp: DataItem<boolean>;
	SrcExtAct: DataItem<boolean>;
	SrcExtAut: DataItem<boolean>;
	SrcExtOp: DataItem<boolean>;
}

/**
 * Events emitted by [[ServiceSourceMode]]
 */
export interface ServiceSourceModeEvents extends BaseServiceEvents {
	changed: {
		serviceSourceMode: ServiceSourceMode;
		sourceChannel: boolean;
	};
}
type ServiceSourceModeEmitter = StrictEventEmitter<EventEmitter, ServiceSourceModeEvents>;

export class ServiceSourceModeController extends (EventEmitter as new() => ServiceSourceModeEmitter){
	SrcChannel: DataItem<boolean>;
	SrcIntAct: DataItem<boolean>;
	SrcIntAut: DataItem<boolean>;
	SrcIntOp: DataItem<boolean>;
	SrcExtAct: DataItem<boolean>;
	SrcExtAut: DataItem<boolean>;
	SrcExtOp: DataItem<boolean>;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super();

		this.SrcChannel = DataItemFactory.create(getDataItemModel(options, 'SrcChannel'), connectionHandler);

		this.SrcExtAut = DataItemFactory.create(getDataItemModel(options, 'SrcExtAut'), connectionHandler);
		this.SrcIntAut = DataItemFactory.create(getDataItemModel(options, 'SrcIntAut'), connectionHandler);

		this.SrcExtOp = DataItemFactory.create(getDataItemModel(options, 'SrcExtOp'), connectionHandler);
		this.SrcIntOp = DataItemFactory.create(getDataItemModel(options, 'SrcIntOp'), connectionHandler);

		this.SrcExtAct = DataItemFactory.create(getDataItemModel(options, 'SrcExtAct'), connectionHandler);
		this.SrcIntAct = DataItemFactory.create(getDataItemModel(options, 'SrcIntAct'), connectionHandler);

		this.SrcChannel.on('changed', () => {
			this.emit('changed', {serviceSourceMode: this.getServiceSourceMode(), sourceChannel: this.SrcChannel.value});
		});
		// TODO: Always two of them will change in parallel --> Smart way to just emit one event?
		// Even if there are just inverted options both can be 0 initially, to not miss a change both were added here
		this.SrcIntAct.on('changed', () => {
			this.emit('changed', {serviceSourceMode: this.getServiceSourceMode(), sourceChannel: this.SrcChannel.value});
		});
		this.SrcExtAct.on('changed', () => {
			this.emit('changed', {serviceSourceMode: this.getServiceSourceMode(), sourceChannel: this.SrcChannel.value});
		});
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
		return new Promise<void>((resolve, reject) => {
			if (this.isServiceSourceMode(expectedServiceSourceMode)) {
				resolve();
			} else {
				setTimeout(() => {
					reject('Timeout: ServiceSourceMode did not change');
				}, 3000);
				// eslint-disable-next-line @typescript-eslint/no-this-alias
				const da = this;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.on('changed', function test(this: any) {
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
			await this.writeServiceSourceMode(ServiceSourceMode.Extern);
			await this.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Extern);
		}
	}

	/**
	 * Set data assembly to internal ServiceSourceMode
	 */
	public async setToInternalServiceSourceMode(): Promise<void> {
		if (!this.isIntSource()) {
			await this.writeServiceSourceMode(ServiceSourceMode.Intern);
			await this.waitForServiceSourceModeToPassSpecificTest(ServiceSourceMode.Intern);
		}
	}

	/**
	 * Write ServiceSourceMode to DataItem
	 */
	private async writeServiceSourceMode(serviceSourceMode: ServiceSourceMode): Promise<void> {
		catDataAssembly.debug(`Write serviceSourceMode: ${serviceSourceMode}`);
		if (serviceSourceMode === ServiceSourceMode.Extern) {
			await this.SrcExtOp.write(true);
		} else if (serviceSourceMode === ServiceSourceMode.Intern) {
			await this.SrcIntOp.write(true);
		}
		catDataAssembly.debug('Set serviceSourceMode');
	}

	public isExtSource(): boolean {
		return this.SrcExtAct.value;
	}

	public isIntSource(): boolean {
		return this.SrcIntAct.value;
	}
}
