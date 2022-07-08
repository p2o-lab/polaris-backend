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

export interface ResetRuntime extends DataAssemblyDataItems {
	ResetOp: DataItem<boolean>;
	ResetAut: DataItem<boolean>;
}

/**
 * Events emitted by [[Reset]]
 */
export interface ResetEvents {
	changed: {
		ResetOp: boolean;
		ResetAut: boolean;
	};
}

type ResetEmitter = StrictEventEmitter<EventEmitter, ResetEvents>;

export class Reset extends (EventEmitter as new () => ResetEmitter) {
	ResetOp: DataItem<boolean>;
	ResetAut: DataItem<boolean>;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler) {
		super();

		this.ResetOp = DataItemFactory.create(getDataItemModel(options, 'ResetOp'), connectionHandler);
		this.ResetAut = DataItemFactory.create(getDataItemModel(options, 'ResetAut'), connectionHandler);
	}
}
