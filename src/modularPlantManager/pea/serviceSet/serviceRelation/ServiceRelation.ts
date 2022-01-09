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

export interface ServiceRelationInterface {
	id?: string;
	description?: string;
	sourceServiceID: string;
	sourceProcedureID: string;
	sourceValue: string;
	targetServiceID: string;
	targetProcedureID: string;
	type: ServiceRelationType;
}

export interface ServiceRelationOptions {
	id?: string;
	name?: string;
	sourceServiceID: string;
	sourceProcedureID: string;
	sourceValue: string;
	targetServiceID: string;
	targetProcedureID: string;
}

export enum ServiceRelationType {
	Enable,
	Disable,
	Synchronisation,
	Force
}

export abstract class ServiceRelation {
	public readonly sourceServiceID: string;
	public readonly sourceProcedureID: string;
	public readonly targetServiceID: string;
	public readonly targetProcedureID: string;
	public readonly sourceValue: string;
	public readonly serviceRelations: ServiceRelation[] = [];

	// type of the ServiceRelation
	protected _type!: ServiceRelationType;
	protected _parentID: string;
	protected _id: string;

	protected constructor(serviceRelationOptions: ServiceRelationOptions, parentID: string) {
		// TODO: Define generic Object reference --> {name, id, type, description}
		this.sourceServiceID = serviceRelationOptions.sourceServiceID;
		this.sourceProcedureID = serviceRelationOptions.sourceProcedureID;
		this.targetServiceID = serviceRelationOptions.targetServiceID;
		this.targetProcedureID = serviceRelationOptions.targetServiceID;
		this.sourceValue = serviceRelationOptions.sourceValue;
		this._parentID = parentID;
		this._id = serviceRelationOptions.id || 'No id given';
	}

	public getSourceServiceID(): string {
		return this.sourceServiceID;
	}

	public getSourceProcedureID(): string {
		return this.sourceProcedureID;
	}

	public getTargetServiceID(): string {
		return this.targetServiceID;
	}

	public getSourceValue(): string {
		return this.sourceValue;
	}

	public getTargetProcedureID(): string {
		return this.targetProcedureID;
	}

	public getType(): ServiceRelationType {
		return this._type;
	}

	public json(): ServiceRelationInterface {
		return {
			id: this._id,
			sourceServiceID: this.sourceServiceID,
			sourceProcedureID: this.sourceProcedureID,
			sourceValue: this.sourceValue,
			targetServiceID: this.targetServiceID,
			targetProcedureID: this.targetProcedureID,
			type: this._type
		};
	}
}
