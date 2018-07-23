import {DataType, VariantArrayType} from 'node-opcua';
import {Module} from "./Module";
import {catOpc} from "../config/logging";
import {SERVICE_COMMAND} from "./enum";

export interface ServiceOptions {
    name: string;
    command: string;
    status: string;
    strategy: { nodeid: string, value: string };
    parameter: { [key: string]: { prop: string } }
}

export class Service {
    parameter: { [key: string]: { prop: string } };

    name: string;
    command: string;
    status: string;
    strategy: { nodeid: string, value: string };
    parent: Module;

    constructor(json: ServiceOptions, parent: Module) {
        this.name = json.name;
        this.command = json.command;
        this.status = json.status;

        this.strategy = json.strategy;
        this.parameter = json.parameter;

        this.parent = parent;
    }

    async getState() {
        let result = await this.parent.session.readVariableValue(this.status);
        catOpc.debug(`get state ${this.name}: ${result.value}`);
        return result;
    }

    start() {
        this.sendCommand(SERVICE_COMMAND.START);
    }

    private setToAutomaticOperationMode() {

    }

    private setToManualOperationMode() {

    }

    private sendCommand(command: SERVICE_COMMAND) {
        this.parent.session.writeSingleNode(
            this.command,
            {
                dataType: DataType.UInt16,
                value: command,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            },
            (statusCode) => {
                catOpc.info(`Send Command ${command} to Service ${this.name} - ${statusCode}`);
            }
        );
    }
}