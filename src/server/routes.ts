import * as express from 'express';
import {recipe_manager} from '../model/RecipeManager';
import {catServer} from "../config/logging";

export default class Routes {
    static init(server): void {

        server.app.use('/doc', express.static('apidoc'));

        /**
         * @api {get} /status    Get status
         * @apiName GetStatus
         * @apiGroup Manager
         */
        server.app.get('/status', async (req: express.Request, res: express.Response) => {
            catServer.info("GET /status");
            res.json({
                recipe_status: recipe_manager.recipe.recipe_status,
                service_states: await recipe_manager.getState()
            });
        });

        /**
         * @api {get} /recipe    Get current recipe
         * @apiName GetRecipe
         * @apiGroup Recipe
         */
        server.app.get('/recipe', (req: express.Request, res: express.Response) => {
            catServer.info('GET /recipe');
            res.json(recipe_manager.recipe_options);
        });

        /**
         * @api {post} /recipe    Post recipe
         * @apiName PostRecipe
         * @apiGroup Recipe
         * @apiParam {Object} recipe  new recipe
         */
        server.app.post('/recipe', async (req: express.Request, res: express.Response) => {
            catServer.info(`POST /recipe. ${req.body.recipe}`);
            recipe_manager.loadRecipe(req.body.recipe);
            await recipe_manager.connect();
            res.send("recipe successful loaded");
        });

        /**
         * @api {post} /recipe/start    Start recipe
         * @apiName StartRecipe
         * @apiGroup Recipe
         */
        server.app.post('/recipe/start', (req: express.Request, res: express.Response) => {
            catServer.info('POST /recipe/start');
            recipe_manager.start();
            res.send("recipe successful started");
        });

    }
}
