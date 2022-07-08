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
	DataAssembly, DataAssemblyDataItems, OpModeRuntime, OSLevel, WQCRuntime
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
import {DataItemFactory, getDataItemModel} from '../dataItem/DataItemFactory';

export type ServiceControlRuntime = DataAssemblyDataItems & OpModeRuntime & ServiceSourceModeRuntime & WQCRuntime & {
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
	public readonly communication!: ServiceControlRuntime;
	public readonly wqc: WQC;
	public readonly opMode: ServiceOpMode;
	public readonly osLevel: OSLevel;
	public readonly serviceSourceMode: ServiceSourceModeController;
	public readonly eventEmitter!: ServiceControlEmitter;
	private readonly logger: Category = catService;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super(options);

		this.wqc = new WQC(options, connectionHandler);
		this.opMode = new ServiceOpMode(options, connectionHandler);
		this.osLevel = new OSLevel(options, connectionHandler);
		this.serviceSourceMode = new ServiceSourceModeController(options, connectionHandler);
		this.eventEmitter = new EventEmitter();

		this.communication.CommandOp = DataItemFactory.create(getDataItemModel(options, 'CommandOp'), connectionHandler);
		this.communication.CommandInt = DataItemFactory.create(getDataItemModel(options, 'CommandInt'), connectionHandler);
		this.communication.CommandExt = DataItemFactory.create(getDataItemModel(options, 'CommandExt'), connectionHandler);
		this.communication.CommandEn = DataItemFactory.create(getDataItemModel(options, 'CommandEn'), connectionHandler);
		this.communication.StateCur = DataItemFactory.create(getDataItemModel(options, 'StateCur'), connectionHandler);

		this.communication.ProcedureOp = DataItemFactory.create(getDataItemModel(options, 'ProcedureOp'), connectionHandler);
		this.communication.ProcedureExt = DataItemFactory.create(getDataItemModel(options, 'ProcedureExt'), connectionHandler);
		this.communication.ProcedureInt = DataItemFactory.create(getDataItemModel(options, 'ProcedureInt'), connectionHandler);
		this.communication.ProcedureCur = DataItemFactory.create(getDataItemModel(options, 'ProcedureCur'), connectionHandler);
		this.communication.ProcedureReq = DataItemFactory.create(getDataItemModel(options, 'ProcedureReq'), connectionHandler);

		this.communication.InteractQuestionID = DataItemFactory.create(getDataItemModel(options, 'InteractQuestionID'), connectionHandler);
		this.communication.InteractAnswerID = DataItemFactory.create(getDataItemModel(options, 'InteractAnswerID'), connectionHandler);
		this.communication.PosTextID = DataItemFactory.create(getDataItemModel(options, 'PosTextID'), connectionHandler);

		this.defaultReadDataItem = this.communication.StateCur;
		this.defaultReadDataItemType = 'number';

		this.defaultWriteDataItem = this.communication.CommandExt;
		this.defaultWriteDataItemType = 'number';

		this.subscribeToChanges().then();
	}

	currentProcedure(): number | undefined {
		return this.communication.ProcedureCur.value;
	}

	requestedProcedure(): number | undefined {
		return this.communication.ProcedureReq.value;
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
		this.communication.ProcedureCur.on('changed', (data) => {
			this.logger.debug(`Procedure changed: ${JSON.stringify(data.value)}`);
			this.emit('procedure', {
				requestedProcedure: this.communication.ProcedureReq.value,
				currentProcedure: this.communication.ProcedureCur.value
			});
		});
		this.communication.ProcedureReq.on('changed', (data) => {
			this.logger.debug(`Procedure changed: ${JSON.stringify(data.value)}`);
			this.emit('procedure', {
				requestedProcedure: this.communication.ProcedureReq.value,
				currentProcedure: this.communication.ProcedureCur.value
			});
		});
		this.communication.StateCur.on('changed', () => {
			this.emit('state', this.communication.StateCur.value);
		});
		this.communication.InteractQuestionID.on('changed', () => {
			this.emit('question', this.communication.InteractQuestionID.value);
		});
		this.communication.CommandEn.on('changed', () => {
			this.emit('commandEn', this.communication.CommandEn.value);
		});
	}
}
