/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

import {ModularPlantManager} from '../../../modularPlantManager';

import {Request, Response, Router} from 'express';
import {catServer} from '../../../logging';

export const recipeRouter: Router = Router();

/**
 * @api {get} /recipe    Get recipe list
 * @apiName GetRecipeList
 * @apiGroup Recipe
 */
recipeRouter.get('/', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const result = manager.recipes.map((recipe) => {
		return {id: recipe.id, options: recipe.options, protected: recipe.protected};
	});
	res.json(result);
});

/**
 * @api {get} /recipe/:recipeId    Get recipe
 * @apiName GetRecipe
 * @apiGroup Recipe
 * @apiParam recipeId
 */
recipeRouter.get('/:recipeId', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const requestedRecipe = manager.recipes.find((recipe) => recipe.id === req.params.recipeId);
	if(requestedRecipe) {
		res.json(requestedRecipe.json());
	}
	res.status(400).send('RecipeId unknown');
});

/**
 * @api {get} /recipe/:recipeId/download    Download recipe options
 * @apiName GetRecipeDownload
 * @apiGroup Recipe
 * @apiParam recipeId
 */
recipeRouter.get('/:recipeId/download', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const requestedRecipe = manager.recipes.find((recipe) => recipe.id === req.params.recipeId);
	if(requestedRecipe) {
		res.json(requestedRecipe.options);
	}
	res.status(400).send('RecipeId unknown');
});

/**
 * @api {delete} /recipe/:recipeId    Delete recipe
 * @apiName DeleteRecipe
 * @apiGroup Recipe
 * @apiParam recipeId   id of recipe to be deleted
 */
recipeRouter.delete('/:recipeId', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		manager.removeRecipe(req.params.recipeId);
		res.send({status: 'Successful deleted', id: req.params.recipeId});
	} catch (err) {
		res.status(400).send(err.toString());
	}
});

/**
 * @api {put} /recipe    Load recipe
 * @apiName PutRecipe
 * @apiGroup Recipe
 * @apiParam {Object} recipe  new recipe
 */
recipeRouter.put('', (req: Request, res: Response) => {
	catServer.debug(`PUT /recipe: ${JSON.stringify(req.body)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	manager.loadRecipe(req.body);
	res.json({status: 'recipe successful loaded'});
});
