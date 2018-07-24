import * as express from 'express';
import {recipe_manager} from '../model/RecipeManager';

export default class Routes {
    static init(server): void {

        server.app.use('/doc', express.static('apidoc'));

        /**
         * @api {get} /status    Get status
         * @apiName GetStatus
         * @apiGroup Manager
         */
        server.app.get('/status', (req: express.Request, res: express.Response) => {
            res.json(recipe_manager.getState());
        });

        /**
         * @api {get} /recipe    Post recipe
         * @apiName GetRecipe
         * @apiGroup Recipe
         */
        server.app.get('/recipe', (req: express.Request, res: express.Response) => {
            res.json({recipe: 'abc', status: 'idle', version: '0.1.0'});
        });

        /**
         * @api {post} /recipe    Post recipe
         * @apiName PostRecipe
         * @apiGroup Recipe
         * @apiParam {Object} recipe  new recipe
         */
        server.app.post('/recipe', (req: express.Request, res: express.Response) => {
            res.json({status: 'io', version: '0.1.0'});
        });
    }
}
