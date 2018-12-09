/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import { catOpc, catRecipe } from '../config/logging';
import { ServiceState } from './enum';
import { Module } from './Module';
import { Service } from './Service';
import { Recipe } from './Recipe';
import {
    AndConditionOptions,
    ConditionOptions,
    ConditionType,
    NotConditionOptions,
    OrConditionOptions,
    StateConditionOptions,
    TimeConditionOptions,
    VariableConditionOptions
} from 'pfe-ree-interface';
import { EventEmitter } from 'events';

export abstract class Condition {

    protected _fulfilled: boolean = false;
    private options: ConditionOptions;
    protected eventEmitter: EventEmitter = new EventEmitter;

    get fulfilled(): boolean {
        return this._fulfilled;
    }

    /**
     * Create Condition
     * @param {ConditionOptions} options
     * @param {Map<string,Module>} modules
     * @param recipe
     * @returns Condition
     * */
    static create(options: ConditionOptions, modules: Module[], recipe: Recipe): Condition {
        catRecipe.trace(`Create Condition: ${JSON.stringify(options)}`);
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
        } else {
            throw new Error(`No Condition found for ${options}`);
        }
    }

    /**
     * Listen to any change in condition and inform via 'state_change' event
     */
    abstract listen(): EventEmitter;

    /**
     * Clear listening on condition
     */
    abstract clear();

    constructor(options: ConditionOptions) {
        this.options = options;
    }

    json(): ConditionOptions {
        return this.options;
    }
}

export class NotCondition extends Condition {
    condition: Condition;

    constructor(options: NotConditionOptions, modules: Module[], recipe: Recipe) {
        super(options);
        catRecipe.trace(`Add NotCondition: ${options}`);
        this.condition = Condition.create(options.condition, modules, recipe);
        this._fulfilled = !this.condition.fulfilled;
    }

    clear() {
        this.eventEmitter.removeAllListeners();
        this.condition.clear();
    }

    listen(): EventEmitter {
        this.condition.listen().on('state_changed', (state) => {
            this._fulfilled = !state;
            this.eventEmitter.emit('state_changed', this._fulfilled);
        });
        return this.eventEmitter;
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
        this.eventEmitter.removeAllListeners();
        this.conditions.forEach(cond => cond.clear());
    }
}

export class AndCondition extends AggregateCondition {

    constructor(options: AndConditionOptions, modules: Module[], recipe: Recipe) {
        super(options, modules, recipe);
        catRecipe.trace(`Add AndCondition: ${options}`);
    }

    listen(): EventEmitter {
        this.conditions.forEach((condition) => {
            condition.listen().on('state_changed', (state) => {
                catRecipe.info(`AndCondition: ${JSON.stringify(this.conditions.map(item => item.fulfilled))}`);
                const oldState = this._fulfilled;
                this._fulfilled = this.conditions.every(condition => condition.fulfilled);
                if (oldState !== this._fulfilled) {
                    this.eventEmitter.emit('state_changed', this._fulfilled);
                }
            });
        });
        return this.eventEmitter;
    }
}

export class OrCondition extends AggregateCondition {

    constructor(options: OrConditionOptions, modules: Module[], recipe: Recipe) {
        super(options, modules, recipe);
        catRecipe.trace(`Add OrCondition: ${options}`);
    }

    listen(): EventEmitter {
        this.conditions.forEach((condition) => {
            condition.listen().on('state_changed', (status) => {
                const oldState = this._fulfilled;
                this._fulfilled = this.conditions.some(condition => condition.fulfilled);
                if (oldState !== this._fulfilled) {
                    this.eventEmitter.emit('state_changed', this._fulfilled);
                }
            });
        });
        return this.eventEmitter;
    }
}

export class TimeCondition extends Condition {
    private timer: NodeJS.Timer;
    private duration: number;

    constructor(options: TimeConditionOptions) {
        super(options);
        this.duration = options.duration * 1000;
        this._fulfilled = false;
        catRecipe.trace(`Add TimeCondition: ${JSON.stringify(options)}`);
    }

    listen(): EventEmitter {
        catRecipe.debug(`Start Timer: ${this.duration}`);
        this.timer = setTimeout(() => {
            catRecipe.debug(`TimeCondition finished: ${this.duration}`);
            this._fulfilled = true;
            this.eventEmitter.emit('state_changed', this._fulfilled);
        },
            this.duration);
        return this.eventEmitter;
    }

    clear(): void {
        this.eventEmitter.removeAllListeners();
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
        this.eventEmitter.removeAllListeners();
        this.service.parent.clearListener(this.service.status);
    }

    listen(): EventEmitter {
        this.monitoredItem = this.service.parent.listenToOpcUaNode(this.service.status);
        this.monitoredItem.on('changed', (dataValue) => {
            const state: ServiceState = dataValue;
            this._fulfilled = ServiceState[state]
                .localeCompare(this.state, 'en', { usage: 'search', sensitivity: 'base' }) === 0;
            catRecipe.info(`StateCondition: ${this.module.id}.${this.service.name}) = (${ServiceState[state]})` +
                `- ?= ${this.state} -> ${this._fulfilled}`);
            this.eventEmitter.emit('state_changed', this._fulfilled);
        });
        return this.eventEmitter;
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
        this.eventEmitter.removeAllListeners();
        this.listener.removeAllListeners();
    }

    listen(): EventEmitter {
        catRecipe.info(`Listen to ${this.dataStructure}.${this.variable}`);
        this.module.readVariable(this.dataStructure, this.variable).then((value) => {
            this._fulfilled = this.compare(value.value.value);
            this.eventEmitter.emit('state_changed', this._fulfilled);
            catOpc.info(`VariableCondition ${this.dataStructure}: ${value.value.value} ${this.operator} ${this.value} = ${this._fulfilled}`);
        });

        this.listener = this.module.listenToVariable(this.dataStructure, this.variable)
            .on('changed', (value) => {
                catOpc.info(`value changed to ${value} -  (${this.operator}) compare against ${this.value}`);
                this._fulfilled = this.compare(value);
                this.eventEmitter.emit('state_changed', this._fulfilled);
                catOpc.info(`VariableCondition ${this.dataStructure}: ${value} ${this.operator} ${this.value} = ${this._fulfilled}`);
            });
        return this.eventEmitter;
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
