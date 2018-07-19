
import {Step} from "./Step";
import {Module} from "./Module";


interface IRecipe {
    version: string;
    name: string;
    author: string;
    modules: object;
    initial_step: string;
    steps: object;
}


export class Recipe {

    version: string;
    name: string;
    author: string;
    modules: Map<string,Module>;
    initial_step: Step;
    steps: Map<string,Step>;

    constructor(json: IRecipe) {
        this.version = json.version;
        this.name = json.name;
        this.author = json.author;

        this.modules = new Map<string, Module>();
        Object.keys(json.modules).forEach( (key) => {
            let json_module : Module = json.modules[key];
            this.modules.set(key, new Module(json_module));

        });

        this.steps = new Map<string, Step>();
        Object.keys(json.steps).forEach( (key) => {
            let json_step: Step = json.steps[key];
            this.steps.set(key, new Step(json_step, this.modules));

        });

        // Resolve next steps to appropriate objects
        this.steps.forEach( (step: Step) => {
           step.transitions.forEach( (transition) => {
               transition.next_step = this.steps.get(<string> transition.next_step);
           })
        });

        this.initial_step = this.steps.get(json.initial_step);
    }

    test() {
        console.log(this.name + " " + this.version);
    }

}
