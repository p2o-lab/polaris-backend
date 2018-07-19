import {Operation} from "./Operation";
import {Transition} from "./Transition";

export class Step {
    constructor(json: any, modules) {
        this.name = json.name;

        this.operations = [];
        json.operations.forEach( (json_operation: Operation) => {
            this.operations.push(new Operation(json_operation, modules));

        });

        this.transitions = [];
        json.transitions.forEach( (json_transition: Transition) => {
            this.transitions.push(new Transition(json_transition, modules));

        });
    }

    name: string;
    operations: Operation[];
    transitions: Transition[];

}