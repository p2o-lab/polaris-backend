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

import {BackendNotification, PEAInterface, PEAOptions, POLServiceInterface, POLServiceOptions, RecipeOptions, ServiceCommand, VariableChange,} from '@p2olab/polaris-interface';
import {catManager, ServiceLogEntry} from '../logging';
import {ParameterChange, PEAController, Service} from './pea';
import {ServiceState} from './pea/dataAssembly';
import {POLService, POLServiceFactory} from './polService';
import {Player, Recipe} from './recipe';
import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {PEAProvider} from '../peaProvider/PEAProvider';

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

	public readonly peaProvider = new PEAProvider();
	// loaded recipes
	public readonly recipes: Recipe[] = [];
	// instantiated PEAs
	public readonly peas: PEAController[] = [];
	
	// instantiated POL services
	public readonly polServices: POLService[] = [];
	
	public readonly player: Player;
	public variableArchive: VariableChange[] = [];
	public serviceArchive: ServiceLogEntry[] = [];

	// autoReset determines if a service is automatically reset
	private _autoReset = true;
	private _autoResetTimeout = 500; //milliseconds

	constructor() {
		super();

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


	get autoReset(): boolean {
		return this._autoReset;
	}


	set autoReset(value: boolean) {
		catManager.info(`Set AutoReset to ${value}`);
		this._autoReset = value;
	}


	/**
	 * get PEAController by given identifier
	 * @param identifier
	 * @returns {PEAController}
	 */
	public getPEAController(identifier: string): PEAController {
		const pea = this.peas.find((p) => p.id === identifier);
		if (!pea) {
			throw Error(`PEA with id ${identifier} not found`);
		}
		return pea;
	}


	/**
	 * Load PEAControllers by given identifier
	 * @param {string} identifier
	 */
	public async loadPEAController(identifier: string): Promise<PEAController[]>{
		const newPEAs: PEAController[] = [];
		const peaOptions: PEAOptions = await this.peaProvider.getPEAControllerOptionsByPEAIdentifier(identifier);

		newPEAs.push(new PEAController(peaOptions));
		this.peas.push(...newPEAs);
		this.setPEAEventListeners(newPEAs);

		return newPEAs;
	}

	/**
	 * Remove PEAController by given identifier
	 * @param identifier
	 */
	public async removePEAController(identifier: string): Promise<void> {
		catManager.info(`Remove PEA ${identifier}`);
		const pea = this.getPEAController(identifier);

		if (pea.isProtected()) {
			throw new Error(`PEA ${identifier} can not be deleted since it is protected.`);
		}

		catManager.debug(`Disconnecting pea ${identifier} ...`);
		await pea.disconnectAndUnsubscribe()
			.catch((err) => catManager.warn('Something wrong while disconnecting from PEAController: ' + err.toString()));

		catManager.debug(`Deleting pea ${identifier} ...`);
		const index = this.peas.indexOf(pea, 0);
		if (pea) this.peas.splice(index, 1);
	}

	/**
	 * get all PEAController as json
	 * @returns {PEAInterface[]}
	 */
	public getAllPEAControllers(): PEAInterface[] {
		return this.peas.map((pea) => pea.json());
	}

	/**
	 * get all POLServices as json
	 * @returns {POLServiceInterface[]}
	 */
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
	 * Abort all services of all PEAs
	 */
	public abortAllServices(): Promise<Promise<void[]>[][]> {
		const tasks = [];
		tasks.push(this.peas.map((peaController) => peaController.abortAllServices()));
		return Promise.all(tasks);
	}

	/**
	 * Stop all services of all PEAs
	 */
	public stopAllServices(): Promise<Promise<void[]>[][]> {
		const tasks = [];
		tasks.push(this.peas.map((peaController) => peaController.stopAllServices()));
		return Promise.all(tasks);
	}

	/**
	 * Reset all services of all PEAs
	 */
	public resetAllServices(): Promise<Promise<void[]>[][]> {
		const tasks = [];
		tasks.push(this.peas.map((peaController) => peaController.resetAllServices()));
		return Promise.all(tasks);
	}

	public removeRecipe(identifier: string): void {
		catManager.debug(`Remove recipe ${identifier}`);
		const recipe = this.recipes.find((r) => r.id === identifier);
		if (!recipe) {
			throw new Error(`Recipe ${identifier} not found.`);
		}
		if (recipe.protected) {
			throw new Error(`Recipe ${identifier} can not be deleted since it is protected.`);
		} else {
			const index = this.recipes.indexOf(recipe, 0);
			if (index > -1) {
				this.recipes.splice(index, 1);
			}
		}
	}

	/**
	 * find [Service] of a [PEAController]
	 * @param identifier
	 * @param {string} serviceName
	 * @returns {Service}
	 */
	public getService(identifier: string, serviceName: string): Service {
		const pea: PEAController = this.getPEAController(identifier);
		return pea.getService(serviceName);
	}

	public addPOLService(options: POLServiceOptions): void {
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
		if (this.autoReset) {
			catManager.info(`Service ${service.connection.id}.${service.name} completed. ` +
				`Short waiting time (${this._autoResetTimeout}) to AutoReset`);
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
			}, this._autoResetTimeout);
		}
	}

	/**
	 * set all event listeners for new PEAControllers
	 * @param newPEAs - new PEAControllers
	 * @private
	 */
	private setPEAEventListeners(newPEAs: PEAController[]): void {
		newPEAs.forEach((p: PEAController) => {
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
		});
	}
}
