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
	getSourceModeDataItemOptions,
	SourceModeMockup
} from '../../../baseFunction/sourceMode/SourceMode.mockup';
import {DrvMockup, getDrvDataItemOptions} from '../Drv.mockup';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getDataAssemblyOptions} from '../../../DataAssemblyController.mockup';
import {DataAssemblyOptions} from '@p2olab/polaris-interface';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/ActiveElement/AnaDrv';

function getAnaDrvSpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
		RpmSclMax: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmSclMax`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmSclMin: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmSclMin`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmUnit: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmUnit`,
			dataType: 'Int16'
		} as OpcUaNodeOptions,
		RpmMax: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmMax`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmMin: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmMin`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmInt: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmInt`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmMan: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmMan`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		Rpm: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.Rpm`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmFbk: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmFbk`,
			dataType: 'Float'
		} as OpcUaNodeOptions,
		RpmFbkCalc: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmFbkCalc`,
			dataType: 'Boolean'
		} as OpcUaNodeOptions,
		RpmRbk: {
			namespaceIndex: `${namespace}`,
			nodeId: `${objectBrowseName}.RpmRbk`,
			dataType: 'Float'
		} as OpcUaNodeOptions
	});
}

export function getAnaDrvDataItemOptions(namespace: number, objectBrowseName: string): object {
	return ({
			...getDrvDataItemOptions(namespace, objectBrowseName),
			...getSourceModeDataItemOptions(namespace, objectBrowseName),
			...getAnaDrvSpecificDataItemOptions(namespace, objectBrowseName),
		} as OpcUaNodeOptions
	);
}

export function getAnaDrvOptions(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): object {
	const options = getDataAssemblyOptions(name, tagName, tagDescription);
	options.metaModelRef = metaModelReference;
	options.dataItems = {
		...options.dataItems,
		...getAnaDrvDataItemOptions(namespace, objectBrowseName)};
	return options;
}

export class AnaDrvMockup extends DrvMockup{

	public sourceMode: SourceModeMockup;

	public rpmSclMin= 0;
	public rpmSclMax= 0;
	public rpmUnit= 0;
	public rpmMin= 0;
	public rpmMax= 0;
	public rpmInt= 0;
	public rpmMan= 0;
	public rpm= 0;
	public rpmRbk= 0;
	public rpmFbkCalc= false;
	public rpmFbk= false;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		this.sourceMode = new SourceModeMockup(namespace,this.mockupNode,this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmSclMin`,
			browseName: `${variableName}.RpmSclMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmSclMin});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmSclMax`,
			browseName: `${variableName}.RpmSclMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmSclMax});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmUnit`,
			browseName: `${variableName}.RpmUnit`,
			dataType: DataType.UInt32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.rpmUnit});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmMin`,
			browseName: `${variableName}.RpmMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmMin});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmMax`,
			browseName: `${variableName}.RpmMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmMax});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmInt`,
			browseName: `${variableName}.RpmInt`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmInt});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmMan`,
			browseName: `${variableName}.RpmMan`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmMan});
				},
				set: (variant: Variant): StatusCodes => {
					this.rpmMan = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Rpm`,
			browseName: `${variableName}.Rpm`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpm});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmRbk`,
			browseName: `${variableName}.RpmRbk`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.rpmRbk});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmFbkCalc`,
			browseName: `${variableName}.RpmFbkCalc`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmFbkCalc});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RpmFbk`,
			browseName: `${variableName}.RpmFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmFbk});
				},
			},
		});

	}

	public getDataAssemblyOptions(): DataAssemblyOptions {
		const options = super.getDataAssemblyOptions();
		options.metaModelRef = metaModelReference;
		options.dataItems = {
			...options.dataItems,
			...this.sourceMode.getDataItemOptions(),
			...getAnaDrvSpecificDataItemOptions(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		};
		return options;
	}
}
