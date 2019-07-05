/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {DataType, Variant} from 'node-opcua';
import {catTestServer} from '../config/logging';
import {OpMode, ServiceControlEnable, ServiceMtpCommand, ServiceState} from '../model/core/enum';
import {TestServerStringVariable} from './ModuleTestStringVariable';
import {TestServerVariable} from './ModuleTestVariable';

export class TestServerService {
    public varStatus: number = 0;
    public varStrategy: number = 1;
    public varCommand: number = 0;
    public varCommandEnable: number = 0;
    public varOpmode: number = 0;
    public serviceName: string;
    public readonly parameter: Array<TestServerVariable | TestServerStringVariable> = [];

    constructor(namespace, rootNode, serviceName) {
        catTestServer.info(`Add service ${serviceName}`);
        this.serviceName = serviceName;
        this.state(ServiceState.IDLE);

        const serviceNode = namespace.addObject({
            organizedBy: rootNode,
            browseName: serviceName
        });

        this.parameter.push(new TestServerVariable(namespace, serviceNode, serviceName + '.Parameter1', false));
        this.parameter.push(new TestServerVariable(namespace, serviceNode, serviceName + '.Parameter2', false));

        this.parameter.push(new TestServerStringVariable(namespace, serviceNode, serviceName + '.ErrorMsg'));

        namespace.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.Strategy`,
            browseName: `${serviceName}.Strategy`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varStrategy});
                },
                set: (variant) => {
                    this.varStrategy = parseInt(variant.value, 10);
                }
            }
        });

        namespace.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.CurrentStrategy`,
            browseName: `${serviceName}.CurrentStrategy`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varStrategy});
                }
            }
        });

        namespace.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.CommandEnable`,
            browseName: `${serviceName}.CommandEnable`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varCommandEnable});
                }
            }
        });

        namespace.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.OpMode`,
            browseName: `${serviceName}.OpMode`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    catTestServer.trace(`[${this.serviceName}] Get Opmode in testserver ${this.varOpmode}`);
                    return new Variant({dataType: DataType.UInt32, value: this.varOpmode});
                },
                set: (variant) => {
                    if (parseInt(variant.value, 10) === OpMode.stateManOp) {
                        this.varOpmode = this.varOpmode & ~OpMode.stateAutAct;
                        this.varOpmode = this.varOpmode | OpMode.stateManAct;
                    }
                    if (parseInt(variant.value, 10) === OpMode.stateAutOp) {
                        this.varOpmode = this.varOpmode & ~OpMode.stateManAct;
                        this.varOpmode = this.varOpmode | OpMode.stateAutAct;
                    }
                    if (parseInt(variant.value, 10) === OpMode.srcExtOp) {
                        this.varOpmode = this.varOpmode | OpMode.srcExtAct;
                    }
                    catTestServer.debug(`[${this.serviceName}] Set Opmode in testserver ${variant} ` +
                        `${parseInt(variant.value, 10)} -> ${this.varOpmode}`);
                }
            }
        });

        namespace.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.State`,
            browseName: `${serviceName}.State`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varStatus});
                }
            }
        });

        namespace.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.Command`,
            browseName: `${serviceName}.Command`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varCommand});
                },
                set: (variant) => {
                    this.varCommand = parseInt(variant.value, 10);
                    if (this.varCommand === ServiceMtpCommand.COMPLETE && this.varStatus === ServiceState.EXECUTE) {
                        this.state(ServiceState.COMPLETING);
                    } else if (this.varCommand === ServiceMtpCommand.RESTART &&
                        this.varStatus === ServiceState.EXECUTE) {
                        this.state(ServiceState.STARTING);
                    } else if (this.varCommand === ServiceMtpCommand.RESET) {
                        this.state(ServiceState.IDLE);
                    } else if (this.varCommand === ServiceMtpCommand.START && this.varStatus === ServiceState.IDLE) {
                        this.state(ServiceState.STARTING);
                    } else if (this.varCommand === ServiceMtpCommand.RESUME && this.varStatus === ServiceState.PAUSED) {
                        this.state(ServiceState.RESUMING);
                    } else if (this.varCommand === ServiceMtpCommand.PAUSE && this.varStatus === ServiceState.EXECUTE) {
                        this.state(ServiceState.PAUSING);
                    } else if (this.varCommand === ServiceMtpCommand.STOP) {
                        this.state(ServiceState.STOPPING);
                    } else if (this.varCommand === ServiceMtpCommand.ABORT) {
                        this.state(ServiceState.ABORTING);
                    }
                }
            }
        });
    }

    public startSimulation() {
        this.parameter.forEach((variable) => variable.startSimulation());
    }

    public stopSimulation() {
        this.parameter.forEach((variable) => variable.stopSimulation());
    }

    private state(state: ServiceState) {
        catTestServer.info(`Set ServiceState: ${ServiceState[state]}`);
        this.varStatus = state;
        this.varCommand = ServiceMtpCommand.UNDEFINED;
        this.varCommandEnable = ServiceControlEnable.ABORT + ServiceControlEnable.STOP;
        switch (state) {
            case ServiceState.IDLE:
                this.varCommandEnable += ServiceControlEnable.START;
                break;
            case ServiceState.EXECUTE:
                this.varCommandEnable += ServiceControlEnable.PAUSE +
                    ServiceControlEnable.COMPLETE + ServiceControlEnable.RESTART;
                break;
            case ServiceState.PAUSED:
                this.varCommandEnable += ServiceControlEnable.RESUME;
                break;
            case ServiceState.COMPLETED:
            case ServiceState.STOPPED:
            case ServiceState.ABORTED:
                this.varCommandEnable += ServiceControlEnable.RESET;
                break;
        }
        this.automaticStateChange(ServiceState.STARTING, ServiceState.EXECUTE);
        this.automaticStateChange(ServiceState.STOPPING, ServiceState.STOPPED);
        this.automaticStateChange(ServiceState.ABORTING, ServiceState.ABORTED);
        this.automaticStateChange(ServiceState.PAUSING, ServiceState.PAUSED);
        this.automaticStateChange(ServiceState.RESUMING, ServiceState.EXECUTE);
        this.automaticStateChange(ServiceState.COMPLETING, ServiceState.COMPLETED);
    }

    private automaticStateChange(currentState: ServiceState, nextState: ServiceState, delay = 100) {
        if (this.varStatus === currentState) {
            setTimeout(() => {
                if (this.varStatus === currentState) {
                    this.state(nextState);
                }
            }, delay);
        }
    }
}
