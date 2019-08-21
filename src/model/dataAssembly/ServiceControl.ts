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

/* tslint:disable:max-classes-per-file */
import {Module} from '../core/Module';
import {BaseDataAssemblyRuntime, DataAssembly} from './DataAssembly';
import {OpcUaDataItem} from './DataItem';
import {OpModeDA} from './mixins';

export interface ServiceControlRuntime extends BaseDataAssemblyRuntime {
    OpMode: OpcUaDataItem<number>;
    CommandMan: OpcUaDataItem<number>;
    CommandExt: OpcUaDataItem<number>;
    CommandEnable: OpcUaDataItem<number>;
    State: OpcUaDataItem<number>;
    StrategyMan: OpcUaDataItem<number>;
    StrategyExt: OpcUaDataItem<number>;
    StrategyInt: OpcUaDataItem<number>;
    CurrentStrategy: OpcUaDataItem<number>;
}

export class ServiceControl extends OpModeDA(DataAssembly) {
    public readonly communication: ServiceControlRuntime;

    constructor(options, module: Module) {
        super(options, module);
        this.communication.CommandMan = OpcUaDataItem.fromOptions(options.communication.CommandMan, 'write');
        this.communication.CommandExt = OpcUaDataItem.fromOptions(options.communication.CommandExt, 'write');
        this.communication.CommandEnable = OpcUaDataItem.fromOptions(options.communication.CommandEnable, 'read');
        this.communication.State = OpcUaDataItem.fromOptions(options.communication.State, 'read');
        this.communication.StrategyMan = OpcUaDataItem.fromOptions(options.communication.StrategyMan, 'write');
        this.communication.StrategyExt = OpcUaDataItem.fromOptions(options.communication.StrategyExt, 'write');
        this.communication.StrategyInt = OpcUaDataItem.fromOptions(options.communication.StrategyInt, 'read');
        this.communication.CurrentStrategy = OpcUaDataItem.fromOptions(options.communication.CurrentStrategy, 'read');
    }

}
