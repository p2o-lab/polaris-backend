/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

import {ServiceControlEnable, ServiceMtpCommand, ServiceState} from './enum';

// eslint-disable-next-line no-undef
import Timeout = NodeJS.Timeout;
import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {OpModeMockup} from '../../dataAssembly/_extensions/opMode/OpMode.mockup';
import {PEATestNumericVariable} from '../../../_utils';

export function getServiceMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string): object {

	return ({
			StateChannel: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateChannel`,
				dataType: 'Boolean'
			},
			StateOffAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOffAut`,
				dataType: 'Boolean'
			},
			StateOpAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOpAut`,
				dataType: 'Boolean'
			},
			StateAutAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateAutAut`,
				dataType: 'Boolean'
			},
			StateOffOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOffOp`,
				dataType: 'Boolean'
			},
			StateOpOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOpOp`,
				dataType: 'Boolean'
			},
			StateAutOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateAutOp`,
				dataType: 'Boolean'
			},
			StateOpAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOpAct`,
				dataType: 'Boolean'
			},
			StateAutAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateAutAct`,
				dataType: 'Boolean'
			},
			StateOffAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StateOffAct`,
				dataType: 'Boolean'
			}
		}
	);
}



export class ServiceMockup {
	public varStatus = 0;
	public varProcedure = 1;
	public varCommand = 0;
	public varCommandEnable = 0;
	public opMode: OpModeMockup;
	public readonly serviceName: string;

	public readonly offset: PEATestNumericVariable;
	public readonly factor: PEATestNumericVariable;
	public readonly pvIn: PEATestNumericVariable;
	public readonly pvOut: PEATestNumericVariable;
	public readonly pvIntegral: PEATestNumericVariable;
	//public readonly currentTime: PEATestStringVariable;
	public readonly updateRate: PEATestNumericVariable;
	public readonly finalOut: PEATestNumericVariable;
	public readonly finalIntegral: PEATestNumericVariable;
	//public readonly finalTime: PEATestStringVariable;

	private interval: Timeout | undefined;
	private timeoutAutomaticStateChange: Timeout | undefined;
	private unit = 1351;
	private unitIntegral = 1038;

	constructor(ns: Namespace, rootNode: UAObject, serviceName: string) {
		this.serviceName = serviceName;
		this.state(ServiceState.IDLE);

		const serviceNode = ns.addObject({
			organizedBy: rootNode,
			browseName: serviceName
		});

		this.factor = new PEATestNumericVariable(ns, serviceNode, serviceName + '.Factor', 2, 0);
		this.offset = new PEATestNumericVariable(ns, serviceNode, serviceName + '.Offset', 20, this.unit);
		this.pvIn = new PEATestNumericVariable(ns, serviceNode, serviceName + '.ProcessValueIn', 1, this.unit);
		this.pvOut = new PEATestNumericVariable(ns, serviceNode, serviceName + '.ProcessValueOut', 22, this.unit);
		this.pvIntegral = new PEATestNumericVariable(ns, serviceNode, serviceName + '.ProcessValueIntegral',
			0, this.unitIntegral);
		//this.currentTime = new PEATestStringVariable(ns, serviceNode, serviceName + '.CurrentTime');
		this.updateRate = new PEATestNumericVariable(ns, serviceNode, serviceName + '.UpdateRate',
			1000, 1056, 100, 10000);
		this.finalOut = new PEATestNumericVariable(ns, serviceNode, serviceName + '.FinalOut', 0, this.unit);
		this.finalIntegral = new PEATestNumericVariable(ns, serviceNode, serviceName + '.FinalIntegral',
			0, this.unitIntegral);
		//this.finalTime = new PEATestStringVariable(ns, serviceNode, serviceName + '.FinalTime');

		ns.addVariable({
			componentOf: serviceNode,
			nodeId: `ns=1;s=${serviceName}.Procedure`,
			browseName: `${serviceName}.Procedure`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.varProcedure});
				},
				set: (variant: Variant): StatusCodes => {
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
				get: (): Variant => {
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
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.varCommandEnable});
				}
			}
		});

		this.opMode = new OpModeMockup(ns, serviceNode, this.serviceName);

		ns.addVariable({
			componentOf: serviceNode,
			nodeId: `ns=1;s=${serviceName}.State`,
			browseName: `${serviceName}.State`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
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
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.varCommand});
				},
				set: (variant: Variant): StatusCodes => {
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
					} else {
						return StatusCodes.Bad;
					}
					return StatusCodes.Good;
				}
			}
		});
	}

	public startSimulation(): void {
		//this.currentTime.startCurrentTimeUpdate();
	}

	public stopSimulation(): void {
		//this.currentTime.stopCurrentTimeUpdate();
		if (this.interval) {
			global.clearInterval(this.interval);
		}
		if (this.timeoutAutomaticStateChange) {
			global.clearTimeout(this.timeoutAutomaticStateChange);
		}
	}

	private state(state: ServiceState): void {
		this.varStatus = state;
		this.varCommand = ServiceMtpCommand.UNDEFINED;
		this.varCommandEnable = ServiceControlEnable.ABORT + ServiceControlEnable.STOP;
		// noinspection FallThroughInSwitchStatementJS
		switch (state) {
			case ServiceState.IDLE:
				this.varCommandEnable += ServiceControlEnable.START;
				break;
			case ServiceState.EXECUTE:
				this.varCommandEnable += ServiceControlEnable.PAUSE +
					ServiceControlEnable.COMPLETE + ServiceControlEnable.RESTART;
				if (this.interval) {
					global.clearInterval(this.interval);
				}
				this.interval = global.setInterval(() => {
					this.pvOut.v = this.factor.v * this.pvIn.v + this.offset.v;
					this.pvIntegral.v = this.pvIntegral.v + this.pvOut.v * this.updateRate.v / 1000;
				}, this.updateRate.v);
				break;
			case ServiceState.PAUSED:
				this.varCommandEnable += ServiceControlEnable.RESUME;
				if (this.interval) {
					global.clearInterval(this.interval);
				}
				break;
			case ServiceState.COMPLETED:
				this.finalOut.v = this.pvOut.v;
				this.finalIntegral.v = this.pvIntegral.v;
				//this.finalTime.v = this.currentTime.v;
			// eslint-disable-next-line no-fallthrough
			case ServiceState.STOPPED:
			case ServiceState.ABORTED:
				this.varCommandEnable += ServiceControlEnable.RESET;
				if (this.interval) {
					global.clearInterval(this.interval);
				}
				break;
		}
		this.automaticStateChange(ServiceState.STARTING, ServiceState.EXECUTE);
		this.automaticStateChange(ServiceState.STOPPING, ServiceState.STOPPED);
		this.automaticStateChange(ServiceState.ABORTING, ServiceState.ABORTED);
		this.automaticStateChange(ServiceState.PAUSING, ServiceState.PAUSED);
		this.automaticStateChange(ServiceState.RESUMING, ServiceState.EXECUTE);
		this.automaticStateChange(ServiceState.COMPLETING, ServiceState.COMPLETED);
	}

	private automaticStateChange(currentState: ServiceState, nextState: ServiceState, delay = 100): void {
		if (this.varStatus === currentState) {
			if (this.timeoutAutomaticStateChange) {
				global.clearInterval(this.timeoutAutomaticStateChange);
			}
			this.timeoutAutomaticStateChange = global.setTimeout(() => {
				if (this.varStatus === currentState) {
					this.state(nextState);
				}
			}, delay);
		}
	}
}
