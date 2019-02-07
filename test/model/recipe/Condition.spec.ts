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

import {Condition, ExpressionCondition, TimeCondition} from '../../../src/model/recipe/Condition';
import {ConditionType} from '@plt/pfe-ree-interface';
import {expect} from 'chai';
import * as fs from 'fs';
import {Module} from '../../../src/model/core/Module';

function later(delay) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}

/**
 * Test for [[Condition]]
 */
describe('Condition', () => {
    describe('ExpressionCondition', () => {
        let module: Module;
        before(async () => {
            const file = fs.readFileSync('assets/modules/module_cif.json');
            module = new Module(JSON.parse(file.toString()).modules[0]);
            await module.connect();
        });

        after(async () => {
            await module.disconnect();
        });

        it('should work with simple expression', async () => {
            const expr = new ExpressionCondition({type: ConditionType.expression, expression: '4>3'});
            let value = await expr.getValue();
            expect(value).to.be.true;
        });

        it('should work with semi-complex expression', async () => {
            const expr: ExpressionCondition = <ExpressionCondition> Condition.create({
                type: ConditionType.expression,
                expression: 'cos(CIF.Test_AnaView\\.L004)^2 > 0.1'
            }, [module]);
            let value = await expr.getValue();
            expect(value).to.be.true;
        });

        it('should work with complex expression', async () => {
            const expr = <ExpressionCondition> Condition.create({
                type: ConditionType.expression,
                expression: 'sin(a)^2 + cos(CIF.Test_AnaView\\.L004)^2 < 0.5',
                scope: [
                    {
                        name: 'a',
                        module: 'CIF',
                        dataAssembly: 'Test_AnaView.L004',
                        variable: 'V'
                    }
                ]
            }, [module]);
            let value = await expr.getValue();
            expect(value).to.be.false;
        });

    });

    it('should listen to a time condition of 0.1s', (done) => {
        const condition = new TimeCondition({type: ConditionType.time, duration: 0.1});

        expect(condition.json()).to.deep.equal({type: 'time', duration: 0.1});

        expect(condition).to.have.property('fulfilled', false);

        condition.listen().on('stateChanged', () => {
            expect(condition).to.have.property('fulfilled', true);
            done();
        });

        expect(condition).to.have.property('fulfilled', false);
    });

    it('should listen to an AND condition of two time conditions', async () => {
        const condition = Condition.create({
            type: ConditionType.and,
            conditions: [
                {type: ConditionType.time, duration: 0.2},
                {type: ConditionType.time, duration: 0.1}
            ]
        }, undefined, undefined);
        expect(condition.json()).to.deep.equal({
            type: 'and',
            conditions:
                [{type: 'time', duration: 0.2},
                    {type: 'time', duration: 0.1}]
        });
        condition.listen().on('stateChanged', () => {
            expect(condition).to.have.property('fulfilled', true);
        });
        expect(condition).to.have.property('fulfilled', false);
        await later(150);
        expect(condition).to.have.property('fulfilled', false);
        await later(60);
        expect(condition).to.have.property('fulfilled', true);
    });

    it('should listen to a OR condition of two time conditions', async () => {
        const condition = Condition.create({
            type: ConditionType.or,
            conditions: [
                {type: ConditionType.time, duration: 0.5},
                {type: ConditionType.time, duration: 0.1}
            ]
        }, undefined, undefined);
        expect(condition.json()).to.deep.equal({
            type: 'or',
            conditions:
                [{type: 'time', duration: 0.5},
                    {type: 'time', duration: 0.1}]
        });
        let hit = false;
        condition.listen().on('stateChanged', () => {
            expect(condition).to.have.property('fulfilled', true);
            hit = true;
        });
        await later(60);
        expect(condition).to.have.property('fulfilled', false);
        await later(50);
        expect(condition).to.have.property('fulfilled', true);
        expect(hit).to.be.true;
    });

    it('should listen to a NOT condition', async () => {
        const condition = Condition.create({
            type: ConditionType.not,
            condition: {type: ConditionType.time, duration: 0.1}
        }, undefined, undefined);
        expect(condition.json()).to.deep.equal({type: 'not', condition: {type: 'time', duration: 0.1}});

        condition.listen();
        await later(10);
        expect(condition).to.have.property('fulfilled', true);
        await later(100);
        expect(condition).to.have.property('fulfilled', false);
    });

    it('should fail with wrong parameter', () => {
        expect(() => Condition.create({type: ConditionType.time, duration: -10}, undefined, undefined)).to.throw();
    });

});
