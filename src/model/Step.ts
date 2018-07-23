import {Operation, OperationOptions} from "./Operation";
import {Transition, TransitionOptions} from "./Transition";
import {catRecipe} from "../config/logging";

export interface StepOptions {
    name: string;
    operations: OperationOptions[];
    transitions: TransitionOptions[];
}

export class Step {
    name: string;
    operations: Operation[];
    transitions: Transition[];

    constructor(options: StepOptions, modules) {
        this.name = options.name;

        this.operations = [];
        options.operations.forEach((json_operation: OperationOptions) => {
            this.operations.push(new Operation(json_operation, modules));
        });

        this.transitions = [];
        options.transitions.forEach((json_transition: TransitionOptions) => {
            this.transitions.push(new Transition(json_transition, modules));
        });
    }

    execute(callback: (step: Step) => void) {
        this.operations.forEach((operation) => {
            catRecipe.info(`Start operation ${operation}`);
        });

        this.transitions.forEach((transition) => {
            transition.condition.listen((status) => {
                catRecipe.info(`Status: ${status}`);
                if (status) {
                    this.transitions.forEach((transition) => {
                        transition.condition.clear();
                    });
                    callback(transition.next_step);
                }
            });
        });
    }

}