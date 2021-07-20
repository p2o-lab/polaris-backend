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

import {ModularPlantManager, ServiceState} from '../../../modularPlantManager';
import {Request, Response, Router} from 'express';
import * as asyncHandler from 'express-async-handler';
import {constants} from 'http2';
import {ServiceCommand} from '@p2olab/polaris-interface';
import {catServer} from '../../../logging';
import * as path from 'path';

export const peaRouter: Router = Router();

/**
 * @api {post} /addByOptions    Load/Instantiate PEAController via PEAController-options directly
 * @apiName PostPEA
 * @apiGroup PEAController
 * @apiParam {PEAOptions} pea    PiMAdIdentifier
 */
peaRouter.post('/loadPEA', async (req, res) => {
	catServer.info('Load PEAController via PEAController-Options');
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		await manager.loadPEAController(req.body.id);
		res.status(200).send('"Success!"');
	} catch (err) {
		res.status(500).send(err.toString());
	}
});

// TODO: Place this code somewhere else?
// set up Multer for parsing uploaded file
const fs = require('fs');
const multer = require('multer');
// create uploads directory
if (fs.existsSync('uploads/')) {
	// delete uploads folder, because it could contain files, which haven't been deleted successfully due to crash
	fs.rmdirSync('uploads/', {recursive: true});
}// create new uploads folder
fs.mkdirSync('uploads/');

// set up filename and destination
const storage = multer.diskStorage({
	destination: function (req: any, file: any, cb: any) {
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
	const filePath: string = (req as MulterRequest).file.path;
	//create object to pass to PiMAd
	const object = {source:filePath};

	const manager: ModularPlantManager = req.app.get('manager');
	manager.addPEAToPimadPool(object, response => {
		if(response.getMessage()=='Success!'){
			res.status(200).send('"'+response.getMessage()+'"');
		}else{
			res.status(500).send('"'+response.getMessage()+'"');
		}
		// delete file
		fs.unlinkSync(filePath);
	});
});

/**
 * @api {get} Get all PEAs from PiMAd
 * @apiName GetPiMAdPEAs
 * @apiGroup PEAController
 */
peaRouter.get('/PiMAdPEAs', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	manager.getAllPEAsFromPimadPool(response => {
			if (response.getMessage() == 'Success!') {
				res.status(200).send(response.getContent());
			} else {
				res.status(500).send('"'+response.getMessage()+'"');
			}
		}
	);
}));

/**
 * @api {get} Get all PEAControllers
 * @apiName GetPEAControllers
 * @apiGroup PEAController
 */
peaRouter.get('', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		res.json(manager.getAllPEAControllers());
	} catch (err) {
		res.status(500).send(err.toString());
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
	} catch (err) {
		res.status(constants.HTTP_STATUS_NOT_FOUND).send(err.toString());
	}
});

/**
 * @api {get} /:peaId/getServerSettings
 * @apiName GetSettings
 * @apiGroup PEAController
 * @apiParam {string} peaId
 */
peaRouter.get('/:peaId/getServerSettings', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const peaControllerCon = manager.getPEAController(req.params.peaId).connection;
		const body= {serverUrl: peaControllerCon.endpoint, username: peaControllerCon.username, password: peaControllerCon.password};
		res.status(200).send(body);
	}catch (e) {
		res.status(500).send(e.toString());
	}

});

/**
 * @api {post} /updateSettings
 * @apiName PostSettings
 * @apiGroup PEAController
 * @apiParam {ServerSettingsOptions}  [options]
 */
peaRouter.post('/updateSettings', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		manager.updateServerSettings(req.body.options);
		res.status(200).send('"'+'Success!'+'"');
	} catch(e){
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
 * @api {post} /:peaId/connect    Connect PEAController by ID
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
	} catch (e) {
		res.status(500).send(e.toString());
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
	}catch (e) {
		res.status(500).send(e.toString());
	}

}));

/**
 * @api {delete} /:peaId    Delete PEAController  by ID
 * @apiName DeletePEA
 * @apiGroup PEAController
 * @apiParam {string} peaId    ID of PEAController to be deleted
 */

peaRouter.delete('/:peaId', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		await manager.removePEAController(req.params.peaId);
		res.status(200).send('"Success!"');
	} catch (err) {
		res.status(404).send(err.toString());
	}
}));

/**
 * @api {delete} /:peaId    Delete PiMAdPEA  by identifier
 * @apiName DeletePiMAdPEA
 * @apiGroup PiMAdPEA
 * @apiParam {string} pimadIdentifier
 */

peaRouter.delete('/PiMAd/:peaId', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	manager.deletePEAFromPimadPool(req.params.peaId,response => {
		if(response.getMessage()=='Success!'){
			res.status(200).send('"'+response.getMessage()+'"');
		} else {
			res.status(500).send('"'+response.getMessage()+'"');
		}
	});
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
		await service.executeCommandAndWaitForStateChange(command);
		res.json({
			pea: req.params.peaId,
			service: service.name,
			command: req.params.command,
			status: 'Command succesfully send'
		});
	} catch (err) {
		res.status(500).send(err.toString());
	}


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
