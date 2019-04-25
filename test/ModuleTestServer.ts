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


import {OpMode, ServiceMtpCommand, ServiceState} from '../src/model/core/enum';
import {DataType, Variant} from 'node-opcua';
import {OPCUAServer} from 'node-opcua-server';
import Timeout = NodeJS.Timeout;

export class ModuleTestServer {
    private server: OPCUAServer;

    public varStatus;
    public varCommand;
    public varCommandEnable;
    public varOpmode;
    public varVariable;
    public varStrategy;
    public externalTrigger: boolean;
    private interval: Timeout;

    constructor() {
        this.server = new OPCUAServer({
            port: 4334
        });
        this.varStatus = ServiceState.IDLE;
        this.varStrategy = 1;
        this.varCommand = 0;
        this.varCommandEnable = 2047;
        this.varOpmode = 0;
        this.externalTrigger = false;
        this.varVariable = 0.0;
    }

    public start(done) {
        this.server.initialize(() => {
            this.createAddressSpace();
            this.server.start(done);
        });
    }

    public startSimulation() {
        let time = 0;
        this.interval = setInterval(() => {
            time = time + 0.1;
            this.varVariable = 20 + 5 * Math.sin(time);
        },100);
    }

    public stopSimulation() {
        this.interval.unref();
    }

    private createAddressSpace() {
        const addressSpace = this.server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();

        // declare a new object
        const myModule = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: 'MyTestModule'
        });

        namespace.addVariable({
            componentOf: myModule,
            nodeId: 'ns=1;s=MyVariable',
            browseName: 'MyVariable',
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.varVariable});
                }
            }
        });

        namespace.addVariable({
            componentOf: myModule,
            nodeId: 'ns=1;s=MyStrategy',
            browseName: 'MyStrategy',
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varStrategy});
                },
                set: (variant) => {
                    this.varStrategy = parseInt(variant.value);
                }
            }
        });

        namespace.addVariable({
            componentOf: myModule,
            nodeId: 'ns=1;s=MyCurrentStrategy',
            browseName: 'MyCurrentStrategy',
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varStrategy});
                }
            }
        });

        namespace.addVariable({
            componentOf: myModule,
            nodeId: 'ns=1;s=MyCommandEnable',
            browseName: 'MyCommandEnable',
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varCommandEnable});
                }
            }
        });

        namespace.addVariable({
            componentOf: myModule,
            nodeId: 'ns=1;s=MyOpMode',
            browseName: 'MyOpMode',
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varOpmode});
                },
                set: (variant) => {
                    if (parseInt(variant.value) == OpMode.stateManOp) {
                        this.varOpmode = this.varOpmode | OpMode.stateManAct;
                    }
                }
            }
        });

        namespace.addVariable({
            componentOf: myModule,
            nodeId: 'ns=1;s=MyState',
            browseName: 'MyState',
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varStatus});
                }
            }
        });

        namespace.addVariable({
            componentOf: myModule,
            nodeId: 'ns=1;s=MyCommand',
            browseName: 'MyCommand',
            dataType: 'UInt32',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.UInt32, value: this.varCommand});
                },
                set: (variant) => {
                    this.varCommand = parseInt(variant.value);
                    if (this.varCommand == ServiceMtpCommand.COMPLETE && this.varStatus == ServiceState.EXECUTE) {
                        this.varCommand = ServiceMtpCommand.UNDEFINED;
                        this.varStatus = ServiceState.COMPLETING;
                        setTimeout(() => {
                            this.varStatus = ServiceState.COMPLETED;
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.RESTART && this.varStatus == ServiceState.EXECUTE) {
                        this.varCommand = ServiceMtpCommand.UNDEFINED;
                        this.varStatus = ServiceState.STARTING;
                        setTimeout(() => {
                            this.varStatus = ServiceState.EXECUTE;
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.RESET) {
                        this.varCommand = ServiceMtpCommand.UNDEFINED;
                        this.varStatus = ServiceState.IDLE;
                    } else if (this.varCommand == ServiceMtpCommand.START && this.varStatus == ServiceState.IDLE) {
                        this.varCommand = ServiceMtpCommand.UNDEFINED;
                        this.varStatus = ServiceState.STARTING;
                        setTimeout(() => {
                            this.varStatus = ServiceState.EXECUTE;
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.RESUME && this.varStatus == ServiceState.PAUSED) {
                        this.varCommand = ServiceMtpCommand.UNDEFINED;
                        this.varStatus = ServiceState.RESUMING;
                        setTimeout(() => {
                            this.varStatus = ServiceState.EXECUTE;
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.PAUSE && this.varStatus == ServiceState.EXECUTE) {
                        this.varCommand = ServiceMtpCommand.UNDEFINED;
                        this.varStatus = ServiceState.PAUSING;
                        setTimeout(() => {
                            this.varStatus = ServiceState.PAUSED;
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.STOP) {
                        this.varCommand = ServiceMtpCommand.UNDEFINED;
                        this.varStatus = ServiceState.STOPPING;
                        setTimeout(() => {
                            this.varStatus = ServiceState.STOPPED;
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.ABORT) {
                        this.varCommand = ServiceMtpCommand.UNDEFINED;
                        this.varStatus = ServiceState.ABORTING;
                        setTimeout(() => {
                            this.varStatus = ServiceState.ABORTED;
                        }, 100);
                    }
                }
            }
        });

        namespace.addVariable({
            componentOf: myModule,
            browseName: 'MyVariable1',
            nodeId: 'ns=1;s=trigger',
            dataType: 'Boolean',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Boolean, value: this.externalTrigger});
                }
            }
        });
    }


    public shutdown(done) {
        this.server.shutdown(100, done);
    }
}
