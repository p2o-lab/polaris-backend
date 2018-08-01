import * as express from 'express';
import {moduleRouter} from "./moduleRouter";
import {recipeRouter} from "./recipeRouter";

export default class Routes {
    static init(server): void {

        server.app.use('/doc', express.static('apidoc'));
        server.app.use('/module', moduleRouter);
        server.app.use('/recipe', recipeRouter);
    }
}
