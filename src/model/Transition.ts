import {Step} from "./Step";
import {Condition, StateCondition, TimeCondition, VariableCondition} from "./Condition";

export class Transition {
    next_step: Step | string;
    conditions: Condition[];

    constructor(json, modules) {
        this.next_step = json.next_step;
        let conditions = json.condition;

        this.conditions = [];
        conditions.forEach((json_condition) => {

            if (json_condition.hasOwnProperty("time")) {
                this.conditions.push(new TimeCondition(json_condition));
            }
            if (json_condition.hasOwnProperty("service")) {
                this.conditions.push(new StateCondition(json_condition, modules));
            }
            if (json_condition.hasOwnProperty("variable")) {
                this.conditions.push(new VariableCondition(json_condition, modules));
            }
        });


        console.log(this.conditions)
    }
}

