import {Operation, OperationOptions} from "./Operation";
import {Transition, TransitionOptions} from "./Transition";
import {catRecipe} from "../config/logging";
import {recipe_manager} from "./RecipeManager";

export interface StepOptions {
    name: string;
    operations: OperationOptions[];
    transitions: TransitionOptions[];
}

export class Step {
    name: string;
    operations: Operation[];
    transitions: Transition[];

    constructor(options: StepOptions, modules, recipe) {
        this.name = options.name;

        this.operations = options.operations.map(operationOptions => new Operation(operationOptions, modules, recipe));
        this.transitions = options.transitions.map(transitionOptions => new Transition(transitionOptions, modules, recipe));
    }

    execute(callback: (step: Step) => void) {
        catRecipe.info(`Start step ${this.name}`);
        recipe_manager.eventEmitter.emit('refresh', 'recipe', 'stepStarted', this.name);
        this.operations.forEach((operation) => {
            catRecipe.info(`Start operation ${operation.module.id} ${operation.service.name} ${operation.command} ${operation.parameter}`);
            operation.execute();
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
