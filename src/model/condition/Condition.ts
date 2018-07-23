import {catOpc, catRecipe} from "../../config/logging";
import {ConditionType} from "../enum";
import {
    AndConditionOptions,
    BaseConditionOptions,
    ConditionOptions,
    NotConditionOptions,
    OrConditionOptions,
    StateConditionOptions,
    TimeConditionOptions,
    VariableConditionOptions
} from "./ConditionOptions";
import {Module} from "../Module";
import {Service} from "../Service";
import {AttributeIds, ClientMonitoredItem, coerceNodeId} from "node-opcua";


export abstract class Condition {

    protected _fulfilled = false;

    get fulfilled(): boolean {
        return this._fulfilled;
    }

    /**
     * Create Condition
     * @param {ConditionOptions} options
     * @param {Map<string,Module>} modules
     * @returns {any}
     */
    static create(options: ConditionOptions, modules: Map<string, Module> = null) {
        catRecipe.trace(`Create Condition: ${JSON.stringify(options)}`);
        let type = (<BaseConditionOptions> options).type;
        if (type == ConditionType.time)
            return new TimeCondition(<TimeConditionOptions> options);
        if (type == ConditionType.and)
            return new AndCondition(<AndConditionOptions> options);
        if (type == ConditionType.state)
            return new StateCondition(<StateConditionOptions> options, modules);
        if (type == ConditionType.variable)
            return new VariableCondition(<VariableConditionOptions> options, modules);
        if (type == ConditionType.or)
            return new OrCondition(<OrConditionOptions> options);
        if (type == ConditionType.not)
            return new NotCondition(<NotConditionOptions> options);
    }

    /**
     * Listen to any change in condition and inform via callback
     * @param {(boolean) => void} callback
     */
    abstract listen(callback: (boolean) => void);

    /**
     * Clear listening on condition
     */
    abstract clear();
}

export class OrCondition extends Condition {
    conditions: Condition[];

    constructor(options: OrConditionOptions) {
        super();
        catRecipe.trace(`Add OrCondition: ${options}`);
        this.conditions = options.conditions.map((option) => {
            return Condition.create(option)
        });
        this._fulfilled = false;
    }

    clear() {
        this.conditions.forEach((cond) => cond.clear());
    }

    listen(callback) {
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
    moduleName: string;
    service: Service;
    serviceName: string;
    state: string;
    private monitoredItem: ClientMonitoredItem;

    constructor(options: StateConditionOptions, modules: Map<string, Module> = null) {
        super();
        this.moduleName = options.module;
        this.serviceName = options.service;
        this.state = options.state;
        if (modules)
            this.resolve_module(modules);
    }

    clear() {
        this.monitoredItem.terminate(() => catOpc.debug(`Subscription terminated: ${this.service}`));
    }

    listen(callback) {
        this.monitoredItem = this.service.parent.subscription.monitor({
                nodeId: coerceNodeId(this.service.status),
                attributeId: AttributeIds.Value
            },
            {
                samplingInterval: 1000,
                discardOldest: true,
                queueSize: 10
            });
        this.monitoredItem.on("changed", (dataValue) => {
            console.log(`State Changed (${this.serviceName}) = ${dataValue.value.value.toString()}`);
            this._fulfilled = dataValue.value.value == this.state;
            callback(this._fulfilled);
        });

    }

    private resolve_module(modules: Map<string, Module>) {
        this.module = modules.get(this.moduleName);
        this.service = this.module.services.get(this.serviceName);
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

    listen(callback) {
        catRecipe.debug(`Start Timer: ${this.duration}`);
        this.timer = setTimeout(() => {
                catRecipe.debug(`Timer finished: ${this.duration}`);
                this._fulfilled = true;
                callback(true);
            },
            this.duration);
    }

    clear() {
        this.timer.unref();
    }
}

export class VariableCondition extends Condition {
    module: Module;
    module_name: string;
    variable: string;
    value: string | number;
    operator: string;

    constructor(options: VariableConditionOptions, modules: Map<string, Module> = null) {
        super();
        this.module_name = options.module;
        this.variable = options.variable;
        this.value = options.value;
        this.operator = options.operator;
        if (modules)
            this.resolve_module(modules);
    }

    /**
     * TODO: Implement me
     */
    clear() {
    }

    /**
     * TODO: Implement me
     * @param {(boolean) => void} callback
     */
    listen(callback) {
    }

    private resolve_module(modules: Map<string, Module>) {
        if (typeof module === "string") {
            this.module = modules.get(this.module_name);
        }
    }
}

export class NotCondition extends Condition {
    condition: Condition;

    constructor(options: NotConditionOptions) {
        super();
        catRecipe.trace(`Add NotCondition: ${options}`);
        this.condition = Condition.create(options.condition);
        this._fulfilled = false;
    }

    clear() {
        this.condition.clear();
    }

    listen(callback) {
        this.condition.listen(() => {
            this._fulfilled = this.condition.fulfilled;
            callback(this._fulfilled);
        });
    }
}

export class AndCondition extends Condition {

    conditions: Condition[] = [];

    constructor(options: AndConditionOptions) {
        super();
        catRecipe.trace(`Add AndCondition: ${options}`);
        this.conditions = options.conditions.map((option) => {
            return Condition.create(option)
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




