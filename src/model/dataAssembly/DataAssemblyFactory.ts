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

import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {catDataAssembly} from '../../logging/logging';
import {OpcUaConnection} from 'src/model/connection/OpcUaConnection';
import {AdvAnaOp, AnaServParam, ExtAnaOp, ExtIntAnaOp} from 'src/model/dataAssembly/operationElement/AnaOp';
import {AnaMon, AnaView} from 'src/model/dataAssembly/indicatorElement/AnaView';
import {AdvBinOp, BinServParam, ExtBinOp, ExtIntBinOp} from 'src/model/dataAssembly/operationElement/BinOp';
import {BinMon, BinView} from 'src/model/dataAssembly/indicatorElement/BinView';
import {DataAssembly} from './DataAssembly';
import {AdvDigOp, DigServParam, ExtDigOp, ExtIntDigOp} from 'src/model/dataAssembly/operationElement/DigOp';
import {DigMon, DigView} from 'src/model/dataAssembly/indicatorElement/DigView';
import {AnaDrv, MonAnaDrv} from 'src/model/dataAssembly/activeElement/Drv';
import {ServiceControl} from './ServiceControl';
import {StrView} from 'src/model/dataAssembly/indicatorElement/Str';
import {AnaVlv, BinVlv, MonAnaVlv, MonBinVlv} from 'src/model/dataAssembly/activeElement/Vlv';

export class DataAssemblyFactory {
    public static create(variableOptions: DataAssemblyOptions, connection: OpcUaConnection): DataAssembly {
        catDataAssembly.debug(`Create DataAssembly ${variableOptions.name} (${variableOptions.interface_class})`);
        const types = {
            'AnaView': AnaView,
            'AnaMon': AnaMon,
            'ExtAnaOp': ExtAnaOp,
            'ExtIntAnaOp': ExtIntAnaOp,
            'AdvAnaOp': AdvAnaOp,
            'AnaServParam': AnaServParam,

            'BinView': BinView,
            'BinMon': BinMon,
            'ExtBinOp': ExtBinOp,
            'ExtIntBinOp': ExtIntBinOp,
            'AdvBinOp': AdvBinOp,
            'BinServParam': BinServParam,

            'DigView': DigView,
            'DigMon': DigMon,
            'ExtDigOp': ExtDigOp,
            'ExtIntDigOp': ExtIntDigOp,
            'AdvDigOp': AdvDigOp,
            'DigServParam': DigServParam,

            'BinVlv': BinVlv,
            'MonBinVlv': MonBinVlv,
            'AnaVlv': AnaVlv,
            'MonAnaVlv': MonAnaVlv,

            'AnaDrv': AnaDrv,
            'MonAnaDrv': MonAnaDrv,

            'StrView': StrView,

            'ServiceControl': ServiceControl
        };
        let type = types[variableOptions.interface_class];
        if (!type) {
            if (!variableOptions.interface_class) {
                catDataAssembly.debug(`No interface class specified for DataAssembly ${variableOptions.name}. ` +
                    `Use standard DataAssembly.`);
            } else {
                catDataAssembly.warn(`No data assembly implemented for ${variableOptions.interface_class} ` +
                    `of ${variableOptions.name}. Use standard DataAssembly.`);
            }
            type = DataAssembly;
        }

        const instance: DataAssembly = new type(variableOptions, connection);
        instance.logParsingErrors();
        return instance;
    }
}
