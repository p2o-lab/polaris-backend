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
import {getDataAssemblyMockupReferenceJSON} from '../../../DataAssembly.mockup';
import {getSourceModeDAMockupReferenceJSON} from '../../../_extensions/sourceModeDA/SourceModeDA.mockup';
import {getOpModeDAMockupReferenceJSON, OpModeDAMockup} from '../../../_extensions/opModeDA/OpModeDA.mockup';
import {getInterlockDAMockupReferenceJSON, InterlockDAMockup} from '../../../_extensions/interlockDA/InterlockDA.mockup';
import {getResetDAMockupReferenceJSON, ResetDAMockup} from '../../../_extensions/resetDA/ResetDA.mockup';
import {
	FeedbackMonitoringDAMockup,
	getFeedbackMonitoringDAMockupReferenceJSON
} from '../../../_extensions/feedbackMonitoringDA/FeedbackMonitoringDA.mockup';


export function getMonAnaVlvMockupReferenceJSON(
	namespace = 1,
	objectBrowseName = 'P2OGalaxy') {

	return ({
			...getDataAssemblyMockupReferenceJSON(namespace,objectBrowseName),
			...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
			...getOSLevelDAMockupReferenceJSON(namespace,objectBrowseName),
			...getSourceModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getOpModeDAMockupReferenceJSON(namespace,objectBrowseName),
			...getInterlockDAMockupReferenceJSON(namespace,objectBrowseName),
			...getResetDAMockupReferenceJSON(namespace,objectBrowseName),
			...getFeedbackMonitoringDAMockupReferenceJSON(namespace,objectBrowseName),
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
			},
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
			},
			PosReachedFbk: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosReachedFbk`,
				dataType: 'Boolean'
			},
			PosTolerance: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PosTolerance`,
				dataType: 'Float'
			},
			MonPosTi: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MonPosTi`,
				dataType: 'Float'
			},
			MonPosErr: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MonPosErr`,
				dataType: 'Boolean'
			}
		}
	);
}

export class MonAnaVlvMockup {

	public readonly name: string;
	public wqc: WQCDAMockup;
	public osLevel: OSLevelDAMockup;
	public operationMode: OpModeDAMockup;
	public interlock: InterlockDAMockup;
	public reset: ResetDAMockup;
	public feedbackMonitoring: FeedbackMonitoringDAMockup;

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

	public posReachedFbk = false;
	public posTolerance = 0.0;
	public monPosTi = 0.0;
	public monPosErr = false;

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
		this.feedbackMonitoring= new FeedbackMonitoringDAMockup(namespace,this.mockupNode,this.name);

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
			nodeId: `ns=${namespace};s=${variableName}.SafePosEn`,
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
			nodeId: `ns=${namespace};s=${variableName}.OpenOp`,
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
			nodeId: `ns=${namespace};s=${variableName}.CloseOp`,
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
			nodeId: `ns=${namespace};s=${variableName}.OpenAut`,
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
			nodeId: `ns=${namespace};s=${variableName}.CloseAut`,
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
			nodeId: `ns=${namespace};s=${variableName}.OpenFbkCalc`,
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
			nodeId: `ns=${namespace};s=${variableName}.OpenFbk`,
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
			nodeId: `ns=${namespace};s=${variableName}.CloseFbkCalc`,
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
			nodeId: `ns=${namespace};s=${variableName}.CloseFbk`,
			browseName: `${variableName}.CloseFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.closeFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.OpenAct`,
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
			nodeId: `ns=${namespace};s=${variableName}.CloseAct`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosSclMin`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosSclMax`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosUnit`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosMin`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosMax`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosInt`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosMan`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosRbk`,
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
			nodeId: `ns=${namespace};s=${variableName}.Pos`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosFbkCalc`,
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
			nodeId: `ns=${namespace};s=${variableName}.PosFbk`,
			browseName: `${variableName}.PosFbk`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posFbk});
				},
			},
		});

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.PosReachedFbk`,
			browseName: `${variableName}.PosReachedFbk`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.posReachedFbk});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.PosTolerance`,
			browseName: `${variableName}.PosTolerance`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.posTolerance});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MonPosTi`,
			browseName: `${variableName}.MonPosTi`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.monPosTi});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MonPosErr`,
			browseName: `${variableName}.MonPosErr`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.monPosErr});
				},
			},
		});
	}

	public getMonAnaVlvMockupJSON() {
		return getMonAnaVlvMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name || 'UnqualifiedName');
	}
}
