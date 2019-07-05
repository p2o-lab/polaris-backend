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

import {Service} from '../core/Service';
import {ServiceState} from '../core/enum';
import {StateConditionOptions} from '@p2olab/polaris-interface';
import {Module} from '../core/Module';
import {catCondition} from '../../config/logging';
import {Condition} from './Condition';
import {ModuleCondition} from './ModuleCondition';

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
        this.service.eventEmitter.on('state', this.check);
        this.check({state: this.service.state, timestamp: new Date()});
        return this;
    }

    public clear() {
        super.clear();
        this.service.eventEmitter.removeListener('state', this.check);
    }

    private check = (data: { state: ServiceState, timestamp: Date }) => {
        this._fulfilled = (data.state === this.state);
        catCondition.info(`StateCondition ${this.service.qualifiedName}: actual=${ServiceState[data.state]}` +
            ` ; condition=${ServiceState[this.state]} -> ${this._fulfilled}`);
        this.emit('stateChanged', this._fulfilled);
    }
}
