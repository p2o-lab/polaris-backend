/* tslint:disable:max-classes-per-file */
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
import {OpcUaConnection, OpcUaDataItem} from '../../../../connection';
import {Vlv, VlvRuntime} from '../Vlv';
import {SourceModeRuntime} from '../../../_extensions';
import {SourceModeController} from '../../../_extensions/sourceModeDA/SourceModeController';

export type AnaVlvRuntime = VlvRuntime & SourceModeRuntime & {
	Pos: OpcUaDataItem<number>;
	PosFbk: OpcUaDataItem<number>;
	PosFbkCalc: OpcUaDataItem<boolean>;
	PosRbk: OpcUaDataItem<number>;
	PosInt: OpcUaDataItem<number>;
	PosMan: OpcUaDataItem<number>;
	PosUnit: OpcUaDataItem<number>;
	PosSclMin: OpcUaDataItem<number>;
	PosSclMax: OpcUaDataItem<number>;
	PosMin: OpcUaDataItem<number>;
	PosMax: OpcUaDataItem<number>;

	OpenAct: OpcUaDataItem<boolean>;
	CloseAct: OpcUaDataItem<boolean>;
};

export class AnaVlv extends Vlv {
	public readonly communication!: AnaVlvRuntime;
	sourceMode: SourceModeController;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.sourceMode = new SourceModeController(this);
		this.sourceMode.setCommunication();

		this.communication.Pos = this.createDataItem('Pos', 'read', 'number');
		this.communication.PosFbk = this.createDataItem('PosFbk', 'read', 'number');
		this.communication.PosFbkCalc = this.createDataItem('PosFbkCalc', 'read', 'boolean');
		this.communication.PosRbk = this.createDataItem('PosRbk', 'read', 'number');
		this.communication.PosInt = this.createDataItem('PosInt', 'read', 'number');
		this.communication.PosMan = this.createDataItem('PosMan', 'read', 'number');
		this.communication.PosUnit = this.createDataItem('PosUnit', 'read', 'number');
		this.communication.PosSclMin = this.createDataItem('PosSclMin', 'read', 'number');
		this.communication.PosSclMax = this.createDataItem('PosSclMax', 'read', 'number');
		this.communication.PosMin = this.createDataItem('PosMin', 'read', 'number');
		this.communication.PosMax = this.createDataItem('PosMax', 'read', 'number');

		this.communication.OpenAct = this.createDataItem('OpenAct', 'read', 'boolean');
		this.communication.CloseAct = this.createDataItem('CloseAct', 'read', 'boolean');
	}
}
