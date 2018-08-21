import {manager} from '../../model/Manager';
import {Request, Response, Router} from "express";

import * as asyncHandler from 'express-async-handler';
import {catServer} from "../../config/logging";
import * as multer from 'multer';

export const moduleRouter: Router = Router();

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @api {get} /module/    Get all modules
 * @apiName GetModules
 * @apiGroup Module
 */
moduleRouter.get('', asyncHandler(async (req: Request, res: Response) => {
    const tasks = manager.modules.map(module => module.json());
    res.json(await Promise.all(tasks));
}));

/**
 * @api {get} /module/:id    Get module
 * @apiName GetModule
 * @apiGroup Module
 * @apiParam {string} id    Module id
 */
moduleRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    res.json(await manager.modules.find(module => module.id === req.params.id).json());
}));

/**
 * @api {put} /module    Add module
 * @apiName PutModule
 * @apiGroup Module
 * @apiParam {file} modules    Modules to be added
 */
moduleRouter.put('', upload.single('file'), asyncHandler(async (req, res) => {
    const moduleOptions = JSON.parse(req.file.buffer.toString());
    catServer.debug(`Load module. ${JSON.stringify(moduleOptions)}`);
    const newModules = manager.loadModule(moduleOptions);
    manager.eventEmitter.emit('refresh', 'module');
    res.json(await Promise.all(newModules.map(module => module.json())));
}));

/**
 * @api {delete} /module/:id    Delete module
 * @apiName DeleteModule
 * @apiGroup Module
 * @apiParam {string} id    Module id to be deleted
 */
moduleRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const module = manager.modules.find(module => module.id === req.params.id);
    await module.disconnect();
    const index = manager.modules.indexOf(module, 0);
    if (index > -1) {
        manager.modules.splice(index, 1);
    }
    manager.eventEmitter.emit('refresh', 'module');
    res.send({status: 'Successful deleted', id: req.params.id});
}));


/**
 * @api {post} /module/:id/connect    Connect module
 * @apiName ConnectModule
 * @apiGroup Module
 * @apiParam {string} id    Module id
 */
moduleRouter.post('/:id/connect', asyncHandler(async (req: Request, res: Response) => {
    const module = manager.modules.find(module => module.id === req.params.id);
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
    const module = manager.modules.find(module => module.id === req.params.id);
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
    await manager.abortAllModules();
    res.json({status: "aborted all services from all modules"});
}));

