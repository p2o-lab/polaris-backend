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
import { Request, Response, Router } from 'express';

import * as asyncHandler from 'express-async-handler';
import {catModule, catServer} from '../../config/logging';

export const moduleRouter: Router = Router();

/**
 * @api {get} /module/    Get all modules
 * @apiName GetModules
 * @apiGroup Module
 */
moduleRouter.get('', asyncHandler(async (req: Request, res: Response) => {
    const tasks = manager.modules.map(async module => await module.json());
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
 * @api {get} /module/:id/download    Download module options
 * @apiName GetModuleDownload
 * @apiGroup Module
 * @apiParam {string} id    Module id
 */
moduleRouter.get('/:id/download', asyncHandler(async (req: Request, res: Response) => {
    res.json(await manager.modules.find(module => module.id === req.params.id).options);
}));

/**
 * @api {put} /module    Add module
 * @apiName PutModule
 * @apiGroup Module
 * @apiParam {ModuleOptions} modules    Modules to be added
 */
moduleRouter.put('', asyncHandler(async (req, res) => {
    const moduleOptions = req.body.modules;
    catServer.info(`Load module: ${JSON.stringify(moduleOptions)}`);
    const newModules = manager.loadModule(req.body);
    newModules.forEach(module =>
        module.connect()
            .catch(reason => catModule.warn('Could not connect to module: ' + reason))
    );
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
    if (module.protected) {
        res.status(404).send(`Module {$id} is protected and can't be deleted`);
    } else {
        const index = manager.modules.indexOf(module, 0);
        if (index > -1) {
            manager.modules.splice(index, 1);
        }
        await module.disconnect();
        res.send({ status: 'Successful deleted', id: req.params.id });
    }
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
    res.json({ module: module.id, status: 'Succesfully connected' });
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
    res.json({ module: module.id, status: 'Succesfully disconnected' });
}));

/**
 * @api {post} /module/abort    Abort all services
 * @apiName AbortAllServices
 * @apiDescription Abort all services from all modules
 * @apiGroup Module
 */
moduleRouter.post('/abort', asyncHandler(async (req: Request, res: Response) => {
    await manager.abortAllServices();
    res.json({ status: 'aborted all services from all modules' });
}));

/**
 * @api {post} /module/stop    Stop all services
 * @apiName StopAllServices
 * @apiDescription Abort all services from all modules
 * @apiGroup Module
 */
moduleRouter.post('/stop', asyncHandler(async (req: Request, res: Response) => {
    await manager.stopAllServices();
    res.json({ status: 'stopped all services from all modules' });
}));

/**
 * @api {post} /module/reset    Reset all services
 * @apiName ResetAllServices
 * @apiDescription Reset all services from all modules
 * @apiGroup Module
 */
moduleRouter.post('/reset', asyncHandler(async (req: Request, res: Response) => {
    await manager.resetAllServices();
    res.json({ status: 'reset all services from all modules' });
}));