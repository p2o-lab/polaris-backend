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

import {DataAssembly} from './DataAssembly';

export class ExtBinOp extends DataAssembly {

    constructor(options, module) {
        super(options, module);
        this.subscribedNodes.push('VOut', 'VState0', 'VState1', 'VExt', 'VRbk');
    }

    get VState0() {
        return this.communication['VState0'];
    }

    get VState1() {
        return this.communication['VState1'];
    }

    get VExt() {
        return this.communication['VExt'];
    }

    get VOut() {
        return this.communication['VOut'];
    }

    get VRbk() {
        return this.communication['VRbk'];
    }

}

export class ExtIntBinOp extends ExtBinOp {

    constructor(options, module) {
        super(options, module);
        this.subscribedNodes.push('VInt', 'OpMode');
    }

    get VInt() {
        return this.communication['VInt'];
    }

    get OpMode() {
        return this.communication['OpMode'];
    }
}

export class AdvBinOp extends ExtIntBinOp {

}

export class BinServParam extends ExtIntBinOp {

}
