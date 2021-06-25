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

import {DataAssemblyOptions, ParameterInterface} from '@p2olab/polaris-interface';
import {OpcUaConnection, OpcUaDataItem} from '../../../connection';
import {ScaleSettingsRuntime, UnitDataAssemblyRuntime} from '../../_extensions';
import {IndicatorElement, IndicatorElementRuntime} from '../IndicatorElement';
import {ScaleSettings} from '../../_extensions/scaleSettingsDA/ScaleSettings';
import {UnitSettings} from '../../_extensions/unitDA/UnitSettings';
export type AnaViewRuntime = IndicatorElementRuntime & UnitDataAssemblyRuntime & ScaleSettingsRuntime & {
	V: OpcUaDataItem<number>;
};

export class AnaView extends IndicatorElement {
	public readonly communication!: AnaViewRuntime;
	private readonly scaleSettings: ScaleSettings;
	private readonly unitSettings: UnitSettings;

	constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
		super(options, connection);
		this.communication.V = this.createDataItem('V', 'read');

		this.unitSettings = new UnitSettings(this);
		this.unitSettings.setCommunication();

		this.scaleSettings = new ScaleSettings(this);
		this.scaleSettings.setCommunication();

		this.defaultReadDataItem = this.communication.V;
		this.defaultReadDataItemType = 'number';
	}

}