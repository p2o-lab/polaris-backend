import {Step} from './Step';
import {Condition} from './Condition';
import {ConditionOptions} from 'pfe-ree-interface';
import {TransitionInterface} from 'pfe-ree-interface/dist/interfaces';
import {Module} from './Module';
import {Recipe} from './Recipe';

export interface TransitionOptions {
    next_step: string;
    condition: ConditionOptions;
}

export class Transition {
    next_step: Step;
    next_step_name: string;
    condition: Condition;

    constructor(options: TransitionOptions, modules: Module[], recipe: Recipe) {
        if (options.next_step) {
            this.next_step_name = options.next_step;
        } else {
            throw new Error(`"next_step" property is missing in ${JSON.stringify(options)}`);
        }
        if (options.condition) {
            this.condition = Condition.create(options.condition, modules, recipe);
        } else {
            throw new Error(`"condition" property is missing in ${JSON.stringify(options)}`);
        }
    }

    json(): TransitionInterface {
        return {
            next_step: this.next_step_name,
            condition: this.condition.json()
        };
    }
}
