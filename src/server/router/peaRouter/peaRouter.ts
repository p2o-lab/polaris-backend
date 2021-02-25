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

import {catPEA, ModularPlantManager} from '../../../modularPlantManager';

import {Request, Response, Router} from 'express';
import * as asyncHandler from 'express-async-handler';
import {constants} from 'http2';
import {catServer} from '../../server';

export const peaRouter: Router = Router();

/**
 * @api {get} /pea/    Get all PEAs
 * @apiName GetPEAs
 * @apiGroup PEA
 */
peaRouter.get('', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.json(await manager.getPEAs());
}));

/**
 * @api {get} /pea/:id    Get PEA
 * @apiName GetPEA
 * @apiGroup PEA
 * @apiParam {string} id    PEA id
 */
peaRouter.get('/:id', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		res.json(manager.getPEA(req.params.id).json());
	} catch (err) {
		res.status(constants.HTTP_STATUS_NOT_FOUND).send(err.toString());
	}
});

/**
 * @api {get} /pea/:id/download    Download PEA options
 * @apiName GetModuleDownload
 * @apiGroup PEA
 * @apiParam {string} id    PEA ID
 */
peaRouter.get('/:id/download', (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.json(manager.getPEA(req.params.id).options);
});

/**
 * @api {put} /pea    Add PEA
 * @apiName PutPEA
 * @apiGroup PEA
 * @apiParam {PEAOptions} pea    PEA to be added
 */
peaRouter.put('', (req, res) => {
	catServer.info('Load PEA');
	const manager: ModularPlantManager = req.app.get('manager');
	const newPEAs = manager.load(req.body);
	newPEAs.forEach((p) =>
		p.connect()
			.catch(() => catPEA.warn(`Could not connect to PEA ${p.id}`))
	);
	res.json(newPEAs.map((m) => m.json()));
});

/**
 * @api {delete} /pea/:id    Delete PEA
 * @apiName DeletePEA
 * @apiGroup PEA
 * @apiParam {string} id    PEA ID to be deleted
 */
peaRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	try {
		await manager.removePEA(req.params.id);
		res.send({status: 'Successful deleted', id: req.params.id});
	} catch (err) {
		res.status(404).send(err.toString());
	}
}));

/**
 * @api {post} /pea/:id/connect    Connect PEA
 * @apiName ConnectPEA
 * @apiGroup PEA
 * @apiParam {string} id    PEA id
 */
peaRouter.post('/:id/connect', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const pea = manager.getPEA(req.params.id);
	await pea.connect();
	res.json({pea: pea.id, status: 'Successfully connected'});
}));

/**
 * @api {post} /pea/:id/disconnect    Disconnect PEA
 * @apiName DisconnectPEA
 * @apiGroup PEA
 * @apiParam {string} id    PEA ID
 */
peaRouter.post('/:id/disconnect', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	const pea = manager.getPEA(req.params.id);
	await pea.disconnect();
	res.json({pea: pea.id, status: 'Successfully disconnected'});
}));
