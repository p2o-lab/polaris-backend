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
import {OpModeDAMockup} from '../../_extensions/opModeDA/OpModeDA.mockup';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../../_extensions/wqcDA/WQCDA.mockup';
import {getOSLevelDAMockupReferenceJSON, OSLevelDAMockup} from '../../_extensions/osLevelDA/OSLevelDA.mockup';
import {getDataAssemblyMockupReferenceJSON} from '../../DataAssembly.mockup';
import {getSourceModeDAMockupReferenceJSON, SourceModeDAMockup} from '../../_extensions/sourceModeDA/SourceModeDA.mockup';


export function getPIDCtrlMockupReferenceJSON(
	namespace = 1,
	objectBrowseName = 'P2OGalaxy') {

	return ({
			...getDataAssemblyMockupReferenceJSON(namespace,objectBrowseName),
			...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
			...getOSLevelDAMockupReferenceJSON(namespace,objectBrowseName),
			...getSourceModeDAMockupReferenceJSON(namespace,objectBrowseName),
			PV: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PV`,
				dataType: 'Float'
			},
			PVSclMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PVSclMin`,
				dataType: 'Float'
			},
			PVSclMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PVSclMax`,
				dataType: 'Float'
			},
			PVUnit: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.PVUnit`,
				dataType: 'Int16'
			},
			SPMan: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPMan`,
				dataType: 'Float'
			},
			SPInt: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPInt`,
				dataType: 'Float'
			},
			SPSclMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPSclMin`,
				dataType: 'Float'
			},
			SPSclMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPSclMax`,
				dataType: 'Float'
			},
			SPUnit: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPUnit`,
				dataType: 'Int16'
			},
			SPIntMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPIntMin`,
				dataType: 'Float'
			},
			SPIntMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPIntMax`,
				dataType: 'Float'
			},
			SPManMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPManMin`,
				dataType: 'Float'
			},
			SPManMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SPManMax`,
				dataType: 'Float'
			},
			SP: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.SP`,
				dataType: 'Float'
			},
			MVMan: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MVMan`,
				dataType: 'Float'
			},
			MV: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MV`,
				dataType: 'Float'
			},
			MVSclMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MVSclMin`,
				dataType: 'Float'
			},
			MVSclMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MVSclMax`,
				dataType: 'Float'
			},
			MVUnit: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MVUnit`,
				dataType: 'Int16'
			},
			MVMin: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MVMin`,
				dataType: 'Float'
			},
			MVMax: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.MVMax`,
				dataType: 'Float'
			},
			P: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.P`,
				dataType: 'Float'
			},
			Ti: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Ti`,
				dataType: 'Float'
			},
			Td: {
				namespaceIndex: `${namespace}`,
				nodeId: `${objectBrowseName}.Td`,
				dataType: 'Float'
			}
		}
	);
}

export class PIDCtrlMockup {

	public readonly name: string;
	public wqc: WQCDAMockup;
	public osLevel: OSLevelDAMockup;
	public opMode: OpModeDAMockup;
	public sourceMode: SourceModeDAMockup;
	public pv= 0;
	public pvSclMin= 0;
	public pvSclMax= 0;
	public pvUnit= 0;

	public spMan= 0;
	public spInt= 0;
	public spSclMin= 0;
	public spSclMax= 0;
	public spUnit= 0;
	public spIntMin= 0;
	public spIntMax= 0;
	public spManMin= 0;
	public spManMax= 0;
	public sp= 0;

	public mvMan= 0;
	public mv= 0;
	public mvSclMin= 0;
	public mvSclMax= 0;
	public mvUnit= 0;
	public mvMin= 0;
	public mvMax= 0;

	public p= 0;
	public ti= 0;
	public td= 0;
	
	protected mockupNode: UAObject;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		this.name = variableName;

		this.mockupNode = namespace.addObject({
			organizedBy: rootNode,
			browseName: variableName
		});

		this.osLevel = new OSLevelDAMockup(namespace, this.mockupNode, this.name);
		this.wqc = new WQCDAMockup(namespace, this.mockupNode, this.name);
		this.opMode = new OpModeDAMockup(namespace, this.mockupNode, this.name);
		this.sourceMode = new SourceModeDAMockup(namespace, this.mockupNode, this.name);

		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.PV`,
			browseName: `${variableName}.PV`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.pv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.PVSclMin`,
			browseName: `${variableName}.PVSclMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.pvSclMin});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.PVSclMax`,
			browseName: `${variableName}.PVSclMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.pvSclMax});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.PVUnit`,
			browseName: `${variableName}.PVUnit`,
			dataType: DataType.UInt32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.pvUnit});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPMan`,
			browseName: `${variableName}.SPMan`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.spMan});
				},
				set: (variant: Variant): StatusCodes => {
					this.spMan = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPInt`,
			browseName: `${variableName}.SPInt`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.spInt});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPSclMin`,
			browseName: `${variableName}.SPSclMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.spSclMin});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPSclMax`,
			browseName: `${variableName}.SPSclMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.spSclMax});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPUnit`,
			browseName: `${variableName}.SPUnit`,
			dataType: DataType.UInt32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.spUnit});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPIntMin`,
			browseName: `${variableName}.SPIntMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.spIntMin});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPIntMax`,
			browseName: `${variableName}.SPIntMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.spIntMax});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPManMin`,
			browseName: `${variableName}.SPManMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.spManMin});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SPManMax`,
			browseName: `${variableName}.SPManMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.spManMax});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.SP`,
			browseName: `${variableName}.SP`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.sp});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MVMan`,
			browseName: `${variableName}.MVMan`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.mvMan});
				},
				set: (variant: Variant) => {
					this.mvMan = parseFloat(variant.value);
					return StatusCodes.Good;
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MV`,
			browseName: `${variableName}.MV`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.mv});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MVMin`,
			browseName: `${variableName}.MVMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.mvMin});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MVMax`,
			browseName: `${variableName}.MVMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.mvMax});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MVUnit`,
			browseName: `${variableName}.MVUnit`,
			dataType: DataType.UInt32,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.UInt32, value: this.mvUnit});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MVSclMin`,
			browseName: `${variableName}.MVSclMin`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.mvSclMin});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.MVSclMax`,
			browseName: `${variableName}.MVSclMax`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.mvSclMax});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.P`,
			browseName: `${variableName}.P`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.p});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.Ti`,
			browseName: `${variableName}.Ti`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.ti});
				},
			},
		});
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace};s=${variableName}.Td`,
			browseName: `${variableName}.Td`,
			dataType: DataType.Double,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.td});
				},
			},
		});
	}

	public getPIDCtrlMockupJSON() {
		return getPIDCtrlMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name || 'UnqualifiedName');
	}
}
