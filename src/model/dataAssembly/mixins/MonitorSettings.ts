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

import {BaseDataAssemblyRuntime, DataAssembly} from '../DataAssembly';
import {OpcUaDataItem} from '../DataItem';
import {Constructor} from './mixins';

export type MonitorSettingsRuntime = BaseDataAssemblyRuntime & {
    VAHEn: OpcUaDataItem<boolean>;
    VAHLim: OpcUaDataItem<number>;
    VAHAct: OpcUaDataItem<boolean>;
    VWHEn: OpcUaDataItem<boolean>;
    VWHLim: OpcUaDataItem<number>;
    VWHAct: OpcUaDataItem<boolean>;
    VTHEn: OpcUaDataItem<boolean>;
    VTHLim: OpcUaDataItem<number>;
    VTHAct: OpcUaDataItem<boolean>;
    VALEn: OpcUaDataItem<boolean>;
    VALLim: OpcUaDataItem<number>;
    VALAct: OpcUaDataItem<boolean>;
    VWLEn: OpcUaDataItem<boolean>;
    VWLLim: OpcUaDataItem<number>;
    VWLAct: OpcUaDataItem<boolean>;
    VTLEn: OpcUaDataItem<boolean>;
    VTLLim: OpcUaDataItem<number>;
    VTLAct: OpcUaDataItem<boolean>;
};

// tslint:disable-next-line:variable-name
export function MonitorSettings<TBase extends Constructor<DataAssembly>>(Base: TBase) {
    return class extends Base {
        public communication: MonitorSettingsRuntime;

        constructor(...args: any[]) {
            super(...args);
            this.createDataItem(args[0], 'VAHEn', 'write');
            this.createDataItem(args[0], 'VAHLim', 'write');
            this.createDataItem(args[0], 'VAHAct', 'write');
            this.createDataItem(args[0], 'VWHEn', 'write');
            this.createDataItem(args[0], 'VWHLim', 'write');
            this.createDataItem(args[0], 'VWHAct', 'write');
            this.createDataItem(args[0], 'VTHEn', 'write');
            this.createDataItem(args[0], 'VTHLim', 'write');
            this.createDataItem(args[0], 'VTHAct', 'write');
            this.createDataItem(args[0], 'VALEn', 'write');
            this.createDataItem(args[0], 'VALLim', 'write');
            this.createDataItem(args[0], 'VALAct', 'write');
            this.createDataItem(args[0], 'VWLEn', 'write');
            this.createDataItem(args[0], 'VWLLim', 'write');
            this.createDataItem(args[0], 'VWLAct', 'write');
            this.createDataItem(args[0], 'VTLEn', 'write');
            this.createDataItem(args[0], 'VTLLim', 'write');
            this.createDataItem(args[0], 'VTLAct', 'write');
        }
    };
}
