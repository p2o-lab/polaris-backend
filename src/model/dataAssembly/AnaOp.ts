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

import {OpcUaConnection} from 'src/model/connection/OpcUaConnection';
import {BaseDataAssemblyRuntime} from './DataAssembly';
import {OpcUaDataItem} from './DataItem';
import {OpModeDA, OpModeRuntime} from './mixins/OpMode';
import {ScaleSettingsDA, ScaleSettingsRuntime} from './mixins/ScaleSettings';
import {SourceModeDA, SourceModeRuntime} from './mixins/SourceMode';
import {UnitDA, UnitDataAssemblyRuntime} from './mixins/Unit';
import {ValueLimitationDA, ValueLimitationRuntime} from './mixins/ValueLimitation';
import {WritableDataAssembly} from './WritableDataAssembly';

export type AnaOpRuntime = BaseDataAssemblyRuntime &
    UnitDataAssemblyRuntime & ValueLimitationRuntime &
    ScaleSettingsRuntime & {
    VOut: OpcUaDataItem<number>;
    VRbk: OpcUaDataItem<number>;
    VExt: OpcUaDataItem<number>;
};

export class ExtAnaOp extends ValueLimitationDA(ScaleSettingsDA(UnitDA(WritableDataAssembly))) {
    public readonly communication: AnaOpRuntime;

    constructor(options, connection: OpcUaConnection) {
        super(options, connection);
        this.communication.VOut = this.createDataItem('VOut', 'read');
        this.communication.VRbk = this.createDataItem('VRbk', 'read');
        this.communication.VExt = this.createDataItem('VExt', 'write');
        this.writeDataItem = this.communication.VExt;
        this.readDataItem = this.communication.VRbk;
        this.type = 'number';
    }
}

export type ExtIntAnaOpRuntime = AnaOpRuntime & OpModeRuntime & SourceModeRuntime & {
    VInt: OpcUaDataItem<number>;
};

export class ExtIntAnaOp extends OpModeDA(SourceModeDA(ExtAnaOp)) {

    public readonly communication: ExtIntAnaOpRuntime;

    constructor(options, connection: OpcUaConnection) {
        super(options, connection);
        this.type = 'number';
        this.communication.VInt = this.createDataItem('VInt', 'read');
    }
}

export class AdvAnaOp extends ExtIntAnaOp {

}

export class AnaServParam extends ExtIntAnaOp {

}
