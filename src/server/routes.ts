import * as express from 'express';
import {Request} from 'express';
import {moduleRouter} from "./router/moduleRouter";
import {recipeRouter} from "./router/recipeRouter";
import {catServer} from "../config/logging";
import {serviceRouter} from "./router/serviceRouter";
import {coreRouter} from "./router/coreRouter";
import {playerRouter} from "./router/playerRouter";

export default class Routes {
    static init(server): void {

        // Logging all requests
        server.app.use((req: Request, res, next) => {
            catServer.info(`${req.method} ${req.url}`);
            next();
        });


        server.app.use('/doc', express.static('apidoc'));
        server.app.use('/module', moduleRouter);
        server.app.use('/module', serviceRouter);
        server.app.use('/recipe', recipeRouter);
        server.app.use('/player', playerRouter);
        server.app.use('/', coreRouter);


        // Error handling
        server.app.use(function (err, req, res, next) {
            catServer.error(`An Error occured: ${err.toString()}`, err);
            res.status(500).send({status: 'error', error: err.toString(), stack: err.stack});
        });

    }
}
