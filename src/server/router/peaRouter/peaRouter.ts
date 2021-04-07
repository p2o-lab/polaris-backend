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

import {ModularPlantManager} from '../../../modularPlantManager';

import {Request, Response, Router} from 'express';
import * as asyncHandler from 'express-async-handler';
import {constants} from 'http2';
import {ServiceCommand} from '@p2olab/polaris-interface';
import {catServer} from '../../../logging';

export const peaRouter: Router = Router();

/**
 * @api {put} /addByOptions    Add PEA via PEA-options directly
 * @apiName PutPEA
 * @apiGroup PEA
 * @apiParam {PEAOptions} pea    PEA to be added
 */
peaRouter.put('/addByOptions', (req, res) => {
	catServer.info('Load PEA via PEA-Options');
	const manager: ModularPlantManager = req.app.get('manager');
	const newPEAs = manager.load(req.body);
/*	newPEAs.forEach((p) =>
		p.connect()
			.catch(() => catPEA.warn(`Could not connect to PEA ${p.id}`))
	);*/
	res.json(newPEAs.map((m) => m.json()));
});

/**
 * @api {put} /addByPiMAd Add PEA via PiMAd.
 * @apiName PutPEA
 * @apiGroup PEA
 * @apiParam {PEAOptions} pea PEA to be added.
 */
peaRouter.put('/addByPiMAd', (req, res) => {
	const manager: ModularPlantManager = req.app.get('manager');
	manager.addPEAToPimadPool(req.body);
	res.status(200).send('PiMAd-Hello-World\n');
});

/**
 * @api {get}    Get all PEAs
 * @apiName GetPEAs
 * @apiGroup PEA
 */
peaRouter.get('', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.json(await manager.getPEAs());
}));

/**
 * @api {get} /:peaId    Get PEA
 * @apiName GetPEA
 * @apiGroup PEA
 * @apiParam {string} peaId    ID of PEA to be received as json
 */
peaRouter.get('/:peaId', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		res.json(manager.getPEA(req.params.peaId).json());
	} catch (err) {
		res.status(constants.HTTP_STATUS_NOT_FOUND).send(err.toString());
	}
});

/**
 * @api {get} /:peaId/download    Download PEA options by ID
 * @apiName GetModuleDownload
 * @apiGroup PEA
 * @apiParam {string} peaId    ID of PEA to download related options.
 */
peaRouter.get('/:peaId/download', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.json(manager.getPEA(req.params.peaId).options);
});

/**
 * @api {post} /:peaId/connect    Connect PEA by ID
 * @apiName ConnectPEA
 * @apiGroup PEA
 * @apiParam {string} peaId    ID of PEA to be connected.
 */
peaRouter.post('/:peaId/connect', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const pea = manager.getPEA(req.params.peaId);
	await pea.connect();
	res.json({pea: pea.id, status: 'Successfully connected'});
}));

/**
 * @api {post} /:peaId/disconnect    Disconnect PEA
 * @apiName DisconnectPEA
 * @apiGroup PEA
 * @apiParam {string} peaId    ID of PEA to be disconnected.
 */
peaRouter.post('/:peaId/disconnect', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const pea = manager.getPEA(req.params.peaId);
	await pea.disconnect();
	res.json({pea: pea.id, status: 'Successfully disconnected'});
}));

/**
 * @api {delete} /:peaId    Delete PEA by ID
 * @apiName DeletePEA
 * @apiGroup PEA
 * @apiParam {string} peaId    ID of PEA to be deleted
 */
peaRouter.delete('/:peaId', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		await manager.removePEA(req.params.peaId);
		res.send({status: 'Successful deleted', peaId: req.params.peaId});
	} catch (err) {
		res.status(404).send(err.toString());
	}
}));

/**
 * @api {post} /:peaId/service/:serviceName    Configure service
 * @apiName ConfigureService
 * @apiDescription Configure procedure and parameters of service
 * @apiGroup PEA
 * @apiParam {string} peaId    PEA id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string} procedure      Name of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Procedure Parameters
 */
peaRouter.post('/:peaId/service/:serviceName', asyncHandler(async (req: Request, res: Response) => {
	catServer.info(`Set Procedure: ${req.body.procedure}; Parameters: ${JSON.stringify(req.body.parameters)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	const service = manager.getService(req.params.peaId, req.params.serviceName);
	if (req.body.procedure) {
		const procedure = service.getProcedureByNameOrDefault(req.body.procedure);
		if (procedure) {
			await service.setProcedure(procedure);
		}
	}
	if (req.body.parameters) {
		await service.setParameters(req.body.parameters, manager.peas);
	}
	res.json(service.json());
}));

/**
 * @api {post} /:peaId/service/:serviceName/:command   Call service
 * @apiName CallService
 * @apiGroup PEA
 * @apiParam {string} peaId      PEA id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string="start","stop","abort","complete","pause","unhold","reset"} command       Command name
 * @apiParam {string} [procedure]      Name of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Strategy Parameters
 */
peaRouter.post('/:peaId/service/:serviceName/:command', asyncHandler(async (req: Request, res: Response) => {
	catServer.debug(`Call service: ${JSON.stringify(req.params)} ${JSON.stringify(req.body)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	const service = manager.getService(req.params.peaId, req.params.serviceName);
	if (req.body.procedure) {
		const procedure = service.getProcedureByNameOrDefault(req.body.procedure);
		if (procedure) {
			await service.setProcedure(procedure);
		}
	}
	if (req.body.parameters) {
		await service.setParameters(req.body.parameters, manager.peas);
	}
	const command = req.params.command as ServiceCommand;
	await service.executeCommand(command);
	res.json({
		pea: req.params.peaId,
		service: service.name,
		command: req.params.command,
		status: 'Command succesfully send'
	});
}));

/**
 * @api {get} /pea/:PEAId/service/:serviceName    Get service statusNode
 * @apiName GetService
 * @apiGroup PEA
 * @apiParam {string} peaId      PEA id
 * @apiParam {string} serviceName   Name of service
 */
peaRouter.get('/:peaId/service/:serviceName', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const service = manager.getService(req.params.peaId, req.params.serviceName);
	res.json(service.json());
}));
