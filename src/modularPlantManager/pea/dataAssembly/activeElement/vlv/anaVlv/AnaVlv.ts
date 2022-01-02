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

import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {OpcUaConnection, DataItem} from '../../../../connection';
import {Vlv, VlvRuntime} from '../Vlv';
import {SourceModeController, SourceModeRuntime} from '../../../_extensions';

export type AnaVlvRuntime = VlvRuntime & SourceModeRuntime & {
	Pos: DataItem<number>;
	PosFbk: DataItem<number>;
	PosFbkCalc: DataItem<boolean>;
	PosRbk: DataItem<number>;
	PosInt: DataItem<number>;
	PosMan: DataItem<number>;
	PosUnit: DataItem<number>;
	PosSclMin: DataItem<number>;
	PosSclMax: DataItem<number>;
	PosMin: DataItem<number>;
	PosMax: DataItem<number>;

	OpenAct: DataItem<boolean>;
	CloseAct: DataItem<boolean>;
};

export class AnaVlv extends Vlv {
	public readonly communication!: AnaVlvRuntime;
	sourceMode: SourceModeController;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.sourceMode = new SourceModeController(this);

		this.communication.Pos = this.createDataItem('Pos', 'number');
		this.communication.PosFbk = this.createDataItem('PosFbk', 'number');
		this.communication.PosFbkCalc = this.createDataItem('PosFbkCalc','boolean');
		this.communication.PosRbk = this.createDataItem('PosRbk', 'number');
		this.communication.PosInt = this.createDataItem('PosInt','number');
		this.communication.PosMan = this.createDataItem('PosMan',  'number');
		this.communication.PosUnit = this.createDataItem('PosUnit', 'number');
		this.communication.PosSclMin = this.createDataItem('PosSclMin', 'number');
		this.communication.PosSclMax = this.createDataItem('PosSclMax', 'number');
		this.communication.PosMin = this.createDataItem('PosMin', 'number');
		this.communication.PosMax = this.createDataItem('PosMax', 'number');

		this.communication.OpenAct = this.createDataItem('OpenAct', 'boolean');
		this.communication.CloseAct = this.createDataItem('CloseAct', 'boolean');
	}
}
