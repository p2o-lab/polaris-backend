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

import {Petrinet} from '../../../src/model/virtualService/aggregatedService/Petrinet';
import {expect} from 'chai';

describe('Petrinet', () => {

    it('should handle', () => {
        const pn = new Petrinet({
            initialTransition: 't1',
            states: [
                {
                    id: 'Init',
                    operations: [ ],
                    nextTransitions: ['t2']
                }
            ],
            transitions: [
                {
                    id: 't1',
                    condition: null,
                    nextStates: ['Init']
                },
                {
                    id: 't2',
                    condition: null,
                    nextStates: ['finished']
                }
            ]
        }, []);

        expect(pn.transitions[1].nextStates).to.have.lengthOf(0);
        expect(pn.transitions[1].priorStates[0].id).to.equal('Init');
        expect(pn.states[0].nextTransitions).to.have.lengthOf(1);
        expect(pn.states[0].nextTransitions[0].id).to.equal('t2');
    });

    it('should handle complex petrinet', () => {
        const pn = new Petrinet({
            initialTransition: 't1',
            states: [
                {
                    id: 's1',
                    operations: [ ],
                    nextTransitions: ['t2']
                },
                {
                    id: 's2',
                    operations: [ ],
                    nextTransitions: ['t2']
                },
                {
                    id: 's3',
                    operations: [ ],
                    nextTransitions: ['t3', 't4']
                },
                {
                    id: 's4',
                    operations: [ ],
                    nextTransitions: ['t5']
                }
            ],
            transitions: [
                {
                    id: 't1',
                    condition: null,
                    nextStates: ['s1', 's2']
                },
                {
                    id: 't2',
                    condition: null,
                    nextStates: ['s3']
                },
                {
                    id: 't3',
                    condition: null,
                    nextStates: ['s4']
                },
                {
                    id: 't4',
                    condition: null,
                    nextStates: ['s4']
                }
            ]
        }, []);

        expect(pn.transitions[1].nextStates).to.have.lengthOf(1);
        expect(pn.transitions[1].priorStates[0].id).to.equal('s1');
        expect(pn.states[0].nextTransitions).to.have.lengthOf(1);
        expect(pn.states[0].nextTransitions[0].id).to.equal('t2');
    });

});
