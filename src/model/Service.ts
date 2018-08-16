import {DataType, DataValue, Variant, VariantArrayType} from 'node-opcua-client';
import {Module} from './Module';
import {catOpc, catService} from '../config/logging';
import {
    isAutomaticState,
    isExtSource,
    isManualState,
    isOffState,
    OpMode,
    ServiceCommand,
    ServiceMtpCommand,
    ServiceState
} from './enum';
import {OpcUaNode, Strategy} from "./Interfaces";
import {Parameter} from "./Parameter";

export interface ServiceOptions {
    name: string;
    communication: {
        OpMode: OpcUaNode,
        ControlOp: OpcUaNode,
        ControlExt: OpcUaNode,
        State: OpcUaNode,
        StrategyOp: OpcUaNode,
        StrategyExt: OpcUaNode
    };
    strategies: Strategy[];
}

export class Service {
    name: string;
    command: OpcUaNode;
    status: OpcUaNode;
    opMode: OpcUaNode;
    strategy: OpcUaNode;
    strategies: Strategy[];

    parent: Module;

    constructor(serviceOptions: ServiceOptions, parent: Module) {
        this.name = serviceOptions.name;

        this.opMode = serviceOptions.communication.OpMode;
        this.command = serviceOptions.communication.ControlExt;
        this.status = serviceOptions.communication.State;
        this.strategy = serviceOptions.communication.StrategyExt;

        this.strategies = serviceOptions.strategies;
        this.parent = parent;
    }

    async getServiceState(): Promise<ServiceState> {
        const result: DataValue = await this.parent.session.readVariableValue(this.parent.resolveNodeId(this.status));
        const state: ServiceState = <ServiceState> result.value.value;
        const stateString: string = ServiceState[state];
        catOpc.trace(`Read state ${this.name}: ${state} (${stateString})`);
        return state;
    }

    async getOpMode(): Promise<OpMode> {
        const nodeId = this.parent.resolveNodeId(this.opMode);
        catOpc.trace(`OpMode NodeId: ${nodeId}`);
        const result: any = await this.parent.session.readVariableValue(nodeId);
        const opMode: number = result.value.value;
        const opModeString: string = OpMode[opMode];

        catOpc.trace(`Read OpMode ${this.name} - ${opMode} (${opModeString})`);
        return opMode;
    }

    async getOverview(): Promise<any> {
        const opMode = this.getOpMode();
        const state = this.getServiceState();
        const strategies = this.getStrategies();
        return Promise.all([opMode, state, strategies])
            .then((data) => {
                return {
                    opMode: OpMode[data[0]] || data[0],
                    status: ServiceState[data[1]] || data[1],
                    strategies: data[2]
                };
            });
    }

    async getStrategies() {
        return await Promise.all(this.strategies.map(async (strategy) => {
            return {
                id: strategy.id,
                name: strategy.name,
                default: strategy.default,
                parameters: await this.getCurrentParameter(strategy)
            }
        }));
    }

    async getCurrentParameter(strategy: Strategy) {
        return await Promise.all(strategy.parameters.map(async (param) => {
            if (this.parent.isConnected()) {
                const value = await this.parent.session.readVariableValue(this.parent.resolveNodeId(param.communication.VExt));
                return {
                    name: param.name,
                    value: value.value.value
                }
            }
            return {
                name: param.name,
                value: "not connected"
            }
        }));
    }

    executeCommand(command: ServiceCommand, strategy: Strategy, parameter: Parameter[]) {
        catService.info(`trigger service ${this.name} - ${command} - ${strategy} - ${JSON.stringify(parameter)}`);
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
        await this.setParameter(strategy, parameter);
        return await this.sendCommand(ServiceMtpCommand.START);
    }

    stop(): Promise<any> {
        return this.sendCommand(ServiceMtpCommand.STOP);
    }

    async reset(): Promise<any> {
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
        catService.debug(`Set parameter: ${strategy} - ${JSON.stringify(parameter)}`);
        // set strategy
        if (strategy) {
            await this.parent.session.writeSingleNode(this.parent.resolveNodeId(this.strategy),
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
                parameter.forEach((param: Parameter) => {
                    param.variable = param.variable || "VExt";
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

    private writeOpMode(opMode) {
        return this.parent.session.writeSingleNode(this.parent.resolveNodeId(this.opMode),
            {
                dataType: DataType.UInt32,
                value: opMode,
                arrayType: VariantArrayType.Scalar,
            });
    }

    /**
     * Set service to automatic operation mode and source to external source
     * @returns {Promise<boolean>}
     */
    private async setToAutomaticOperationMode(): Promise<any> {
        let opMode: OpMode = await this.getOpMode();

        if (isOffState(opMode)) {
            catService.trace("First go to Manual state");
            await this.writeOpMode(OpMode.stateManOp);
            await new Promise((resolve, reject) => {
                this.parent.listenToOpcUaNode(this.opMode).on('changed', (value) => {
                    if (isManualState(value)) {
                        catService.trace(`finally in ManualMode`);
                        opMode = value;
                        resolve(true);
                    }
                })
            });
        }

        if (isManualState(opMode)) {
            catService.trace("Go to Automatic state");
            await this.writeOpMode(OpMode.stateAutOp);
            await new Promise((resolve, reject) => {
                this.parent.listenToOpcUaNode(this.opMode).on('changed', (value) => {
                    catOpc.trace(`OpMode changed: ${value}`);
                    if (isAutomaticState(value)) {
                        catService.trace(`finally in AutomaticMode`);
                        opMode = value;
                        resolve(true);
                    }
                });
            });
        }

        if (!isExtSource(opMode)) {
            catService.trace("Go to External source");
            await this.writeOpMode(OpMode.srcExtOp);
            return new Promise((resolve, reject) => {
                this.parent.listenToOpcUaNode(this.opMode).on('changed', (value) => {
                    catService.trace(`OpMode changed: ${value}`);
                    if (isExtSource(value)) {
                        catService.trace(`finally in ExtSource`);
                        resolve(true);
                    }
                });
            });
        } else {
            return Promise.resolve(true);
        }
    }

    private setToManualOperationMode(): Promise<any> {
        return this.writeOpMode(OpMode.stateManOp);
    }

    private async sendCommand(command: ServiceMtpCommand): Promise<any> {
        catService.debug(`Send command ${ServiceMtpCommand[command]} (${command}) to service "${this.name}"`);

        await this.setToAutomaticOperationMode();

        const result = await this.parent.session.writeSingleNode(
            this.parent.resolveNodeId(this.command),
            {
                dataType: DataType.UInt32,
                value: command,
                arrayType: VariantArrayType.Scalar
            });
        catService.debug(`Command ${command} written to ${this.name}: ${JSON.stringify(result)}`);

        return result;
    }

}
