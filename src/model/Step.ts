import {Service} from "./Service";
import {Module} from "./Module";

class Operation {
    constructor(json, modules: Map<string,Module>) {
        this.module = modules.get(json.module);
        this.service = this.module.services.get(json.service);
        this.command = json.command;
        this.parameter = json.parameter;
    }
    module: Module;
    service: Service;
    command: string;
    parameter: any;


}

class Transition {
    constructor(json: Transition) {
        this.next_step = json.next_step;
        this.condition = json.condition;
    }


    next_step: Step | string;
    condition: any;
}

export class Step {
    constructor(json: any, modules) {
        this.name = json.name;

        this.operations = [];
        json.operations.forEach( (json_operation: Operation) => {
            this.operations.push(new Operation(json_operation, modules));

        });

        this.transitions = [];
        json.transitions.forEach( (json_transition: Transition) => {
            this.transitions.push(new Transition(json_transition));

        });
    }

    name: string;
    operations: Operation[];
    transitions: Transition[];

}