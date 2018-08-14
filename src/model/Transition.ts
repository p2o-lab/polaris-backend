import {Step} from "./Step";
import {Condition, ConditionOptions} from "./Condition";

export interface TransitionOptions {
    next_step: string;
    condition: ConditionOptions;
}

export class Transition {
    next_step: Step;
    next_step_name: string;
    condition: Condition;

    constructor(json, modules, recipe) {
        this.next_step_name = json.next_step;
        this.condition = Condition.create(json.condition, modules, recipe);
    }

    json() {
        return {
            next_step: this.next_step_name,
            condition: this.condition.json()
        }
    }
}

