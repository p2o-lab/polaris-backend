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
import {catServer} from '../../../logging';
import {OperationMode, ServiceCommand, ServiceSourceMode} from '@p2olab/polaris-interface';

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
		await manager.createPEAControllerInstance(req.body.id);
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
 * @api {get} /:peaId/dataAssemblies    Get all DataAssemblies of PEA
 * @apiName GetDataAssemblies
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController owning DataAssemblies
 */
peaRouter.get('/:peaId/dataAssemblies', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {

		const pea = manager.getPEAController(req.params.peaId);
		if(!pea){
			throw new Error(`PEA with ID ${req.params.peaId} not found.`);
		}
		const dataAssemblies = pea.getDataAssemblyJson();
		res.send(dataAssemblies);
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
 * @api {get} /:peaId/download - Download PEAController options by ID
 * @apiName GetPEADownload
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to download related options.
 */
peaRouter.get('/:peaId/download', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.json(manager.getPEAController(req.params.peaId).options);
});

/**
 * @api {post} /:peaId/connect - Connect PEAController by ID and subscribe to dataAssemblies
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
 * @api {post} /:peaId/disconnect -  Disconnect PEAController
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
 * @api {delete} /:peaId - Delete PEAController by ID
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
 * @api {post} /:peaId/service/:serviceId/procedureRequest/:procedureId    Request a procedure change of service in pea
 * @apiName ProcedureRequest
 * @apiDescription Configure procedure and parameters of service
 * @apiGroup PEAController
 * @apiParam {string} peaId    PEAController id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string} procedure      Name of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Procedure Parameters
 */
peaRouter.post('/:peaId/service/:serviceId/procedureRequest/:procedureId', asyncHandler(async (req: Request, res: Response) => {
	catServer.info(`Request Procedure: ${req.params.procedureId}; Parameters: ${JSON.stringify(req.body.parameters)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const pea = manager.getPEAController(req.params.peaId);
		const service = pea.getService(req.params.serviceId);
		const procedureId = parseInt(req.params.procedureId,10);
		await service.requestProcedureOperator(procedureId);

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
 * @api {post} /:peaId/service/:serviceId/procedureRequest/:procedureId    Request a procedure change of service in pea
 * @apiName ProcedureRequest
 * @apiDescription Configure procedure and parameters of service
 * @apiGroup PEAController
 * @apiParam {string} peaId    PEAController id
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string} procedure      Name of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Procedure Parameters
 */
peaRouter.post('/:peaId/service/:serviceId/osLevel/:osLevel', asyncHandler(async (req: Request, res: Response) => {
	catServer.info(`Set OsLevel: ${req.params.osLevel};`);
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const pea = manager.getPEAController(req.params.peaId);
		const service = pea.getService(req.params.serviceId);
		const osLevel = parseInt(req.params.osLevel,10);
		await service.changeOsLevel(osLevel);
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
peaRouter.post('/:peaId/service/:serviceId/:command', asyncHandler(async (req: Request, res: Response) => {
	catServer.debug(`Call service: ${JSON.stringify(req.params)} ${JSON.stringify(req.body)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const service = manager.getService(req.params.peaId, req.params.serviceName);
		if (service){
			if (req.body.parameters) {
				await service.setParameters(req.body.parameters, manager.peas);
			}
			const command = req.params.command as ServiceCommand;
			console.log('execute');
			await service.executeCommand(command);
			res.json({
				pea: req.params.peaId,
				service: service.name,
				command: req.params.command,
				status: 'Command successfully sent'
			});
		} else {
			res.status(404).send('Service not found');
		}
	} catch (e: any) {
		console.log(e);
		res.status(500).send(e.toString());
	}
}));

/**
 * @api {post} /:peaId/service/:serviceName/opMode/:opMode
 * @apiName Change service operation mode
 * @apiGroup PEAController
 * @apiParam {string} peaId     PEAController identifier
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string="offline","operator","automatic"} opMode      OpMode name
 */
peaRouter.post('/:peaId/service/:serviceId/opMode/:opModeParam', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const service = manager.getService(req.params.peaId, req.params.serviceId);
		const opMode = req.params.opModeParam as OperationMode;

		if(service){
		await service.requestOpMode(opMode);
		res.json({
			pea: req.params.peaId,
			service: service.name,
			opMode: req.params.opMode,
			status: 'OpMode successfully changed'
		});
		} else {
			res.status(404).send('Service not found.');
		}
	} catch (e: any) {
		console.log(e);
		res.status(500).send(e.toString());
	}
}));

/**
 * @api {post} /:peaId/service/:serviceName/serviceSourceMode/:serviceSourceMode
 * @apiName Change service source mode
 * @apiGroup PEAController
 * @apiParam {string} peaId     PEAController identifier
 * @apiParam {string} serviceName   Name of service
 * @apiParam {string="extern","intern"} serviceSourceMode
 */
peaRouter.post('/:peaId/service/:serviceName/serviceSourceMode/:serviceSourceMode', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const service = manager.getService(req.params.peaId, req.params.serviceName);

		const serviceSourceMode = req.params.serviceSourceMode as ServiceSourceMode;
		if(service){
			await service.requestServiceSourceMode(serviceSourceMode);
			res.json({
				pea: req.params.peaId,
				service: service.name,
				serviceSourceMode: req.params.serviceSourceMode,
				status: 'SourceMode successfully changed.'
			});
		} else {
			res.status(404).send('Service not found.');
		}
	} catch (e: any) {
		console.log(e);
		res.status(500).send(e.toString());
	}
}));

/**
 * @api {get} /pea/:peaId/service/:serviceName    Get service status
 * @apiName GetService
 * @apiGroup PEAController
 * @apiParam {string} peaId   PEA ID
 * @apiParam {string} serviceId
 */
peaRouter.get('/:peaId/service/:serviceId', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const service = manager.getService(req.params.peaId, req.params.serviceId);
		if (service) {
			res.json(service.json());
		} else {
			res.status(404).send('Service not found.');
		}
	}
	catch(e: any){
		console.log(e);
		res.status(500).send(e.toString());
	}
}));
