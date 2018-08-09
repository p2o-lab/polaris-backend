import * as express from 'express';
import {Request} from 'express';
import {moduleRouter} from "./router/moduleRouter";
import {recipeRouter} from "./router/recipeRouter";
import {catServer} from "../config/logging";
import {serviceRouter} from "./router/serviceRouter";

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


        // Error handling
        server.app.use(function (err, req, res, next) {
            catServer.error("An Error occured", err);
            res.status(500).send({status: 'Something broke!', error: err.toString(), stack: err.stack});
        });

    }
}
