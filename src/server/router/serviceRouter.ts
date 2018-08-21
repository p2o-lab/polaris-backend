import {manager} from '../../model/Manager';
import {ServiceCommand} from "pfe-ree-interface";
import {moduleRouter} from "./moduleRouter";
import {Request, Response, Router} from "express";
import * as asyncHandler from 'express-async-handler';
import {Strategy} from "../../model/Interfaces";
import {Parameter} from "../../model/Parameter";
import {catServer} from "../../config/logging";

export const serviceRouter: Router = Router();


/**
 * @api {post} /module/:moduleId/service/:serviceName/:command    Call service
 * @apiName CallService
 * @apiGroup Service
 * @apiParam {string} moduleId      Module id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string="start","stop","abort","complete","pause","unhold","reset"} command       Command name
 * @apiParam {string} [strategy]    Strategy name
 * @apiParam {Object[]} [parameters]    Parameters for *start* or *restart*
 */
moduleRouter.post('/:moduleId/service/:serviceName/:command', asyncHandler(async (req: Request, res: Response) => {
    const module = await manager.modules.find(module => module.id === req.params.moduleId);
    const service = await module.services.find(service => service.name === req.params.serviceName);
    const command: ServiceCommand = req.params.command;

    catServer.info(`Call service: ${JSON.stringify(req.params)} - ${JSON.stringify(req.body)}`);
    let strategy: Strategy = null;
    let parameters: Parameter[] = [];
    if (req.body.strategy) {
        strategy = service.strategies.find(strat => strat.name === req.body.strategy);
    } else {
        strategy = service.strategies.find(strat => strat.default === true);
    }

    if (req.body.parameters) {
        parameters = req.body.parameters;
    }

    const result = await service.executeCommand(command, strategy, parameters);
    res.json({
        module: module.id,
        service: service.name,
        command: req.params.command,
        status: "Command succesfully send"
    });
}));


/**
 * @api {get} /module/:moduleId/service/:serviceName/    Get service status
 * @apiName GetService
 * @apiGroup Service
 * @apiParam {string} moduleId      Module id
 * @apiParam {string} serviceName   Name of service
 */
moduleRouter.get('/:moduleId/service/:serviceName', asyncHandler(async (req: Request, res: Response) => {
    const module = await manager.modules.find(module => module.id === req.params.moduleId);
    if (!module) {
        throw new Error(`Module with id ${req.params.moduleId} not registered`);
    }
    const service = await module.services.find(service => service.name === req.params.serviceName);
    res.json(await service.getOverview());
}));