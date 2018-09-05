import {Recipe} from "./Recipe";
import {catRM} from "../config/logging";
import {EventEmitter} from "events";
import {PlayerInterface, RecipeState, Repeat} from "pfe-ree-interface";

export class Player {
    public repeat: Repeat = Repeat.none;
    private eventEmitter: EventEmitter = new EventEmitter();

    constructor() {
        this.eventEmitter.on('recipe_finished', () => {
            if (this._status === RecipeState.running) {
                if (this._currentItem < this._playlist.length - 1) {
                    this._currentItem = this._currentItem + 1;
                    catRM.info(`Go to next recipe (${this.currentItem + 1}/${this.playlist.length})`);
                    this.runCurrentRecipe().then(() => catRM.info("recipe started"));
                } else {
                    this._status = RecipeState.completed;
                }
            }
        })
    }

    private _playlist: Recipe[] = [];

    get playlist(): Recipe[] {
        return this._playlist;
    }

    private _currentItem: number = undefined;

    get currentItem(): number {
        return this._currentItem;
    }

    private _status: RecipeState = RecipeState.stopped;

    get status() {
        return this._status;
    }

    /**
     * Add recipe to playlist
     * @param {Recipe} recipe
     */
    public enqueue(recipe: Recipe) {
        this._playlist.push(recipe);
        if (this.currentItem === undefined) {
            this._currentItem = 0;
        }
    }

    public getCurrentRecipe(): Recipe {
        return this._playlist[this._currentItem];
    }

    /**
     * Remove recipe from playlist
     * @param {number} index in playlist
     */
    public remove(index: number) {
        catRM.info(`Delete recipe ${index} from playlist`);
        this._playlist.splice(index, 1);
    }

    public async json(): Promise<PlayerInterface> {
        const pl = this._playlist.map(recipe => recipe.json());
        return {
            playlist: await Promise.all(pl),
            currentItem: this._currentItem,
            repeat: this.repeat,
            status: this.status
        }
    }

    public async start() {
        if (this.status === RecipeState.idle || this.status === RecipeState.stopped) {
            this._status = RecipeState.running;
            this.runCurrentRecipe().then();
        } else {
            throw new Error('Player currently already running');
        }
    }

    public reset() {
        if (this.getCurrentRecipe().status === RecipeState.completed || this.getCurrentRecipe().status === RecipeState.stopped) {
            this._currentItem = 0;
            this._status = RecipeState.idle;
        }
    }

    /**
     * Pause all modules used in current recipe
     * TODO: pause only those which should be currently in runing due to the recipe
     */
    public pause() {
        this._status = RecipeState.paused;
        this.getCurrentRecipe().modules.forEach((module) => {
            module.pause();
        });
    }

    public resume() {
        this._status = RecipeState.stopped;
        this.getCurrentRecipe().modules.forEach((module) => {
            module.resume();
        });
    }

    public stop() {
        this._status = RecipeState.stopped;
        this.getCurrentRecipe().modules.forEach((module) => {
            module.stop();
        });
    }

    private async runCurrentRecipe() {
        const events = await this.getCurrentRecipe().start();
        events.on('recipe_finished', (data) => {
            this.eventEmitter.emit('recipe_finished', data);
        });
    }
}