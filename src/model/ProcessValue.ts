import {OpcUaNode} from "./Interfaces";

export class ProcessValue {

    name: string;
    communication: OpcUaNode[];

    constructor(variableOptions: any) {
        this.name = variableOptions.name;
        this.communication = variableOptions.communication;
    }

}