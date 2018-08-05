import {DataType, DataValue, Variant, VariantArrayType} from 'node-opcua-client';
import {Module} from './Module';
import {catOpc, catService} from '../config/logging';
import {OpMode, ServiceCommand, ServiceMtpCommand, ServiceState} from './enum';
import {OpcUaNode, Strategy} from "./Interfaces";
import {Parameter} from "./Parameter";

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

    executeCommand(command: ServiceCommand, strategy: Strategy, parameter: Parameter[]) {
        if (command === 'start') {
            return this.start(strategy, parameter);
        } else if (command === 'stop') {
            return this.stop();
        } else if (command === 'reset') {
            return this.reset();
        } else if (command === 'complete') {
            return this.complete();
        } else if (command === 'abort') {
            return this.abort();
        } else if (command === 'unhold') {
            return this.unhold();
        } else if (command === 'pause') {
            return this.pause();
        } else if (command === 'resume') {
            return this.resume();
        } else if (command === 'restart') {
            return this.restart(strategy, parameter);
        } else {
            throw new Error(`Command ${command} can not be interpreted`);
        }
    }

    async start(strategy: Strategy, parameter: Parameter[]): Promise<any> {
        // 1) OpMode setzen auf Automatic External)
        let result = await this.setToManualOperationMode();
        catService.debug(`AutomaticMode Result: ${result}`);

        // 2) Parameter setzen (incl. strategy)
        result = await this.setParameter(strategy, parameter);
        catService.debug(`Parameter Result: ${result}`);

        // 3) ControlOp setzen (Command senden)
        result = await this.sendCommand(ServiceMtpCommand.START);
        catService.debug(`Command Result: ${result}`);
        return result;
    }

    stop(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    reset(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.RESET);
    }

    complete(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.COMPLETE);
    }

    abort(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.ABORT);
    }

    unhold(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.UNHOLD);
    }

    pause(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.PAUSE);
    }

    resume(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.RESUME);
    }

    async restart(strategy: Strategy, parameter: Parameter[]): Promise<any> {
        await this.setParameter(strategy, parameter);
        return this.sendCommand(ServiceMtpCommand.RESTART);
    }

    private async setParameter(strategy: Strategy, parameter: Parameter[]): Promise<any[]> {
        // set strategy
        if (strategy) {
            await this.parent.session.writeSingleNode(this.parent.resolveNodeId(this.strategyOp),
                {
                    dataType: DataType.UInt32,
                    value: strategy.id,
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                });
        }


        const tasks = [];
        if (strategy && parameter) {
            catOpc.debug(`Should write parameters ${JSON.stringify(parameter)}`);

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

    private async sendCommand(command: ServiceMtpCommand): Promise<any> {
        catOpc.debug(`Send command ${ServiceMtpCommand[command]} (${command}) to service "${this.name}"`);

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
