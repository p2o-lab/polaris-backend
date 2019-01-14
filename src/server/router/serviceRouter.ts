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
import { ServiceCommand } from '@plt/pfe-ree-interface';
import { moduleRouter } from './moduleRouter';
import { Request, Response, Router } from 'express';
import * as asyncHandler from 'express-async-handler';
import { Strategy } from '../../model/Interfaces';
import { Parameter } from '../../model/Parameter';
import { catServer } from '../../config/logging';

export const serviceRouter: Router = Router();

/**
 * @api {post} /module/:moduleId/service/:serviceName/configure    Configure Service
 * @apiName ConfigureService
 * @apiDescription Configure service parameters
 * @apiGroup Service
 * @apiParam {string} id    Module id
 * @apiParam {object} parameters    Module Service Parameters
 */
moduleRouter.post('/:moduleId/service/:serviceName/configure', asyncHandler(async (req: Request, res: Response) => {
    const module = await manager.modules.find(module => module.id === req.params.moduleId);
    if (!module) {
        throw new Error(`Module with id ${req.params.moduleId} not registered`);
    }
    const service = await module.services.find(service => service.name === req.params.serviceName);
    await service.setServiceParameters(req.body.parameters);
    res.json(await service.getOverview());
}));

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
        parameters = req.body.parameters.map(
            parameterOptions => new Parameter(parameterOptions, service, strategy)
        );
    }

    const result = await service.executeCommand(command, strategy, parameters);
    res.json({
        module: module.id,
        service: service.name,
        command: req.params.command,
        status: 'Command succesfully send'
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

