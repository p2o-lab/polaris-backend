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
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../../_extensions/wqcDA/WQCDA.mockup';
import {getOSLevelDAMockupReferenceJSON, OSLevelDAMockup} from '../../../_extensions/osLevelDA/OSLevelDA.mockup';
import {getOpModeDAMockupReferenceJSON, OpModeDAMockup} from '../../../_extensions/opModeDA/OpModeDA.mockup';
import {getInterlockDAMockupReferenceJSON, InterlockDAMockup} from '../../../_extensions/interlockDA/InterlockDA.mockup';
import {getResetDAMockupReferenceJSON, ResetDAMockup} from '../../../_extensions/resetDA/ResetDA.mockup';
import {
	getSourceModeDAMockupReferenceJSON,
	SourceModeDAMockup
} from '../../../_extensions/sourceModeDA/SourceModeDA.mockup';
import {getActiveElementMockupReferenceJSON} from '../../ActiveElement.mockup';
import {getDrvMockupReferenceJSON} from '../Drv.mockup';


export function getAnaDrvMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			...getOpModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getSourceModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getDrvMockupReferenceJSON(namespace,objectBrowseName),
			RpmSclMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmSclMax`,
				dataType: 'Float'
			},
			RpmSclMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmSclMin`,
				dataType: 'Float'
			},
			RpmUnit: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmUnit`,
				dataType: 'Int16'
			},
			RpmMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmMax`,
				dataType: 'Float'
			},
			RpmMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmMin`,
				dataType: 'Float'
			},
			RpmInt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmInt`,
				dataType: 'Float'
			},
			RpmMan: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmMan`,
				dataType: 'Float'
			},
			Rpm: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Rpm`,
				dataType: 'Float'
			},
			RpmFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmFbk`,
				dataType: 'Float'
			},
			RpmFbkCalc: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmFbkCalc`,
				dataType: 'Boolean'
			},
			RpmRbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmRbk`,
				dataType: 'Float'
			}
		}
	);
}

export class AnaDrvMockup {

	public readonly name: string;
	public wqc: WQCDAMockup;
	public osLevel: OSLevelDAMockup;
	public operationMode: OpModeDAMockup;
	public interlock: InterlockDAMockup;
	public reset: ResetDAMockup;
	public sourceMode: SourceModeDAMockup;

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
		this.sourceMode= new SourceModeDAMockup(namespace,this.mockupNode,this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SafePos`,
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
			nodeId: `ns=${namespace};s=${variableName}.SafePosAct`,
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
			nodeId: `ns=${namespace};s=${variableName}.FwdEn`,
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
			nodeId: `ns=${namespace};s=${variableName}.RevEn`,
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
			nodeId: `ns=${namespace};s=${variableName}.StopOp`,
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
			nodeId: `ns=${namespace};s=${variableName}.FwdOp`,
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
			nodeId: `ns=${namespace};s=${variableName}.RevOp`,
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
			nodeId: `ns=${namespace};s=${variableName}.StopAut`,
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
			nodeId: `ns=${namespace};s=${variableName}.FwdAut`,
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
			nodeId: `ns=${namespace};s=${variableName}.RevAut`,
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
			nodeId: `ns=${namespace};s=${variableName}.FwdCtrl`,
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
			nodeId: `ns=${namespace};s=${variableName}.RevCtrl`,
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
			nodeId: `ns=${namespace};s=${variableName}.RevFbkCalc`,
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
			nodeId: `ns=${namespace};s=${variableName}.RevFbk`,
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
			nodeId: `ns=${namespace};s=${variableName}.FwdFbkCalc`,
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
			nodeId: `ns=${namespace};s=${variableName}.FwdFbk`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmSclMin`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmSclMax`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmUnit`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmMin`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmMax`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmInt`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmMan`,
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
			nodeId: `ns=${namespace};s=${variableName}.Rpm`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmRbk`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmFbkCalc`,
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
			nodeId: `ns=${namespace};s=${variableName}.RpmFbk`,
			browseName: `${variableName}.RpmFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.rpmFbk});
				},
			},
		});

	}

	public getAnaDrvMockupJSON() {
		return getAnaDrvMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
