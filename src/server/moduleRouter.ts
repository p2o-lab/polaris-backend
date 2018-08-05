import {recipe_manager} from '../model/RecipeManager';
import {catServer} from '../config/logging';
import {Request, Response, Router} from "express";
import {ServiceCommand} from "../model/enum";
import {Strategy} from "../model/Interfaces";
import {Parameter} from "../model/Parameter";

import * as asyncHandler from 'express-async-handler';

export const moduleRouter: Router = Router();

/**
 * @api {get} /module/    Get all modules
 * @apiName GetModules
 * @apiGroup Module
 */
moduleRouter.get('', asyncHandler(async (req: Request, res: Response) => {
    catServer.info('GET /module/');
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
    catServer.info(`GET /module/${req.params.id}`);
    res.json(await recipe_manager.modules.find(module => module.id === req.params.id).json());
}));

/**
 * @api {post} /module    Add modules
 * @apiName PostModule
 * @apiGroup Module
 * @apiParam {object} modules    Modules to be added
 */
moduleRouter.post('', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`POST /module/ - ${JSON.stringify(req.body)}`);
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
    catServer.info(`Delete /module/${req.params.id}`);
    const module = recipe_manager.modules.find(module => module.id === req.params.id);
    await module.disconnect();
    const index = recipe_manager.modules.indexOf(module, 0);
    if (index > -1) {
        recipe_manager.modules.splice(index, 1);
    }
    res.send({status: 'Successful deleted', id: req.params.id});
}));


/**
 * @api {post} /module/abort    Abort all services
 * @apiName AbortAllServices
 * @apiDescription Abort all services from all modules
 * @apiGroup Module
 */
moduleRouter.post('/abort', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`POST /module/abort`);
    res.json(await recipe_manager.abortAllModules());
}));


/**
 * @api {post} /module/:moduleId/service/:serviceName/:command    Call service
 * @apiName CallService
 * @apiGroup Service
 * @apiParam {string} moduleId      Module id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string="start","stop","abort","complete"} command       Command name
 * @apiParam {string} [strategy]    Strategy name
 * @apiParam {Object[]} [parameters]    Parameters for *start* or *restart*
 */
moduleRouter.post('/:moduleId/service/:serviceName/:command', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`Call service ${req.params.moduleId}`);
    const module = await recipe_manager.modules.find(module => module.id === req.params.moduleId);
    const service = await module.services.find(service => service.name === req.params.serviceName);
    const command: ServiceCommand = req.params.command;

    let strategy: Strategy = null;
    let parameters: Parameter[] = [];
    if (req.params.strategy) {
        strategy = service.strategies.find(strat => strat.name === req.params.strategy);
    } else {
        strategy = service.strategies.find(strat => strat.default === true);
    }

    if (req.params.parameters) {
        parameters = req.params.parameters;
    }

    const result = await service.executeCommand(command, strategy, parameters);
    res.send("Command succesfully send: " + result);
}));


/**
 * @api {get} /module/:moduleId/service/:serviceName/    Get service status
 * @apiName GetService
 * @apiGroup Service
 * @apiParam {string} moduleId      Module id
 * @apiParam {string} serviceName   Name of service
 */
moduleRouter.get('/:moduleId/service/:serviceName', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`Call service ${req.params.moduleId}`);
    const module = await recipe_manager.modules.find(module => module.id === req.params.moduleId);
    if (!module) {
        throw new Error(`Module with id ${req.params.moduleId} not registered`);
    }
    const service = await module.services.find(service => service.name === req.params.serviceName);
    res.json(await service.getOverview());
}));