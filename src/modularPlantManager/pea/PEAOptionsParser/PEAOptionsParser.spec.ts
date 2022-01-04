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

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {PEAOptionsParser} from './PEAOptionsParser';
import {ModularPlantManager} from '../../ModularPlantManager';


chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PEAOptionsParser', () => {
    let pimadId='';
    let modularPlantManager: ModularPlantManager;
    before(async ()=>{
            modularPlantManager = new ModularPlantManager();
            const peaModel = await modularPlantManager.addPEAToPimadPool({source: 'tests/testpea.zip'});
            pimadId = peaModel.pimadIdentifier;

    });
    //TODO: maybe test more
    it('createPEAOptions', async()=>{
        const peaOptions = await PEAOptionsParser.createPEAOptions(pimadId, modularPlantManager);
        let k: keyof typeof peaOptions;  // Type is "one" | "two" | "three"
        expect(peaOptions).to.not.empty;
        for (k in peaOptions) {
            //TODO: check hmiUrl
            if(k == 'username'|| k == 'password' || k == 'hmiUrl' ){
                continue;
            }else {
                expect(peaOptions[k]).to.not.empty;
            }
        }

    });
});
