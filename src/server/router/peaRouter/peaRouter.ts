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
import {catServer} from '../../../logging';
import {OperationMode, ServiceCommand, ServiceSourceMode} from '@p2olab/polaris-interface';
import {PEAProvider} from '../../../peaProvider/PEAProvider';

export const peaRouter: Router = Router();


/**
 * @api {post} /loadPEA   Load/Instantiate PEAController in ModularPlantManager
 * @apiName PostPEA
 * @apiGroup PEAController
 */
peaRouter.post('/addPEA', async (req, res) => {
	catServer.info('Add PEA via PiMAd');
	const manager: ModularPlantManager = req.app.get('manager');
	const peaProvider: PEAProvider = req.app.get('peaProvider');
	try {
		if (req.body.id && !req.body.peaModel) {
			const pea = await peaProvider.getPEAFromPiMAd(req.body.id);
			if (!pea) {
				res.status(400).send('Error: PEA not found content.');
			} else {
				await manager.addPEA(pea);
				res.status(200).send('"Success!"');
			}
		} else if (!req.body.id && req.body.peaModel) {
			await manager.addPEA(req.body.peaModel);
			res.status(200).send('"Success!"');
		} else {
			res.status(400).send('Error: Bad body content.');
		}
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
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
		res.json(manager.getAllPEAs());
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
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
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			res.status(200).send(peaController.json());
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}

	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
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
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			const dataAssemblies = peaController.getDataAssemblyJson();
			res.status(200).send(dataAssemblies);
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
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
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			const connectionSettings = peaController.getCurrentConnectionSettings();
			res.status(200).send(connectionSettings);
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	}catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
});

/**
 * @api {post} /:peaId/initializeConnection
 * @apiName InitializeConnection
 * @apiGroup PEAController
 * @apiParam {string} peaId
 */
peaRouter.post('/:peaId/initializeConnection', async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController) {
			await peaController.initializeConnection();
			res.status(200).send();
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
});


/**
 * @api {post} /:peaId/connection/:handlerId/update
 * @apiName PostConnectionSettings
 * @apiGroup PEAController
 * @apiParam {OpcUaEndpointSettings} options
 */
peaRouter.post('/:peaId/connection/:handlerId/update', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			peaController.updateConnectionAdapter(req.params.handlerId, req.body);
			res.status(200).send('Successfully updated the connection settings!');
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch(error){
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
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
	try{
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			res.status(200).json(peaController.options);
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch(error){
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
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
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			await peaController.connect();
			res.status(200).send({peaId: peaController.id, status: 'Successfully connected'});
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
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
	try {
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			await peaController.disconnect();
			res.status(200).send({peaId: peaController.id, status: 'Successfully disconnected'});
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
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
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			await manager.removePEA(req.params.peaId);
			res.status(200).send({peaId: req.params.peaId, status: 'Successfully deleted'});
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));

/**
 * @api {post} /:peaId/service/:serviceId/procedureRequest/:procedureId    Request a procedure change of service in pea
 * @apiName ProcedureRequest
 * @apiDescription Configure procedure and parameters of service
 * @apiGroup PEAController
 * @apiParam {string} peaId    PEAController id
 * @apiParam {string} serviceId   ID of service
 * @apiParam {string} procedureId     ID of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Procedure Parameters
 */
peaRouter.post('/:peaId/service/:serviceId/procedureRequest/:procedureId', asyncHandler(async (req: Request, res: Response) => {
	catServer.info(`Request Procedure: ${req.params.procedureId}; Parameters: ${JSON.stringify(req.body.parameters)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const peaController = manager.findPEAController(req.params.peaId);
		if (peaController){
			const service = peaController.findService(req.params.serviceId);
			if (service){
				const procedureId = parseInt(req.params.procedureId,10);
				await service.requestProcedureOperator(procedureId);
				if (req.body.parameters) {
					await service.setParameters(req.body.parameters, manager.peas);
				}
				res.status(200).json(service.json());
			} else {
				res.status(404).send(`Error: Service with id ${req.params.peaId} not found`);
			}
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch (error){
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));


/**
 * @api {post} /:peaId/service/:serviceId/procedureRequest/:procedureId    Request a procedure change of service in pea
 * @apiName ProcedureRequest
 * @apiDescription Configure procedure and parameters of service
 * @apiGroup PEAController
 * @apiParam {string} peaId    PEAController id
 * @apiParam {string} serviceId   ID of service
 * @apiParam {string} procedure      ID of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Procedure Parameters
 */
peaRouter.post('/:peaId/service/:serviceId/osLevel/:osLevel', asyncHandler(async (req: Request, res: Response) => {
	catServer.info(`Set OsLevel: ${req.params.osLevel};`);
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const pea = manager.findPEAController(req.params.peaId);
		if (pea){
			const service = pea.findService(req.params.serviceId);
			if (service){
				const osLevel = parseInt(req.params.osLevel,10);
				await service.changeOsLevel(osLevel);
				res.status(200).json(service.json());
			} else {
				res.status(404).send(`Error: Service with id ${req.params.peaId} not found`);
			}
		} else {
			res.status(404).send(`Error: PEA with id ${req.params.peaId} not found`);
		}
	} catch(error){
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));



/**
 * @api {post} /:peaId/service/:serviceId/:command   Call service
 * @apiName CallService
 * @apiGroup PEAController
 * @apiParam {string} peaId      PEAController id
 * @apiParam {string} serviceId   Service id
 * @apiParam {string="start","stop","abort","complete","pause","unhold","reset"} command       Command name
 * @apiParam {string} [procedure]      ID of procedure
 * @apiParam {ParameterOptions[]} [parameters]    Service Strategy Parameters
 */
peaRouter.post('/:peaId/service/:serviceId/:command', asyncHandler(async (req: Request, res: Response) => {
	catServer.debug(`Call service: ${JSON.stringify(req.params)} ${JSON.stringify(req.body)}`);
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const service = manager.getService(req.params.peaId, req.params.serviceId);
		if (service){
			if (req.body.parameters) {
				await service.setParameters(req.body.parameters, manager.peas);
			}
			// TODO: Check if OSLevel > 1, ServiceSourceMode Extern, ProcedureRequest is >0 and valid;
			const command = req.params.command as ServiceCommand;
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
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));

/**
 * @api {post} /:peaId/service/:serviceId/opMode/:opMode
 * @apiName Change service operation mode
 * @apiGroup PEAController
 * @apiParam {string} peaId     PEAController identifier
 * @apiParam {string} serviceId   ID of service
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
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));

/**
 * @api {post} /:peaId/service/:serviceId/serviceSourceMode/:serviceSourceMode
 * @apiName Change service source mode
 * @apiGroup PEAController
 * @apiParam {string} peaId     PEAController identifier
 * @apiParam {string} serviceId   ID of service
 * @apiParam {string="extern","intern"} serviceSourceMode
 */
peaRouter.post('/:peaId/service/:serviceId/serviceSourceMode/:serviceSourceMode', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const service = manager.getService(req.params.peaId, req.params.serviceId);

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
	} catch (error) {
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));

/**
 * @api {get} /pea/:peaId/service/:serviceId    Get service status
 * @apiName GetService
 * @apiGroup PEAController
 * @apiParam {string} peaId   ID of PEA
 * @apiParam {string} serviceId ID of service
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
	catch(error){
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);
		console.log(message);
		res.status(500).send(message);
	}
}));
