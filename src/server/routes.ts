import * as express from 'express';
import {Request} from 'express';
import {moduleRouter} from "./moduleRouter";
import {recipeRouter} from "./recipeRouter";
import {catServer} from "../config/logging";

export default class Routes {
    static init(server): void {

        // Logging all requests
        server.app.use((req: Request, res, next) => {
            catServer.info(`${req.method} ${req.url}`);
            next();
        });


        server.app.use('/doc', express.static('apidoc'));
        server.app.use('/module', moduleRouter);
        server.app.use('/recipe', recipeRouter);


        // Error handling
        server.app.use(function (err, req, res, next) {
            catServer.error("An Error occured", err);
            res.status(500).send({status: 'Something broke!', error: err.toString(), stack: err.stack});
        });

    }
}
