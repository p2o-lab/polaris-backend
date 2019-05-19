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


import {OpMode, ServiceControlEnable, ServiceMtpCommand, ServiceState} from '../model/core/enum';
import {DataType, Variant} from 'node-opcua';
import {OPCUAServer} from 'node-opcua-server';
import Timeout = NodeJS.Timeout;

class Variable {

    v = 20;
    vext = 20;
    unit =  Math.floor((Math.random() * 100) + 1000);
    sclMin = 0;
    sclMax = 100;
    private interval: Timeout;

    constructor(namespace, rootNode, variableName, vext = false) {
        const variableNode = namespace.addObject({
            organizedBy: rootNode,
            browseName: variableName
        });

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.V`,
            browseName: `${variableName}.V`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.v});
                }
            }
        });

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.VUnit`,
            browseName: `${variableName}.VUnit`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.unit});
                }
            }
        });

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.VSclMin`,
            browseName: `${variableName}.VSclMin`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.sclMin});
                }
            }
        });

        namespace.addVariable({
            componentOf: variableNode,
            nodeId: `ns=1;s=${variableName}.VSclMax`,
            browseName: `${variableName}.VSclMax`,
            dataType: 'Double',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Double, value: this.sclMax});
                }
            }
        });
        if (vext) {
            namespace.addVariable({
                componentOf: variableNode,
                nodeId: `ns=1;s=${variableName}.VExt`,
                browseName: `${variableName}.VExt`,
                dataType: 'Double',
                value: {
                    get: () => {
                        return new Variant({dataType: DataType.Double, value: this.vext});
                    },
                    set: (variant) => {
                        this.vext = parseInt(variant.value);
                        setTimeout(() => {
                            this.v = this.vext;
                        }, 1000);
                    }

                }
            });
        }
    }

    startSimulation() {
        let time = 0;
        let f1 = Math.random();
        let f2 = Math.random();
        let f3 = Math.random();
        let f4 = Math.random();
        this.interval = setInterval(() => {
            time = time + 0.05;
            this.v = f1 * 20 + 5 * f2 * Math.sin(2 * f3 * time + 3 * f4);
        }, 100);
    }

    stopSimulation() {
        clearTimeout(this.interval);

    }
}

class Service {
    varStatus = ServiceState.IDLE;
    varStrategy = 1;
    varCommand = 0;
    varCommandEnable = 2047;
    varOpmode = 0;
    private variables: Variable[] = [];

    constructor(namespace, rootNode, serviceName) {
        this.state(ServiceState.IDLE);

        const serviceNode = namespace.addObject({
            organizedBy: rootNode,
            browseName: serviceName
        });


        this.variables.push(new Variable(namespace, serviceNode, serviceName+'.Parameter1', true));

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
                    this.varStrategy = parseInt(variant.value);
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
                    return new Variant({dataType: DataType.UInt32, value: this.varOpmode});
                },
                set: (variant) => {
                    if (parseInt(variant.value) == OpMode.stateManOp) {
                        this.varOpmode = this.varOpmode & ~OpMode.stateAutAct;
                        this.varOpmode = this.varOpmode | OpMode.stateManAct;
                    }
                    if (parseInt(variant.value) == OpMode.stateAutOp) {
                        this.varOpmode = this.varOpmode & ~OpMode.stateManAct;
                        this.varOpmode = this.varOpmode | OpMode.stateAutAct;
                    }
                    if (parseInt(variant.value) == OpMode.srcExtOp) {
                        this.varOpmode = this.varOpmode | OpMode.srcExtAct;
                    }
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
                    this.varCommand = parseInt(variant.value);
                    if (this.varCommand == ServiceMtpCommand.COMPLETE && this.varStatus == ServiceState.EXECUTE) {
                        this.state(ServiceState.COMPLETING);
                        setTimeout(() => {
                            this.state(ServiceState.COMPLETED);
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.RESTART && this.varStatus == ServiceState.EXECUTE) {
                        this.state(ServiceState.STARTING);
                        setTimeout(() => {
                            this.state(ServiceState.EXECUTE);
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.RESET) {
                        this.state(ServiceState.IDLE);
                    } else if (this.varCommand == ServiceMtpCommand.START && this.varStatus == ServiceState.IDLE) {
                        this.state(ServiceState.STARTING);
                        setTimeout(() => {
                            this.state(ServiceState.EXECUTE);
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.RESUME && this.varStatus == ServiceState.PAUSED) {
                        this.state(ServiceState.RESUMING);
                        setTimeout(() => {
                            this.state(ServiceState.EXECUTE);
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.PAUSE && this.varStatus == ServiceState.EXECUTE) {
                        this.state(ServiceState.PAUSING);
                        setTimeout(() => {
                            this.state(ServiceState.PAUSED);
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.STOP) {
                        this.state(ServiceState.STOPPING);
                        setTimeout(() => {
                            this.state(ServiceState.STOPPED);
                        }, 100);
                    } else if (this.varCommand == ServiceMtpCommand.ABORT) {
                        this.state(ServiceState.ABORTING);
                        setTimeout(() => {
                            this.state(ServiceState.ABORTED);
                        }, 100);
                    }
                }
            }
        });
    }

    private state(state: ServiceState) {
        this.varStatus = state;
        this.varCommand = ServiceMtpCommand.UNDEFINED;
        this.varCommandEnable = ServiceControlEnable.ABORT + ServiceControlEnable.STOP;
        switch (state) {
            case ServiceState.IDLE:
                this.varCommandEnable += ServiceControlEnable.START;
                break;
            case ServiceState.EXECUTE:
                this.varCommandEnable += ServiceControlEnable.PAUSE + ServiceControlEnable.COMPLETE + ServiceControlEnable.RESTART;
                break;
            case ServiceState.PAUSED:
                this.varCommandEnable += ServiceControlEnable.RESUME;
                break;
            case ServiceState.COMPLETED:
            case ServiceState.STOPPED:
            case ServiceState.ABORTED:
                let varCommandEnable;
                this.varCommandEnable += ServiceControlEnable.RESET;
                break;
        }
    }

    startSimulation() {
        this.variables.forEach((variable) => variable.startSimulation());
    }

    stopSimulation() {
        this.variables.forEach((variable) => variable.stopSimulation());
    }
}

export class ModuleTestServer {
    private server: OPCUAServer;

    public externalTrigger: boolean;
    public variables: Variable[] = [];
    public services: Service[] = [];

    constructor() {
        this.server = new OPCUAServer({
            port: 4334
        });

        this.externalTrigger = false;
    }

    public async start() {
        await new Promise(resolve => this.server.initialize(resolve));
        this.createAddressSpace();
        console.log('address space created')
        await new Promise(resolve => this.server.start(resolve));
        console.log('server started')
    }

    private createAddressSpace() {
        const addressSpace = this.server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();

        // declare a new object
        const myModule = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: 'TestModule'
        });

        this.variables.push(new Variable(namespace, myModule, 'Variable1'));
        this.variables.push(new Variable(namespace, myModule, 'Variable2'));
        this.variables.push(new Variable(namespace, myModule, 'Variable.3'));

        this.services.push(new Service(namespace, myModule, 'Service1'));
        this.services.push(new Service(namespace, myModule, 'Service2'));


        namespace.addVariable({
            componentOf: myModule,
            browseName: 'ExternalTrigger',
            nodeId: 'ns=1;s=trigger',
            dataType: 'Boolean',
            value: {
                get: () => {
                    return new Variant({dataType: DataType.Boolean, value: this.externalTrigger});
                }
            }
        });
    }


    public startSimulation() {
        this.variables.forEach((variable) => variable.startSimulation());
        this.services.forEach((service) => service.startSimulation());
    }

    public stopSimulation() {
        this.variables.forEach((variable) => variable.stopSimulation());
        this.services.forEach((services) => services.stopSimulation());
    }


    public shutdown(done) {
        this.server.shutdown(100, done);
    }
}
