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
import {OpcUaConnection, OpcUaDataItem} from '../../../connection';
import {OpModeRuntime, SourceModeRuntime} from '../../_extensions';
import {ActiveElement, ActiveElementRuntime} from '../ActiveElement';
import {SourceModeController} from '../../_extensions/sourceModeDA/SourceModeController';
import {OpModeController} from '../../_extensions/opModeDA/OpModeController';

export type PIDCtrlRuntime = ActiveElementRuntime & OpModeRuntime & SourceModeRuntime & {
	PV: OpcUaDataItem<number>;
	PVSclMin: OpcUaDataItem<number>;
	PVSclMax: OpcUaDataItem<number>;
	PVUnit: OpcUaDataItem<number>;

	SPMan: OpcUaDataItem<number>;
	SPInt: OpcUaDataItem<number>;
	SPSclMin: OpcUaDataItem<number>;
	SPSclMax: OpcUaDataItem<number>;
	SPUnit: OpcUaDataItem<number>;
	SPIntMin: OpcUaDataItem<number>;
	SPIntMax: OpcUaDataItem<number>;
	SPManMin: OpcUaDataItem<number>;
	SPManMax: OpcUaDataItem<number>;
	SP: OpcUaDataItem<number>;

	MVMan: OpcUaDataItem<number>;
	MV: OpcUaDataItem<number>;
	MVSclMin: OpcUaDataItem<number>;
	MVSclMax: OpcUaDataItem<number>;
	MVUnit: OpcUaDataItem<number>;
	MVMin: OpcUaDataItem<number>;
	MVMax: OpcUaDataItem<number>;

	P: OpcUaDataItem<number>;
	Ti: OpcUaDataItem<number>;
	Td: OpcUaDataItem<number>;
};

export class PIDCtrl extends ActiveElement {
	public readonly communication!: PIDCtrlRuntime;
	sourceMode: SourceModeController;
	opMode: OpModeController;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);

		this.sourceMode = new SourceModeController(this);
		
		this.opMode = new OpModeController(this);
		this.opMode.initializeOpMode(this);

		this.communication.PV = this.createDataItem('PV', 'read', 'number');
		this.communication.PVSclMin = this.createDataItem('PVSclMin', 'read', 'number');
		this.communication.PVSclMax = this.createDataItem('PVSclMax', 'read', 'number');
		this.communication.PVUnit = this.createDataItem('PVUnit', 'read', 'number');

		this.communication.SPMan = this.createDataItem('SPMan', 'write', 'number');
		this.communication.SPInt = this.createDataItem('SPInt', 'read', 'number');
		this.communication.SPSclMin = this.createDataItem('SPSclMin', 'read', 'number');
		this.communication.SPSclMax = this.createDataItem('SPSclMax', 'read', 'number');
		this.communication.SPUnit = this.createDataItem('SPUnit', 'read', 'number');
		this.communication.SPIntMin = this.createDataItem('SPIntMin', 'read', 'number');
		this.communication.SPIntMax = this.createDataItem('SPIntMax', 'read', 'number');
		this.communication.SPManMin = this.createDataItem('SPManMin', 'read', 'number');
		this.communication.SPManMax = this.createDataItem('SPManMax', 'read', 'number');
		this.communication.SP = this.createDataItem('SP', 'read', 'number');

		this.communication.MVMan = this.createDataItem('MVMan', 'write', 'number');
		this.communication.MV = this.createDataItem('MV', 'read', 'number');
		this.communication.MVSclMin = this.createDataItem('MVSclMin', 'read', 'number');
		this.communication.MVSclMax = this.createDataItem('MVSclMax', 'read', 'number');
		this.communication.MVUnit = this.createDataItem('MVUnit', 'read', 'number');
		this.communication.MVMin = this.createDataItem('MVMin', 'read', 'number');
		this.communication.MVMax = this.createDataItem('MVMax', 'read', 'number');

		this.communication.P = this.createDataItem('P', 'read', 'number');
		this.communication.Ti = this.createDataItem('Ti', 'read', 'number');
		this.communication.Td = this.createDataItem('Td', 'read', 'number');

		this.defaultReadDataItem = this.communication.PV;
		this.defaultReadDataItemType = 'number';
		this.defaultWriteDataItem = this.communication.SPMan;
		this.defaultWriteDataItemType = 'number';
	}
}
