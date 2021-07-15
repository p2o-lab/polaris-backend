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
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../_extensions/wqcDA/WQCDA.mockup';
import {getOSLevelDAMockupReferenceJSON, OSLevelDAMockup} from '../../_extensions/osLevelDA/OSLevelDA.mockup';
import {getSourceModeDAMockupReferenceJSON} from '../../_extensions/sourceModeDA/SourceModeDA.mockup';
import {getOpModeDAMockupReferenceJSON, OpModeDAMockup} from '../../_extensions/opModeDA/OpModeDA.mockup';
import {getInterlockDAMockupReferenceJSON, InterlockDAMockup} from '../../_extensions/interlockDA/InterlockDA.mockup';
import {getResetDAMockupReferenceJSON, ResetDAMockup} from '../../_extensions/resetDA/ResetDA.mockup';
import {getActiveElementMockupReferenceJSON} from '../ActiveElement.mockup';


export function getVlvMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			...getActiveElementMockupReferenceJSON(namespace, objectBrowseName),
			...getOpModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getInterlockDAMockupReferenceJSON(namespace,objectBrowseName),
			...getResetDAMockupReferenceJSON(namespace,objectBrowseName),
			SafePos: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SafePos`,
				dataType: 'Boolean'
			},
			SafePosEn: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SafePosEn`,
				dataType: 'Boolean'
			},
			SafePosAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SafePosAct`,
				dataType: 'Boolean'
			},
			OpenAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.OpenAut`,
				dataType: 'Boolean'
			},
			OpenFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.OpenFbk`,
				dataType: 'Boolean'
			},
			OpenFbkCalc: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.OpenFbkCalc`,
				dataType: 'Boolean'
			},
			OpenOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.OpenOp`,
				dataType: 'Boolean'
			},
			CloseAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.CloseAut`,
				dataType: 'Boolean'
			},
			CloseFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.CloseFbk`,
				dataType: 'Boolean'
			},
			CloseFbkCalc: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.CloseFbkCalc`,
				dataType: 'Boolean'
			},
			CloseOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.CloseOp`,
				dataType: 'Boolean'
			}
		}
	);
}

export class VlvMockup {

	public readonly name: string;
	public wqc: WQCDAMockup;
	public osLevel: OSLevelDAMockup;
	public operationMode: OpModeDAMockup;
	public interlock: InterlockDAMockup;
	public reset: ResetDAMockup;

	public safePos = false;
	public safePosEn = false;
	public openOp = false;
	public closeOp = false;
	public openAut = false;
	public closeAut = false;
	public openFbkCalc = false;
	public openFbk = false;
	public closeFbkCalc = false;
	public closeFbk = false;

	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});

		this.osLevel = new OSLevelDAMockup(namespace, this.mockupNode, this.name);
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);
		this.operationMode = new OpModeDAMockup(namespace,this.mockupNode,this.name);
		this.interlock= new InterlockDAMockup(namespace,this.mockupNode,this.name);
		this.reset= new ResetDAMockup(namespace,this.mockupNode,this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SafePos`,
			browseName: `${variableName}.SafePos`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.safePos});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.SafePosEn`,
			browseName: `${variableName}.SafePosEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.safePosEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.OpenOp`,
			browseName: `${variableName}.OpenOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.openOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.openOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CloseOp`,
			browseName: `${variableName}.CloseOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.closeOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.closeOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.OpenAut`,
			browseName: `${variableName}.OpenAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.openAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CloseAut`,
			browseName: `${variableName}.CloseAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.closeAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.OpenFbkCalc`,
			browseName: `${variableName}.OpenFbkCalc`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.openFbkCalc});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.OpenFbk`,
			browseName: `${variableName}.OpenFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.openFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CloseFbkCalc`,
			browseName: `${variableName}.CloseFbkCalc`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.closeFbkCalc});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.CloseFbk`,
			browseName: `${variableName}.CloseFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.closeFbk});
				},
			},
		});
	}

	public getVlvMockupJSON() {
		return getVlvMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
