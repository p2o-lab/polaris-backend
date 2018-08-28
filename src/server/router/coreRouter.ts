import {manager} from '../../model/Manager';
import {Request, Response, Router} from "express";
import * as asyncHandler from 'express-async-handler';
import {messages} from "../../config/logging";

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
 * @api {get} /activeRecipe    Get active Recipe
 * @apiName GetActiveRecipe
 * @apiGroup Manager
 */
coreRouter.get('/activeRecipe', asyncHandler(async (req, res) => {
    if (manager.activeRecipe) {
        const result = await manager.activeRecipe.json();
        res.json(result);
    } else {
        throw new Error('No recipe active');
    }
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
 * @api {post} /autoReset   Set autoReset
 * @apiName PostAutoReset
 * @apiDescription Set ststus of autoReset and returns updated value
 * @apiGroup Manager
 * @apiParam {Boolean} autoReset      new value of autoReset
 */
coreRouter.post('/autoReset', asyncHandler(async (req: Request, res: Response) => {
    manager.autoreset = isTrue(req.body.autoReset);
    res.json({ autoReset: manager.autoreset});
}));


/**
 * @api {get} /logs   Get logs
 * @apiName GetLogs
 * @apiGroup Manager
 */
coreRouter.get('/logs', asyncHandler(async (req: Request, res: Response) => {
    res.json(messages);
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