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

import {DataType, Namespace, StatusCodes, Variant} from 'node-opcua';
import {catTestServer} from '../logging/logging';
import {ServiceControlEnable, ServiceMtpCommand, ServiceState} from 'src/model/dataAssembly/enum';
import {TestServerNumericVariable} from './ModuleTestNumericVariable';
import Timeout = NodeJS.Timeout;
import {ModuleTestOpMode} from './ModuleTestOpMode';
import {ModuleTestOpMode2} from './ModuleTestOpMode2';
import {TestServerStringVariable} from './ModuleTestStringVariable';

export class TestServerService {
    public varStatus: number = 0;
    public varProcedure: number = 1;
    public varCommand: number = 0;
    public varCommandEnable: number = 0;
    public opMode: ModuleTestOpMode;
    public opModeNew: ModuleTestOpMode2;
    public readonly serviceName: string;

    public readonly offset: TestServerNumericVariable;
    public readonly factor: TestServerNumericVariable;
    public readonly pvIn: TestServerNumericVariable;
    public readonly pvOut: TestServerNumericVariable;
    public readonly pvIntegral: TestServerNumericVariable;
    public readonly currentTime: TestServerStringVariable;
    public readonly updateRate: TestServerNumericVariable;
    public readonly finalOut: TestServerNumericVariable;
    public readonly finalIntegral: TestServerNumericVariable;
    public readonly finalTime: TestServerStringVariable;

    private interval: Timeout;
    private timeoutAutomaticStateChange: Timeout;
    private unit: number = 1351;
    private unitIntegral: number = 1038;

    constructor(ns: Namespace, rootNode, serviceName: string) {
        catTestServer.info(`Add service ${serviceName}`);
        this.serviceName = serviceName;
        this.state(ServiceState.IDLE);

        const serviceNode = ns.addObject({
            organizedBy: rootNode,
            browseName: serviceName
        });

        this.factor = new TestServerNumericVariable(ns, serviceNode, serviceName + '.Factor', 2, 0);
        this.offset = new TestServerNumericVariable(ns, serviceNode, serviceName + '.Offset', 20, this.unit);
        this.pvIn = new TestServerNumericVariable(ns, serviceNode, serviceName + '.ProcessValueIn', 1, this.unit);
        this.pvOut = new TestServerNumericVariable(ns, serviceNode, serviceName + '.ProcessValueOut', 22, this.unit);
        this.pvIntegral = new TestServerNumericVariable(ns, serviceNode, serviceName + '.ProcessValueIntegral',
                0, this.unitIntegral);
        this.currentTime = new TestServerStringVariable(ns, serviceNode, serviceName + '.CurrentTime');
        this.updateRate = new TestServerNumericVariable(ns, serviceNode, serviceName + '.UpdateRate',
            1000, 1056, 100, 10000);
        this.finalOut = new TestServerNumericVariable(ns, serviceNode, serviceName + '.FinalOut', 0, this.unit);
        this.finalIntegral = new TestServerNumericVariable(ns, serviceNode, serviceName + '.FinalIntegral',
            0, this.unitIntegral);
        this.finalTime = new TestServerStringVariable(ns, serviceNode, serviceName + '.FinalTime');

        ns.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.Strategy`,
            browseName: `${serviceName}.Strategy`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varProcedure});
                },
                set: (variant) => {
                    this.varProcedure = parseInt(variant.value, 10);
                    return StatusCodes.Good;
                }
            }
        });

        ns.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.CurrentStrategy`,
            browseName: `${serviceName}.CurrentStrategy`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varProcedure});
                }
            }
        });

        ns.addVariable({
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

        this.opMode = new ModuleTestOpMode(ns, serviceNode, this.serviceName);
        this.opModeNew = new ModuleTestOpMode2(ns, serviceNode, this.serviceName);

        ns.addVariable({
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

        ns.addVariable({
            componentOf: serviceNode,
            nodeId: `ns=1;s=${serviceName}.Command`,
            browseName: `${serviceName}.Command`,
            dataType: 'UInt32',
            value: {
                get: () => {
                    catTestServer.debug(`Get service command (${this.serviceName}):  ${this.varCommand}`);
                    return new Variant({dataType: DataType.UInt32, value: this.varCommand});
                },
                set: (variant) => {
                    this.varCommand = parseInt(variant.value, 10);
                    catTestServer.debug('Set service command: ' + this.varCommand);
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
                    } else {
                        return StatusCodes.Bad;
                    }
                    return StatusCodes.Good;
                }
            }
        });
    }

    public startSimulation() {
        this.currentTime.startCurrentTimeUpdate();
    }

    public stopSimulation() {
        this.currentTime.stopCurrentTimeUpdate();
        if (this.interval) {
            global.clearInterval(this.interval);
        }
        if (this.timeoutAutomaticStateChange) {
            global.clearTimeout(this.timeoutAutomaticStateChange);
        }
    }

    private state(state: ServiceState) {
        catTestServer.debug(`Set ServiceState: ${ServiceState[state]}`);
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
                global.clearInterval(this.interval);
                this.interval = global.setInterval(() => {
                    this.pvOut.v = this.factor.v * this.pvIn.v + this.offset.v;
                    this.pvIntegral.v = this.pvIntegral.v + this.pvOut.v * this.updateRate.v / 1000;
                }, this.updateRate.v);
                break;
            case ServiceState.PAUSED:
                this.varCommandEnable += ServiceControlEnable.RESUME;
                global.clearInterval(this.interval);
                break;
            case ServiceState.COMPLETED:
                this.finalOut.v = this.pvOut.v;
                this.finalIntegral.v = this.pvIntegral.v;
                this.finalTime.v = this.currentTime.v;
            case ServiceState.STOPPED:
            case ServiceState.ABORTED:
                this.varCommandEnable += ServiceControlEnable.RESET;
                global.clearInterval(this.interval);
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
            global.clearTimeout(this.timeoutAutomaticStateChange);
            this.timeoutAutomaticStateChange = global.setTimeout(() => {
                if (this.varStatus === currentState) {
                    this.state(nextState);
                }
            }, delay);
        }
    }
}
