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

import {DataItem} from '../../dataItem/DataItem';
import {DataAssemblyDataItems} from '../../DataAssembly';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {DataItemFactory, getDataItemModel} from '../../dataItem/DataItemFactory';
import {EventEmitter} from 'events';
import {BaseServiceEvents} from '../../../serviceSet';
import {OperationMode} from '@p2olab/polaris-interface';
import StrictEventEmitter from 'strict-event-emitter-types';

export type InterlockRuntime = DataAssemblyDataItems & {
	PermEn: DataItem<boolean>;
	Permit: DataItem<boolean>;
	IntlEn: DataItem<boolean>;
	Interlock: DataItem<boolean>;
	ProtEn: DataItem<boolean>;
	Protect: DataItem<boolean>;
};

/**
 * Events emitted by [[OpMode]]
 */
export interface InterlockEvents extends BaseServiceEvents {
	changed: string;
}

type InterlockEmitter = StrictEventEmitter<EventEmitter, InterlockEvents>;

export class Interlock extends (EventEmitter as new() => InterlockEmitter) {
	PermEn: DataItem<boolean>;
	Permit: DataItem<boolean>;
	IntlEn: DataItem<boolean>;
	Interlock: DataItem<boolean>;
	ProtEn: DataItem<boolean>;
	Protect: DataItem<boolean>;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super();

		this.PermEn = DataItemFactory.create(getDataItemModel(options, 'PermEn'), connectionHandler);
		this.Permit = DataItemFactory.create(getDataItemModel(options, 'Permit'), connectionHandler);
		this.IntlEn = DataItemFactory.create(getDataItemModel(options, 'IntlEn'), connectionHandler);
		this.Interlock = DataItemFactory.create(getDataItemModel(options, 'Interlock'), connectionHandler);
		this.ProtEn = DataItemFactory.create(getDataItemModel(options, 'ProtEn'), connectionHandler);
		this.Protect = DataItemFactory.create(getDataItemModel(options, 'Protect'), connectionHandler);
	}
}
