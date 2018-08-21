import {manager} from '../../model/Manager';
import {Request, Response, Router} from "express";
import * as asyncHandler from 'express-async-handler';

export const coreRouter: Router = Router();


/**
 * @api {get} /    Get Manager
 * @apiName GetManager
 * @apiGroup Manager
 */
coreRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result = manager.json();
    res.json(result);
}));


/**
 * @api {get} /autoReset    Get status of autoReset
 * @apiName GetAutoReset
 * @apiGroup Manager

 */
coreRouter.get('/autoReset', asyncHandler(async (req: Request, res: Response) => {
    res.json({ autoReset: manager.autoreset});
}));

/**
 * @api {post} /autoReset   Set status of autoReset and returns updated value
 * @apiName PostAutoReset
 * @apiGroup Manager
 * @apiParam {Boolean} autoReset      new value of autoReset
 */
coreRouter.post('/autoReset', asyncHandler(async (req: Request, res: Response) => {
    manager.autoreset = isTrue(req.body.autoReset);
    res.json({ autoReset: manager.autoreset});
}));

function isTrue(value){
    if (typeof(value) === 'string'){
        value = value.trim().toLowerCase();
    }
    switch(value){
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default:
            return false;
    }
}