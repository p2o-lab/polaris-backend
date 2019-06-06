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


import {DataAssembly, DataAssemblyOptions} from './DataAssembly';
import {AnaMon, AnaView} from './AnaView';
import {Module} from '../core/Module';
import {AdvAnaOp, AnaServParam, ExtAnaOp, ExtIntAnaOp} from './AnaOp';
import {DigMon, DigView} from './DigView';
import {AdvDigOp, DigServParam, ExtDigOp, ExtIntDigOp} from './DigOp';
import {BinMon, BinView} from './BinView';
import {AdvBinOp, BinServParam, ExtBinOp, ExtIntBinOp} from './BinOp';
import {catModule} from '../../config/logging';
import {AnaVlv, BinVlv, MonAnaVlv, MonBinVlv} from './Vlv';
import {AnaDrv, MonAnaDrv} from './Drv';
import {StrView} from './Str';

export class DataAssemblyFactory {
    static create(variableOptions: DataAssemblyOptions, module: Module): DataAssembly {
        catModule.debug(`Create DataAssembly ${variableOptions.name} (${variableOptions.interface_class})`);

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

            'StrView': StrView
        };
        let type = types[variableOptions.interface_class];
        if (!type) {
            if (variableOptions.interface_class) {
                catModule.warn(`No data assembly implemented for ${variableOptions.interface_class} of ${variableOptions.name}. Use standard DataAssembly.`);
            }
            type = DataAssembly;
        }

        return new type(variableOptions, module);
    }

    static isAnaView(dataAssembly: DataAssembly): dataAssembly is AnaView {
        return dataAssembly.interface_class == 'AnaView';
    }

    static isExtAnaOp(dataAssembly: DataAssembly): dataAssembly is ExtAnaOp {
        return dataAssembly.interface_class == 'ExtAnaOp';
    }

    static isExtIntAnaOp(dataAssembly: DataAssembly): dataAssembly is ExtIntAnaOp {
        return dataAssembly.interface_class == 'ExtIntAnaOp';
    }

    static isAdvAnaOp(dataAssembly: DataAssembly): dataAssembly is AdvAnaOp {
        return dataAssembly.interface_class == 'AdvAnaOp';
    }

    static isAnaServParam(dataAssembly: DataAssembly): dataAssembly is AnaServParam {
        return dataAssembly.interface_class == 'AnaServParam';
    }

    static isDigView(dataAssembly: DataAssembly): dataAssembly is DigView {
        return dataAssembly.interface_class == 'DigView';
    }

    static isExtDigOp(dataAssembly: DataAssembly): dataAssembly is ExtDigOp {
        return dataAssembly.interface_class == 'ExtDigOp';
    }

    static isExtIntDigOp(dataAssembly: DataAssembly): dataAssembly is ExtIntDigOp {
        return dataAssembly.interface_class == 'ExtIntDigOp';
    }

    static isAdvDigOp(dataAssembly: DataAssembly): dataAssembly is AdvDigOp {
        return dataAssembly.interface_class == 'AdvDigOp';
    }

    static isDigServParam(dataAssembly: DataAssembly): dataAssembly is DigServParam {
        return dataAssembly.interface_class == 'DigServParam';
    }

    static isBinView(dataAssembly: DataAssembly): dataAssembly is BinView {
        return dataAssembly.interface_class == 'BinView';
    }

    static isExtBinOp(dataAssembly: DataAssembly): dataAssembly is ExtBinOp {
        return dataAssembly.interface_class == 'ExtBinOp';
    }

    static isExtIntBinOp(dataAssembly: DataAssembly): dataAssembly is ExtIntBinOp {
        return dataAssembly.interface_class == 'ExtIntBinOp';
    }

    static isAdvBinOp(dataAssembly: DataAssembly): dataAssembly is AdvBinOp {
        return dataAssembly.interface_class == 'AdvBinOp';
    }

    static isBinServParam(dataAssembly: DataAssembly): dataAssembly is BinServParam {
        return dataAssembly.interface_class == 'BinServParam';
    }

    static isStrView(dataAssembly: DataAssembly): dataAssembly is StrView {
        return dataAssembly.interface_class == 'StrView';
    }
}
