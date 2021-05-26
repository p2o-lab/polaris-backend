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

import {AnaView, AnaViewRuntime} from './AnaView';
import {BaseDataAssemblyRuntime} from '../../DataAssemblyController';
import {OpcUaConnection, OpcUaDataItem} from '../../../connection';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';

export class AnaMon extends AnaView {
    public communication!: AnaMonRuntime;
    constructor(options: DataAssemblyOptions, connection: OpcUaConnection) {
        super(options, connection);

        this.communication.OSLevel = this.createDataItem('OSLevel', 'write');

        this.communication.VAHEn = this.createDataItem('VAHEn', 'read');
        this.communication.VAHLim = this.createDataItem('VAHLim', 'write');
        this.communication.VAHAct = this.createDataItem('VAHAct', 'read');
        this.communication.VWHEn = this.createDataItem('VWHEn', 'read');
        this.communication.VWHLim = this.createDataItem('VWHLim', 'write');
        this.communication.VWHAct = this.createDataItem('VWHAct', 'read');
        this.communication.VTHEn = this.createDataItem('VTHEn', 'read');
        this.communication.VTHLim = this.createDataItem('VTHLim', 'write');
        this.communication.VTHAct = this.createDataItem('VTHAct', 'read');
        this.communication.VALEn = this.createDataItem('VALEn', 'read');
        this.communication.VALLim = this.createDataItem('VALLim', 'write');
        this.communication.VALAct = this.createDataItem('VALAct', 'read');
        this.communication.VWLEn = this.createDataItem('VWLEn', 'read');
        this.communication.VWLLim = this.createDataItem('VWLLim', 'write');
        this.communication.VWLAct = this.createDataItem('VWLAct', 'read');
        this.communication.VTLEn = this.createDataItem('VTLEn', 'read');
        this.communication.VTLLim = this.createDataItem('VTLLim', 'write');
        this.communication.VTLAct = this.createDataItem('VTLAct', 'read');
    }
    get OSLevel(): number | undefined {
        return this.communication.OSLevel.value;
    }
}

export type AnaMonRuntime = AnaViewRuntime & LimitMonitoringRuntime & {
    OSLevel: OpcUaDataItem<number>;
};

type LimitMonitoringRuntime = BaseDataAssemblyRuntime & {
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

