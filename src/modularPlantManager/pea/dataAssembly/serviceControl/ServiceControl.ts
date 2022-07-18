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

import {DataItem} from '../dataItem/DataItem';
import {
	DataAssembly, DataAssemblyDataItems, OpModeRuntime, OSLevel, OSLevelRuntime, WQCRuntime
} from '../index';
import {OperationMode, ServiceSourceMode} from '@p2olab/polaris-interface';
import {WQC} from '../baseFunction';
import {
	ServiceSourceModeController,
	ServiceSourceModeRuntime
} from '../baseFunction/serviceSourceMode/ServiceSourceModeController';
import {BaseServiceEvents} from '../../serviceSet';
import StrictEventEmitter from 'strict-event-emitter-types';
import {EventEmitter} from 'events';
import {Category} from 'typescript-logging';
import {catService} from '../../../../logging';
import {ServiceOpMode} from '../baseFunction/serviceOpMode/ServiceOpMode';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../connectionHandler/ConnectionHandler';
import {keys} from 'ts-transformer-keys';

export type ServiceControlRuntime = DataAssemblyDataItems & OpModeRuntime & OSLevelRuntime & ServiceSourceModeRuntime & WQCRuntime & {
	CommandOp: DataItem<number>;
	CommandInt: DataItem<number>;
	CommandExt: DataItem<number>;
	CommandEn: DataItem<number>;
	StateCur: DataItem<number>;

	ProcedureOp: DataItem<number>;
	ProcedureExt: DataItem<number>;
	ProcedureInt: DataItem<number>;
	ProcedureCur: DataItem<number>;
	ProcedureReq: DataItem<number>;

	InteractQuestionID: DataItem<number>;
	InteractAnswerID: DataItem<number>;
	PosTextID: DataItem<number>;
};

/**
 * Events emitted by [[ServiceControl]]
 */
export interface ServiceControlEvents extends BaseServiceEvents {
	wqc: number;
	opMode: OperationMode;
	serviceSourceMode: ServiceSourceMode;
	osLevel: number;
	procedure: {
		requestedProcedure: number | undefined,
		currentProcedure: number | undefined,
	};
	state: number;
	question: number;
	commandEn: number;
}

type ServiceControlEmitter = StrictEventEmitter<EventEmitter, ServiceControlEvents>;


export class ServiceControl extends DataAssembly {

	public readonly dataItems!: ServiceControlRuntime;
	public readonly eventEmitter!: ServiceControlEmitter;

	public opMode!: ServiceOpMode;
	public osLevel!: OSLevel;
	public serviceSourceMode!: ServiceSourceModeController;
	public wqc!: WQC;

	private readonly logger: Category = catService;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler, initial = false) {
		super(options, connectionHandler);

		this.eventEmitter = new EventEmitter();

		if (initial) {
			const keyList = keys<typeof this.dataItems>();
			this.initializeDataItems(options, keyList);
			this.initializeBaseFunctions();
		}	

		this.defaultReadDataItem = this.dataItems.StateCur;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.dataItems.CommandExt;
		this.defaultWriteDataItemType = 'number';

		this.subscribeToChanges().then();
	}

	protected initializeBaseFunctions() {
		super.initializeBaseFunctions();
		this.wqc = new WQC(this.dataItems);
		this.opMode = new ServiceOpMode(this.dataItems);
		this.osLevel = new OSLevel(this.dataItems);
		this.serviceSourceMode = new ServiceSourceModeController(this.dataItems);
	}

	currentProcedure(): number | undefined {
		return this.dataItems.ProcedureCur.value;
	}

	requestedProcedure(): number | undefined {
		return this.dataItems.ProcedureReq.value;
	}

	/**
	 * Notify about changes in to serviceControl, procedures, configuration parameters and process values
	 * via events and log messages
	 */
	private async subscribeToChanges(): Promise<void> {
		this.logger.info('[ServiceControl] Subscribe to value changes');

		this.wqc.on('changed', (data) => {
			this.logger.debug(`WQC changed: ${JSON.stringify(data)}`);
			this.emit('wqc', data);
		});
		this.opMode.on('changed', (data) => {
			this.logger.debug(`OpMode changed: ${JSON.stringify(data)}`);
			this.emit('opMode', data);
		});
		this.serviceSourceMode.on('changed', (data) => {
			this.logger.debug(`ServiceSourceMode changed: ${JSON.stringify(data.serviceSourceMode)}`);
			this.emit('serviceSourceMode', data.serviceSourceMode);
		});
		this.osLevel.on('changed', (data) => {
			this.logger.debug(`OSLevel changed: ${JSON.stringify(data)}`);
			this.emit('osLevel', data);
		});
		this.dataItems.ProcedureCur.on('changed', (data) => {
			this.logger.debug(`Procedure changed: ${JSON.stringify(data.value)}`);
			this.emit('procedure', {
				requestedProcedure: this.dataItems.ProcedureReq.value,
				currentProcedure: this.dataItems.ProcedureCur.value
			});
		});
		this.dataItems.ProcedureReq.on('changed', (data) => {
			this.logger.debug(`Procedure changed: ${JSON.stringify(data.value)}`);
			this.emit('procedure', {
				requestedProcedure: this.dataItems.ProcedureReq.value,
				currentProcedure: this.dataItems.ProcedureCur.value
			});
		});
		this.dataItems.StateCur.on('changed', () => {
			this.emit('state', this.dataItems.StateCur.value);
		});
		this.dataItems.InteractQuestionID.on('changed', () => {
			this.emit('question', this.dataItems.InteractQuestionID.value);
		});
		this.dataItems.CommandEn.on('changed', () => {
			this.emit('commandEn', this.dataItems.CommandEn.value);
		});
	}
}