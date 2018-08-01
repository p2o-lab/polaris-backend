export class Variable {

    name: string;
    communication: any[];

    constructor(variableOptions: any) {
        this.name = variableOptions.name;
        this.communication = variableOptions.communication;
    }

}