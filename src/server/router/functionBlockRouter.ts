/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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
import { catServer } from '../../config/logging';
import { Request, Response, Router } from 'express';
import * as asyncHandler from 'express-async-handler';
import {FunctionBlock} from '../../model/functionBlock/FunctionBlock';

export const functionBlockRouter: Router = Router();

/**
 * @api {get} /functionBlock    Get function block list
 * @apiName GetFunctionBlockList
 * @apiGroup FunctionBlock
 */
functionBlockRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result = manager.functionBlocks.map(async (fb: FunctionBlock) => await fb.json());
    res.json(result);
}));

/**
 * @api {get} /functionBlock/:functionBlockId    Get function block
 * @apiName GetFunctionBlock
 * @apiGroup FunctionBlock
 * @apiParam functionBlockId
 */
functionBlockRouter.get('/:functionBlockId', asyncHandler(async (req: Request, res: Response) => {
    const fb = manager.functionBlocks.find(fb => fb.name === req.params.functionBlockId);
    if (fb) {
        res.json(await fb.json());
    } else {
        throw new Error('No such function block');
    }
}));

/**
 * @api {delete} /functionBlock/:functionBlockId    Delete function block
 * @apiName DeleteFunctionBlock
 * @apiGroup FunctionBlock
 * @apiParam functionBlockId   id of function block to be deleted
 */
functionBlockRouter.delete('/:functionBlockId', asyncHandler(async (req: Request, res: Response) => {
    try {
        manager.removeFunctionBlock(req.params.functionBlockId);
        res.send({ status: 'Successful deleted', id: req.params.functionBlockId });
    } catch (err) {
        res.status(400).send(err.toString());
    }
}));

/**
 * @api {put} /functionBlock    Instantiate function block
 * @apiName PutFunctionBlock
 * @apiGroup FunctionBlock
 * @apiParam {string} name  new function block name
 * @apiParam {string} type  new function block type
 */
functionBlockRouter.put('', asyncHandler(async (req: Request, res: Response) => {
    catServer.debug(`PUT /functionBlock: ${JSON.stringify(req.body)}`);
    manager.instantiateFunctionBlock(req.body);
    res.json({ status: 'function block successful instantiated' });
}));

/**
 * @api {post} /functionBlock/:functionBlockName/parameter    Configure FunctionBlock
 * @apiName ConfigureFunctionBlock
 * @apiDescription Configure function block parameter
 * @apiGroup FunctionBlock
 * @apiParam {string} functionBlockName   Name of function block
 * @apiParam {ParameterOptions[]} parameters    function block parameter
 */
functionBlockRouter.post('/:functionBlockName/parameter', asyncHandler(async (req: Request, res: Response) => {
    const fb = manager.functionBlocks.find(fb => fb.name === req.params.functionBlockName);
    await fb.setParameters(JSON.parse(req.body.parameters));
    res.json(await fb.json());
}));


/**
 * @api {post} /functionBlock/:functionBlockId/:command    Call function block
 * @apiName CallFunctionBlock
 * @apiGroup FunctionBlock
 * @apiParam {string} functionBlockId   Name of function block
 * @apiParam {string="start","stop","abort","complete","pause","unhold","reset"} command       Command name
 * @apiParam {ParameterOptions[]} [parameters]    Parameters for *start* or *restart*
 */
functionBlockRouter.post('/:functionBlockId/:command', asyncHandler(async (req: Request, res: Response) => {
    catServer.info(`Call function block: ${JSON.stringify(req.params)} - ${JSON.stringify(req.body)}`);
    const fb = manager.functionBlocks.find(fb => fb.name === req.params.functionBlockId);

    if (req.body.parameters) {
        await fb.setParameters(req.body.parameters);
    }
    const result = await fb.executeCommand(req.params.command);
    res.json({
        functionBlock: fb.name,
        command: req.params.command,
        status: 'Command succesfully send'
    });
}));

