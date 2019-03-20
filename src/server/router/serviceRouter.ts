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


import { moduleRouter } from './moduleRouter';
import { Request, Response, Router } from 'express';
import * as asyncHandler from 'express-async-handler';
import { catServer } from '../../config/logging';
import {manager} from '../../model/Manager';

export const serviceRouter: Router = Router();

/**
 * @api {post} /module/:moduleId/service/:serviceName/parameter    Configure Service
 * @apiName ConfigureService
 * @apiDescription Configure service parameter
 * @apiGroup Service
 * @apiParam {string} moduleId    Module id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {ParameterOptions[]} strategyParameters    Module Service Parameter
 */
moduleRouter.post('/:moduleId/service/:serviceName/parameter', asyncHandler(async (req: Request, res: Response) => {
    const service = manager.getService(req.params.moduleId, req.params.serviceName);
    await service.setServiceParameters(req.body.parameters);
    res.json(await service.getOverview());
}));

/**
 * @api {post} /module/:moduleId/service/:serviceName/strategy    Configure Strategy
 * @apiName ConfigureStrategy
 * @apiDescription Configure strategy and strategy strategyParameters of service
 * @apiGroup Service
 * @apiParam {string} moduleId    Module id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string} strategy      Name of strategy
 * @apiParam {ParameterOptions[]} strategyParameters    Module Service Parameters
 */
moduleRouter.post('/:moduleId/service/:serviceName/strategy', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`Set Strategy Parameters ${req.body.strategy}, ${JSON.stringify(req.body.parameters)}`);
    const service = manager.getService(req.params.moduleId, req.params.serviceName);
    await service.setStrategyParameters(req.body.strategy, req.body.parameters);

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
 * @apiParam {ParameterOptions[]} [strategyParameters]    Parameters for *start* or *restart*
 */
moduleRouter.post('/:moduleId/service/:serviceName/:command', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`Call service: ${JSON.stringify(req.params)} - ${JSON.stringify(req.body)}`);
    const service = manager.getService(req.params.moduleId, req.params.serviceName);

    const result = await service.execute(req.params.command, req.body.strategy, req.body.parameters);
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
    const service = manager.getService(req.params.moduleId, req.params.serviceName);
    res.json(await service.getOverview());
}));

