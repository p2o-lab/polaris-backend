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

import {Petrinet, PetrinetOptions} from './Petrinet';

import {expect} from 'chai';

describe('Petrinet', () => {

	it('should handle simple petrinet', (done) => {
		// TODO: Import real options
		const pn = new Petrinet({} as PetrinetOptions, []);

		expect(pn.transitions[1].nextStates).to.have.lengthOf(0);
		expect(pn.transitions[1].priorStates[0].id).to.equal('Init');
		expect(pn.states[0].nextTransitions).to.have.lengthOf(1);
		expect(pn.states[0].nextTransitions[0].id).to.equal('t2');

		expect(pn.activeStates).to.have.lengthOf(0);
		const stateChanges: string[] = [];
		const transitionChanges: string[] = [];
		pn.eventEmitter.on('state', (state) => {
			expect(pn.activeStates.length).to.be.greaterThan(0);
			stateChanges.push(state.id);
		});
		pn.eventEmitter.on('transition', (tr) => {
			transitionChanges.push(tr.id);
		});

		pn.run();

		pn.eventEmitter.once('completed', () => {
			expect(pn.activeStates).to.have.lengthOf(0);
			expect(stateChanges).to.deep.equal(['Init']);
			expect(transitionChanges).to.deep.equal(['t1', 't2']);
			done();
		});
	});

	it('should handle complex petrinet', (done) => {
		// TODO: Import real options
		const pn = new Petrinet({} as PetrinetOptions, []);

		expect(pn.transitions[1].nextStates).to.have.lengthOf(1);
		expect(pn.transitions[1].priorStates[0].id).to.equal('s1a');
		expect(pn.states[0].nextTransitions).to.have.lengthOf(1);
		expect(pn.states[0].nextTransitions[0].id).to.equal('t2');

		expect(pn.activeStates).to.have.lengthOf(0);
		const stateChanges: string[] = [];
		const transitionChanges: string[] = [];
		pn.eventEmitter.on('state', (state) => {
			expect(pn.activeStates.length).to.be.greaterThan(0);
			stateChanges.push(state.id);
		});
		pn.eventEmitter.on('transition', (tr) => {
			transitionChanges.push(tr.id);
		});

		pn.run();

		pn.eventEmitter.once('completed', () => {
			expect(pn.activeStates).to.have.lengthOf(0);
			expect(stateChanges).to.deep.equal(['s1a', 's1b', 's2', 's3a', 's4']);
			expect(transitionChanges).to.deep.equal(['t1', 't2', 't3a', 't4a', 't5']);
			done();
		});
	});

});
