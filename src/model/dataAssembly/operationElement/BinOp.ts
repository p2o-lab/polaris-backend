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

import {BaseDataAssemblyRuntime} from 'src/model/dataAssembly/DataAssembly';
import {OpcUaDataItem} from 'src/model/dataAssembly/DataItem';
import {OpModeDA} from 'src/model/dataAssembly/mixins/OpMode';
import {SourceModeDA} from 'src/model/dataAssembly/mixins/SourceMode';
import {WritableDataAssembly} from 'src/model/dataAssembly/WritableDataAssembly';

export type ExtBinOpRuntime = BaseDataAssemblyRuntime & {
    VExt: OpcUaDataItem<boolean>;
    VRbk: OpcUaDataItem<boolean>;
    VOut: OpcUaDataItem<boolean>;
    VState0: OpcUaDataItem<string>;
    VState1: OpcUaDataItem<string>;
};

export class ExtBinOp extends WritableDataAssembly {

    public readonly communication: ExtBinOpRuntime;

    constructor(options, module) {
        super(options, module);
        this.communication.VExt = this.createDataItem('VExt', 'write', 'boolean');
        this.communication.VRbk = this.createDataItem('VRbk', 'read', 'boolean');
        this.communication.VOut = this.createDataItem('VOut', 'read', 'boolean');
        this.communication.VState0 = this.createDataItem('VState0', 'read', 'string');
        this.communication.VState1 = this.createDataItem('VState1', 'read', 'string');
        this.type = 'boolean';
        this.writeDataItem = this.communication.VExt;
        this.readDataItem = this.communication.VOut;
    }

}

export class ExtIntBinOp extends OpModeDA(SourceModeDA(ExtBinOp)) {
}

export class AdvBinOp extends ExtIntBinOp {

}

export class BinServParam extends ExtIntBinOp {

}
