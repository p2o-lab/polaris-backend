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
import * as path from "path";

export const peaRouter: Router = Router();

/**
 * @api {put} /addByOptions    Load/Instantiate PEAController via PEAController-options directly
 * @apiName PostPEA
 * @apiGroup PEAController
 * @apiParam {PEAOptions} pea    PiMAdIdentifier
 */
peaRouter.post('/loadPEA', (req, res) => {
	catServer.info('Load PEAController via PEAController-Options');
	const manager: ModularPlantManager = req.app.get('manager');
	const newPEAs = manager.loadPEAController(req.body);
/*	newPEAs.forEach((p) =>
		p.connect()
			.catch(() => catPEA.warn(`Could not connect to PEAController ${p.id}`))
	);*/
	res.json(newPEAs.map((m) => m.json()));
});

// TODO: Place this code somewhere else?
// set up Multer for parsing uploaded file
const fs = require('fs');
const multer = require('multer');
// create uploads directory
if (!fs.existsSync('uploads/')){
	fs.mkdirSync('uploads/');
}
// set up filename and destination
const storage = multer.diskStorage({
	destination: function (req: any, file: any, cb:any) {
		cb(null, path.join('uploads/'));
	},
	filename: (req: any, file: { fieldname: string; originalname: any }, cb: (arg0: null, arg1: string) => void) => {
		cb(null, file.originalname);
	}
});
const upload = multer({storage: storage});

/**
 * @api {post} /addByPiMAd Add PEAController via PiMAd. (Receiving FormData from Frontend and parse with Multer lib)
 * @apiName PostPEA
 * @apiGroup PEAController
 * @apiParam {PEAOptions} pea PEAController to be added.
 */
peaRouter.post('/addByPiMAd', upload.single('uploadedFile'),(req, res) => {
	// parse filepath of uploaded file
	let filePath: string = (req as MulterRequest).file.path;
	//create object to pass to PiMAd
	const object = {source:filePath};

	const manager: ModularPlantManager = req.app.get('manager');
	manager.addPEAToPimadPool(object, response => {
		// TODO: handle failure case
		res.status(200).send('"'+response.getMessage()+'"');
	});
});

/**
 * @api {get}    Get all PEAs
 * @apiName GetPEAs
 * @apiGroup PEAController
 */
peaRouter.get('', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	manager.getAllPEAsFromPimadPool(response => {
		// TODO: handle failure case
		res.status(200).send(response.getContent());
		}
	);
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
		res.json(manager.getPEAController(req.params.peaId).json());
	} catch (err) {
		res.status(constants.HTTP_STATUS_NOT_FOUND).send(err.toString());
	}
});

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
 * @api {post} /:peaId/connect    Connect PEAController by ID
 * @apiName ConnectPEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be connected.
 */
peaRouter.post('/:peaId/connect', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const pea = manager.getPEAController(req.params.peaId);
	await pea.connect();
	res.json({pea: pea.id, status: 'Successfully connected'});
}));

/**
 * @api {post} /:peaId/disconnect    Disconnect PEAController
 * @apiName DisconnectPEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be disconnected.
 */
peaRouter.post('/:peaId/disconnect', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const pea = manager.getPEAController(req.params.peaId);
	await pea.disconnect();
	res.json({pea: pea.id, status: 'Successfully disconnected'});
}));

/**
 * @api {delete} /:peaId    Delete PEAController  by ID
 * @apiName DeletePEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be deleted
 */
/*
peaRouter.delete('/:peaId', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		await manager.removePEA(req.params.peaId);
		res.send({status: 'Successful deleted', peaId: req.params.peaId});
	} catch (err) {
		res.status(404).send(err.toString());
	}
}));*/

/**
 * @api {delete} /:peaId    Delete PEAController  by ID
 * @apiName DeletePEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be deleted
 */

peaRouter.delete('/:peaId', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	manager.deletePEAFromPimadPool(req.params.peaId,response => {
		// TODO: handle failure case
		res.status(200).send('"'+response.getMessage()+'"');
		}
	);
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
 * @apiGroup PEAController
 * @apiParam {string} peaId      PEAController id
 * @apiParam {string} serviceName   Name of service
 */
peaRouter.get('/:peaId/service/:serviceName', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const service = manager.getService(req.params.peaId, req.params.serviceName);
	res.json(service.json());
}));

/**
 *This interface is needed for Multer to work correctly.
 */
interface MulterRequest extends Request {
	file: any;
}
