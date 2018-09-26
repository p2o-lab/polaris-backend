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

import { manager } from '../../model/Manager';
import { catServer } from '../../config/logging';
import { moduleRouter } from './moduleRouter';
import { Request, Response, Router } from 'express';
import * as asyncHandler from 'express-async-handler';

export const recipeRouter: Router = Router();

/**
 * @api {get} /recipe    Get recipe list
 * @apiName GetRecipeList
 * @apiGroup Recipe
 */
recipeRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result = manager.recipes.map((recipe) => {
        return { id: recipe.id, options: recipe.options };
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
    res.send({ status: 'Successful deleted', id: req.params.id });
}));

/**
 * @api {put} /recipe    Load recipe
 * @apiName PutRecipe
 * @apiGroup Recipe
 * @apiParam {Object} recipe  new recipe
 */
recipeRouter.put('', asyncHandler(async (req: Request, res: Response) => {
    catServer.debug(`PUT /recipe: ${JSON.stringify(req.body)}`);
    manager.loadRecipe(req.body);
    res.json({ status: 'recipe successful loaded' });
}));

/**
 * @api {post} /activeRecipe/abort    Abort all services
 * @apiName AbortServices
 * @apiDescription Abort all services from all connected modules
 * @apiGroup Recipe
 */
moduleRouter.post('/abort', asyncHandler(async (req: Request, res: Response) => {
    res.json(await manager.abortAllServices());
}));
