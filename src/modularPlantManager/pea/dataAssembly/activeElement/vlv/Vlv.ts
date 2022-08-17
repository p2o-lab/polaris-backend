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

import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {Interlock, OpMode, Reset} from '../../baseFunction';
import {ActiveElement} from '../ActiveElement';
import {ConnectionHandler} from '../../../connectionHandler/ConnectionHandler';
import {keys} from 'ts-transformer-keys';
import {VlvDataItems} from '@p2olab/pimad-types';

export class Vlv extends ActiveElement {

	public readonly dataItems!: VlvDataItems;

	public reset!: Reset;
	public interlock!: Interlock;
	public opMode!: OpMode;

	constructor(options: DataAssemblyModel, connectionHandler: ConnectionHandler, initial = false) {
		super(options, connectionHandler);

		if (initial) {
			const keyList = keys<typeof this.dataItems>();
			this.initializeDataItems(options, keyList);
			this.initializeBaseFunctions();
			this.subscribe().then();
		}	
	}

	protected initializeBaseFunctions() {
		super.initializeBaseFunctions();
		this.reset = new Reset(this.dataItems);
		this.interlock = new Interlock(this.dataItems);
		this.opMode = new OpMode(this.dataItems);
	}
}
