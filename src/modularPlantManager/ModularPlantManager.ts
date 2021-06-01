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

import {
	BackendNotification,
	BaseDataAssemblyOptions,
	DataAssemblyOptions, OpcUaNodeOptions,
	PEAInterface,
	POLServiceInterface,
	POLServiceOptions,
	PEAOptions,
	RecipeOptions,
	ServiceCommand,
	VariableChange, ServerSettingsOptions, ServiceOptions
} from '@p2olab/polaris-interface';
import {
	Backbone,
	CommunicationInterfaceData,
	logger,
	ModuleAutomation,
	PEAPool,
	PEAPoolVendor, ServiceModel
} from '@p2olab/pimad-core';
import {catManager, catOpcUA, ServiceLogEntry} from '../logging';
import {ParameterChange, PEAController, Service} from './pea';
import {ServiceState} from './pea/dataAssembly';
import {POLService, POLServiceFactory} from './polService';
import {Player, Recipe} from './recipe';
import {PEAModel} from '@p2olab/pimad-core/dist/ModuleAutomation';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import PiMAdResponse = Backbone.PiMAdResponse;
import DataAssembly = ModuleAutomation.DataAssembly;
import {OPCUANodeCommunication} from '@p2olab/pimad-core/dist/ModuleAutomation/CommunicationInterfaceData';
import { v4 as uuidv4 } from 'uuid';
import {ServiceControlOptions} from '@p2olab/polaris-interface/dist/core/dataAssembly';
import {ProcedureOptions} from '@p2olab/polaris-interface/dist/service/options';


interface ModularPlantManagerEvents {
	/**
	 * when one service goes to *completed*
	 * @event recipeFinished
	 */
	recipeFinished: void;

	notify: BackendNotification;
}

type ModularPlantManagerEmitter = StrictEventEmitter<EventEmitter, ModularPlantManagerEvents>;

export interface LoadOptions {
	pea?: PEAOptions;
	peas?: PEAOptions[];
	subMP?: Array<{ peas: PEAOptions[] }>;
}

export class ModularPlantManager extends (EventEmitter as new() => ModularPlantManagerEmitter) {

	// loaded recipes
	public readonly recipes: Recipe[] = [];
	// loaded PEAs
	public readonly peas: PEAController[] = [];
	// instantiated POL services
	public readonly polServices: POLService[] = [];
	public readonly player: Player;
	public variableArchive: VariableChange[] = [];
	public serviceArchive: ServiceLogEntry[] = [];
	// autoreset timeout in milliseconds
	private _autoresetTimeout = 500;
	// PiMAd-core
	public peaControllerPool: PEAPool;

	// these are helper variables to keep the functions small
	private dataAssemblyOptionsArray: DataAssemblyOptions[];
	//WIP
	private serviceOptions: any;

	constructor() {
		super();
		this.peaControllerPool = new PEAPoolVendor().buyDependencyPEAPool();
		this.peaControllerPool.initializeMTPFreeze202001Importer();

		this.dataAssemblyOptionsArray=[];
		this.serviceOptions= {name:'', communication:{TagName: {} as OpcUaNodeOptions, TagDescription: {} as OpcUaNodeOptions}, procedures: []};

		this.player = new Player()
			.on('started', () => {
				this.emit('notify', {message: 'player', player: this.player.json()});
			})
			.on('recipeChanged', () => {
				this.emit('notify', {message: 'player', player: this.player.json()});
			})
			.on('recipeFinished', () => {
				this.emit('notify', {message: 'player', player: this.player.json()});
			})
			.on('completed', () => {
				this.emit('notify', {message: 'player', player: this.player.json()});
			});
	}

	// autoreset determines if a service is automatically reset when
	private _autoreset = true;

	get autoreset(): boolean {
		return this._autoreset;
	}

	set autoreset(value: boolean) {
		catManager.info(`Set AutoReset to ${value}`);
		this._autoreset = value;
	}

	private generateUniqueIdentifier(): string {
		// ...the extinction of all life on earth will occur long before you have a collision (with uuid) (stackoverflow.com)
		const identifier = uuidv4();
		return identifier;
	}

	public getPEAController(peaId: string): PEAController {
		const pea = this.peas.find((p) => p.id === peaId);
		if (pea) {
			return pea;
		} else {
			throw Error(`PEA with id ${peaId} not found`);
		}
	}
	/**
	 * Delete PEAController from Pimad-Pool by given Pimad-Identifier
	 * @param peaId	Pimad-Identifier
	 * @param callback Response from PiMad...
	 */
	public getPEAFromPimadPool(peaId: string, callback: (response: PiMAdResponse) => void) {
		this.peaControllerPool.getPEA(peaId,(response: PiMAdResponse) => {
			callback(response);
		});
	}

	/**
	 * Delete PEAController from Pimad-Pool by given Pimad-Identifier
	 * @param peaId	Pimad-Identifier
	 * @param callback Response from PiMad...
	 */
	public deletePEAFromPimadPool(peaId: string, callback: (response: PiMAdResponse) => void) {
		this.peaControllerPool.deletePEA(peaId,(response: PiMAdResponse) => {
				callback(response);
		});
	}

	/**
	 * Get All PEAs from PiMAd-Pool
	 * @param callback - contains a list of PEAs
	 */
	public getAllPEAsFromPimadPool(callback: (response: PiMAdResponse) => void){
		this.peaControllerPool.getAllPEAs((response: PiMAdResponse) => {
			callback(response);
		});
	}

	/**
	 * add PEAController to PiMaD-Pool by given filepath
	 * @param filePath - filepath of the uploaded file in /uploads
	 * @param callback - contains Success or Failure Message
	 */

	public addPEAToPimadPool(filePath: { source: string}, callback: (response: PiMAdResponse) => void) {
		this.peaControllerPool.addPEA(filePath, (response: PiMAdResponse) => {
				callback(response);
			});
	}

	public updateServerSettings(options: ServerSettingsOptions){
		const pea = this.getPEAController(options.id);
		pea.setConnection(options);
		//console.log(pea.connection);
	}
	/**
	 * Load PEAs from JSON according to TopologyGenerator output or to simplified JSON
	 * Skip PEAController if already a PEAController with same ID is registered
	 * @param options           options for PEAController creation
	 * @param {boolean} protectedPEAs  should PEAs be protected from being deleted
	 * @returns
	 */
	public loadPEAController(pimadIdentifier: string, protectedPEAs = false) {
		const newPEAs: PEAController[] = [];
		if (!pimadIdentifier) {
			throw new Error('No PEAs defined in supplied options');
		}

		/*if (options.subMP) {
			options.subMP.forEach((subMPOptions) => {
				subMPOptions.peas.forEach((peaOptions: PEAOptions) => {
					if (this.peas.find((p) => p.id === peaOptions.pea.getPiMAdIdentifier())) {
						catManager.warn(`PEAController ${peaOptions.pea.getPiMAdIdentifier()} already in registered PEAs`);
						throw new Error(`PEAController ${peaOptions.pea.getPiMAdIdentifier()} already in registered PEAs`);
					} else {
						newPEAs.push(new PEAController(peaOptions, protectedPEAs));
					}
				});
			});
		} else if (options.peas) {
			options.peas.forEach((peaOptions: PEAOptions) => {
				if (this.peas.find((p) => p.id === peaOptions.pea.getPiMAdIdentifier())) {
					catManager.warn(`PEAController ${peaOptions.pea.getPiMAdIdentifier()} already in registered PEAs`);
					throw new Error(`PEAController ${peaOptions.pea.getPiMAdIdentifier()} already in registered PEAs`);
				} else {
					newPEAs.push(new PEAController(peaOptions, protectedPEAs));
				}
			});*/
		else {
			// TODO: als separate Funktion auslagern
			this.getPEAFromPimadPool(pimadIdentifier, response => {
				if(response.getMessage()==='Success!'){
					//get PEAModel
					const peaModel: PEAModel = response.getContent() as PEAModel;
					//get DataAssemblyModels from  PEAModel/PiMAd
					const dataAssemblyModels: DataAssembly[] = (peaModel.getAllDataAssemblies().getContent() as {data: DataAssembly[]}).data;
					// this is the Array we will fill up later on
					const ServiceModels: ServiceModel[] = (peaModel.getAllServices().getContent() as {data: ServiceModel[]}).data;
					console.log(ServiceModels);

					// TODO: do we have to wait till this function finished?
					this.createDataAssemblyOptionsArray(dataAssemblyModels);
					this.createServiceOptionsArray(ServiceModels);

					// create PEAOptions
					const peaOptions: PEAOptions = {
						name: peaModel.getName(),
						id: this.generateUniqueIdentifier(),
						pimadIdentifier: pimadIdentifier,
						services: [],
						username: '',
						password: '',
						hmiUrl: '',
						opcuaServerUrl: '',
						dataAssemblies: this.dataAssemblyOptionsArray
					};

					//console.log(dataAssemblyOptionsArray);
					newPEAs.push(new PEAController(peaOptions, protectedPEAs));
				}

			});

			//const peaOptions = options.pea;
			/*if (this.peas.find((p) => p.id === peaOptions.pea.getPiMAdIdentifier())) {
				catManager.warn(`PEAController ${peaOptions.pea.getPiMAdIdentifier()} already in registered PEAs`);
				throw new Error(`PEAController ${peaOptions.pea.getPiMAdIdentifier()} already in registered PEAs`);
			} else {
				newPEAs.push(new PEAController(peaOptions, protectedPEAs));
			}*/
		}
		this.peas.push(...newPEAs);
		/*newPEAs.forEach((p: PEAController) => {
			p
				.on('connected', () => {
					this.emit('notify', {message: 'pea', pea: p.json()});
				})
				.on('disconnected', () => {
					catManager.info('PEAController disconnected');
					this.emit('notify', {message: 'pea', pea: p.json()});
				})
				.on('controlEnable', ({service}) => {
					this.emit('notify', {message: 'service', peaId: p.id, service: service.json()});
				})
				.on('variableChanged', (variableChange: VariableChange) => {
					this.variableArchive.push(variableChange);
					if (this.player.currentRecipeRun) {
						this.player.currentRecipeRun.variableLog.push(variableChange);
					}
					this.emit('notify', {message: 'variable', variable: variableChange});
				})
				.on('parameterChanged', (parameterChange: ParameterChange) => {
					this.emit('notify', {
						message: 'service',
						peaId: p.id,
						service: parameterChange.service.json()
					});
				})
				.on('commandExecuted', (data) => {
					const logEntry: ServiceLogEntry = {
						timestampPOL: new Date(),
						pea: p.id,
						service: data.service.name,
						procedure: data.procedure.name,
						command: ServiceCommand[data.command],
						parameter: data.parameter ? data.parameter.map((param) => {
							return {name: param.name, value: param.value};
						}) : undefined
					};
					this.serviceArchive.push(logEntry);
					if (this.player.currentRecipeRun) {
						this.player.currentRecipeRun.serviceLog.push(logEntry);
					}
				})
				.on('stateChanged', ({service, state}) => {
					const logEntry: ServiceLogEntry = {
						timestampPOL: new Date(),
						pea: p.id,
						service: service.name,
						state: ServiceState[state]
					};
					this.serviceArchive.push(logEntry);
					if (this.player.currentRecipeRun) {
						this.player.currentRecipeRun.serviceLog.push(logEntry);
					}
					this.emit('notify', {message: 'service', peaId: p.id, service: service.json()});
				})
				.on('opModeChanged', ({service}) => {
					this.emit('notify', {message: 'service', peaId: p.id, service: service.json()});
				})
				.on('serviceCompleted', (service: Service) => {
					this.performAutoReset(service);
				});
			this.emit('notify', {message: 'pea', pea: p.json()});
		});*/
	}

	private createServiceOptionsArray(serviceModels: ServiceModel[]){
		serviceModels.map(serviceModel =>{
			const baseDataAssemblyOptions:
				{
					[k: string]: any;
					TagName: OpcUaNodeOptions;
					TagDescription: OpcUaNodeOptions;
				} =
				{
					TagName: {} as OpcUaNodeOptions,
					TagDescription: {} as OpcUaNodeOptions
				};

			let procedureOptionsArray: ProcedureOptions[] = [], serviceName: string | undefined ='';

			serviceModel.getName(((response, name) => serviceName = name));

			serviceModel.getAllProcedures((response, mProcedures) =>
				mProcedures.map(procedure => {
					const baseDataAssemblyOptionsProcedure:
						{
							[k: string]: any;
							TagName: OpcUaNodeOptions;
							TagDescription: OpcUaNodeOptions;
						} =
						{
							TagName: {} as OpcUaNodeOptions,
							TagDescription: {} as OpcUaNodeOptions
						};

					let procedureOptions: ProcedureOptions;
					let id='', procedureName: string | undefined ='';
					let isDefault = false, isSelfCompleting = false;
					procedure.getName((response1, name1) => procedureName = name1);
					procedure.getAllAttributes((response1, attributes) => {
						attributes.forEach(attribute => {
							const name: string = (attribute.getName().getContent() as{data: string}).data;
							const value = (attribute.getValue().getContent() as{data: string}).data;
							switch(name){
								case('IsSelfCompleting'):
									isSelfCompleting = Boolean(JSON.parse(value));
									break;
								case('IsDefault'):
									isDefault = Boolean(JSON.parse(value));
									break;
								case('ProcedureID'):
									id = value;
							}
						});
					});
					procedure.getDataAssembly((response1, dataAssembly) =>
						dataAssembly.getAllDataItems((response2, dataItems) =>
							dataItems.map(dataItem => {
								let namespaceIndex ='', nodeId='', dataType='', value: undefined | string;
								// get value from PiMAd (only for TagName and TagDescription)
								// get dataType from PiMAd
								dataItem.getDataType((response, mDataType)=>
									dataType= mDataType);
								// get cIData from PiMAd
								dataItem.getCommunicationInterfaceData((response2, cIData) => {
									// check if dataItem has an cIData
									if(cIData){
										// get NodeId object from PiMAd
										(cIData as OPCUANodeCommunication).getNodeId((response, nodeID) => {
											// get NodeId from PiMAd and assign it to variable
											nodeID.getNodeIdIdentifier((response, identifier) =>
												nodeId = identifier);
											// get namespaceIndex from PiMAd and assign it to variable
											nodeID.getNamespaceIndex((response, mNamespace) =>{
												namespaceIndex='urn:DESKTOP-6QLO5BB:NodeOPCUA-Server';
												//namespaceIndex = mNamespace as unknown as string;
											});
										});
									}else {
										// it's a static DataItem
										// TODO: currently only string supported?
										dataItem.getValue((response, mValue) => value = mValue);
										//namespaceIndex='urn:DESKTOP-6QLO5BB:NodeOPCUA-Server';
									}
								});
								const opcUaNodeOptions: OpcUaNodeOptions = {
									nodeId: nodeId,
									namespaceIndex: namespaceIndex,
									dataType: dataType,
									value: value
								};
								// get Name of DataItem from PiMAd
								dataItem.getName((response2, name) =>
								{
									baseDataAssemblyOptionsProcedure[name as string] = opcUaNodeOptions;
								});
							})
						)
					);
/*					procedureOptions = {
						id: id,
						name: procedureName,
						isSelfCompleting: isSelfCompleting,
						isDefault: isDefault,
					};*/
				})
			);

			serviceModel.getDataAssembly((response, dataAssembly) =>
				dataAssembly.getAllDataItems((response1, dataItems) =>
					dataItems.map(dataItem => {
						let namespaceIndex ='', nodeId='', dataType='', value: undefined | string;
						// get value from PiMAd (only for TagName and TagDescription)
						// get dataType from PiMAd
						dataItem.getDataType((response, mDataType)=>
							dataType= mDataType);
						// get cIData from PiMAd
						dataItem.getCommunicationInterfaceData((response2, cIData) => {
							// check if dataItem has an cIData
							if(cIData){
								// get NodeId object from PiMAd
								(cIData as OPCUANodeCommunication).getNodeId((response, nodeID) => {
									// get NodeId from PiMAd and assign it to variable
									nodeID.getNodeIdIdentifier((response, identifier) =>
										nodeId = identifier);
									// get namespaceIndex from PiMAd and assign it to variable
									nodeID.getNamespaceIndex((response, mNamespace) =>{
										namespaceIndex='urn:DESKTOP-6QLO5BB:NodeOPCUA-Server';
										//namespaceIndex = mNamespace as unknown as string;
									});
								});
							}else {
								// it's a static DataItem
								// TODO: currently only string supported?
								dataItem.getValue((response, mValue) => value = mValue);
								//namespaceIndex='urn:DESKTOP-6QLO5BB:NodeOPCUA-Server';
							}
						});
						const opcUaNodeOptions: OpcUaNodeOptions = {
							nodeId: nodeId,
							namespaceIndex: namespaceIndex,
							dataType: dataType,
							value: value
						};
						// get Name of DataItem from PiMAd
						dataItem.getName((response2, name) =>
						{
							baseDataAssemblyOptions[name as string] = opcUaNodeOptions;
						});
					}) ));

			this.serviceOptions = {
				name: serviceName,
				communication: baseDataAssemblyOptions,
				procedures: procedureOptionsArray,
			};
		});
	}

	/**
	 * TODO: This function is still to big
	 * @param dataAssemblyModels
	 * @private
	 */
	private createDataAssemblyOptionsArray(dataAssemblyModels: DataAssembly[]){
		//TODO: parse endpoint
		// iterate through every dataAssemblyModel and create DataAssemblyOptions with BaseDataAssemblyOptions
		dataAssemblyModels.map( dataAssembly => {
			// Initializing baseDataAssemblyOptions, which will be filled during an iteration below
			const baseDataAssemblyOptions:
				{
					[k: string]: any;
					TagName: OpcUaNodeOptions;
					TagDescription: OpcUaNodeOptions;
				} =
				{
					TagName: {} as OpcUaNodeOptions,
					TagDescription: {} as OpcUaNodeOptions
				};

			// Initializing dataAssemblyName, dataAssemblyInterfaceClass
			let dataAssemblyName ='', dataAssemblyInterfaceClass='';

			// get dataAssemblyName from PEAModel
			dataAssembly.getName(((response,name)=>{
				// assign dataAssemblyName
				dataAssemblyName = name;
			}));

			//get metamodelref from PEAModel/Pimad
			dataAssembly.getMetaModelRef(((response,metaModelRef)=>{
				// assign InterfaceClass/MetaModelRef
				dataAssemblyInterfaceClass = metaModelRef;
			}));

			dataAssembly.getAllDataItems(((response1, dataItems) =>
					dataItems.map(dataItem=>{
						// Initializing variables, which will be assigned later
						let namespaceIndex ='', nodeId='', dataType='', value: undefined | string;
						// get value from PiMAd (only for TagName and TagDescription)
						// get dataType from PiMAd
						dataItem.getDataType((response, mDataType)=>
							dataType= mDataType);
						// get cIData from PiMAd
						dataItem.getCommunicationInterfaceData((response2, cIData) => {
							// check if dataItem has an cIData
							if(cIData){
								// get NodeId object from PiMAd
								(cIData as OPCUANodeCommunication).getNodeId((response, nodeID) => {
									// get NodeId from PiMAd and assign it to variable
									nodeID.getNodeIdIdentifier((response, identifier) =>
										nodeId = identifier);
									// get namespaceIndex from PiMAd and assign it to variable
									nodeID.getNamespaceIndex((response, mNamespace) =>{
										namespaceIndex='urn:DESKTOP-6QLO5BB:NodeOPCUA-Server';
										//namespaceIndex = mNamespace as unknown as string;
									});
								});
							}else {
								// it's a static DataItem
								// TODO: currently only string supported?
								dataItem.getValue((response, mValue) => value = mValue);
								//namespaceIndex='urn:DESKTOP-6QLO5BB:NodeOPCUA-Server';
							}
						});

						const opcUaNodeOptions: OpcUaNodeOptions = {
							nodeId: nodeId,
							namespaceIndex: namespaceIndex,
							dataType: dataType,
							value: value
						};
						// get Name of DataItem from PiMAd
						dataItem.getName((response2, name) =>
						{
							baseDataAssemblyOptions[name as string] = opcUaNodeOptions;
						});
					})
			));

			// create dataAssemblyOptions with information collected above
			const dataAssemblyOptions: DataAssemblyOptions = {
				name: dataAssemblyName,
				metaModelRef: dataAssemblyInterfaceClass,
				dataItems: baseDataAssemblyOptions
			};

			this.dataAssemblyOptionsArray.push(dataAssemblyOptions);
		});
	}

	public async removePEAController(peaID: string): Promise<void> {
		catManager.info(`Remove PEA ${peaID}`);
		const pea = this.getPEAController(peaID);

		if (pea.protected) {
			throw new Error(`PEA ${peaID} is protected and can't be deleted`);
		}

		catManager.debug(`Disconnecting pea ${peaID} ...`);
		await pea.disconnect()
			.catch((err) => catManager.warn('Something wrong while disconnecting from PEAController: ' + err.toString()));

		catManager.debug(`Deleting pea ${peaID} ...`);
		const index = this.peas.indexOf(pea, 0);
		if (index > -1) {
			this.peas.splice(index, 1);
		}
	}

	public getAllPEAControllers(): PEAInterface[] {
		return this.peas.map((pea) => pea.json());
	}

	public getPOLServices(): POLServiceInterface[] {
		return this.polServices.map((ps) => ps.json());
	}

	public loadRecipe(options: RecipeOptions, protectedRecipe = false): Recipe {
		const newRecipe = new Recipe(options, this.peas, protectedRecipe);
		this.recipes.push(newRecipe);
		this.emit('notify', {message: 'recipes', recipes: this.recipes.map((r) => r.json())});
		return newRecipe;
	}

	/**
	 * Abort all services from all loaded PEAs
	 */
	public abortAllServices(): Promise<Promise<void[]>[][]> {
		const tasks = [];
		tasks.push(this.peas.map((p) => p.abort()));
		return Promise.all(tasks);
	}

	/**
	 * Stop all services from all loaded PEAs
	 */
	public stopAllServices(): Promise<Promise<void[]>[][]> {
		const tasks = [];
		tasks.push(this.peas.map((p) => p.stop()));
		return Promise.all(tasks);
	}

	/**
	 * Reset all services from all loaded PEAs
	 */
	public resetAllServices(): Promise<Promise<void[]>[][]> {
		const tasks = [];
		tasks.push(this.peas.map((p) => p.reset()));
		return Promise.all(tasks);
	}

	public removeRecipe(recipeID: string): void {
		catManager.debug(`Remove recipe ${recipeID}`);
		const recipe = this.recipes.find((r) => r.id === recipeID);
		if (!recipe) {
			throw new Error(`Recipe ${recipeID} not available.`);
		}
		if (recipe.protected) {
			throw new Error(`Recipe ${recipeID} can not be deleted since it is protected.`);
		} else {
			const index = this.recipes.indexOf(recipe, 0);
			if (index > -1) {
				this.recipes.splice(index, 1);
			}
		}
	}

	/**
	 * find [Service] of a [PEAController] registered in manager
	 * @param {string} peaName
	 * @param {string} serviceName
	 * @returns {Service}
	 */
	public getService(peaName: string, serviceName: string): Service {
		const pea: PEAController | undefined = this.peas.find((p) => p.id === peaName);
		if (!pea) {
			throw new Error(`PEA with ID ${peaName} not registered`);
		}
		return pea.getService(serviceName);
	}

	public instantiatePOLService(options: POLServiceOptions): void {
		const polService = POLServiceFactory.create(options, this.peas);
		catManager.info(`instantiated POLService ${polService.name}`);
		polService.eventEmitter
			.on('controlEnable', () => {
				this.emit('notify', {message: 'polService', polService: polService.json()});
			})
			.on('parameterChanged', () => {
				this.emit('notify', {message: 'polService', polService: polService.json()});
			})
			.on('commandExecuted', (data) => {
				const logEntry: ServiceLogEntry = {
					timestampPOL: new Date(),
					pea: 'polServices',
					service: polService.name,
					procedure: undefined,
					command: ServiceCommand[data.command],
					parameter: data.parameter ? data.parameter.map((param) => {
						return {name: param.name, value: param.value};
					}) : undefined
				};
				this.serviceArchive.push(logEntry);
				if (this.player.currentRecipeRun) {
					this.player.currentRecipeRun.serviceLog.push(logEntry);
				}
			})
			.on('state', (state) => {
				const logEntry: ServiceLogEntry = {
					timestampPOL: new Date(),
					pea: 'polServices',
					service: polService.name,
					state: ServiceState[state]
				};
				this.serviceArchive.push(logEntry);
				if (this.player.currentRecipeRun) {
					this.player.currentRecipeRun.serviceLog.push(logEntry);
				}
				this.emit('notify', {message: 'polService', polService: polService.json()});
			});
		this.emit('notify', {message: 'polService', polService: polService.json()});
		this.polServices.push(polService);
	}

	public removePOLService(polServiceID: string): void {
		catManager.debug(`Remove POLService ${polServiceID}`);
		const index = this.polServices.findIndex((ps) => ps.name === polServiceID);
		if (index === -1) {
			throw new Error(`POLService ${polServiceID} not available.`);
		}
		if (index > -1) {
			this.polServices.splice(index, 1);
		}
	}

	/**
	 * Perform AutoReset for service (bring it automatically from completed to idle)
	 * @param {Service} service
	 */
	private performAutoReset(service: Service): void {
		if (this.autoreset) {
			catManager.info(`Service ${service.connection.id}.${service.name} completed. ` +
				`Short waiting time (${this._autoresetTimeout}) to AutoReset`);
			setTimeout(async () => {
				if (service.connection.isConnected() && service.state === ServiceState.COMPLETED) {
					catManager.info(`Service ${service.connection.id}.${service.name} completed. ` +
						'Now perform AutoReset');
					try {
						await service.executeCommand(ServiceCommand.reset);
					} catch (err) {
						catManager.debug('AutoReset not possible');
					}
				}
			}, this._autoresetTimeout);
		}
	}
}
