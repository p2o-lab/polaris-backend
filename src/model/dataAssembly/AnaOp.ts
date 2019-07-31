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

import {ParameterInterface} from '@p2olab/polaris-interface';
import {Module} from '../core/Module';
import {BaseDataAssemblyRuntime, DataAssembly} from './DataAssembly';
import {OpcUaDataItem} from './DataItem';
import {
    OpModeDA,
    OpModeRuntime,
    ScaleSettingsDA,
    ScaleSettingsRuntime,
    UnitDA,
    UnitDataAssemblyRuntime, ValueLimitationDA
} from './mixins';

export type ValueLimitationRuntime = BaseDataAssemblyRuntime & {
    VMin: OpcUaDataItem<number>;
    VMax: OpcUaDataItem<number>;
};

export type AnaOpRuntime = BaseDataAssemblyRuntime &
    UnitDataAssemblyRuntime & ValueLimitationRuntime &
    ScaleSettingsRuntime & {
    VOut: OpcUaDataItem<number>;
    VRbk: OpcUaDataItem<number>;
    VExt: OpcUaDataItem<number>;
};

export class ExtAnaOp extends ValueLimitationDA(ScaleSettingsDA(UnitDA(DataAssembly))) {
    public readonly communication: AnaOpRuntime;

    constructor(options, module: Module) {
        super(options, module);
        this.communication.VOut = OpcUaDataItem.fromOptions(options.communication.VOut, 'read');
        this.communication.VRbk = OpcUaDataItem.fromOptions(options.communication.VRbk, 'read');
        this.communication.VExt = OpcUaDataItem.fromOptions(options.communication.VExt, 'write');
    }

    public toJson(): ParameterInterface {
        return {
            ...super.toJson(),
            value: this.communication.VOut.value,
            type: 'number',
            readonly: false
        };
    }
}

export type ExtIntAnaOpRuntime = AnaOpRuntime & OpModeRuntime & {
    VInt: OpcUaDataItem<number>;
};

export class ExtIntAnaOp extends OpModeDA(ExtAnaOp) {

    public readonly communication: ExtIntAnaOpRuntime;

    constructor(options, module: Module) {
        super(options, module);
        this.communication.VInt = OpcUaDataItem.fromOptions(options.communication.VInt, 'read');
    }
}

export class AdvAnaOp extends ExtIntAnaOp {

}

export class AnaServParam extends ExtIntAnaOp {

}
