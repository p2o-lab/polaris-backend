import {recipe_manager} from '../model/RecipeManager';
import {catServer} from '../config/logging';
import {moduleRouter} from "./moduleRouter";
import {Request, Response, Router} from "express";
import * as asyncHandler from 'express-async-handler';

export const recipeRouter: Router = Router();

/**
 * @api {get} /recipe    Get recipe
 * @apiName GetRecipe
 * @apiGroup Recipe
 */
recipeRouter.get('', asyncHandler(async (req: Request, res: Response) => {
    catServer.info('GET /recipe');
    const result = await recipe_manager.json();
    res.json(result);
}));

/**
 * @api {get} /recipe/options    Get recipe options
 * @apiName GetRecipeOptions
 * @apiDescription Get JSON which has ben ued to instantiate the current recipe
 * @apiGroup Recipe
 */
recipeRouter.get('/options', asyncHandler((req: Request, res: Response) => {
    catServer.info('GET /recipe/options');
    res.json(recipe_manager.recipe_options);
}));

/**
 * @api {post} /recipe    Load recipe
 * @apiName PostRecipe
 * @apiGroup Recipe
 * @apiParam {Object} recipe  new recipe
 */
recipeRouter.post('', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`POST /recipe. ${req.body.recipe}`);
    recipe_manager.loadRecipe(req.body.recipe);
    await recipe_manager.connect();
    res.send('recipe successful loaded');
}));

/**
 * @api {post} /recipe/start    Start recipe
 * @apiName StartRecipe
 * @apiGroup Recipe
 */
recipeRouter.post('/start', asyncHandler((req: Request, res: Response) => {
    catServer.info('POST /recipe/start');
    recipe_manager.start();
    res.send('recipe successful started');
}));


/**
 * @api {post} /recipe/reset    Reset recipe
 * @apiName ResetRecipe
 * @apiGroup Recipe
 */
recipeRouter.post('/reset', asyncHandler((req: Request, res: Response) => {
    recipe_manager.reset();
    res.send('recipe successful resetted');
}));

/**
 * @api {post} /recipe/abort    Abort all services
 * @apiName AbortServices
 * @apiDescription Abort all services from modules used in recipe
 * @apiGroup Recipe
 */
moduleRouter.post('/abort', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`POST /recipe/abort`);
    res.json(await recipe_manager.abortRecipe());
}));
