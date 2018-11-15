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

import * as express from 'express';
import { Request } from 'express';
import { moduleRouter } from './router/moduleRouter';
import { recipeRouter } from './router/recipeRouter';
import { catServer } from '../config/logging';
import { serviceRouter } from './router/serviceRouter';
import { coreRouter } from './router/coreRouter';
import { playerRouter } from './router/playerRouter';

export default class Routes {
    static init(server): void {

        // Logging all requests
        server.app.use((req: Request, res, next) => {
            catServer.info(`${req.method} ${req.url}`);
            next();
        });

        server.app.use('/doc', express.static('apidoc'));
        server.app.use('/dashboard', express.static('dashboard'));
        server.app.use('/module', moduleRouter);
        server.app.use('/module', serviceRouter);
        server.app.use('/recipe', recipeRouter);
        server.app.use('/player', playerRouter);
        server.app.use('/', coreRouter);

        // Error handling
        server.app.use(function (err, req, res, next) {
            catServer.error(`An Error occured: ${err.toString()}`, err);
            res.status(500).send({ status: 'error', error: err.toString(), stack: err.stack });
        });

    }
}
