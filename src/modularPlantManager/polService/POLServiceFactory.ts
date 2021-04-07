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

import {PEA} from '../pea';
import {
	AggregatedService,
	AggregatedServiceOptions,
	FunctionGenerator,
	PidController,
	POLService,
	Storage, Timer
} from './';

export interface POLServiceOptions {
	name: string;
	type: string;
}

export class POLServiceFactory {
	public static create(options: POLServiceOptions, peaSet?: PEA[], polServices?: POLService[]): POLService {
		if (options.type === Timer.type) {
			return new Timer(options.name);
		} else if (options.type === Storage.type) {
			return new Storage(options.name);
		} else if (options.type === FunctionGenerator.type) {
			return new FunctionGenerator(options.name);
		} else if (options.type === PidController.type) {
			return new PidController(options.name);
		} else if (options.type === AggregatedService.type) {
			if (!peaSet || !polServices) {
				throw new Error('Args missing to generate Aggregated Service.');
			}
			return new AggregatedService(options as AggregatedServiceOptions, peaSet, polServices);
		} else {
			throw new Error('Unknown pol service type ${options.type}');
		}
	}
}
