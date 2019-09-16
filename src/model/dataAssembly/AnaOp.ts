/* tslint:disable:max-classes-per-file */
/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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

import {OpcUaConnection} from '../core/OpcUaConnection';
import {BaseDataAssemblyRuntime, DataAssembly} from './DataAssembly';
import {OpcUaDataItem} from './DataItem';
import {OpModeDA, OpModeRuntime} from './mixins/OpMode';
import {ScaleSettingsDA, ScaleSettingsRuntime} from './mixins/ScaleSettings';
import {UnitDA, UnitDataAssemblyRuntime} from './mixins/Unit';
import {ValueLimitationDA, ValueLimitationRuntime} from './mixins/ValueLimitation';

export type AnaOpRuntime = BaseDataAssemblyRuntime &
    UnitDataAssemblyRuntime & ValueLimitationRuntime &
    ScaleSettingsRuntime & {
    VOut: OpcUaDataItem<number>;
    VRbk: OpcUaDataItem<number>;
    VExt: OpcUaDataItem<number>;
};

export class ExtAnaOp extends ValueLimitationDA(ScaleSettingsDA(UnitDA(DataAssembly))) {
    public readonly communication: AnaOpRuntime;

    constructor(options, connection: OpcUaConnection) {
        super(options, connection);
        this.createDataItem(options, 'VOut', 'read');
        this.createDataItem(options, 'VRbk', 'read');
        this.createDataItem(options, 'VExt', 'write');
        this.isReadOnly = false;
        this.outputDataItem = this.communication.VOut;
        this.type = 'number';
    }
}

export type ExtIntAnaOpRuntime = AnaOpRuntime & OpModeRuntime & {
    VInt: OpcUaDataItem<number>;
};

export class ExtIntAnaOp extends OpModeDA(ExtAnaOp) {

    public readonly communication: ExtIntAnaOpRuntime;

    constructor(options, connection: OpcUaConnection) {
        super(options, connection);
        this.isReadOnly = false;
        this.type = 'number';
        this.outputDataItem = this.communication.VRbk;
        this.createDataItem(options, 'VInt', 'read');
    }
}

export class AdvAnaOp extends ExtIntAnaOp {

}

export class AnaServParam extends ExtIntAnaOp {

}
