export class Service {
    constructor(json: any) {

        this.name = json.name;
        this.command = json.command;
        this.status = json.status;

        this.strategy = json.strategy;
        this.parameter = json.parameter;
    }

    name: string;
    command: string;
    status: string;
    strategy: { nodeid: string, value: string};
    parameter: { [key:string]: {prop:string}}
}