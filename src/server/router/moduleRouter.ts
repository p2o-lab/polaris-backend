import {recipe_manager} from '../../model/RecipeManager';
import {Request, Response, Router} from "express";

import * as asyncHandler from 'express-async-handler';
import {catServer} from "../../config/logging";

export const moduleRouter: Router = Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

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
    catServer.info(`Load module ${JSON.stringify(req.body)}`);
    const newModules = recipe_manager.loadModule(req.body);
    recipe_manager.eventEmitter.emit('refresh', 'module');
    res.json(await Promise.all(newModules.map(module => module.json())));
}));


/**
 * @api {post} /module/new    Add module
 * @apiName PostModule
 * @apiGroup Module
 * @apiParam {file} modules    Modules to be added
 */
moduleRouter.post('/new', upload.single('file'), asyncHandler(async (req, res) => {
    catServer.info(`Load module ${JSON.stringify(req.body)}`);
    const moduleOptions = JSON.parse(req.file.buffer.toString());
    const newModules = recipe_manager.loadModule(moduleOptions);
    recipe_manager.eventEmitter.emit('refresh', 'module');
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
    recipe_manager.eventEmitter.emit('refresh', 'module');
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
    res.json({module: module.id, status: "Succesfully connected"});
}));


/**
 * @api {post} /module/:id/disconnect    Disconnect module
 * @apiName DisconnectModule
 * @apiGroup Module
 * @apiParam {string} id    Module id
 */
moduleRouter.post('/:id/disconnect', asyncHandler(async (req: Request, res: Response) => {
    const module = recipe_manager.modules.find(module => module.id === req.params.id);
    await module.disconnect();
    res.json({module: module.id, status: "Succesfully disconnected"});
}));


/**
 * @api {post} /module/abort    Abort all services
 * @apiName AbortAllServices
 * @apiDescription Abort all services from all modules
 * @apiGroup Module
 */
moduleRouter.post('/abort', asyncHandler(async (req: Request, res: Response) => {
    await recipe_manager.abortAllModules();
    res.json({status: "aborted all services from all modules"});
}));

