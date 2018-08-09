import {recipe_manager} from '../../model/RecipeManager';
import {catServer} from '../../config/logging';
import {Request, Response, Router} from "express";

import * as asyncHandler from 'express-async-handler';

export const moduleRouter: Router = Router();

/**
 * @api {get} /module/    Get all modules
 * @apiName GetModules
 * @apiGroup Module
 */
moduleRouter.get('', asyncHandler(async (req: Request, res: Response) => {
    const tasks = recipe_manager.modules.map(module => module.json());
    res.json(await Promise.all(tasks));
}));

/**
 * @api {get} /module/:id    Get module
 * @apiName GetModule
 * @apiGroup Module
 * @apiParam {string} id    Module id
 */
moduleRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    res.json(await recipe_manager.modules.find(module => module.id === req.params.id).json());
}));

/**
 * @api {post} /module    Add modules
 * @apiName PostModule
 * @apiGroup Module
 * @apiParam {object} modules    Modules to be added
 */
moduleRouter.post('', asyncHandler(async (req: Request, res: Response) => {
    catServer.debug(`POST /module/ - ${JSON.stringify(req.body)}`);
    const newModules = recipe_manager.loadModule(req.body);
    res.json(await Promise.all(newModules.map(module => module.json())));
}));

/**
 * @api {delete} /module/:id    Delete module
 * @apiName DeleteModule
 * @apiGroup Module
 * @apiParam {string} id    Module id to be deleted
 */
moduleRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const module = recipe_manager.modules.find(module => module.id === req.params.id);
    await module.disconnect();
    const index = recipe_manager.modules.indexOf(module, 0);
    if (index > -1) {
        recipe_manager.modules.splice(index, 1);
    }
    res.send({status: 'Successful deleted', id: req.params.id});
}));


/**
 * @api {post} /module/:id/connect    Connect module
 * @apiName ConnectModule
 * @apiGroup Module
 * @apiParam {string} id    Module id
 */
moduleRouter.post('/:id/connect', asyncHandler(async (req: Request, res: Response) => {
    const module = recipe_manager.modules.find(module => module.id === req.params.id);
    await module.connect();
    res.send(`Succesfully connected to ${req.params.id}`);
}));


/**
 * @api {post} /module/:id/disconnect    Disconnect module
 * @apiName DisconnectModule
 * @apiGroup Module
 * @apiParam {string} id    Module id
 */
moduleRouter.post('/:id/disconnect', asyncHandler(async (req: Request, res: Response) => {
    const module = recipe_manager.modules.find(module => module.id === req.params.id);
    res.send(await module.disconnect());
}));


/**
 * @api {post} /module/abort    Abort all services
 * @apiName AbortAllServices
 * @apiDescription Abort all services from all modules
 * @apiGroup Module
 */
moduleRouter.post('/abort', asyncHandler(async (req: Request, res: Response) => {
    res.json(await recipe_manager.abortAllModules());
}));

