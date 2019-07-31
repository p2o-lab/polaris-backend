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

export class BinVlv extends DataAssembly {
    constructor(options, module) {
        super(options, module);
        //this.subscribedNodes.push('OpMode', 'SafePos', 'OpenOp', 'CloseOp', 'OpenLi', 'CloseLi', 'Ctrl', 'OpenFbkEn', 'CloseFbkEn', 'OpenFbk', 'CloseFbk', 'PermEn', 'Permit', 'IntlEn', 'Interlock', 'ProtEn', 'Protect', 'ResetOp', 'ResetLi');
    }
}

export class MonBinVlv extends BinVlv {
    constructor(options, module) {
        super(options, module);
        //this.subscribedNodes.push('MonEn', 'MonSafePos', 'MonStatErr', 'MonDynErr', 'MonStatTi', 'MonDynTi');
    }
}

export class AnaVlv extends DataAssembly {
    constructor(options, module) {
        super(options, module);
        //this.subscribedNodes.push('OpMode', 'OpenOp', 'CloseOp', 'OpenLi', 'CloseLi', 'Ctrl', 'OpenFbkEn', 'CloseFbkEn', 'OpenFbk', 'CloseFbk', 'PosSclMin', 'PosSclMax', 'PosUnit', 'PosInt', 'PosExt', 'PosMin', 'PosMax', 'SafePos', 'PosCtrl', 'PosFbkEn', 'PosFbk', 'PermEn', 'Permit', 'IntlEn', 'Interlock', 'ProtEn', 'Protect', 'ResetOp', 'ResetLi');
    }
}

export class MonAnaVlv extends AnaVlv {
    constructor(options, module) {
        super(options, module);
        //this.subscribedNodes.push('MonEn', 'MonSafePos', 'MonStatErr', 'MonDynErr', 'MonStatTi', 'MonDynTi', 'PosOpngFbk', 'PosClsngFbk', 'PosReachedFbk', 'PosTolerance', 'PosDefClose', 'PosDefOpen', 'MonPosTi', 'MonPosErr');
    }
}
