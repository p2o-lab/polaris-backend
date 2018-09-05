import {Operation, OperationOptions} from "./Operation";
import {Transition, TransitionOptions} from "./Transition";
import {catRecipe} from "../config/logging";
import {manager} from "./Manager";
import {EventEmitter} from "events";
import {StepInterface} from "pfe-ree-interface/dist/interfaces";

export interface StepOptions {
    name: string;
    operations: OperationOptions[];
    transitions: TransitionOptions[];
}

export class Step {
    name: string;
    operations: Operation[];
    transitions: Transition[];

    private eventEmitter: EventEmitter = new EventEmitter();

    constructor(options: StepOptions, modules, recipe) {
        if (options.name) {
            this.name = options.name;
        } else {
            throw new Error(`"name" property is missing in ${JSON.stringify(options)}`);
        }
        if (options.operations) {
            this.operations = options.operations.map(operationOptions => new Operation(operationOptions, modules, recipe));
        } else {
            throw new Error(`"operations" array is missing in ${JSON.stringify(options)}`);
        }
        if (options.transitions){
            this.transitions = options.transitions.map(transitionOptions => new Transition(transitionOptions, modules, recipe));
        } else {
            throw new Error(`"transitions" array is missing in ${JSON.stringify(options)}`);
        }
    }

    execute() {
        manager.eventEmitter.emit('refresh', 'recipe', 'stepStarted');
        this.operations.forEach((operation) => {
            catRecipe.info(`Start operation ${operation.module.id} ${operation.service.name} ${JSON.stringify(operation.command)} ${JSON.stringify(operation.parameter)}`);
            operation.execute();
        });

        this.transitions.forEach((transition) => {
            transition.condition.listen((status) => {
                catRecipe.info(`Status of step ${this.name} for transition to ${transition.next_step_name}: ${status}`);
                if (status) {
                    // clear up all conditions
                    this.transitions.forEach((transition) => {
                        transition.condition.clear();
                    });
                    this.eventEmitter.emit('completed', this, transition);
                }
            });
        });
        return this.eventEmitter;
    }

    public json(): StepInterface {
        return {
            name: this.name,
            transitions: this.transitions.map(transition => transition.json()),
            operations: this.operations.map(operation => operation.json())
        }
    }
}