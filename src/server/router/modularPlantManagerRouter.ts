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

import {messages} from '../../logging';
import {ModularPlantManager} from '../../modularPlantManager';

import {Request, Response, Router} from 'express';
import * as asyncHandler from 'express-async-handler';
import yn from 'yn';
import {version} from '../../../package.json';
import {peaRouter} from './peaRouter/peaRouter';
import {recipeRunRouter} from './recipeRouter/recipeRunRouter';
import {recipeRouter} from './recipeRouter/recipeRouter';
import {playerRouter} from './recipeRouter/playerRouter';
import {polServiceRouter} from './polServiceRouter/polServiceRouter';
import {pimadRouter} from './pimadRouter/pimadRouter';

export const modularPlantManagerRouter: Router = Router();

modularPlantManagerRouter.use('/pea', peaRouter);
modularPlantManagerRouter.use('/pimad', pimadRouter);
modularPlantManagerRouter.use('/polService', polServiceRouter);
modularPlantManagerRouter.use('/recipeRun', recipeRunRouter);
modularPlantManagerRouter.use('/recipe', recipeRouter);
modularPlantManagerRouter.use('/player', playerRouter);

/**
 * @api {post} /shutdown    Shutdown
 * @apiName Shutdown
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.post('/shutdown', () => {
	process.exit();
});

/**
 * @api {get} /version    Get version
 * @apiName GetVersion
 * @apiDescription  Get version of polaris-backend
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.get('/version', (req: Request, res: Response) => {
	res.json({version: version});
});

/**
 * @api {get} /autoReset    Get autoReset
 * @apiName GetAutoReset
 * @apiDescription Get statusNode of autoReset
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.get('/autoReset', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.json({autoReset: manager.autoReset});
}));

/**
 * @api {post} /autoReset   Set autoReset
 * @apiName PostAutoReset
 * @apiDescription Set statusNode of autoReset and returns updated value
 * @apiGroup ModularPlantManager
 * @apiParam {Boolean} autoReset      new value of autoReset
 */
modularPlantManagerRouter.post('/autoReset', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	manager.autoReset = yn(req.body.autoReset, {default: false});
	res.json({autoReset: manager.autoReset});
}));

/**
 * @api {post} /abort    Abort all services
 * @apiName AbortAllServices
 * @apiDescription Abort all services from all PEAs
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.post('/abortAllServices', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	await manager.abortAllServices();
	res.json({status: 'aborted all services from all PEAs'});
}));

/**
 * @api {post} /stop    Stop all services
 * @apiName StopAllServices
 * @apiDescription Abort all services from all PEAs
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.post('/stopAllServices', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	await manager.stopAllServices();
	res.json({status: 'stopped all services from all PEAs'});
}));

/**
 * @api {post} /resetAllServices    Reset all services
 * @apiName ResetAllServices
 * @apiDescription Reset all services on all PEAs
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.post('/resetAllServices', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	await manager.resetAllServices();
	res.json({status: 'reset all services from all PEAs'});
}));

/**
 * @api {get} /logs   Get logs
 * @apiName GetLogs
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.get('/logs(.json)?', asyncHandler(async (req: Request, res: Response) => {
	res.contentType('application/json').attachment()
		.send(JSON.stringify(messages, null, 4));
}));

/**
 * @api {get} /logs/dataAssemblies   Get variable logs
 * @apiName GetVariableLogs
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.get('/logs/dataAssemblies(.json)?', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.contentType('application/json').attachment()
		.send(JSON.stringify(manager.variableArchive.slice(-1000), null, 2));
}));

/**
 * @api {get} /logs/services   Get services logs
 * @apiName GetServiceLogs
 * @apiGroup ModularPlantManager
 */
modularPlantManagerRouter.get('/logs/services(.json)?', asyncHandler(async (req: Request, res: Response) => {
	const manager: ModularPlantManager = req.app.get('manager');
	res.contentType('application/json').attachment()
		.send(JSON.stringify(manager.serviceArchive.slice(-1000), null, 2));
}));
