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

import {AnaMonOptions} from '@p2olab/polaris-interface';
import {BaseDataAssemblyRuntime} from '../DataAssembly';
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
export function MonitorSettings<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        public communication: MonitorSettingsRuntime;

        constructor(...args: any[]) {
            super(...args);
            const a = args[0] as { communication: AnaMonOptions };
            this.communication.VAHEn = OpcUaDataItem.fromOptions(a.communication.VAHEn, 'write');
            this.communication.VAHLim = OpcUaDataItem.fromOptions(a.communication.VAHLim, 'write');
            this.communication.VAHAct = OpcUaDataItem.fromOptions(a.communication.VAHAct, 'write');
            this.communication.VWHEn = OpcUaDataItem.fromOptions(a.communication.VWHEn, 'write');
            this.communication.VWHLim = OpcUaDataItem.fromOptions(a.communication.VWHLim, 'write');
            this.communication.VWHAct = OpcUaDataItem.fromOptions(a.communication.VWHAct, 'write');
            this.communication.VTHEn = OpcUaDataItem.fromOptions(a.communication.VTHEn, 'write');
            this.communication.VTHLim = OpcUaDataItem.fromOptions(a.communication.VTHLim, 'write');
            this.communication.VTHAct = OpcUaDataItem.fromOptions(a.communication.VTHAct, 'write');
            this.communication.VALEn = OpcUaDataItem.fromOptions(a.communication.VALEn, 'write');
            this.communication.VALLim = OpcUaDataItem.fromOptions(a.communication.VALLim, 'write');
            this.communication.VALAct = OpcUaDataItem.fromOptions(a.communication.VALAct, 'write');
            this.communication.VWLEn = OpcUaDataItem.fromOptions(a.communication.VWLEn, 'write');
            this.communication.VWLLim = OpcUaDataItem.fromOptions(a.communication.VWLLim, 'write');
            this.communication.VWLAct = OpcUaDataItem.fromOptions(a.communication.VWLAct, 'write');
            this.communication.VTLEn = OpcUaDataItem.fromOptions(a.communication.VTLEn, 'write');
            this.communication.VTLLim = OpcUaDataItem.fromOptions(a.communication.VTLLim, 'write');
            this.communication.VTLAct = OpcUaDataItem.fromOptions(a.communication.VTLAct, 'write');
        }
    };
}
