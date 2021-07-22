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

import {BaseServiceInterface} from '@p2olab/polaris-interface';
import {Service, ServiceRelation} from '../index';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';

export interface ServiceSetInterface {
	uuid: string;
	name: string;
	description: string;
	services: Service[];
	serviceRelations: ServiceRelation[];
}

/**
 * Events emitted by [[ServiceSet]]
 */
export interface ServiceSetEvents {
	/**
	 * Notify when a [[Service] is added
	 * @event BaseServiceInterface
	 */
	serviceAdded: BaseServiceInterface;
	/**
	 * Notify when a [[Service] is removed
	 * @event BaseServiceInterface
	 */
	serviceRemoved: BaseServiceInterface;
}

type ServiceSetEmitter = StrictEventEmitter<EventEmitter, ServiceSetEvents>;

export abstract class ServiceSet {
	public readonly eventEmitter: ServiceSetEmitter;
	public readonly services: Service[] = [];
	public readonly serviceRelations: ServiceRelation[] = [];
	// name of the ServiceSet
	protected _name = '';

	protected constructor() {
		this.eventEmitter = new EventEmitter();
	}

	public get qualifiedName(): string {
		return `${this._name}`;
	}

	public get allServices(): Service[] {
		return this.services;
	}

	public addService(): void {
		// TODO: add logic
	}

	public removeService(): void {
		// TODO: add logic
	}

	public abstract json(): ServiceSetInterface;

}
