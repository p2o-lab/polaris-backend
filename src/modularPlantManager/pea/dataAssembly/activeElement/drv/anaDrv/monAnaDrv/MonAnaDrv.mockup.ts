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

import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {
	FeedbackMonitoringMockup, getFeedbackMonitoringDataItemOptions
} from '../../../../baseFunction/feedbackMonitoring/FeedbackMonitoring.mockup';
import {AnaDrvMockup, getAnaDrvDataItemOptions} from '../AnaDrv.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../../../DataAssemblyController.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/AnaDrv/MonAnaDrv';

function getMonAnaDrvSpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		RpmErr: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmErr`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		RpmAHEn: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmAHEn`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		RpmAHLim: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmAHLim`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmAHAct: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmAHAct`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		RpmALEn: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmALEn`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		RpmALLim: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmALLim`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmALAct: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmALAct`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions
	});
}


export function getMonAnaDrvDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getAnaDrvDataItemOptions(namespace, objectBrowseName),
			...getFeedbackMonitoringDataItemOptions(namespace, objectBrowseName),
			...getMonAnaDrvSpecificDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}

export function getMonAnaDrvOptions(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getMonAnaDrvDataItemOptions(namespace, objectBrowseName)};
	return options;
}

export class MonAnaDrvMockup extends AnaDrvMockup {

	public feedbackMonitoring: FeedbackMonitoringMockup;
	
	public rpmErr = 0;
	public rpmAHEn = false;
	public rpmAHLim = 0;
	public rpmAHAct = false;
	public rpmWHEn = false;
	public rpmWHLim = 0;
	public rpmWHAct = false;
	public rpmTHEn = false;
	public rpmTHLim = 0;
	public rpmTHAct = false;

	public rpmTLEn = false;
	public rpmTLLim = 0;
	public rpmTLAct = false;
	public rpmWLEn = false;
	public rpmWLLim = 0;
	public rpmWLAct = false;
	public rpmALEn = false;
	public rpmALLim = 0;
	public rpmALAct = false;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.feedbackMonitoring= new FeedbackMonitoringMockup(namespace,this.mockupNode,this.name);

		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmErr`,
			browseName: `${variableName}.RpmErr`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmErr});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmAHEn`,
			browseName: `${variableName}.RpmAHEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmAHEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmAHLim`,
			browseName: `${variableName}.RpmAHLim`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmAHLim});
				},

				set: (variant: Variant): StatusCodes => {
					this.rpmAHLim = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmAHAct`,
			browseName: `${variableName}.RpmAHAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmAHAct});
				},
			},
		});
		
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmWHEn`,
			browseName: `${variableName}.RpmWHEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmWHEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmWHLim`,
			browseName: `${variableName}.RpmWHLim`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmWHLim});
				},
				set: (variant: Variant): StatusCodes => {
					this.rpmWHLim = parseFloat(variant.value);
					return StatusCodes.Good;
				}
			},
		});
		
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmWHAct`,
			browseName: `${variableName}.RpmWHAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmWHAct});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmTHEn`,
			browseName: `${variableName}.RpmTHEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmTHEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmTHLim`,
			browseName: `${variableName}.RpmTHLim`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmTHLim});
				},

				set: (variant: Variant): StatusCodes => {
					this.rpmTHLim = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmTHAct`,
			browseName: `${variableName}.RpmTHAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmTHAct});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmTLEn`,
			browseName: `${variableName}.RpmTLEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmTLEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmTLLim`,
			browseName: `${variableName}.RpmTLLim`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmTLLim});
				},

				set: (variant: Variant): StatusCodes => {
					this.rpmTLLim = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmTLAct`,
			browseName: `${variableName}.RpmTLAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmTLAct});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmWLEn`,
			browseName: `${variableName}.RpmWLEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmWLEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmWLLim`,
			browseName: `${variableName}.RpmWLLim`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmWLLim});
				},

				set: (variant: Variant): StatusCodes => {
					this.rpmWLLim = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmWLAct`,
			browseName: `${variableName}.RpmWLAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant=> {
					return new Variant({dataType: DataType.Boolean, value: this.rpmWLAct});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmALEn`,
			browseName: `${variableName}.RpmALEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmALEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmALLim`,
			browseName: `${variableName}.RpmALLim`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmALLim});
				},

				set: (variant: Variant): StatusCodes => {
					this.rpmALLim = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: rootNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmALAct`,
			browseName: `${variableName}.RpmALAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmALAct});
				},
			},
		});

	}

	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...this.feedbackMonitoring.getDataItemOptions(),
			...getMonAnaDrvSpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
	}
}
