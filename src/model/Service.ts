import {DataType, DataValue, Variant, VariantArrayType} from 'node-opcua-client';
import {Module} from './Module';
import {catOpc, catService} from '../config/logging';
import {OpMode, ServiceCommand, ServiceState} from './enum';
import {OpcUaNode, Parameter, Strategy} from "./Interfaces";

export interface ServiceOptions {
    name: string;
    communication: {
        op_mode: OpcUaNode,
        control_op: OpcUaNode,
        state: OpcUaNode,
        strategy_op: OpcUaNode
    };
    strategies: Strategy[];
}

export class Service {
    name: string;
    command: OpcUaNode;
    status: OpcUaNode;
    opMode: OpcUaNode;
    strategyOp: OpcUaNode;
    strategies: Strategy[];

    parent: Module;

    constructor(serviceOptions: ServiceOptions, parent: Module) {
        this.name = serviceOptions.name;

        this.opMode = serviceOptions.communication.op_mode;
        this.command = serviceOptions.communication.control_op;
        this.status = serviceOptions.communication.state;
        this.strategyOp = serviceOptions.communication.strategy_op;

        this.strategies = serviceOptions.strategies;
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
        const opMode = this.getOpMode();
        const state = this.getServiceState();
        return Promise.all([opMode, state])
            .then((data) => {
                return {opMode: data[0], status: data[1]};
            });
    }

    async start(strategy: Strategy, parameter: Parameter[]): Promise<any> {
        // 1) OpMode setzen auf Automatic External)
        let result = await this.setToManualOperationMode();
        catService.debug(`AutomaticMode Result: ${result}`);

        // 2) Parameter setzen (incl. strategy)
        result = await this.setParameter(strategy, parameter);
        catService.debug(`Parameter Result: ${result}`);

        // 3) ControlOp setzen (Command senden)
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

    private async setParameter(strategy: Strategy, parameter: Parameter[]): Promise<any[]> {
        // set strategy
        await this.parent.session.writeSingleNode(this.parent.resolveNodeId(this.strategyOp),
            {
                dataType: DataType.UInt32,
                value: strategy.id,
                arrayType: VariantArrayType.Scalar,
                dimensions: null
            });


        catOpc.debug(`Should write parameters ${JSON.stringify(parameter)}`);
        const tasks = [];
        if (parameter) {
            parameter.forEach((param) => {
                const serviceParam = strategy.parameters.find((obj) => obj.name === param.name);
                const variable = serviceParam.communication[param.variable];
                const nodeid = this.parent.resolveNodeId(variable);
                const dataValue: Variant = {
                    dataType: DataType.Float,
                    value: parseFloat(param.value),
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                };
                tasks.push(this.parent.session.writeSingleNode(nodeid, dataValue));
            });
        }
        return Promise.all(tasks);
    }

    private async setToAutomaticOperationMode(): Promise<any> {
        const opMode: OpMode = await this.getOpMode();
        if (opMode !== OpMode.stateAutAct) {
            return this.parent.session.writeSingleNode(this.parent.resolveNodeId(this.opMode),
                {
                    dataType: DataType.UInt32,
                    value: OpMode.stateAutOp,
                    arrayType: VariantArrayType.Scalar,
                });
        } else {
            return Promise.resolve('Already in automatic');
        }
    }

    private setToManualOperationMode(): Promise<any> {
        return this.parent.session.writeSingleNode(this.parent.resolveNodeId(this.opMode),
            {
                dataType: DataType.UInt32,
                value: OpMode.stateManOp,
                arrayType: VariantArrayType.Scalar,
            });
    }

    private async sendCommand(command: ServiceCommand): Promise<any> {
        catOpc.debug(`Send command ${ServiceCommand[command]} (${command}) to service "${this.name}"`);

        const result = await this.parent.session.writeSingleNode(
            this.parent.resolveNodeId(this.command),
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        catOpc.debug(`Command ${command} written to ${this.name}: ${JSON.stringify(result)}`);

        return result;
    }

}
