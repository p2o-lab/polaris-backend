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
	BackendNotification, PEAInterface, PEAOptions, POLServiceInterface, POLServiceOptions,
	RecipeOptions,
	ServiceCommand, VariableChange
} from '@p2olab/polaris-interface';
import {Backbone, PEAPool, PEAPoolVendor} from '@p2olab/pimad-core';
import {catManager, ServiceLogEntry} from '../logging';
import {ParameterChange, PEA, Service} from './pea';
import {ServiceState} from './pea/dataAssembly';
import {POLService, POLServiceFactory} from './polService';
import {Player, Recipe} from './recipe';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import PiMAdResponse = Backbone.PiMAdResponse;

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
	public readonly peas: PEA[] = [];
	// instantiated POL services
	public readonly polServices: POLService[] = [];
	public readonly player: Player;
	public variableArchive: VariableChange[] = [];
	public serviceArchive: ServiceLogEntry[] = [];
	// autoreset timeout in milliseconds
	private _autoresetTimeout = 500;
	// PiMAd-core
	public peaPool: PEAPool;

	constructor() {
		super();
		this.peaPool = new PEAPoolVendor().buyDependencyPEAPool();
		this.peaPool.initializeMTPFreeze202001Importer();

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

	public getPEA(peaId: string): PEA {
		const pea = this.peas.find((p) => p.id === peaId);
		if (pea) {
			return pea;
		} else {
			throw Error(`PEA with id ${peaId} not found`);
		}
	}
	public getAllPEAsFromPimadPool(callback: (response: PiMAdResponse) => void){
		this.peaPool.getAllPEAs((response: PiMAdResponse, peas) => {
			if (response.getMessage() === 'Success!')
			callback(response);
		});
	}
	public addPEAToPimadPool(filePath: { source: string}, callback: (response: PiMAdResponse) => void) {
		this.peaPool.addPEA(filePath, (response: PiMAdResponse) => {
				callback(response);
			});
	}
	/**
	 * Load PEAs from JSON according to TopologyGenerator output or to simplified JSON
	 * Skip PEA if already a PEA with same ID is registered
	 * @param options           options for PEA creation
	 * @param {boolean} protectedPEAs  should PEAs be protected from being deleted
	 * @returns {PEA[]}  created PEAs
	 */
	public load(options: LoadOptions, protectedPEAs = false): PEA[] {
		const newPEAs: PEA[] = [];
		if (!options) {
			throw new Error('No PEAs defined in supplied options');
		}
		if (options.subMP) {
			options.subMP.forEach((subMPOptions) => {
				subMPOptions.peas.forEach((peaOptions: PEAOptions) => {
					if (this.peas.find((p) => p.id === peaOptions.id)) {
						catManager.warn(`PEA ${peaOptions.id} already in registered PEAs`);
						throw new Error(`PEA ${peaOptions.id} already in registered PEAs`);
					} else {
						newPEAs.push(new PEA(peaOptions, protectedPEAs));
					}
				});
			});
		} else if (options.peas) {
			options.peas.forEach((peaOptions: PEAOptions) => {
				if (this.peas.find((p) => p.id === peaOptions.id)) {
					catManager.warn(`PEA ${peaOptions.id} already in registered PEAs`);
					throw new Error(`PEA ${peaOptions.id} already in registered PEAs`);
				} else {
					newPEAs.push(new PEA(peaOptions, protectedPEAs));
				}
			});
		} else if (options.pea) {
			const peaOptions = options.pea;
			if (this.peas.find((p) => p.id === peaOptions.id)) {
				catManager.warn(`PEA ${peaOptions.id} already in registered PEAs`);
				throw new Error(`PEA ${peaOptions.id} already in registered PEAs`);
			} else {
				newPEAs.push(new PEA(peaOptions, protectedPEAs));
			}
		} else {
			throw new Error('No PEAs defined in supplied options');
		}
		this.peas.push(...newPEAs);
		newPEAs.forEach((p: PEA) => {
			p
				.on('connected', () => {
					this.emit('notify', {message: 'pea', pea: p.json()});
				})
				.on('disconnected', () => {
					catManager.info('PEA disconnected');
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
		});
		return newPEAs;
	}

	public async removePEA(peaID: string): Promise<void> {
		catManager.info(`Remove PEA ${peaID}`);
		const pea = this.getPEA(peaID);
		if (pea.protected) {
			throw new Error(`PEA ${peaID} is protected and can't be deleted`);
		}

		catManager.debug(`Disconnecting pea ${peaID} ...`);
		await pea.disconnect()
			.catch((err) => catManager.warn('Something wrong while disconnecting from PEA: ' + err.toString()));

		catManager.debug(`Deleting pea ${peaID} ...`);
		const index = this.peas.indexOf(pea, 0);
		if (index > -1) {
			this.peas.splice(index, 1);
		}
	}

	public getPEAs(): PEAInterface[] {
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
	 * find [Service] of a [PEA] registered in manager
	 * @param {string} peaName
	 * @param {string} serviceName
	 * @returns {Service}
	 */
	public getService(peaName: string, serviceName: string): Service {
		const pea: PEA | undefined = this.peas.find((p) => p.id === peaName);
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
