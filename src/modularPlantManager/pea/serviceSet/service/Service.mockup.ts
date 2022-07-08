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
import {OpModeMockup} from '../../dataAssembly/baseFunction/opMode/OpMode.mockup';
import {AnaServParamMockup} from '../../dataAssembly/operationElement/servParam/anaServParam/AnaServParam.mockup';
import {AnaProcessValueInMockup} from '../../dataAssembly/inputElement/processValueIn/AnaProcessValueIn/AnaProcessValueIn.mockup';
import {AnaViewMockup} from '../../dataAssembly/indicatorElement/AnaView/AnaView.mockup';

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

	public readonly offset: AnaServParamMockup;
	public readonly factor: AnaServParamMockup;
	public readonly updateRate: AnaServParamMockup;
	public readonly pvIn: AnaProcessValueInMockup;

	public readonly pvIntegral: AnaViewMockup;
	public readonly finalOut: AnaViewMockup;
	public readonly pvOut: AnaViewMockup;
	public readonly finalIntegral: AnaViewMockup;

	private interval: Timeout | undefined;
	private timeoutAutomaticStateChange: Timeout | undefined;
	private unit = 1351;
	private unitIntegral = 1038;

	constructor(namespace: Namespace, rootNode: UAObject, serviceName: string) {
		this.serviceName = serviceName;
		this.state(ServiceState.IDLE);

		const serviceNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: serviceName
		});

		this.factor = new AnaServParamMockup(namespace, serviceNode, serviceName + '.Factor');
		this.factor.vOut = 2;

		this.offset = new AnaServParamMockup(namespace, serviceNode, serviceName + '.Offset');
		this.offset.vOut = 20;
		this.offset.unit.unit = this.unit;

		this.pvIn = new AnaProcessValueInMockup(namespace, serviceNode, serviceName + '.ProcessValueIn');
		this.pvIn.vExt = 1;
		this.pvIn.unit.unit = this.unit;

		this.pvOut = new AnaViewMockup(namespace, serviceNode, serviceName + '.ProcessValueOut');
		this.pvOut.v = 22;
		this.pvOut.unit.unit = this.unit;

		this.pvIntegral = new AnaViewMockup(namespace, serviceNode, serviceName + '.ProcessValueIntegral');
		this.pvIntegral.v = 0;
		this.pvIntegral.unit.unit = this.unitIntegral;

		this.updateRate = new AnaServParamMockup(namespace, serviceNode, serviceName + '.UpdateRate');
		this.updateRate.vExt = 1000;
		this.updateRate.vOut = 1000;
		this.updateRate.unit.unit = 1056;
		this.updateRate.valueLimitation.vMin = 100;
		this.updateRate.valueLimitation.vMax = 10000;

		this.finalOut = new AnaViewMockup(namespace, serviceNode, serviceName + '.FinalOut');
		this.finalOut.v = 0;
		this.finalOut.unit.unit = this.unit;

		this.finalIntegral = new AnaViewMockup(namespace, serviceNode, serviceName + '.FinalIntegral');
		this.finalIntegral.v = 0;
		this.finalIntegral.unit.unit = this.unitIntegral;

		namespace.addVariable({
			componentOf: serviceNode,
			nodeId: `ns=${namespace.index};s=${serviceName}.Procedure`,
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

		namespace.addVariable({
			componentOf: serviceNode,
			nodeId: `ns=1;s=${serviceName}.ProcedureCur`,
			browseName: `${serviceName}.ProcedureCur`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.varProcedure});
				}
			}
		});

		namespace.addVariable({
			componentOf: serviceNode,
			nodeId: `ns=${namespace.index};s=${serviceName}.CommandEn`,
			browseName: `${serviceName}.CommandEn`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.varCommandEnable});
				}
			}
		});

		this.opMode = new OpModeMockup(namespace, serviceNode, this.serviceName);

		namespace.addVariable({
			componentOf: serviceNode,
			nodeId: `ns=${namespace.index};s=${serviceName}.StateCur`,
			browseName: `${serviceName}.StateCur`,
			dataType: 'UInt32',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.varStatus});
				}
			}
		});

		namespace.addVariable({
			componentOf: serviceNode,
			nodeId: `ns=${namespace.index};s=${serviceName}.Command`,
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
					this.pvOut.v = this.factor.vOut * this.pvIn.vExt + this.offset.vOut;
					this.pvIntegral.v = this.pvIntegral.v + this.pvOut.v * this.updateRate.vOut / 1000;
				}, this.updateRate.vOut);
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
