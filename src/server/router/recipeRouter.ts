import {recipe_manager} from '../../model/RecipeManager';
import {catServer} from '../../config/logging';
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
    const result = await recipe_manager.json();
    res.json(result);
}));


/**
 * @api {post} /recipe    Load recipe
 * @apiName PostRecipe
 * @apiGroup Recipe
 * @apiParam {Object} recipe  new recipe
 */
recipeRouter.post('', asyncHandler(async (req: Request, res: Response) => {
    catServer.debug(`POST /recipe. ${JSON.stringify(req.body)}`);
    recipe_manager.loadRecipe(req.body);
    recipe_manager.connect();
    res.json({status: 'recipe successful loaded'});
}));

/**
 * @api {post} /recipe/start    Start recipe
 * @apiName StartRecipe
 * @apiGroup Recipe
 */
recipeRouter.post('/start', asyncHandler(async (req: Request, res: Response) => {
    await recipe_manager.connect();
    recipe_manager.start();
    res.json({status: 'recipe successful started'});
}));


/**
 * @api {post} /recipe/reset    Reset recipe
 * @apiName ResetRecipe
 * @apiGroup Recipe
 */
recipeRouter.post('/reset', asyncHandler((req: Request, res: Response) => {
    recipe_manager.reset();
    res.json({status: 'recipe successful resetted'});
}));

/**
 * @api {post} /recipe/abort    Abort all services
 * @apiName AbortServices
 * @apiDescription Abort all services from modules used in recipe
 * @apiGroup Recipe
 */
moduleRouter.post('/abort', asyncHandler(async (req: Request, res: Response) => {
    res.json(await recipe_manager.abortRecipe());
}));
