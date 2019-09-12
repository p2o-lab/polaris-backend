/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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

import {Module} from '../core/Module';
import {
    AggregatedService, AggregatedServiceOptions
} from './AggregatedService';
import {FunctionGenerator} from './FunctionGenerator';
import {PidController} from './PidController';
import {Storage} from './Storage';
import {Timer} from './Timer';
import {VirtualService} from './VirtualService';

export interface VirtualServiceOptions {
    name: string;
    type: string;
}

export class VirtualServiceFactory {
 public static create(options: VirtualServiceOptions, modules?: Module[]): VirtualService {
     if (options.type === Timer.type) {
         return new Timer(options.name);
     } else  if (options.type === Storage.type) {
         return new Storage(options.name);
     } else if (options.type === FunctionGenerator.type) {
         return new FunctionGenerator(options.name);
     } else if (options.type === PidController.type) {
         return new PidController(options.name);
     } else if (options.type === AggregatedService.type) {
         return new AggregatedService(options as AggregatedServiceOptions, modules);
     } else {
         throw new Error(`Unknown virtual service type ${options.type}`);
     }
 }
}
