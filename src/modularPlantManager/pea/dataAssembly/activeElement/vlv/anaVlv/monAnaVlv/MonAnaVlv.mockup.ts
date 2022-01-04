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
import {
	FeedbackMonitoringMockup,
	getFeedbackMonitoringMockupReferenceJSON
} from '../../../../_extensions/feedbackMonitoring/FeedbackMonitoring.mockup';
import {AnaVlvMockup, getAnaVlvMockupReferenceJSON} from '../AnaVlv.mockup';


export function getMonAnaVlvMockupReferenceJSON(
	namespace: number,
	objectBrowseName: string): object {

	return ({
			...getAnaVlvMockupReferenceJSON(namespace, objectBrowseName),
			...getFeedbackMonitoringMockupReferenceJSON(namespace,objectBrowseName),
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

export class MonAnaVlvMockup extends AnaVlvMockup {

	public feedbackMonitoring: FeedbackMonitoringMockup;

	public posReachedFbk = false;
	public posTolerance = 0.0;
	public monPosTi = 0.0;
	public monPosErr = false;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

		super(namespace, rootNode, variableName);

		this.feedbackMonitoring= new FeedbackMonitoringMockup(namespace,this.mockupNode,this.name);
		
		namespace.addVariable({
			componentOf: this.mockupNode,
			nodeId: `ns=${namespace.index};s=${variableName}.PosReachedFbk`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.PosTolerance`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.MonPosTi`,
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
			nodeId: `ns=${namespace.index};s=${variableName}.MonPosErr`,
			browseName: `${variableName}.MonPosErr`,
			dataType: DataType.Boolean,
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Boolean, value: this.monPosErr});
				},
			},
		});
	}

	public getMonAnaVlvMockupJSON(): object {
		return getMonAnaVlvMockupReferenceJSON(
			this.mockupNode.namespaceIndex,
			this.mockupNode.browseName.name as string);
	}
}
