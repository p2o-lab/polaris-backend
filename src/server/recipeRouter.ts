import * as express from 'express';
import {recipe_manager} from '../model/RecipeManager';
import {catServer} from '../config/logging';

export const recipeRouter = express.Router();

/**
 * @api {get} /recipe    Get recipe
 * @apiName GetRecipe
 * @apiGroup Recipe
 */
recipeRouter.get('', async (req: express.Request, res: express.Response) => {
    catServer.info('GET /recipe');
    res.json({
        recipe_status: recipe_manager.recipe.recipe_status,
        service_states: await recipe_manager.getServiceStates()
    });
});

/**
 * @api {get} /recipe/options    Get recipe options
 * @apiName GetRecipeOptions
 * @apiGroup Recipe
 */
recipeRouter.get('/options', (req: express.Request, res: express.Response) => {
    catServer.info('GET /recipe/options');
    res.json(recipe_manager.recipe_options);
});

/**
 * @api {post} /recipe    Post recipe
 * @apiName PostRecipe
 * @apiGroup Recipe
 * @apiParam {Object} recipe  new recipe
 */
recipeRouter.post('', async (req: express.Request, res: express.Response) => {
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
recipeRouter.post('/start', (req: express.Request, res: express.Response) => {
    catServer.info('POST /recipe/start');
    recipe_manager.start();
    res.send('recipe successful started');
});
