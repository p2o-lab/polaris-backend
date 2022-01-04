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
import {WQCDAMockup} from '../../_extensions/wqcDA/WQCDA.mockup';
import {OSLevelDAMockup} from '../../_extensions/osLevelDA/OSLevelDA.mockup';
import {getOpModeMockupReferenceJSON, OpModeMockup} from '../../_extensions/opMode/OpMode.mockup';
import {getInterlockMockupReferenceJSON, InterlockMockup} from '../../_extensions/interlock/Interlock.mockup';
import {getResetDAMockupReferenceJSON, ResetDAMockup} from '../../_extensions/resetDA/ResetDA.mockup';
import {getActiveElementMockupReferenceJSON} from '../ActiveElement.mockup';


export function getDrvMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string): object {

	return ({
			
			...getActiveElementMockupReferenceJSON(namespace,objectBrowseName),
			...getOpModeMockupReferenceJSON(namespace,objectBrowseName),
			...getInterlockMockupReferenceJSON(namespace,objectBrowseName),
			...getResetDAMockupReferenceJSON(namespace,objectBrowseName),
			SafePos: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SafePos`,
				dataType: 'Boolean'
			},
			SafePosAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SafePosAct`,
				dataType: 'Boolean'
			},
			FwdAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.FwdAut`,
				dataType: 'Boolean'
			},
			FwdCtrl: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.FwdCtrl`,
				dataType: 'Boolean'
			},
			FwdEn: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.FwdEn`,
				dataType: 'Boolean'
			},
			FwdFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.FwdFbk`,
				dataType: 'Boolean'
			},
			FwdFbkCalc: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.FwdFbkCalc`,
				dataType: 'Boolean'
			},
			FwdOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.FwdOp`,
				dataType: 'Boolean'
			},
			RevAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RevAut`,
				dataType: 'Boolean'
			},
			RevCtrl: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RevCtrl`,
				dataType: 'Boolean'
			},
			RevEn: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RevEn`,
				dataType: 'Boolean'
			},
			RevFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RevFbk`,
				dataType: 'Boolean'
			},
			RevFbkCalc: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RevFbkCalc`,
				dataType: 'Boolean'
			},
			RevOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RevOp`,
				dataType: 'Boolean'
			},
			StopAut: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StopAut`,
				dataType: 'Boolean'
			},
			StopOp: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.StopOp`,
				dataType: 'Boolean'
			},
			Trip: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Trip`,
				dataType: 'Boolean'
			}
		}
	);
}

export class DrvMockup {

	public readonly name: string;
	public wqc: WQCDAMockup;
	public osLevel: OSLevelDAMockup;
	public operationMode: OpModeMockup;
	public interlock: InterlockMockup;
	public reset: ResetDAMockup;

	public safePos = false;
	public safePosAct = false;


	public fwdEn= false;
	public revEn= false;
	public stopOp= false;
	public fwdOp= false;
	public revOp= false;
	public stopAut= false;
	public fwdAut= false;
	public revAut= false;
	public fwdCtrl= false;
	public revCtrl= false;
	public revFbkCalc= false;
	public revFbk= false;
	public fwdFbkCalc= false;
	public fwdFbk= false;
	public trip= false;

	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});

		this.osLevel = new OSLevelDAMockup(namespace, this.mockupNode, this.name);
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);
		this.operationMode = new OpModeMockup(namespace,this.mockupNode,this.name);
		this.interlock= new InterlockMockup(namespace,this.mockupNode,this.name);
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
			nodeId: `ns=${namespace.index};s=${variableName}.SafePosAct`,
			browseName: `${variableName}.SafePosAct`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.safePosAct});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdEn`,
			browseName: `${variableName}.FwdEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevEn`,
			browseName: `${variableName}.RevEn`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revEn});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StopOp`,
			browseName: `${variableName}.StopOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stopOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.stopOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdOp`,
			browseName: `${variableName}.FwdOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.fwdOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevOp`,
			browseName: `${variableName}.RevOp`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revOp});
				},
				set: (variant: Variant): StatusCodes => {
					this.revOp = variant.value;
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.StopAut`,
			browseName: `${variableName}.StopAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.stopAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdAut`,
			browseName: `${variableName}.FwdAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevAut`,
			browseName: `${variableName}.RevAut`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revAut});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdCtrl`,
			browseName: `${variableName}.FwdCtrl`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdCtrl});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevCtrl`,
			browseName: `${variableName}.RevCtrl`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revCtrl});
				},
			},
		});
		
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevFbkCalc`,
			browseName: `${variableName}.RevFbkCalc`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revFbkCalc});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.RevFbk`,
			browseName: `${variableName}.RevFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.revFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdFbkCalc`,
			browseName: `${variableName}.FwdFbkCalc`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdFbkCalc});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.FwdFbk`,
			browseName: `${variableName}.FwdFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.fwdFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.Trip`,
			browseName: `${variableName}.Trip`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.trip});
				},
			},
		});

	}

	public getDrvMockupJSON(): object {
		return getDrvMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
