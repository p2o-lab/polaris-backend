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

import {catModule} from '../../config/logging';
import {Module} from '../core/Module';
import {AdvAnaOp, AnaServParam, ExtAnaOp, ExtIntAnaOp} from './AnaOp';
import {AnaMon, AnaView} from './AnaView';
import {AdvBinOp, BinServParam, ExtBinOp, ExtIntBinOp} from './BinOp';
import {BinMon, BinView} from './BinView';
import {DataAssembly, DataAssemblyOptions} from './DataAssembly';
import {AdvDigOp, DigServParam, ExtDigOp, ExtIntDigOp} from './DigOp';
import {DigMon, DigView} from './DigView';
import {AnaDrv, MonAnaDrv} from './Drv';
import {StrView} from './Str';
import {AnaVlv, BinVlv, MonAnaVlv, MonBinVlv} from './Vlv';

export class DataAssemblyFactory {
    public static create(variableOptions: DataAssemblyOptions, module: Module): DataAssembly {
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
            catModule.warn(`No data assembly implemented for ${variableOptions.interface_class} ` +
                `of ${variableOptions.name}. Use standard DataAssembly.`);
            type = DataAssembly;
        }

        return new type(variableOptions, module);
    }

    public static isAnaView(dataAssembly: DataAssembly): dataAssembly is AnaView {
        return dataAssembly.interfaceClass === 'AnaView';
    }

    public static isExtAnaOp(dataAssembly: DataAssembly): dataAssembly is ExtAnaOp {
        return this.isExtIntAnaOp(dataAssembly) || dataAssembly.interfaceClass === 'ExtAnaOp';
    }

    public static isExtIntAnaOp(dataAssembly: DataAssembly): dataAssembly is ExtIntAnaOp {
        return this.isAdvAnaOp(dataAssembly) || this.isAnaServParam(dataAssembly) || dataAssembly.interfaceClass === 'ExtIntAnaOp';
    }

    public static isAdvAnaOp(dataAssembly: DataAssembly): dataAssembly is AdvAnaOp {
        return dataAssembly.interfaceClass === 'AdvAnaOp';
    }

    public static isAnaServParam(dataAssembly: DataAssembly): dataAssembly is AnaServParam {
        return dataAssembly.interfaceClass === 'AnaServParam';
    }

    public static isDigView(dataAssembly: DataAssembly): dataAssembly is DigView {
        return dataAssembly.interfaceClass === 'DigView';
    }

    public static isExtDigOp(dataAssembly: DataAssembly): dataAssembly is ExtDigOp {
        return this.isExtIntDigOp(dataAssembly) || dataAssembly.interfaceClass === 'ExtDigOp';
    }

    public static isExtIntDigOp(dataAssembly: DataAssembly): dataAssembly is ExtIntDigOp {
        return this.isAdvDigOp(dataAssembly) || dataAssembly.interfaceClass === 'ExtIntDigOp';
    }

    public static isAdvDigOp(dataAssembly: DataAssembly): dataAssembly is AdvDigOp {
        return this.isDigServParam(dataAssembly) || dataAssembly.interfaceClass === 'AdvDigOp';
    }

    public static isDigServParam(dataAssembly: DataAssembly): dataAssembly is DigServParam {
        return dataAssembly.interfaceClass === 'DigServParam';
    }

    public static isBinView(dataAssembly: DataAssembly): dataAssembly is BinView {
        return dataAssembly.interfaceClass === 'BinView';
    }

    public static isExtBinOp(dataAssembly: DataAssembly): dataAssembly is ExtBinOp {
        return this.isExtIntBinOp(dataAssembly) || dataAssembly.interfaceClass === 'ExtBinOp';
    }

    public static isExtIntBinOp(dataAssembly: DataAssembly): dataAssembly is ExtIntBinOp {
        return this.isAdvBinOp(dataAssembly) || dataAssembly.interfaceClass === 'ExtIntBinOp';
    }

    public static isAdvBinOp(dataAssembly: DataAssembly): dataAssembly is AdvBinOp {
        return this.isBinServParam(dataAssembly) || dataAssembly.interfaceClass === 'AdvBinOp';
    }

    public static isBinServParam(dataAssembly: DataAssembly): dataAssembly is BinServParam {
        return dataAssembly.interfaceClass === 'BinServParam';
    }

    public static isStrView(dataAssembly: DataAssembly): dataAssembly is StrView {
        return dataAssembly.interfaceClass === 'StrView';
    }
}
