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

import {DataType, Namespace, UAObject, Variant} from 'node-opcua';
import {getLockView8DataItemModel, LockView8Mockup} from '../LockView8/LockView8.mockup';

import {getDataAssemblyModel} from '../../../DataAssembly.mockup';
import {CIData, DataAssemblyModel, DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../../dataItem/DataItem.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly/DiagnosticElement/LockView16';

function getLockView16SpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {
	const result: DataItemModel[] = [];
	let dataItem: DataItemModel = getEmptyDataItemModel();
	dataItem.name = 'In9En';
	dataItem.dataType = 'Boolean';
	let ciOptions: CIData = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In9En`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In9';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In9`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In9QC';
	dataItem.dataType = 'Byte';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In9QC`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In9Inv';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In9Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In9Txt';
	dataItem.dataType = 'String';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In9Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In10En';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In10En`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In10';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In10`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In10QC';
	dataItem.dataType = 'Byte';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In10QC`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In10Inv';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In10Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In10Txt';
	dataItem.dataType = 'String';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In10Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In11En';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In11En`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In11';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In11`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In11QC';
	dataItem.dataType = 'Byte';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In11QC`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In11Inv';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In11Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In11Txt';
	dataItem.dataType = 'String';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In11Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In12En';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In12En`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In12';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In12`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In12QC';
	dataItem.dataType = 'Byte';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In12QC`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In12Inv';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In12Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In12Txt';
	dataItem.dataType = 'String';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In12Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In13En';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In13En`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In13';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In13`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In13QC';
	dataItem.dataType = 'Byte';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In13QC`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In13Inv';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In13Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In13Txt';
	dataItem.dataType = 'String';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In13Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In14En';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In14En`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In14';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In14`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In14QC';
	dataItem.dataType = 'Byte';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In14QC`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In14Inv';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In14Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In14Txt';
	dataItem.dataType = 'String';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In14Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In15En';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In15En`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In15';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In15`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In15QC';
	dataItem.dataType = 'Byte';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In15QC`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In15Inv';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In15Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In15Txt';
	dataItem.dataType = 'String';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In15Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In16En';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In16En`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In16';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In16`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In16QC';
	dataItem.dataType = 'Byte';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In16QC`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In16Inv';
	dataItem.dataType = 'Boolean';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In16Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);

	dataItem = getEmptyDataItemModel();
	dataItem.name = 'In16Txt';
	dataItem.dataType = 'String';
	ciOptions = getEmptyCIDataModel();
	ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
	ciOptions.nodeId.identifier = `${objectBrowseName}.In16Inv`;
	ciOptions.nodeId.namespaceIndex = `${namespace}`;
	dataItem.cIData = ciOptions;
	result.push(dataItem);


	return result;
}

export function getLockView16DataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
	return [
			...getLockView8DataItemModel(namespace, objectBrowseName),
			...getLockView16SpecificDataItemModels(namespace, objectBrowseName),
		];
}

export function getLockView16DataAssemblyModel(namespace: number, objectBrowseName: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
	const options = getDataAssemblyModel(metaModelReference, name, tagName, tagDescription);
	options.dataItems = [
		...options.dataItems,
		...getLockView16DataItemModel(namespace, objectBrowseName)
	];
	return options;
}

export class LockView16Mockup extends LockView8Mockup{

	public in9En = false;
	public in9 = false;
	public in9QC = 0;
	public in9Inv = false;
	public in9Txt = 'testText';

	public in10En = false;
	public in10 = false;
	public in10QC = 0;
	public in10Inv = false;
	public in10Txt = 'testText';

	public in11En = false;
	public in11 = false;
	public in11QC = 0;
	public in11Inv = false;
	public in11Txt = 'testText';

	public in12En = false;
	public in12 = false;
	public in12QC = 0;
	public in12Inv = false;
	public in12Txt = 'testText';

	public in13En = false;
	public in13 = false;
	public in13QC = 0;
	public in13Inv = false;
	public in13Txt = 'testText';

	public in14En = false;
	public in14 = false;
	public in14QC = 0;
	public in14Inv = false;
	public in14Txt = 'testText';

	public in15En = false;
	public in15 = false;
	public in15QC = 0;
	public in15Inv = false;
	public in15Txt = 'testText';

	public in16En = false;
	public in16 = false;
	public in16QC = 0;
	public in16Inv = false;
	public in16Txt = 'testText';


	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {
		super(namespace, rootNode, variableName);

		// INPUT 9
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In9En`,
			browseName: `${variableName}.In9En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in9En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In9`,
			browseName: `${variableName}.In9`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in9});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In9QC`,
			browseName: `${variableName}.In9QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in9QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In9Inv`,
			browseName: `${variableName}.In9Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in9Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In9Txt`,
			browseName: `${variableName}.In9Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in9Txt});
				},
			},
		});
// INPUT 10
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In10En`,
			browseName: `${variableName}.In10En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in10En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In10`,
			browseName: `${variableName}.In10`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in10});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In10QC`,
			browseName: `${variableName}.In10QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in10QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In10Inv`,
			browseName: `${variableName}.In10Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in10Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In10Txt`,
			browseName: `${variableName}.In10Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in10Txt});
				},
			},
		});
// INPUT 11
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In11En`,
			browseName: `${variableName}.In11En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in11En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In11`,
			browseName: `${variableName}.In11`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in11});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In11QC`,
			browseName: `${variableName}.In11QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in11QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In11Inv`,
			browseName: `${variableName}.In11Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in11Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In11Txt`,
			browseName: `${variableName}.In11Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in11Txt});
				},
			},
		});
// INPUT 12
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In12En`,
			browseName: `${variableName}.In12En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in12En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In12`,
			browseName: `${variableName}.In12`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in12});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In12QC`,
			browseName: `${variableName}.In12QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in12QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In12Inv`,
			browseName: `${variableName}.In12Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in12Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In12Txt`,
			browseName: `${variableName}.In12Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in12Txt});
				},
			},
		});
// INPUT 13
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In13En`,
			browseName: `${variableName}.In13En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in13En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In13`,
			browseName: `${variableName}.In13`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in13});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In13QC`,
			browseName: `${variableName}.In13QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in13QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In13Inv`,
			browseName: `${variableName}.In13Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in13Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In13Txt`,
			browseName: `${variableName}.In13Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in13Txt});
				},
			},
		});
// INPUT 14
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In14En`,
			browseName: `${variableName}.In14En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in14En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In14`,
			browseName: `${variableName}.In14`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in14});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In14QC`,
			browseName: `${variableName}.In14QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in14QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In14Inv`,
			browseName: `${variableName}.In14Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in14Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In14Txt`,
			browseName: `${variableName}.In14Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in14Txt});
				},
			},
		});
// INPUT 15
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In15En`,
			browseName: `${variableName}.In15En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in15En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In15`,
			browseName: `${variableName}.In15`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in15});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In15QC`,
			browseName: `${variableName}.In15QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in15QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In15Inv`,
			browseName: `${variableName}.In15Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in15Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In15Txt`,
			browseName: `${variableName}.In15Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in15Txt});
				},
			},
		});
// INPUT 16
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In16En`,
			browseName: `${variableName}.In16En`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in16En});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In16`,
			browseName: `${variableName}.In16`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in16});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In16QC`,
			browseName: `${variableName}.In16QC`,
			dataType: DataType.Byte,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Byte, value: this.in16QC});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In16Inv`,
			browseName: `${variableName}.In16Inv`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.in16Inv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.In16Txt`,
			browseName: `${variableName}.In16Txt`,
			dataType: DataType.String,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.String, value: this.in16Txt});
				},
			},
		});
	}

	public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
		const options = super.getDataAssemblyModel(metaModelReferenceOption || metaModelReference);
		options.dataItems = [
			...options.dataItems,
			...getLockView16SpecificDataItemModels(this.mockupNode.namespaceIndex, this.mockupNode.browseName.name as string),
		];
		return options;
	}
}
