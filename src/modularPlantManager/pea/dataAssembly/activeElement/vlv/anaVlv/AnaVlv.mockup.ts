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
	getSourceModeMockupReferenceJSON,
	SourceModeMockup
} from '../../../baseFunction/sourceMode/SourceMode.mockup';
import {getVlvMockupReferenceJSON, VlvMockup} from '../Vlv.mockup';


export function getAnaVlvMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string): object {

	return ({
			...getVlvMockupReferenceJSON(namespace, objectBrowseName),
			...getSourceModeMockupReferenceJSON(namespace,objectBrowseName),
			Pos: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Pos`,
				dataType: 'Float'
			},
			PosFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosFbk`,
				dataType: 'Float'
			},
			PosFbkCalc: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosFbkCalc`,
				dataType: 'Boolean'
			},
			PosRbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosRbk`,
				dataType: 'Float'
			},
			PosInt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosInt`,
				dataType: 'Float'
			},
			PosMan: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosMan`,
				dataType: 'Float'
			},
			PosUnit: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosUnit`,
				dataType: 'Int16'
			},
			PosSclMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosSclMin`,
				dataType: 'Float'
			},
			PosSclMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosSclMax`,
				dataType: 'Float'
			},
			PosMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosMin`,
				dataType: 'Float'
			},
			PosMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosMax`,
				dataType: 'Float'
			},
			OpenAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.OpenAct`,
				dataType: 'Boolean'
			},
			CloseAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.CloseAct`,
				dataType: 'Boolean'
			}
		}
	);
}

export class AnaVlvMockup extends VlvMockup{

	public sourceModeMockup: SourceModeMockup;

	public posSclMin = 0;
	public posSclMax = 0;
	public posUnit = 0;
	public posMin = 0;
	public posMax = 0;
	public posInt = 0;
	public posMan = 0;
	public posRbk = 0;
	public pos = 0;
	public posFbkCalc = false;
	public posFbk = 0;
	public openAct = false;
	public closeAct = false;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		super(namespace, rootNode, variableName);

		this.sourceModeMockup = new SourceModeMockup(namespace, rootNode, variableName);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.OpenAct`,
			browseName: `${variableName}.OpenAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.openAct});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CloseAct`,
			browseName: `${variableName}.CloseAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.closeAct});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosSclMin`,
			browseName: `${variableName}.PosSclMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posSclMin});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosSclMax`,
			browseName: `${variableName}.PosSclMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posSclMax});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosUnit`,
			browseName: `${variableName}.PosUnit`,
			dataType: DataType.UInt32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.posUnit});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosMin`,
			browseName: `${variableName}.PosMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posMin});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosMax`,
			browseName: `${variableName}.PosMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posMax});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosInt`,
			browseName: `${variableName}.PosInt`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posInt});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosMan`,
			browseName: `${variableName}.PosMan`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posMan});
				},
				set: (variant: Variant): StatusCodes => {
					this.posMan = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosRbk`,
			browseName: `${variableName}.PosRbk`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posRbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Pos`,
			browseName: `${variableName}.Pos`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.pos});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosFbkCalc`,
			browseName: `${variableName}.PosFbkCalc`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.posFbkCalc});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosFbk`,
			browseName: `${variableName}.PosFbk`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posFbk});
				},
			},
		});
	}

	public getAnaVlvMockupJSON(): object {
		return getAnaVlvMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
