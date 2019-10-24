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
            this.communication.VAHEn = this.createDataItem('VAHEn', 'write');
            this.communication.VAHLim = this.createDataItem('VAHLim', 'write');
            this.communication.VAHAct = this.createDataItem('VAHAct', 'write');
            this.communication.VWHEn = this.createDataItem('VWHEn', 'write');
            this.communication.VWHLim = this.createDataItem('VWHLim', 'write');
            this.communication.VWHAct = this.createDataItem('VWHAct', 'write');
            this.communication.VTHEn = this.createDataItem('VTHEn', 'write');
            this.communication.VTHLim = this.createDataItem('VTHLim', 'write');
            this.communication.VTHAct = this.createDataItem('VTHAct', 'write');
            this.communication.VALEn = this.createDataItem('VALEn', 'write');
            this.communication.VALLim = this.createDataItem('VALLim', 'write');
            this.communication.VALAct = this.createDataItem('VALAct', 'write');
            this.communication.VWLEn = this.createDataItem('VWLEn', 'write');
            this.communication.VWLLim = this.createDataItem('VWLLim', 'write');
            this.communication.VWLAct = this.createDataItem('VWLAct', 'write');
            this.communication.VTLEn = this.createDataItem('VTLEn', 'write');
            this.communication.VTLLim = this.createDataItem('VTLLim', 'write');
            this.communication.VTLAct = this.createDataItem('VTLAct', 'write');
        }
    };
}
