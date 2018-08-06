import {catOpc, catRecipe} from '../config/logging';
import {ConditionType, ServiceState} from './enum';
import {Module} from './Module';
import {Service} from './Service';
import {AttributeIds, ClientMonitoredItem, coerceNodeId} from 'node-opcua-client';
import {Recipe} from "./Recipe";

export type ConditionOptions = AndConditionOptions | TimeConditionOptions | OrConditionOptions |
    TimeConditionOptions | StateConditionOptions | VariableConditionOptions | NotConditionOptions;

export interface BaseConditionOptions {
    type: ConditionType;
}

export interface AndConditionOptions extends BaseConditionOptions {
    type: ConditionType.and;
    conditions: ConditionOptions[];
}

export interface OrConditionOptions extends BaseConditionOptions {
    type: ConditionType.or;
    conditions: ConditionOptions[];
}

export interface NotConditionOptions extends BaseConditionOptions {
    type: ConditionType.not;
    condition: ConditionOptions;
}

export interface StateConditionOptions extends BaseConditionOptions {
    type: ConditionType.state;
    // module id (can be ommited if only one module is registered)
    module?: string;
    service: string;
    state: string;
}

export interface TimeConditionOptions extends BaseConditionOptions {
    type: ConditionType.time;
    duration: number;
}

export interface VariableConditionOptions extends BaseConditionOptions {
    type: ConditionType.variable;
    module: string;
    variable: string;
    dataStructure: string;
    value: string | number;
    operator: string;
}

export abstract class Condition {

    protected _fulfilled: boolean = false;

    get fulfilled(): boolean {
        return this._fulfilled;
    }

    /**
     * Create Condition
     * @param {ConditionOptions} options
     * @param {Map<string,Module>} modules
     * @returns Condition
     * */
    static create(options: ConditionOptions, modules: Module[], recipe: Recipe): Condition {
        catRecipe.trace(`Create Condition: ${JSON.stringify(options)}`);
        const type: ConditionType = options.type;
        if (type === ConditionType.time) {
            return new TimeCondition(<TimeConditionOptions> options);
        }
        else if (type === ConditionType.and) {
            return new AndCondition(<AndConditionOptions> options, modules, recipe);
        }
        else if (type === ConditionType.state) {
            return new StateCondition(<StateConditionOptions> options, modules, recipe);
        }
        else if (type === ConditionType.variable) {
            return new VariableCondition(<VariableConditionOptions> options, modules, recipe);
        }
        else if (type === ConditionType.or) {
            return new OrCondition(<OrConditionOptions> options, modules, recipe);
        }
        else if (type === ConditionType.not) {
            return new NotCondition(<NotConditionOptions> options, modules, recipe);
        }
        else throw new Error(`No Condition found for ${options}`);
    }

    /**
     * Listen to any change in condition and inform via callback
     * @param {(boolean) => void} callback
     */
    abstract listen(callback: (condition: boolean) => void): void | Promise<void>;

    /**
     * Clear listening on condition
     */
    abstract clear();
}

export class OrCondition extends Condition {
    conditions: Condition[];

    constructor(options: OrConditionOptions, modules, recipe) {
        super();
        catRecipe.trace(`Add OrCondition: ${options}`);
        this.conditions = options.conditions.map((option) => {
            return Condition.create(option, modules, recipe);
        });
        this._fulfilled = false;
    }

    clear() {
        this.conditions.forEach(cond => cond.clear());
    }

    listen(callback): void {
        this.conditions.forEach((condition) => {
            condition.listen(() => {
                this._fulfilled = this.conditions.some((condition) => {
                    return condition.fulfilled;
                });
                callback(this._fulfilled);
            });
        });
    }
}

export class StateCondition extends Condition {
    module: Module;
    service: Service;
    state: string;
    private monitoredItem: ClientMonitoredItem;

    constructor(options: StateConditionOptions, modules: Module[], recipe: Recipe) {
        super();
        if (options.module) {
            this.module = modules.find(module => module.id === options.module);
        } else if (modules.length === 1) {
            this.module = modules[0];
        }
        recipe.modules.add(this.module);
        this.service = this.module.services.find(service => service.name === options.service);

        this.state = options.state;
    }

    clear() {
        this.monitoredItem.terminate(() => catOpc.debug(`Subscription terminated: ${this.service.name}`));
    }

    listen(callback): void {
        this.monitoredItem = this.service.parent.subscription.monitor({
                nodeId: this.service.parent.resolveNodeId(this.service.status),
                attributeId: AttributeIds.Value
            },
            {
                samplingInterval: 1000,
                discardOldest: true,
                queueSize: 10
            });
        this.monitoredItem.on('changed', (dataValue) => {
            let state: ServiceState = dataValue.value.value;
            catOpc.debug(`State Changed (${this.service.name}) = ${state} (${ServiceState[state]}) - compare to ${this.state}`);
            this._fulfilled = ServiceState[state]
                .localeCompare(this.state, 'en', {usage: "search", sensitivity: "base"}) === 0;
            callback(this._fulfilled);
        });
    }
}

export class TimeCondition extends Condition {
    private timer: NodeJS.Timer;
    private duration: number;

    constructor(options: TimeConditionOptions) {
        super();
        this.duration = options.duration * 1000;
        this._fulfilled = false;
        catRecipe.trace(`Add TimeCondition: ${JSON.stringify(options)}`);
    }

    listen(callback): void {
        catRecipe.debug(`Start Timer: ${this.duration}`);
        this.timer = setTimeout(() => {
                catRecipe.debug(`Timer finished: ${this.duration}`);
                this._fulfilled = true;
                callback(true);
            },
            this.duration);
    }

    clear(): void {
        this.timer.unref();
    }
}

export class VariableCondition extends Condition {
    module: Module;
    dataStructure: string;
    variable: string;
    value: string | number;
    operator: string;

    constructor(options: VariableConditionOptions, modules: Module[], recipe: Recipe) {
        super();
        if (options.module) {
            this.module = modules.find(module => module.id === options.module);
        } else if (modules.length === 1) {
            this.module = modules[0];
        }
        recipe.modules.add(this.module);

        this.dataStructure = options.dataStructure;
        this.variable = options.variable;
        this.value = options.value;
        this.operator = options.operator;
    }

    /**
     *
     */
    clear(): void {
        this.module.clearListener(this.variable);
    }

    /**
     *
     * @param {(boolean) => void} callback
     */
    async listen(callback): Promise<void> {
        const value = await this.module.readVariable(this.dataStructure, this.variable);

        if (value.value.value === this.value) {
            this._fulfilled = true;
        } else {
            this._fulfilled = false;
        }
        callback(this._fulfilled);

        this.module.listenToVariable(this.dataStructure, this.variable)
            .on('changed', (value) => {
                catOpc.debug(`value changed to ${value}`);
                if (value === this.value) {
                    this._fulfilled = true;
                } else {
                    this._fulfilled = false;
                }
                callback(this._fulfilled);
            });
    }
}

export class NotCondition extends Condition {
    condition: Condition;

    constructor(options: NotConditionOptions, modules, recipe) {
        super();
        catRecipe.trace(`Add NotCondition: ${options}`);
        this.condition = Condition.create(options.condition, modules, recipe);
        this._fulfilled = false;
    }

    clear() {
        this.condition.clear();
    }

    listen(callback): void {
        this.condition.listen(() => {
            this._fulfilled = this.condition.fulfilled;
            callback(this._fulfilled);
        });
    }
}

export class AndCondition extends Condition {

    conditions: Condition[] = [];

    constructor(options: AndConditionOptions, modules, recipe) {
        super();
        catRecipe.trace(`Add AndCondition: ${options}`);
        this.conditions = options.conditions.map((option) => {
            return Condition.create(option, modules, recipe);
        });
        this._fulfilled = false;
    }

    clear() {
        this.conditions.forEach((cond) => cond.clear());
    }

    listen(callback) {
        this.conditions.forEach((condition) => {
            condition.listen(() => {
                this._fulfilled = this.conditions.every((condition) => {
                    return condition.fulfilled;
                });
                callback(this._fulfilled);
            });
        });
    }
}
