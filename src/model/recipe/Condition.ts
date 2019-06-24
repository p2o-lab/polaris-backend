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

import {
    AndConditionOptions,
    ConditionOptions,
    ConditionType,
    ExpressionConditionOptions,
    NotConditionOptions,
    OrConditionOptions,
    ScopeOptions,
    StateConditionOptions,
    TimeConditionOptions,
    VariableConditionOptions
} from '@p2olab/polaris-interface';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {catCondition} from '../../config/logging';
import Timeout = NodeJS.Timeout;
import {ServiceState} from '../core/enum';
import {Module} from '../core/Module';
import {Service} from '../core/Service';
import {ScopeItem} from './ScopeItem';
import {Expression} from 'expr-eval';

/**
 * Events emitted by [[Condition]]
 */
interface ConditionEvents {
    /**
     * Notify when the condition changes its state. Parameter is a boolean representing if condition is fulfilled.
     * @event stateChanged
     */
    stateChanged: boolean;
}

type ConditionEmitter = StrictEventEmitter<EventEmitter, ConditionEvents>;

export abstract class Condition extends (EventEmitter as new() => ConditionEmitter) {

    get fulfilled(): boolean {
        return this._fulfilled;
    }

    /**
     * Create Condition
     * @param {ConditionOptions} options    options for creating Condition
     * @param {Module[]} modules    modules to be used for evaluating module name in expressions
     * @returns Condition
     */
    public static create(options: ConditionOptions, modules: Module[]): Condition {
        catCondition.trace(`Create Condition: ${JSON.stringify(options)}`);
        const type: ConditionType = options.type;
        if (type === ConditionType.time) {
            return new TimeCondition(options as TimeConditionOptions);
        } else if (type === ConditionType.and) {
            return new AndCondition(options as AndConditionOptions, modules);
        } else if (type === ConditionType.state) {
            return new StateCondition(options as StateConditionOptions, modules);
        } else if (type === ConditionType.variable) {
            return new VariableCondition(options as VariableConditionOptions, modules);
        } else if (type === ConditionType.or) {
            return new OrCondition(options as OrConditionOptions, modules);
        } else if (type === ConditionType.not) {
            return new NotCondition(options as NotConditionOptions, modules);
        } else if (type === ConditionType.expression) {
            return new ExpressionCondition(options as ExpressionConditionOptions, modules);
        } else {
            throw new Error(`No Condition found for ${options}`);
        }
    }

    protected _fulfilled: boolean = false;
    private options: ConditionOptions;

    constructor(options: ConditionOptions) {
        super();
        this.options = options;
    }

    /**
     * Listen to any change in condition and inform via 'stateChanged' event
     */
    public abstract listen(): Condition;

    /**
     * Clear listening on condition
     */
    public clear() {
        this._fulfilled = undefined;
        this.removeAllListeners('stateChanged');
    }

    public abstract getUsedModules(): Set<Module>;

    public json(): ConditionOptions {
        return this.options;
    }
}

export class ExpressionCondition extends Condition {

    private expression: Expression;
    private scopeArray: ScopeItem[];
    private listenersExpression: EventEmitter[] = [];

    /**
     *
     * @param {ExpressionConditionOptions} options
     * @param {Module[]} modules
     */
    constructor(options: ExpressionConditionOptions, modules: Module[] = []) {
        super(options);
        catCondition.info(`Add ExpressionCondition: ${options.expression} ` +
            `(${JSON.stringify(modules.map((m) => m.id))})`);
        // evaluate scopeArray
        this.scopeArray = (options.scope || [])
            .map((item: ScopeOptions) => ScopeItem.extractFromScopeOptions(item, modules));

        // evaluate additional variables from expression
        const extraction = ScopeItem.extractFromExpressionString(
            options.expression,
            modules,
            this.scopeArray.map((scope) => scope.name));
        this.expression = extraction.expression;
        this.scopeArray.push (...extraction.scopeItems);
        this._fulfilled = false;
    }

    public getUsedModules(): Set<Module> {
        return new Set<Module>([...this.scopeArray.map((sa) => sa.module)]);
    }

    public listen(): Condition {
        this.scopeArray.forEach(async (item) => {
            const a = item.module.listenToOpcUaNode(item.variable);
            a.on('changed', this.boundOnChanged);
            this.listenersExpression.push(a);
        });
        return this;
    }

    public async onChanged() {
        this._fulfilled = (await this.getValue()) as boolean;
        this.emit('stateChanged', this._fulfilled);
    }

    /**
     * calculate value from current scopeArray
     * @returns {Promise<any>}
     */
    public async getValue(): Promise<any> {
        // get current variables
        const tasks = await Promise.all(this.scopeArray.map(async (item) => {
            return item.module.readVariableNode(item.variable)
                .then((value) => {
                    return item.name.split('.').reduceRight((previous, current) => {
                        const a = {};
                        a[current] = previous;
                        return a;
                    }, value.value.value );
                });
        }));
        const assign = require('assign-deep');
        const scope = assign(...tasks);
        catCondition.info(`Scope: ${JSON.stringify(scope)}`);
        return this.expression.evaluate(scope);
    }

    public clear() {
        super.clear();
        this.listenersExpression.forEach((item) => {
            item.removeListener('changed', this.boundOnChanged);
        });
    }

    private boundOnChanged = () => this.onChanged();

}

export class NotCondition extends Condition {
    public condition: Condition;

    constructor(options: NotConditionOptions, modules: Module[]) {
        super(options);
        catCondition.trace(`Add NotCondition: ${options}`);
        this.condition = Condition.create(options.condition, modules);
        this._fulfilled = !this.condition.fulfilled;
    }

    public clear() {
        super.clear();
        this.condition.clear();
    }

    public listen(): Condition {
        this.condition.listen().on('stateChanged', (state) => {
            this._fulfilled = !state;
            this.emit('stateChanged', this._fulfilled);
        });
        return this;
    }

    public getUsedModules(): Set<Module> {
        return this.condition.getUsedModules();
    }
}

export class TimeCondition extends Condition {

    private timer: Timeout;
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

    public listen(): Condition {
        catCondition.debug(`Start Timer: ${this.duration}`);
        this.timer = global.setTimeout(() => {
                catCondition.debug(`TimeCondition finished: ${this.duration}`);
                this._fulfilled = true;
                this.emit('stateChanged', this._fulfilled);
        },
            this.duration);
        return this;
    }

    public clear(): void {
        super.clear();
        if (this.timer) {
            global.clearTimeout(this.timer);
        }
    }

    public getUsedModules(): Set<Module> {
        return new Set<Module>();
    }
}

export abstract class ModuleCondition extends Condition {
    protected readonly module: Module;
    protected monitoredItem: EventEmitter;

    constructor(options: StateConditionOptions | VariableConditionOptions, modules: Module[]) {
        super(options);
        if (options.module) {
            this.module = modules.find((module) => module.id === options.module);
        } else if (modules.length === 1) {
            this.module = modules[0];
        }
        if (!this.module) {
            throw new Error(`Could not find module ${options.module} in ${JSON.stringify(modules.map((m) => m.id))}`);
        }
    }

    public clear() {
        super.clear();
        if (this.monitoredItem) {
            this.monitoredItem.removeListener('changed', this.boundCheckHandler);
        }
    }

    public getUsedModules() {
        return new Set<Module>().add(this.module);
    }

    public abstract check(data: any);
    protected boundCheckHandler = (data: any) => this.check(data);
}

export class StateCondition extends ModuleCondition {
    public readonly service: Service;
    public readonly state: ServiceState;

    constructor(options: StateConditionOptions, modules: Module[]) {
        super(options, modules);
        if (this.module.services) {
            this.service = this.module.services.find((service) => service.name === options.service);
        }
        if (!this.service) {
            throw new Error(`Service "${options.service}" not found in provided module ${this.module.id}`);
        }
        const mapping = {
            'idle': ServiceState.IDLE,
            'starting': ServiceState.STARTING,
            'execute': ServiceState.EXECUTE,
            'completing': ServiceState.COMPLETING,
            'completed': ServiceState.COMPLETED,
            'resetting': ServiceState.RESETTING,
            'pausing': ServiceState.PAUSING,
            'paused': ServiceState.PAUSED,
            'resuming': ServiceState.RESUMING,
            'holding': ServiceState.HOLDING,
            'held': ServiceState.HELD,
            'unholding': ServiceState.UNHOLDING,
            'stopping': ServiceState.STOPPING,
            'stopped': ServiceState.STOPPED,
            'aborting': ServiceState.ABORTING,
            'aborted': ServiceState.ABORTED
        };
        this.state = mapping[options.state.toLowerCase()];
        if (!this.state) {
            throw new Error(`State ${options.state} is not a valid state for a condition (${JSON.stringify(options)}`);
        }
    }

    public listen(): Condition {
        this.monitoredItem = this.service.eventEmitter.on('state', this.boundCheckHandler);
        return this;
    }

    public check(data: {state: ServiceState, timestamp: Date}) {
        this._fulfilled = (data.state === this.state);
        catCondition.info(`StateCondition ${this.service.qualifiedName}: actual=${ServiceState[data.state]}` +
            ` ; condition=${ServiceState[this.state]} -> ${this._fulfilled}`);
        this.emit('stateChanged', this._fulfilled);
    }
}

export class VariableCondition extends ModuleCondition {
    public readonly dataStructure: string;
    public readonly variable: string;
    public readonly value: string | number;
    public readonly operator: '==' | '<' | '>' | '<=' | '>=';

    constructor(options: VariableConditionOptions, modules: Module[]) {
        super(options, modules);
        if (!options.dataAssembly) {
            throw new Error(`Condition does not have 'dataAssembly' ${JSON.stringify(options)}`);
        }
        this.dataStructure = options.dataAssembly;
        this.variable = options.variable || 'V';
        this.value = options.value;
        this.operator = options.operator || '==';
    }

    public listen(): Condition {
        catCondition.debug(`Listen to ${this.dataStructure}.${this.variable}`);
        this.monitoredItem = this.module.listenToVariable(this.dataStructure, this.variable)
            .on('changed', this.boundCheckHandler);
        return this;
    }

    public check(data) {
        catCondition.debug(`value changed to ${data.value} -  (${this.operator}) compare against ${this.value}`);
        const value: number = data.value;
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
        this._fulfilled = result;
        this.emit('stateChanged', this._fulfilled);
        catCondition.debug(`VariableCondition ${this.dataStructure}: ` +
            `${data.value} ${this.operator} ${this.value} = ${this._fulfilled}`);
    }

}

export abstract class AggregateCondition extends Condition {
    public conditions: Condition[] = [];

    constructor(options: AndConditionOptions | OrConditionOptions, modules: Module[]) {
        super(options);
        this.conditions = options.conditions.map((option) => {
            return Condition.create(option, modules);
        });
        this._fulfilled = false;
    }

    public clear() {
        super.clear();
        this.conditions.forEach((cond) => cond.clear());
    }

    public getUsedModules(): Set<Module> {
        const set = new Set<Module>();
        this.conditions.forEach((cond) => {
            Array.from(cond.getUsedModules()).forEach((module) => {
                set.add(module);
            });
        });
        return set;
    }
}

export class AndCondition extends AggregateCondition {

    constructor(options: AndConditionOptions, modules: Module[]) {
        super(options, modules);
        catCondition.trace(`Add AndCondition: ${options}`);
    }

    public listen(): Condition {
        this.conditions.forEach((condition) => {
            condition.listen().on('stateChanged', (state) => {
                catCondition.debug(`AndCondition: ${state} = ` +
                    `${JSON.stringify(this.conditions.map((item) => item.fulfilled))}`);
                const oldState = this._fulfilled;
                this._fulfilled = this.conditions.every((cond) => cond.fulfilled);
                if (oldState !== this._fulfilled) {
                    this.emit('stateChanged', this._fulfilled);
                }
            });
        });
        return this;
    }
}

export class OrCondition extends AggregateCondition {

    constructor(options: OrConditionOptions, modules: Module[]) {
        super(options, modules);
        catCondition.trace(`Add OrCondition: ${options}`);
    }

    public listen(): Condition {
        this.conditions.forEach((condition) => {
            condition.listen().on('stateChanged', (status) => {
                const oldState = this._fulfilled;
                this._fulfilled = this.conditions.some((cond) => cond.fulfilled);
                if (oldState !== this._fulfilled) {
                    this.emit('stateChanged', this._fulfilled);
                }
            });
        });
        return this;
    }
}
