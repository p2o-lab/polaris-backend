import {Step, StepOptions} from "./Step";
import {Module, ModuleOptions} from "./Module";
import {catRecipe} from "../config/logging";


export interface RecipeOptions {
    version: string;
    name: string;
    author: string;
    modules: Map<string, ModuleOptions>;
    initial_step: string;
    steps: Map<string, StepOptions>;
}


export class Recipe {

    version: string;
    name: string;
    author: string;
    modules: Map<string,Module>;
    initial_step: Step;
    steps: Map<string,Step>;

    constructor(options: RecipeOptions) {
        this.version = options.version;
        this.name = options.name;
        this.author = options.author;

        this.modules = new Map<string, Module>();
        Object.keys(options.modules).forEach((key) => {
            let option_module: Module = options.modules[key];
            this.modules.set(key, new Module(option_module));

        });

        this.steps = new Map<string, Step>();
        Object.keys(options.steps).forEach((key) => {
            let json_step: StepOptions = options.steps[key];
            this.steps.set(key, new Step(json_step, this.modules));

        });

        // Resolve next steps to appropriate objects
        this.steps.forEach((step: Step) => {
            step.transitions.forEach((transition) => {
                transition.next_step = this.steps.get(transition.next_step_name);
            })
        });

        this.initial_step = this.steps.get(options.initial_step);
        catRecipe.info("Recipe parsing finished")
    }

}
