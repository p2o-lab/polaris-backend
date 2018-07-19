import {Module} from "./Module";
import {Service} from "./Service";

export class Condition {
}

export class TimeCondition extends Condition {
    time: string;

    constructor(json_condition: any) {
        super();
        this.time = json_condition.time;
    }
}

export class VariableCondition extends Condition {
    module: Module;
    variable: string;
    value: string | number;
    operator: string;

    constructor(json_condition: any, modules: any) {
        super();
        this.module = modules.get(json_condition.module);
        this.variable = json_condition.variable;
        this.value = json_condition.value;
        this.operator = json_condition.operator;
    }
}

export class StateCondition extends Condition {
    module: Module;
    service: Service;
    state: string;

    constructor(json_condition: any, modules: Map<string, Module>) {
        super();
        this.module = modules.get(json_condition.module);
        this.service = this.module.services.get(json_condition.service);
        this.state = json_condition.state;
    }
}