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
import {
	FeedbackMonitoringDAMockup,
	getFeedbackMonitoringDAMockupReferenceJSON
} from '../../../_extensions/feedbackMonitoringDA/FeedbackMonitoringDA.mockup';
import {getAnaDrvMockupReferenceJSON} from './AnaDrv.mockup';


export function getMonAnaDrvMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string) {

	return ({
			...getAnaDrvMockupReferenceJSON(namespace, objectBrowseName),
			...getFeedbackMonitoringDAMockupReferenceJSON(namespace,objectBrowseName),
			RpmErr: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmErr`,
				dataType: 'Boolean'
			},
			RpmAHEn: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmAHEn`,
				dataType: 'Boolean'
			},
			RpmAHLim: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmAHLim`,
				dataType: 'Float'
			},
			RpmAHAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmAHAct`,
				dataType: 'Boolean'
			},
			RpmALEn: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmALEn`,
				dataType: 'Boolean'
			},
			RpmALLim: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmALLim`,
				dataType: 'Float'
			},
			RpmALAct: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.RpmALAct`,
				dataType: 'Boolean'
			},
		}
	);
}

export class MonAnaDrvMockup {

	public readonly name: string;
	public wqc: WQCDAMockup;
	public osLevel: OSLevelDAMockup;
	public operationMode: OpModeDAMockup;
	public interlock: InterlockDAMockup;
	public reset: ResetDAMockup;
	public sourceMode: SourceModeDAMockup;
	public feedbackMonitoring: FeedbackMonitoringDAMockup;

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

	public rpmErr = 0.0;
	public rpmAHEn = false;
	public rpmAHLim: string | number | DataType | undefined = undefined;
	public rpmAHAct = false;
	public rpmWHEn = false;
	public rpmWHLim: string | number | DataType | undefined = undefined;
	public rpmWHAct = false;
	public rpmTHEn = false;
	public rpmTHLim: string | number | DataType | undefined = undefined;
	public rpmTHAct = false;

	public rpmTLEn = false;
	public rpmTLLim: string | number | DataType | undefined = undefined;
	public rpmTLAct = false;
	public rpmWLEn = false;
	public rpmWLLim: string | number | DataType | undefined = undefined;
	public rpmWLAct = false;
	public rpmALEn = false;
	public rpmALLim: string | number | DataType | undefined = undefined;
	public rpmALAct = false;

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
		this.feedbackMonitoring= new FeedbackMonitoringDAMockup(namespace,this.mockupNode,this.name);

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

				set: (variant: Variant) => {
					switch (typeof this.rpmAHLim) {
						case 'undefined':
							return StatusCodes.BadTypeDefinitionInvalid;
						case DataType.Double.toString():
							this.rpmAHLim = parseFloat(variant.value);
							return StatusCodes.Good;
						default:
							this.rpmAHLim = parseInt(variant.value,10);
							return StatusCodes.Good;
					}
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

				set: (variant: Variant) => {
					switch (typeof this.rpmWHLim) {
						case 'undefined':
							return StatusCodes.BadTypeDefinitionInvalid;
						case DataType.Double.toString():
							this.rpmWHLim = parseFloat(variant.value);
							return StatusCodes.Good;
						default:
							this.rpmWHLim = parseInt(variant.value,10);
							return StatusCodes.Good;
					}
				},
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

				set: (variant: Variant) => {
					switch (typeof this.rpmTHLim) {
						case 'undefined':
							return StatusCodes.BadTypeDefinitionInvalid;
						case DataType.Double.toString():
							this.rpmTHLim = parseFloat(variant.value);
							return StatusCodes.Good;
						default:
							this.rpmTHLim = parseInt(variant.value,10);
							return StatusCodes.Good;
					}
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

				set: (variant: Variant) => {
					switch (typeof this.rpmTLLim) {
						case 'undefined':
							return StatusCodes.BadTypeDefinitionInvalid;
						case DataType.Double.toString():
							this.rpmTLLim = parseFloat(variant.value);
							return StatusCodes.Good;
						default:
							this.rpmTLLim = parseInt(variant.value,10);
							return StatusCodes.Good;
					}
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
					switch (typeof this.rpmWLLim) {
						case 'undefined':
							return StatusCodes.BadTypeDefinitionInvalid;
						case DataType.Double.toString():
							this.rpmWLLim = parseFloat(variant.value);
							return StatusCodes.Good;
						default:
							this.rpmWLLim = parseInt(variant.value,10);
							return StatusCodes.Good;
					}
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
					switch (typeof this.rpmALLim) {
						case 'undefined':
							return StatusCodes.BadTypeDefinitionInvalid;
						case DataType.Double.toString():
							this.rpmALLim = parseFloat(variant.value);
							return StatusCodes.Good;
						default:
							this.rpmALLim = parseInt(variant.value,10);
							return StatusCodes.Good;
					}
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

	public getMonAnaDrvMockupJSON() {
		return getMonAnaDrvMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
