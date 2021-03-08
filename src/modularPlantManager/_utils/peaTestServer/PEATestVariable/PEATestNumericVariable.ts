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

import {PEATestVariable} from './PEATestVariable';

// eslint-disable-next-line no-undef
import Timeout = NodeJS.Timeout;
import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';

export class PEATestNumericVariable extends PEATestVariable {

	public v: number;
	public vext: number;
	public sclMin: number;
	public sclMax: number;
	public unit: number;
	protected interval: Timeout | undefined;

	constructor(namespace: Namespace, rootNode: UAObject, variableName: string, initialValue = 20,
				initialUnit?: number, initialMin?: number, initialMax?: number) {
		super(namespace, rootNode, variableName);

		this.v = initialValue;
		this.vext = initialValue;
		this.sclMin = initialMin || initialValue - Math.random() * 100;
		this.sclMax = initialMax || initialValue + Math.random() * 100;
		this.unit = initialUnit || Math.floor((Math.random() * 100) + 1000);

		namespace.addVariable({
			componentOf: this.variableNode,
			nodeId: `ns=1;s=${variableName}.V`,
			browseName: `${variableName}.V`,
			dataType: 'Double',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.v});
				}
			}
		});

		namespace.addVariable({
			componentOf: this.variableNode,
			nodeId: `ns=1;s=${variableName}.VUnit`,
			browseName: `${variableName}.VUnit`,
			dataType: 'Double',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.unit});
				}
			}
		});

		namespace.addVariable({
			componentOf: this.variableNode,
			nodeId: `ns=1;s=${variableName}.VSclMin`,
			browseName: `${variableName}.VSclMin`,
			dataType: 'Double',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.sclMin});
				}
			}
		});

		namespace.addVariable({
			componentOf: this.variableNode,
			nodeId: `ns=1;s=${variableName}.VSclMax`,
			browseName: `${variableName}.VSclMax`,
			dataType: 'Double',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.sclMax});
				}
			}
		});

		namespace.addVariable({
			componentOf: this.variableNode,
			nodeId: `ns=1;s=${variableName}.VExt`,
			browseName: `${variableName}.VExt`,
			dataType: 'Double',
			value: {
				get: (): Variant => {
					return new Variant({dataType: DataType.Double, value: this.vext});
				},
				set: (variant: Variant): StatusCodes => {
					this.vext = parseFloat(variant.value);
					setTimeout(() => {
						this.v = this.vext;
					}, 500);
					return StatusCodes.Good;
				}

			}
		});
	}

	public startRandomOscillation(): void {
		let time = 0;
		const f1 = Math.random();
		const f2 = Math.random();
		const amplitude = this.sclMax - this.sclMin;
		const average = (this.sclMax + this.sclMin) / 2;
		this.interval = global.setInterval(() => {
			time = time + 0.5;
			this.v = average + 0.5 * amplitude * Math.sin(0.01 * (1 + f1) * time + Math.PI * f2);
		}, 500);
	}

	public stopRandomOscillation(): void {
		if (this.interval) {
			global.clearInterval(this.interval);
		}
	}
}
