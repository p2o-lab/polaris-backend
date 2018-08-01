import {DataType, VariantArrayType} from 'node-opcua-client';
import {Module} from './Module';
import {catOpc, catService} from '../config/logging';
import {OpMode, ServiceCommand, ServiceState} from './enum';
import {DataValue, Variant} from 'node-opcua';
import {OpcUaNode} from "./Interfaces";

export interface ServiceOptions {
    name: string;
    controlOp: OpcUaNode;
    status: OpcUaNode;
    opMode: OpcUaNode;
    configParameter: {
        [key: string]: { nodeid: string, value: any, datatype: string }
    };
    parameter: { [key: string]: { nodeid: string, datatype: string } };
}

export class Service {
    parameter: { [key: string]: { nodeid: string, datatype: string } };

    name: string;
    controlOp: OpcUaNode;
    status: OpcUaNode;
    opMode: OpcUaNode;
    strategies: any[];
    configParameter: {
        [key: string]: { nodeid: string, value: any, datatype: string }
    };
    parent: Module;

    constructor(serviceOptions, parent: Module) {
        this.name = serviceOptions.name;

        this.opMode = serviceOptions.communication.op_mode;
        this.controlOp = serviceOptions.communication.control_op;
        this.status = serviceOptions.communication.state;

        //this.configParameter = serviceOptions.configParameter;
        //this.parameter = serviceOptions.parameter;

        this.parent = parent;
    }

    async getServiceState(): Promise<ServiceState> {
        const result: DataValue = await this.parent.session.readVariableValue(this.parent.resolveNodeId(this.status));
        const state: ServiceState = <ServiceState> result.value.value;
        const stateString: string = ServiceState[state];
        catOpc.debug(`Read state ${this.name}: ${state} (${stateString})`);
        return state;
    }

    async getOpMode(): Promise<OpMode> {
        const result: any = await this.parent.session.readVariableValue(this.parent.resolveNodeId(this.opMode));
        const opMode: number = result.value.value;
        const opModeString: string = OpMode[opMode];

        catOpc.debug(`Read OpMode ${this.name} - ${opMode} (${opModeString})`);
        return opMode;
    }

    async getOverview(): Promise<any> {
        return new Promise<object>((resolve, reject) => {
            const opMode = this.getOpMode();
            const state = this.getServiceState();
            Promise.all([opMode, state]).then((data) => {
                resolve({opMode: data[0], status: data[1]});
            }).catch((err) => {
                reject(err)
            });
        });

    }

    async start(parameter: { [param: string]: any }): Promise<any> {
        // 1) OpMode setzen auf Automatic External)
        let result = await this.setToAutomaticOperationMode();
        catService.debug(`AutomaticMode Result: ${result}`);

        // 2) ConfigParameter und StrategyParameter setzen
        // result = await this.setConfigParameter();
        // catService.debug(`Config Result: ${result}`);

        // 3) Parameter setzen
        // result = await this.setParameter(parameter);
        // catService.debug(`Parameter Result: ${result}`);

        // 4) ControlOp setzen (Command senden)
        result = await this.sendCommand(ServiceCommand.START);
        catService.debug(`Command Result: ${result}`);
    }

    stop(): Promise<any> {
        return this.sendCommand(ServiceCommand.STOP);
    }

    reset(): void {
        this.sendCommand(ServiceCommand.RESET);
        this.setToManualOperationMode();
    }

    complete(): Promise<any> {
        return this.sendCommand(ServiceCommand.COMPLETE);
    }

    abort(): Promise<any> {
        return this.sendCommand(ServiceCommand.ABORT);
    }

    private async setToAutomaticOperationMode(): Promise<any> {
        const opMode: OpMode = await this.getOpMode();
        if (opMode !== OpMode.stateAutAct) {
            await this.parent.session.writeSingleNode(this.parent.resolveNodeId(this.opMode),
                {
                    dataType: DataType.UInt32,
                    value: OpMode.stateManOp,
                    arrayType: VariantArrayType.Scalar,
                });

            return await this.parent.session.writeSingleNode(this.parent.resolveNodeId(this.opMode),
                {
                    dataType: DataType.UInt32,
                    value: OpMode.stateAutOp,
                    arrayType: VariantArrayType.Scalar,
                });
        }
        return Promise.resolve('Already in automatic');
    }

    private setConfigParameter(): Promise<any> {
        const tasks = [];
        Object.keys(this.configParameter).forEach(async (key) => {
            const param = this.configParameter[key];
            catService.trace(`Set Config Parameter: ${param}`);
            tasks.push(this.parent.session.writeSingleNode(param.nodeid,
                {
                    dataType: param.datatype,
                    value: param.value,
                    arrayType: VariantArrayType.Scalar,
                }));
        });
        return Promise.all(tasks);
    }

    private setParameter(parameter: { [param: string]: any }): Promise<any[]> {
        catOpc.debug(`Should write parameters ${JSON.stringify(parameter)} to ${JSON.stringify(this.parameter)}`);
        const tasks = [];
        Object.keys(parameter).forEach((key) => {
            const paramValue = parameter[key];
            const paramOption = this.parameter[key];

            const dataValue: Variant = {
                dataType: <DataType> paramOption.datatype,
                value: paramValue,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            };
            catOpc.trace(`Parameter - ${key}: ${paramValue} -> ${JSON.stringify(paramOption)} = ${dataValue.dataType}`);
            tasks.push(this.parent.session.writeSingleNode(paramOption.nodeid, dataValue));
        });
        return Promise.all(tasks);
    }

    private setToManualOperationMode(): Promise<void> {
        return this.parent.session.writeSingleNode(this.opMode,
            {
                dataType: DataType.UInt32,
                value: OpMode.stateManOp,
                arrayType: VariantArrayType.Scalar,
            });
    }

    private async sendCommand(command: ServiceCommand): Promise<any> {
        catOpc.debug(`Send command ${ServiceCommand[command]} (${command}) to service "${this.name}"`);

        const result = await this.parent.session.writeSingleNode(
            this.parent.resolveNodeId(this.controlOp),
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        catOpc.debug(`Command ${command} written to ${this.name}: ${JSON.stringify(result)}`);

        return result;
    }

}
