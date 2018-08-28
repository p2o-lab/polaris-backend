import {manager} from '../../model/Manager';
import {catServer} from '../../config/logging';
import {moduleRouter} from "./moduleRouter";
import {Request, Response, Router} from "express";
import * as asyncHandler from 'express-async-handler';

export const recipeRouter: Router = Router();


/**
 * @api {get} /recipe    Get recipe list
 * @apiName GetRecipeList
 * @apiGroup Recipe
 */
recipeRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result = manager.recipes.map((recipe) => {
        return {id: recipe.id, options: recipe.options};
    });
    res.json(result);
}));


/**
 * @api {get} /recipe/:recipeId    Get recipe
 * @apiName GetRecipe
 * @apiGroup Recipe
 * @apiParam recipeId
 */
recipeRouter.get('/:recipeId', asyncHandler(async (req: Request, res: Response) => {
    const result = await manager.recipes.find(recipe => recipe.id === req.params.recipeId).json();
    res.json(result);
}));

/**
 * @api {delete} /recipe/:recipeId    Delete recipe
 * @apiName DeleteRecipe
 * @apiGroup Recipe
 * @apiParam recipeId
 */
recipeRouter.delete('/:recipeId', asyncHandler(async (req: Request, res: Response) => {
    const recipe = await manager.recipes.find(recipe => recipe.id === req.params.recipeId);
    const index = manager.recipes.indexOf(recipe, 0);
    if (index > -1) {
        manager.recipes.splice(index, 1);
    }
    manager.eventEmitter.emit('refresh', 'recipes');
    res.send({status: 'Successful deleted', id: req.params.id});
}));


/**
 * @api {put} /recipe    Load recipe
 * @apiName PutRecipe
 * @apiGroup Recipe
 * @apiParam {Object} recipe  new recipe
 */
recipeRouter.put('', asyncHandler(async (req: Request, res: Response) => {
    catServer.debug(`PUT /recipe. ${JSON.stringify(req.body)}`);
    manager.loadRecipe(req.body);
    res.json({status: 'recipe successful loaded'});
}));

/**
 * @api {post} /recipe/:recipeId/active    Activate recipe
 * @apiName PutRecipe
 * @apiGroup Recipe
 * @apiParam {string} recipeId  id of recipe to be activated
 */
recipeRouter.post('/:recipeId/active', asyncHandler(async (req: Request, res: Response) => {
    manager.activateRecipe(req.params.recipeId);
    res.json({status: `recipe ${req.params.recipeId} successfully activated`});
}));

/**
 * @api {post} /recipe/start    Start recipe
 * @apiName StartRecipe
 * @apiGroup Recipe
 */
recipeRouter.post('/start', asyncHandler(async (req: Request, res: Response) => {
    await manager.start();
    res.json({status: 'activeRecipe successful started'});
}));


/**
 * @api {post} /activeRecipe/reset    Reset activeRecipe
 * @apiName ResetRecipe
 * @apiGroup Recipe
 */
recipeRouter.post('/reset', asyncHandler((req: Request, res: Response) => {
    manager.reset();
    res.json({status: 'activeRecipe successful reset'});
}));


/**
 * @api {post} /activeRecipe/abort    Abort all services
 * @apiName AbortServices
 * @apiDescription Abort all services from modules used in activeRecipe
 * @apiGroup Recipe
 */
moduleRouter.post('/abort', asyncHandler(async (req: Request, res: Response) => {
    res.json(await manager.abortRecipe());
}));
