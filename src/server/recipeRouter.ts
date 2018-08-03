import {recipe_manager} from '../model/RecipeManager';
import {catServer} from '../config/logging';
import {RecipeState} from "../model/enum";
import {moduleRouter} from "./moduleRouter";
import {Request, Response, Router} from "express";

export const recipeRouter: Router = Router();

/**
 * @api {get} /recipe    Get recipe
 * @apiName GetRecipe
 * @apiGroup Recipe
 */
recipeRouter.get('', async (req: Request, res: Response) => {
    catServer.info('GET /recipe');
    res.json({
        recipe_status: RecipeState[recipe_manager.recipe.recipe_status],
        service_states: await recipe_manager.getServiceStates(),
        current_step: recipe_manager.recipe.current_step
    });
});

/**
 * @api {get} /recipe/options    Get recipe options
 * @apiName GetRecipeOptions
 * @apiGroup Recipe
 */
recipeRouter.get('/options', (req: Request, res: Response) => {
    catServer.info('GET /recipe/options');
    res.json(recipe_manager.recipe_options);
});

/**
 * @api {post} /recipe    Load recipe
 * @apiName PostRecipe
 * @apiGroup Recipe
 * @apiParam {Object} recipe  new recipe
 */
recipeRouter.post('', async (req: Request, res: Response) => {
    catServer.info(`POST /recipe. ${req.body.recipe}`);
    recipe_manager.loadRecipe(req.body.recipe);
    await recipe_manager.connect();
    res.send('recipe successful loaded');
});

/**
 * @api {post} /recipe/start    Start recipe
 * @apiName StartRecipe
 * @apiGroup Recipe
 */
recipeRouter.post('/start', (req: Request, res: Response) => {
    catServer.info('POST /recipe/start');
    recipe_manager.start();
    res.send('recipe successful started');
});

/**
 * @api {post} /recipe/abort    Abort all services from modules used in recipe
 * @apiName AbortServices
 * @apiGroup Recipe
 */
moduleRouter.post('/abort', async (req: Request, res: Response) => {
    catServer.info(`POST /recipe/abort`);
    res.json(await recipe_manager.abortRecipe());
});
