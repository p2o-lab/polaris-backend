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

import { Request, Response, Router } from 'express';
import * as asyncHandler from 'express-async-handler';
import { manager } from '../../model/Manager';

export const playerRouter: Router = Router();

/**
 * @api {get} /player    Get Player
 * @apiName GetPlayer
 * @apiGroup Player
 */
playerRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result = await manager.player.json();
    res.json(result);
}));

/**
 * @api {post} /player/start    Start Player
 * @apiName StartPlayer
 * @apiGroup Player
 */
playerRouter.post('/start', asyncHandler(async (req: Request, res: Response) => {
    const result = await manager.player.start();
    res.json(result);
}));

/**
 * @api {post} /player/pause    Pause Player
 * @apiName PausePlayer
 * @apiGroup Player
 */
playerRouter.post('/pause', asyncHandler(async (req: Request, res: Response) => {
    const result = await manager.player.pause();
    res.json(result);
}));

/**
 * @api {post} /player/stop    Stop Player
 * @apiName StopPlayer
 * @apiGroup Player
 */
playerRouter.post('/stop', asyncHandler(async (req: Request, res: Response) => {
    const result = await manager.player.stop();
    res.json(result);
}));

/*
 * @api {post} /player/reset    Reset Player
 * @apiName ResetPlayer
 * @apiGroup Player
 */
playerRouter.post('/reset', asyncHandler(async (req: Request, res: Response) => {
    const result = await manager.player.reset();
    res.json(result);
}));

/**
 * @api {post} /player/enqueue    Enqueue Recipe
 * @apiName EnqueueRecipe
 * @apiGroup Player
 * @apiParam recipeId   id of recipe to be added to playlist
 */
playerRouter.post('/enqueue', asyncHandler(async (req: Request, res: Response) => {
    const recipe = manager.recipes.find(recipe => recipe.id === req.body.recipeId);
    if (recipe) {
        manager.player.enqueue(recipe);
        res.json(await manager.player.json());
    } else {
        throw new Error(`Could not find recipe with id ${req.body.recipeId}`);
    }
}));

/**
 * @api {post} /player/remove    Remove Recipe
 * @apiName RemoveRecipe
 * @apiGroup Player
 * @apiParam index   index of recipe in playlist to be removed
 */
playerRouter.post('/remove', asyncHandler(async (req: Request, res: Response) => {
    manager.player.remove(req.body.index);
    res.json(await manager.player.json());
}));
