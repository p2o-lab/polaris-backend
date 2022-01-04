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
import * as path from 'path';

export const pimadRouter: Router = Router();


/**
 *This interface is needed for Multer to work correctly.
 */
interface MulterRequest extends Request {
	file: any;
}

// set up Multer for parsing uploaded file
const fs = require('fs');
const multer = require('multer');

// delete uploads folder if exists
if (fs.existsSync('uploads/')) {
	fs.rmdirSync('uploads/', {recursive: true});
}
// create new uploads folder
fs.mkdirSync('uploads/');

// set up filename and destination
const storage = multer.diskStorage({
	destination: function (req: any, file: any, cb: any) {
		cb(null, path.join('uploads/'));
	},
	filename: (req: any, file: { filename: string; originalname: any }, cb: (arg0: null, arg1: string) => void) => {
		cb(null, file.originalname);
	}
});
const upload = multer({storage: storage});



/**
 * @api {post} /addPEA Add PEA to PiMAd PEA Pool by receiving MTP FormData from Frontend and parse with Multer lib
 * @apiName PostPEA
 * @apiGroup PiMAd
 * @apiParam {PEAOptions} MTP of PEA to be added.
 */
pimadRouter.post('/addPEA', upload.single('uploadedFile'), async (req, res) => {
	// parse filepath of uploaded file
	const filePath: string = (req as MulterRequest).file.path;
	//create object to pass to PiMAd
	const object = {source:filePath};

	const manager: ModularPlantManager = req.app.get('manager');
	try{
		await manager.addPEAToPimadPool(object);
		res.status(200).send('"Success!"');
	} catch(e){
		console.log(e);
		res.status(500).send('"'+e.toString()+'"');
	}
});

/**
 * @api {get} Get all PEAs from PiMAd
 * @apiName GetPiMAdPEAs
 * @apiGroup PiMAd
 */
pimadRouter.get('/allPEAs', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		const pimadPEAs = await manager.getAllPEAsFromPimadPool();
		res.status(200).send(pimadPEAs);
	} catch(e){
		console.log(e);
		res.status(500).send('"'+e.toString()+'"');
	}
}));

/**
 * @api {get} /:peaId  Get PEA from PiMAd
 * @apiName GetPEA
 * @apiGroup PiMAd
 * @apiParam {string} peaId  ID of PEAController to be received as json
 */
pimadRouter.get('/:peaId', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		res.send(manager.getPEAController(req.params.peaId).json());
	} catch (e) {
		console.log(e);
		res.status(constants.HTTP_STATUS_NOT_FOUND).send(e.toString());
	}
});

/**
 * @api {delete} /:peaId    Delete PEA by identifier
 * @apiName DeletePEA
 * @apiGroup PiMAd
 * @apiParam {string} identifier
 */

pimadRouter.delete('/:peaId', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try{
		await manager.deletePEAFromPimadPool(req.params.peaId);
		res.status(200).send('"Successfully deleted PiMAd-PEA!"');
	} catch(e){
		console.log(e);
		res.status(500).send('"'+e.toString()+'"');
	}
}));
