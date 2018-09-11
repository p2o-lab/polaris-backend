/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import {Recipe} from "./Recipe";
import {catRM} from "../config/logging";
import {EventEmitter} from "events";
import {Module, ModuleOptions} from "./Module";
import {Service} from "./Service";
import {ManagerInterface, RecipeOptions} from "pfe-ree-interface";
import {Player} from "./Player";

export class Manager {

    // loaded activeRecipe
    activeRecipe: Recipe;
    recipes: Recipe[] = [];

    // loaded modules
    modules: Module[] = [];

    queue: Recipe;

    player: Player = new Player();

    automaticMode: boolean = false;

    // autoreset determines if a service is automatically reset when
    private _autoreset: boolean = true;

    // general event emitter
    eventEmitter: EventEmitter = new EventEmitter();

    constructor() {
        this.eventEmitter.on('serviceCompleted', (service: Service) => {
            catRM.debug(`Service ${service.name} completed (autoreset: ${this._autoreset})`);
            if (this._autoreset) {
                service.reset();
            }
        });
    }

    get autoreset(): boolean {
        return this._autoreset;
    }

    set autoreset(value: boolean) {
        catRM.info(`Set AutoReset to ${value}`);
        this._autoreset = value;
    }

    /**
     * Load modules from JSON according to TopologyGenerator output or to simplified JSON
     * Skip module if already a module with same id is registered
     * @param options
     * @returns {Module[]}
     */
    public loadModule(options): Module[] {
        let newModules: Module[] = [];
        if (options.subplants) {
            options.subplants.forEach((subplantOptions) => {
                subplantOptions.modules.forEach((moduleOptions: ModuleOptions) => {
                    if (this.modules.find(module => module.id === moduleOptions.id)) {
                        catRM.warn(`Module ${moduleOptions.id} already in registered modules`);
                    } else {
                        newModules.push(new Module(moduleOptions));
                    }
                });
            });
        } else if (options.modules) {
            options.modules.forEach((moduleOptions) => {
                if (this.modules.find(module => module.id === moduleOptions.id)) {
                    catRM.warn(`Module ${moduleOptions.id} already in registered modules`);
                } else {
                    newModules.push(new Module(moduleOptions));
                }
            });
        } else {
            throw new Error('No modules defined in supplied options');
        }
        this.modules.push(...newModules);
        return newModules;
    }

    public loadRecipe(options: RecipeOptions): Recipe {
        const newRecipe = new Recipe(options, this.modules);
        this.recipes.push(newRecipe);
        manager.eventEmitter.emit('refresh', 'recipes');
        return newRecipe;
    }


    /**
     * Abort all services from modules used in activeRecipe
     * @returns {Promise}
     */
    abortAllServices() {
        let tasks = Array.from(this.activeRecipe.modules).map((module) => {
            return module.services.map((service) => {
                return service.abort();
            })
        });
        return Promise.all(tasks);
    }

    /**
     * Abort all services from all loaded modules
     * @returns {Promise}
     */
    abortAllModules() {
        let tasks = this.modules.map(module =>
            module.services.map(service =>
                service.abort()
            )
        );
        return Promise.all(tasks);
    }

    async json(): Promise<ManagerInterface> {
        let recipe = await this.player.getCurrentRecipe().json();
        return {
            activeRecipe: recipe,
            modules: this.modules.map(module => module.id),
            autoReset: this.autoreset
        };
    }

}

export const manager: Manager = new Manager();
