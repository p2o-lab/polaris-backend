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
 * @api {post} /loadPEA   Load/Instantiate PEAController in ModularPlantManager
 * @apiName PostPEA
 * @apiGroup PEAController
 */
peaRouter.post('/loadPEA', async (req, res) => {
	catServer.info('Load PEAController via PEAController-Options');
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		await manager.loadPEAController(req.body.id);
		res.status(200).send('"Success!"');
	} catch (e: any) {
		console.log(e);
		res.status(500).send(e.toString());
	}
});

/**
 * @api {get} Get all PEAControllers of ModularPlantManager
 * @apiName GetPEAControllers
 * @apiGroup PEAController
 */
peaRouter.get('/allPEAs', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		res.json(manager.getAllPEAControllers());
	} catch (e: any) {
		console.log(e);
		res.status(500).send(e.toString());
	}
}));

/**
 * @api {get} /:peaId    Get PEAController
 * @apiName GetPEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be received as json
 */
peaRouter.get('/:peaId', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		res.send(manager.getPEAController(req.params.peaId).json());
	} catch (e: any) {
		console.log(e);
		res.status(constants.HTTP_STATUS_NOT_FOUND).send(e.toString());
	}
});

/**
 * @api {get} /:peaId/getConnectionSettings
 * @apiName GetConnectionSettings
 * @apiGroup PEAController
 * @apiParam {string} peaId
 */
peaRouter.get('/:peaId/getConnectionSettings', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const peaController = manager.getPEAController(req.params.peaId);
		const body = peaController.getCurrentConnectionSettings();
		res.status(200).send(body);
	}catch (e: any) {
		res.status(500).send(e.toString());
	}
});

/**
 * @api {post} /:peaId/updateConnectionSettings
 * @apiName PostConnectionSettings
 * @apiGroup PEAController
 * @apiParam {ConnectionSettingsOptions} options
 */
peaRouter.post('/:peaId/updateConnectionSettings', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const peaController = manager.getPEAController(req.params.peaId);
		peaController.updateConnection(req.body);
		res.status(200).send('"'+'Successfully updated the connection settings!'+'"');
	} catch(e: any){
		res.status(500).send(e.toString());
	}
}));

/**
 * @api {get} /:peaId/download    Download PEAController options by ID
 * @apiName GetModuleDownload
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to download related options.
 */
peaRouter.get('/:peaId/download', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.json(manager.getPEAController(req.params.peaId).options);
});

/**
 * @api {post} /:peaId/connect    Connect PEAController by ID and subscribe to dataAssemblies
 * @apiName ConnectPEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be connected.
 */
peaRouter.post('/:peaId/connect', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const pea = manager.getPEAController(req.params.peaId);
		await pea.connectAndSubscribe();
		res.status(200).send({peaId: pea.id, status: 'Successfully connected'});
	} catch (e: any) {
		res.status(500).send(e.toString());
		console.log(e);
	}
}));

/**
 * @api {post} /:peaId/disconnect    Disconnect PEAController
 * @apiName DisconnectPEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be disconnected.
 */
peaRouter.post('/:peaId/disconnect', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const pea = manager.getPEAController(req.params.peaId);
		await pea.disconnectAndUnsubscribe();
		res.status(200).send({peaId: pea.id, status: 'Successfully disconnected'});
	}catch (e: any) {
		console.log(e);
		res.status(500).send(e.toString());
	}
}));

/**
 * @api {delete} /:peaId    Delete PEAController by ID
 * @apiName DeletePEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be deleted
 */

peaRouter.delete('/:peaId', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		await manager.removePEAController(req.params.peaId);
		res.status(200).send({peaId: req.params.peaId, status: 'Successfully deleted'});
	} catch (e: any) {
		console.log(e);
		res.status(500).send(e.toString());
	}
}));

/**
 * @api {post} /:peaId/service/:serviceName    Configure service
 * @apiName ConfigureService
 * @apiDescription Configure procedure and parameters of service
 * @apiGroup PEAController
 * @apiParam {string} peaId    PEAController id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string} procedure      Name of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Procedure Parameters
 */
peaRouter.post('/:peaId/service/:serviceName', asyncHandler(async (req: Request, res: Response) => {
	catServer.info(`Set Procedure: ${req.body.procedure}; Parameters: ${JSON.stringify(req.body.parameters)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	try{
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
	}catch(e: any){
		console.log(e);
		res.status(500).send('"'+e.toString()+'"');
	}

}));

/**
 * @api {post} /:peaId/service/:serviceName/:command   Call service
 * @apiName CallService
 * @apiGroup PEAController
 * @apiParam {string} peaId      PEAController id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string="start","stop","abort","complete","pause","unhold","reset"} command       Command name
 * @apiParam {string} [procedure]      Name of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Strategy Parameters
 */
peaRouter.post('/:peaId/service/:serviceName/:command', asyncHandler(async (req: Request, res: Response) => {
	catServer.debug(`Call service: ${JSON.stringify(req.params)} ${JSON.stringify(req.body)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	try{
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
			status: 'Command successfully send'
		});
	} catch (e: any) {
		console.log(e);
		res.status(500).send(e.toString());
	}
}));

/**
 * @api {get} /pea/:peaId/service/:serviceName    Get service statusNode
 * @apiName GetService
 * @apiGroup PEAController
 * @apiParam {string} peaId   PEA ID
 * @apiParam {string} serviceName   Name of service
 */
peaRouter.get('/:peaId/service/:serviceName', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const service = manager.getService(req.params.peaId, req.params.serviceName);
		res.json(service.json());
	}
	catch(e: any){
		console.log(e);
		res.status(500).send(e.toString());
	}
}));
