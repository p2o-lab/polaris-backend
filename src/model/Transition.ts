import {Step} from "./Step";
import {Condition} from "./condition/Condition";
import {ConditionOptions} from "./condition/ConditionOptions";

export interface TransitionOptions {
    next_step: string;
    condition: ConditionOptions;
}

export class Transition {
    next_step: Step;
    next_step_name: string;
    condition: Condition;

    constructor(json, modules) {
        this.next_step_name = json.next_step;
        this.condition = Condition.create(json.condition, modules);
    }
}

