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

import {Recipe} from './recipe/Recipe';
import {catManager} from '../config/logging';
import {EventEmitter} from 'events';
import {Module, ModuleOptions} from './core/Module';
import {Service} from './core/Service';
import {ManagerInterface, RecipeOptions, ServiceCommand} from '@p2olab/polaris-interface';
import {Player} from './recipe/Player';
import {ServiceState} from './core/enum';
import {ServiceLogEntry, VariableLogEntry} from '../logging/archive';
import StrictEventEmitter from 'strict-event-emitter-types';

interface ManagerEvents {
    /**
     * when one service goes to *completed*
     * @event
     */
    recipeFinished: void;

    notify: (string, any) => void;
}

type ManagerEmitter = StrictEventEmitter<EventEmitter, ManagerEvents>;

export class Manager extends (EventEmitter as { new(): ManagerEmitter }) {

    // loaded recipes
    readonly recipes: Recipe[] = [];

    // loaded modules
    readonly modules: Module[] = [];

    readonly player: Player;

    variableArchive: VariableLogEntry[] = [];

    serviceArchive: ServiceLogEntry[] = [];

    // autoreset determines if a service is automatically reset when
    private _autoreset: boolean = true;
    // autoreset timeout in milliseconds
    private _autoreset_timeout = 500;

    constructor() {
        super();
        this.player = new Player()
            .on('started', () => {
                this.emit('notify', 'player', this.player.json())
            })
            .on('recipeStarted', () => {
                this.emit('notify', 'player', this.player.json())
            })
            .on('stepFinished', () => {
                this.emit('notify', 'player', this.player.json())
            })
            .on('recipeFinished', () => {
                this.emit('recipeFinished');
                this.emit('notify', 'player', this.player.json())
            })
            .on('completed', () => {
                this.emit('notify', 'player', this.player.json())
            });
    }

    get autoreset(): boolean {
        return this._autoreset;
    }

    set autoreset(value: boolean) {
        catManager.info(`Set AutoReset to ${value}`);
        this._autoreset = value;
    }

    /**
     * Load modules from JSON according to TopologyGenerator output or to simplified JSON
     * Skip module if already a module with same id is registered
     * @param options           options for creating modules
     * @param {boolean} protectedModules  should modules be protected from being deleted
     * @returns {Module[]}  created modules
     */
    public loadModule(options: {
        module?: ModuleOptions,
        modules?: ModuleOptions[],
        subplants?: { modules: ModuleOptions[] }[]
    }, protectedModules: boolean = false): Module[] {
        let newModules: Module[] = [];
        if (!options) {
            throw new Error('No modules defined in supplied options');
        }
        if (options.subplants) {
            options.subplants.forEach((subplantOptions) => {
                subplantOptions.modules.forEach((moduleOptions: ModuleOptions) => {
                    if (this.modules.find(module => module.id === moduleOptions.id)) {
                        catManager.warn(`Module ${moduleOptions.id} already in registered modules`);
                    } else {
                        newModules.push(new Module(moduleOptions, protectedModules));
                    }
                });
            });
        } else if (options.modules) {
            options.modules.forEach((moduleOptions: ModuleOptions) => {
                if (this.modules.find(module => module.id === moduleOptions.id)) {
                    catManager.warn(`Module ${moduleOptions.id} already in registered modules`);
                } else {
                    newModules.push(new Module(moduleOptions, protectedModules));
                }
            });
        } else if (options.module) {
            let moduleOptions = options.module;
            if (this.modules.find(module => module.id === moduleOptions.id)) {
                catManager.warn(`Module ${moduleOptions.id} already in registered modules`);
            } else {
                newModules.push(new Module(moduleOptions, protectedModules));
            }
        } else {
            throw new Error('No modules defined in supplied options');
        }
        this.modules.push(...newModules);
        newModules.forEach(async (module: Module) => {
            module
                .on('connected', () => this.emit('notify', 'module', null))
                .on('disconnected', () => this.emit('notify', 'module', null))
                .on('controlEnable', ({service, controlEnable}) => {
                    this.emit('notify', 'module', {
                        module: service.parent.id,
                        service: service.name,
                        controlEnable: controlEnable
                    });
                })
                .on('variableChanged', async (data) => {
                    const logEntry: VariableLogEntry = {
                        timestampPfe: data.timestampPfe,
                        timestampModule: data.timestampModule,
                        module: module.id,
                        value: data.value,
                        variable: data.variable,
                        unit: data.unit
                    };
                    this.variableArchive.push(logEntry);
                    if (this.player.currentRecipeRun) {
                        this.player.currentRecipeRun.variableLog.push(logEntry);
                    }
                    this.emit('notify', 'variable', logEntry);
                })
                .on('parameterChanged', (data) => {
                    data['module'] = module.id;
                    this.emit('notify', 'module', data);
                })
                .on('commandExecuted', (data) => {
                    const logEntry: ServiceLogEntry = {
                        timestampPfe: data.timestampPfe,
                        module: module.id,
                        service: data.service.name,
                        strategy: data.strategy.name,
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
                .on('stateChanged', async ({service, state, timestampPfe}) => {
                    const logEntry: ServiceLogEntry = {
                        timestampPfe: new Date(),
                        module: module.id,
                        service: service.name,
                        state: ServiceState[state]
                    };
                    this.serviceArchive.push(logEntry);
                    if (this.player.currentRecipeRun) {
                        this.player.currentRecipeRun.serviceLog.push(logEntry);
                    }
                    this.emit('notify', 'module', {
                        module: module.id,
                        service: service.name,
                        status: ServiceState[state],
                        lastChange: 0
                    });
                })
                .on('opModeChanged', async ({service, opMode}) => {
                    this.emit('notify', 'module', {
                        module: module.id,
                        service: service.name,
                        opMode: opMode
                    });
                })
                .on('serviceCompleted', (service: Service) => {
                    this.performAutoReset(service);
                });
        });
        this.emit('notify', 'module', null);
        return newModules;
    }


    public async removeModule(moduleId) {
        const module = this.modules.find(module => module.id === moduleId);
        if (!module) {
            throw new Error(`No Module ${moduleId} found.`);
        }
        if (module.protected) {
            throw new Error(`Module ${moduleId} is protected and can't be deleted`);
        }
        const index = this.modules.indexOf(module, 0);
        if (index > -1) {
            this.modules.splice(index, 1);
        }
        await module.disconnect();
    }

    public loadRecipe(options: RecipeOptions, protectedRecipe: boolean = false): Recipe {
        const newRecipe = new Recipe(options, this.modules, protectedRecipe);
        this.recipes.push(newRecipe);
        this.emit('notify', 'recipes', null);
        return newRecipe;
    }

    /**
     * Abort all services from all loaded modules
     */
    abortAllServices() {
        const tasks = [];
        tasks.push(this.modules.map((module) => module.abort()));
        return Promise.all(tasks);
    }

    /**
     * Stop all services from all loaded modules
     */
    stopAllServices() {
        const tasks = [];
        tasks.push(this.modules.map((module) => module.stop()));
        return Promise.all(tasks);
    }

    /**
     * Reset all services from all loaded modules
     */
    resetAllServices() {
        const tasks = [];
        tasks.push(this.modules.map((module) => module.reset()));
        return Promise.all(tasks);
    }

    /**
     * get ManagerInterfacie as JSON
     *
     * @returns {ManagerInterface}
     */
    json(): ManagerInterface {
        return {
            activeRecipe: this.player.getCurrentRecipe() ? this.player.getCurrentRecipe().json() : undefined,
            modules: this.modules.map(module => module.id),
            autoReset: this.autoreset
        };
    }

    /**
     * Perform autoreset for service (bring it automatically from completed to idle)
     * @param {Service} service
     */
    private performAutoReset(service: Service) {
        if (this.autoreset) {
            catManager.info(`Service ${service.parent.id}.${service.name} completed. Short waiting time (${this._autoreset_timeout}) to autoreset`);
            setTimeout(async () => {
                if (service.parent.isConnected() && await service.getServiceState() === ServiceState.COMPLETED) {
                    catManager.info(`Service ${service.parent.id}.${service.name} completed. Now perform autoreset`);
                    try {
                        service.execute(ServiceCommand.reset);
                    } catch (err) {
                        catManager.debug('Autoreset not possible')
                    }
                }
            }, this._autoreset_timeout);
        }
    }

    public removeRecipe(recipeId: string) {
        catManager.debug(`Remove recipe ${recipeId}`);
        const recipe = this.recipes.find(recipe => recipe.id === recipeId);
        if (!recipe) {
            throw new Error(`Recipe ${recipeId} not available.`);
        }
        if (recipe.protected) {
            throw new Error(`Recipe ${recipeId} can not be deleted since it is protected.`);
        } else {
            const index = this.recipes.indexOf(recipe, 0);
            if (index > -1) {
                this.recipes.splice(index, 1);
            }
        }
    }

    /**
     * find [TestServerService] of a [Module] registered in manager
     * @param {string} moduleName
     * @param {string} serviceName
     * @returns {Service}
     */
    getService(moduleName: string, serviceName: string): Service {
        const module: Module = this.modules.find(module => module.id === moduleName);
        if (!module) {
            throw new Error(`Module with id ${moduleName} not registered`);
        }
        const service: Service = module.services.find(service => service.name === serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} does not exist on module ${moduleName}`);
        }
        return service;
    }
}
