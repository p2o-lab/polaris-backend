/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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

import {Request, Response, Router} from 'express';
import * as asyncHandler from 'express-async-handler';
import {catServer} from '../../config/logging';
import {Manager} from '../../model/Manager';

export const virtualServiceRouter: Router = Router();

/**
 * @api {get} /virtualService    Get virtual service list
 * @apiName GetVirtualServiceList
 * @apiGroup VirtualService
 */
virtualServiceRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const manager: Manager = req.app.get('manager');
    res.json(await manager.getVirtualServices());
}));

/**
 * @api {get} /virtualService/:virtualServiceId    Get virtual service
 * @apiName GetVirtualService
 * @apiGroup VirtualService
 * @apiParam virtualServiceId   id of virtual service
 */
virtualServiceRouter.get('/:virtualServiceId', asyncHandler(async (req: Request, res: Response) => {
    const manager: Manager = req.app.get('manager');
    const virtualService = manager.virtualServices.find((vs) => vs.name === req.params.virtualServiceId);
    if (virtualService) {
        res.json(await virtualService.json());
    } else {
        throw new Error('No such virtual service');
    }
}));

/**
 * @api {delete} /virtualService/:virtualServiceId    Delete virtual service
 * @apiName DeleteVirtualService
 * @apiGroup VirtualService
 * @apiParam virtualServiceId   id of virtual service to be deleted
 */
virtualServiceRouter.delete('/:virtualServiceId', asyncHandler(async (req: Request, res: Response) => {
    try {
        const manager: Manager = req.app.get('manager');
        manager.removeVirtualService(req.params.virtualServiceId);
        res.send({ status: 'Successful deleted', id: req.params.virtualServiceId });
    } catch (err) {
        res.status(400).send(err.toString());
    }
}));

/**
 * @api {put} /virtualService    Instantiate virtual service
 * @apiName PutVirtualService
 * @apiGroup VirtualService
 * @apiParam {string} name  new virtual service name
 * @apiParam {string} type  new virtual service type
 */
virtualServiceRouter.put('', asyncHandler(async (req: Request, res: Response) => {
    catServer.debug(`PUT /virtualService: ${JSON.stringify(req.body)}`);
    const manager: Manager = req.app.get('manager');
    manager.instantiateVirtualService(req.body);
    res.json({ status: 'virtual service successful instantiated' });
}));

/**
 * @api {post} /virtualService/:virtualServiceName/parameter    Configure VirtualService
 * @apiName ConfigureVirtualService
 * @apiDescription Configure virtual service parameter
 * @apiGroup VirtualService
 * @apiParam {string} virtualServiceId   Id of virtual service
 * @apiParam {ParameterOptions[]} parameters    virtual service parameter
 */
virtualServiceRouter.post('/:virtualServiceId/parameter', asyncHandler(async (req: Request, res: Response) => {
    const manager: Manager = req.app.get('manager');
    const virtualService = manager.virtualServices.find((vs) => vs.name === req.params.virtualServiceId);
    await virtualService.setParameters(JSON.parse(req.body.parameters));
    res.json(await virtualService.json());
}));

/**
 * @api {post} /virtualService/:virtualServiceId/:command    Call virtual service
 * @apiName CallVirtualService
 * @apiGroup VirtualService
 * @apiParam {string} virtualServiceId   Name of virtual service
 * @apiParam {string="start","stop","abort","complete","pause","unhold","reset"} commandNode       Command name
 * @apiParam {ParameterOptions[]} [parameters]    Parameters for *start* or *restart*
 */
virtualServiceRouter.post('/:virtualServiceId/:command', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`Call virtual service: ${JSON.stringify(req.params)} - ${JSON.stringify(req.body)}`);
    const manager: Manager = req.app.get('manager');
    const virtualService = manager.virtualServices.find((vs) => vs.name === req.params.virtualServiceId);

    if (req.body.parameters) {
        await virtualService.setParameters(req.body.parameters);
    }
    const result = await virtualService.executeCommand(req.params.command);
    res.json({
        virtualService: virtualService.name,
        command: req.params.command,
        status: 'Command succesfully send'
    });
}));
