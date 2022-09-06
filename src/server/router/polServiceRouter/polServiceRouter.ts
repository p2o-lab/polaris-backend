/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

import {ServiceCommand} from '@p2olab/polaris-interface';
import {ModularPlantManager} from '../../../modularPlantManager';

import {Request, Response, Router} from 'express';
import * as asyncHandler from 'express-async-handler';
import {catServer} from '../../../logging';

export const polServiceRouter: Router = Router();

/**
 * @api {get} /polService    Get POL service list
 * @apiName GetVirtualServiceList
 * @apiGroup VirtualService
 */
polServiceRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.json(manager.getPOLServices());
}));

/**
 * @api {get} /polService/:polServiceId    Get POL service
 * @apiName GetPOLService
 * @apiGroup POLService
 * @apiParam polServiceId   id of POL service
 */
polServiceRouter.get('/:polServiceId', asyncHandler(async (req: Request, res: Response) => {
	try {
		const manager: ModularPlantManager = req.app.get('manager');
		const polService = manager.polServices.find((vs) => vs.name === req.params.polServiceId);
		if (!polService) {
			throw new Error('POL Service not found');
		}
		res.json(polService.json());
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));

/**
 * @api {delete} /polService/:polServiceId    Delete POL service
 * @apiName DeletePOLService
 * @apiGroup POLService
 * @apiParam polServiceId   id of POL service to be deleted
 */
polServiceRouter.delete('/:polServiceId', asyncHandler(async (req: Request, res: Response) => {
	try {
		const manager: ModularPlantManager = req.app.get('manager');
		manager.removePOLService(req.params.polServiceId);
		res.send({status: 'Successful deleted', id: req.params.polServiceId});
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));

/**
 * @api {put} /polService    Instantiate POL service
 * @apiName PutPOLService
 * @apiGroup POLService
 * @apiParam {string} name  new POL service name
 * @apiParam {string} type  new POL service type
 */
polServiceRouter.put('', asyncHandler(async (req: Request, res: Response) => {
	catServer.debug(`PUT /polService: ${JSON.stringify(req.body)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	manager.addPOLService(req.body);
	res.json({status: 'pol service successful instantiated'});
}));

/**
 * @api {post} /polService/:polServiceName/parameter    Configure POLService
 * @apiName ConfigurePOLService
 * @apiDescription Configure POL service parameter
 * @apiGroup POLService
 * @apiParam {string} polServiceId   Id of POL service
 * @apiParam {ParameterOptions[]} parameters    POL service parameter
 */
polServiceRouter.post('/:polServiceId/parameter', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const polService = manager.polServices.find((vs) => vs.name === req.params.polServiceId);
	if (polService) {
		await polService.setParameters(JSON.parse(req.body.parameters));
		res.json(polService.json());
	} else {
		res.status(404).send('No POL Service found');
	}
}));

/**
 * @api {post} /polService/:polServiceId/:command    Call POL service
 * @apiName CallPOLService
 * @apiGroup POLService
 * @apiParam {string} polServiceId   Name of POL service
 * @apiParam {string="start","stop","abort","complete","pause","unhold","reset"} commandNode       Command name
 * @apiParam {ParameterOptions[]} [parameters]    Parameters for *start* or *restart*
 */
polServiceRouter.post('/:polServiceId/:command', asyncHandler(async (req: Request, res: Response) => {
	catServer.info(`Call POL service: ${JSON.stringify(req.params)} - ${JSON.stringify(req.body)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	const polService = manager.polServices.find((vs) => vs.name === req.params.polServiceId);
	if (!polService) {
		res.status(404).send('Not Acceptable');
	} else {
		if (req.body.parameters) {
			await polService.setParameters(req.body.parameters);
		}
		await polService.executeCommand(req.params.command as ServiceCommand);
		res.json({
			polService: polService.name,
			command: req.params.command,
			status: 'Command successfully sent'
		});
	}
}));
