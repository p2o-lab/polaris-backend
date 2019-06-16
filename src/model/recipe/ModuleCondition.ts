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

import {Module} from '../core/Module';
import {EventEmitter} from 'events';
import {StateConditionOptions, VariableConditionOptions} from '@p2olab/polaris-interface';
import {Condition} from './Condition';
import {Service} from '../core/Service';
import {ServiceState} from '../core/enum';
import {catCondition} from '../../config/logging';

export abstract class ModuleCondition extends Condition {
    protected readonly module: Module;
    protected monitoredItem: EventEmitter;
    protected boundCheckHandler = (data: any) => this.check(data);

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
        this.monitoredItem = this.module.listenToOpcUaNode(this.service.status)
            .on('changed', this.boundCheckHandler);
        return this;
    }

    public check(data) {
        const state: ServiceState = data.value;
        this._fulfilled = (state === this.state);
        catCondition.info(`StateCondition ${this.service.qualifiedName}: actual=${ServiceState[state]}` +
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
