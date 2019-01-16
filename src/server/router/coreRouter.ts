/*
 * MIT License
 *
 * Copyright (c) 2018 Markus Graube <markus.graube@tu.dresden.de>,
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

import { manager } from '../../model/Manager';
import { Request, Response, Router } from 'express';
import * as asyncHandler from 'express-async-handler';
import { messages } from '../../config/logging';

export const coreRouter: Router = Router();

/**
 * @api {get} /    Get Manager
 * @apiName GetManager
 * @apiGroup Manager
 */
coreRouter.get('/', (req: Request, res: Response) => {
    const result = manager.json();
    res.json(result);
});

/**
 * @api {get} /autoReset    Get autoReset
 * @apiName GetAutoReset
 * @apiDescription Get status of autoReset
 * @apiGroup Manager

 */
coreRouter.get('/autoReset', asyncHandler(async (req: Request, res: Response) => {
    res.json({ autoReset: manager.autoreset });
}));

/**
 * @api {post} /autoReset   Set autoReset
 * @apiName PostAutoReset
 * @apiDescription Set status of autoReset and returns updated value
 * @apiGroup Manager
 * @apiParam {Boolean} autoReset      new value of autoReset
 */
coreRouter.post('/autoReset', asyncHandler(async (req: Request, res: Response) => {
    manager.autoreset = isTrue(req.body.autoReset);
    res.json({ autoReset: manager.autoreset });
}));

/**
 * @api {get} /logs   Get logs
 * @apiName GetLogs
 * @apiGroup Manager
 */
coreRouter.get('/logs(.json)?', asyncHandler(async (req: Request, res: Response) => {
    res.contentType('application/json').attachment()
        .send(JSON.stringify(messages, null, 4));
}));

/**
 * @api {get} /logs/variables   Get variable logs
 * @apiName GetVariableLogs
 * @apiGroup Manager
 */
coreRouter.get('/logs/variables(.json)?', asyncHandler(async (req: Request, res: Response) => {
    res.contentType('application/json').attachment()
        .send(JSON.stringify(manager.variableArchive.slice(-1000), null, 2));
}));

/**
 * @api {get} /logs/services   Get services logs
 * @apiName GetServicesLogs
 * @apiGroup Manager
 */
coreRouter.get('/logs/services(.json)?', asyncHandler(async (req: Request, res: Response) => {
    res.contentType('application/json').attachment()
        .send(JSON.stringify(manager.serviceArchive.slice(-1000), null, 2));
}));

function isTrue(value: any) {
    let valueTmp;
    if (typeof(value) === 'string') {
        valueTmp = value.trim().toLowerCase();
    } else {
        valueTmp = value;
    }
    switch (valueTmp) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
        return true;
    default:
        return false;
    }
}
