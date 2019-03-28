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

import {catCondition} from '../../config/logging';
import { ServiceState } from '../core/enum';
import { Module } from '../core/Module';
import { Service } from '../core/Service';
import { Recipe } from './Recipe';
import {
    AndConditionOptions,
    ConditionOptions,
    ConditionType,
    ExpressionConditionOptions,
    NotConditionOptions,
    OrConditionOptions, ScopeOptions,
    StateConditionOptions,
    TimeConditionOptions,
    VariableConditionOptions
} from '@plt/pfe-ree-interface';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Expression, Parser} from 'expr-eval';
import {ScopeItem} from './ScopeItem';


/**
 * Events emitted by [[Condition]]
 */
interface ConditionEvents {
    /**
     * Notify when the condition changes its state. Parameter is a boolean representing if condition is fulfilled.
     * @event
     */
    stateChanged: boolean;
}

type ConditionEmitter = StrictEventEmitter<EventEmitter, ConditionEvents>;

export abstract class Condition extends (EventEmitter as { new(): ConditionEmitter }) {

    protected _fulfilled: boolean = false;
    private options: ConditionOptions;

    get fulfilled(): boolean {
        return this._fulfilled;
    }

    /**
     * Create Condition
     * @param {ConditionOptions} options    options for creating Condition
     * @param {Module[]} modules    modules to be used for evaluating module name in expressions
     * @param {Recipe} recipe   recipe using this condition. It will be updated according to the used modules
     * @returns Condition
     * */
    static create(options: ConditionOptions, modules: Module[], recipe?: Recipe): Condition {
        catCondition.trace(`Create Condition: ${JSON.stringify(options)}`);
        const type: ConditionType = options.type;
        if (type === ConditionType.time) {
            return new TimeCondition(<TimeConditionOptions> options);
        } else if (type === ConditionType.and) {
            return new AndCondition(<AndConditionOptions> options, modules, recipe);
        } else if (type === ConditionType.state) {
            return new StateCondition(<StateConditionOptions> options, modules, recipe);
        } else if (type === ConditionType.variable) {
            return new VariableCondition(<VariableConditionOptions> options, modules, recipe);
        } else if (type === ConditionType.or) {
            return new OrCondition(<OrConditionOptions> options, modules, recipe);
        } else if (type === ConditionType.not) {
            return new NotCondition(<NotConditionOptions> options, modules, recipe);
        } else if (type === ConditionType.expression) {
                return new ExpressionCondition(<ExpressionConditionOptions> options, modules);
        } else {
            throw new Error(`No Condition found for ${options}`);
        }
    }

    /**
     * Listen to any change in condition and inform via 'stateChanged' event
     */
    abstract listen(): Condition;

    /**
     * Clear listening on condition
     */
    abstract clear();

    constructor(options: ConditionOptions) {
        super();
        this.options = options;
    }

    json(): ConditionOptions {
        return this.options;
    }
}

export class ExpressionCondition extends Condition {

    private expression: Expression;
    private scopeArray: ScopeItem[];

    /**
     * 
     * @param {ExpressionConditionOptions} options
     * @param {Module[]} modules
     */
    constructor(options: ExpressionConditionOptions, modules: Module[] = []) {
        super(options);
        catCondition.info(`Add ExpressionCondition: ${options.expression} (${JSON.stringify(modules.map(m => m.id))})`);
        // evaluate scopeArray
        this.scopeArray = (options.scope||[]).map((item: ScopeOptions) => ScopeItem.extractFromScopeOptions(item, modules));

        // evaluate additional variables from expression
        const extraction = ScopeItem.extractFromExpressionString(options.expression, modules);
        this.expression = extraction.expression;
        this.scopeArray.push (...extraction.scopeItems);
        this._fulfilled = false;
    }

    listen(): Condition {
        this.scopeArray.forEach(async (item) => {
            item.module.listenToOpcUaNode(item.variable)
                .on('changed', async (data) => {
                    this._fulfilled = <boolean> (await this.getValue());
                    this.emit('stateChanged', this._fulfilled)
                });
        });

        return this;
    }

    /**
     * calculate value from current scopeArray
     * @returns {Promise<any>}
     */
    public async getValue(): Promise<any> {
        // get current variables
        const tasks = await Promise.all(this.scopeArray.map(async (item) => {
            return item.module.readVariableNode(item.variable)
                .then(value => {
                    return item.name.split('.').reduceRight((previous, current) => {
                        let a = {};
                        a[current] = previous;
                        return a;
                    }, value.value.value );
                });
        }));
        const assign = require('assign-deep');
        const scope = assign(...tasks);
        catCondition.info(`Scope: ${JSON.stringify(scope)}`);
        const result = this.expression.evaluate(scope);
        return result;
    }

    clear() {
        this.removeAllListeners();
    }
}

export class NotCondition extends Condition {
    condition: Condition;

    constructor(options: NotConditionOptions, modules: Module[], recipe: Recipe) {
        super(options);
        catCondition.trace(`Add NotCondition: ${options}`);
        this.condition = Condition.create(options.condition, modules, recipe);
        this._fulfilled = !this.condition.fulfilled;
    }

    clear() {
        this.removeAllListeners();
        this.condition.clear();
    }

    listen(): Condition {
        this.condition.listen().on('stateChanged', (state) => {
            this._fulfilled = !state;
            this.emit('stateChanged', this._fulfilled);
        });
        return this;
    }
}

export abstract class AggregateCondition extends Condition {
    conditions: Condition[] = [];

    constructor(options: AndConditionOptions | OrConditionOptions, modules: Module[], recipe: Recipe) {
        super(options);
        this.conditions = options.conditions.map((option) => {
            return Condition.create(option, modules, recipe);
        });
        this._fulfilled = false;
    }

    clear() {
        this.removeAllListeners();
        this.conditions.forEach(cond => cond.clear());
    }
}

export class AndCondition extends AggregateCondition {

    constructor(options: AndConditionOptions, modules: Module[], recipe: Recipe) {
        super(options, modules, recipe);
        catCondition.trace(`Add AndCondition: ${options}`);
    }

    listen(): Condition {
        this.conditions.forEach((condition) => {
            condition.listen().on('stateChanged', (state) => {
                catCondition.debug(`AndCondition: ${JSON.stringify(this.conditions.map(item => item.fulfilled))}`);
                const oldState = this._fulfilled;
                this._fulfilled = this.conditions.every(condition => condition.fulfilled);
                if (oldState !== this._fulfilled) {
                    this.emit('stateChanged', this._fulfilled);
                }
            });
        });
        return this;
    }
}

export class OrCondition extends AggregateCondition {

    constructor(options: OrConditionOptions, modules: Module[], recipe: Recipe) {
        super(options, modules, recipe);
        catCondition.trace(`Add OrCondition: ${options}`);
    }

    listen(): Condition {
        this.conditions.forEach((condition) => {
            condition.listen().on('stateChanged', (status) => {
                const oldState = this._fulfilled;
                this._fulfilled = this.conditions.some(condition => condition.fulfilled);
                if (oldState !== this._fulfilled) {
                    this.emit('stateChanged', this._fulfilled);
                }
            });
        });
        return this;
    }
}

export class TimeCondition extends Condition {
    private timer: NodeJS.Timer;
    private duration: number;

    constructor(options: TimeConditionOptions) {
        super(options);
        if (options.duration <= 0) {
            throw new Error('Duration is negative');
        }
        this.duration = options.duration * 1000;
        this._fulfilled = false;
        catCondition.trace(`Add TimeCondition: ${JSON.stringify(options)}`);
    }

    listen(): Condition {
        catCondition.debug(`Start Timer: ${this.duration}`);
        this.timer = setTimeout(() => {
                catCondition.debug(`TimeCondition finished: ${this.duration}`);
            this._fulfilled = true;
            this.emit('stateChanged', this._fulfilled);
        },
            this.duration);
        return this;
    }

    clear(): void {
        this.removeAllListeners();
        this.timer.unref();
    }
}

export abstract class ModuleCondition extends Condition {
    module: Module;

    constructor(options: StateConditionOptions | VariableConditionOptions, modules: Module[], recipe: Recipe) {
        super(options);
        if (options.module) {
            this.module = modules.find(module => module.id === options.module);
        } else if (modules.length === 1) {
            this.module = modules[0];
        }
        recipe.modules.add(this.module);
    }
}

export class StateCondition extends ModuleCondition {
    module: Module;
    service: Service;
    state: string;
    private monitoredItem: EventEmitter;

    constructor(options: StateConditionOptions, modules: Module[], recipe: Recipe) {
        super(options, modules, recipe);
        this.service = this.module.services.find(service => service.name === options.service);
        this.state = options.state;
    }

    clear() {
        this.removeAllListeners();
        this.service.parent.clearListener(this.service.statusNode);
    }

    listen(): Condition {
        this.monitoredItem = this.service.parent.listenToOpcUaNode(this.service.statusNode)
            .on('changed', (data) => {
                const state: ServiceState = data.value;
                this._fulfilled = ServiceState[state]
                    .localeCompare(this.state, 'en', { usage: 'search', sensitivity: 'base' }) === 0;
                catCondition.debug(`StateCondition: ${this.module.id}.${this.service.name}) = (${ServiceState[state]})` +
                    `- ?= ${this.state} -> ${this._fulfilled}`);
                this.emit('stateChanged', this._fulfilled);
            });
        return this;
    }
}

export class VariableCondition extends ModuleCondition {
    dataStructure: string;
    variable: string;
    value: string | number;
    operator: '==' | '<' | '>' | '<=' | '>=';
    private listener: EventEmitter;

    constructor(options: VariableConditionOptions, modules: Module[], recipe: Recipe) {
        super(options, modules, recipe);
        if (!options.dataAssembly) {
            throw new Error(`Condition does not have 'dataAssembly' ${JSON.stringify(options)} in recipe '${recipe.name}'`);
        }
        this.dataStructure = options.dataAssembly;
        this.variable = options.variable || 'V';
        this.value = options.value;
        this.operator = options.operator || '==';
    }

    /**
     *
     */
    clear(): void {
        this.removeAllListeners();
        this.listener.removeAllListeners();
    }

    listen(): Condition {
        catCondition.debug(`Listen to ${this.dataStructure}.${this.variable}`);
        this.module.readVariable(this.dataStructure, this.variable).then((value) => {
            this._fulfilled = this.compare(value.value.value);
            this.emit('stateChanged', this._fulfilled);
            catCondition.debug(`VariableCondition ${this.dataStructure}: ${value.value.value} ${this.operator} ${this.value} = ${this._fulfilled}`);
        });

        this.listener = this.module.listenToVariable(this.dataStructure, this.variable)
            .on('changed', (data) => {
                catCondition.debug(`value changed to ${data.value} -  (${this.operator}) compare against ${this.value}`);
                this._fulfilled = this.compare(data.value);
                this.emit('stateChanged', this._fulfilled);
                catCondition.debug(`VariableCondition ${this.dataStructure}: ${data.value} ${this.operator} ${this.value} = ${this._fulfilled}`);
            });
        return this;
    }

    private compare(value: number): boolean {
        let result = false;
        if (this.operator === '==') {
            if (value === this.value) {
                result = true;
            }
        } else if (this.operator === '<=') {
            if (value <= this.value) {
                result = true;
            }
        } else if (this.operator === '>=') {
            if (value >= this.value) {
                result = true;
            }
        } else if (this.operator === '<') {
            if (value < this.value) {
                result = true;
            }
        } else if (this.operator === '>') {
            if (value > this.value) {
                result = true;
            }
        }
        return result;
    }

}
