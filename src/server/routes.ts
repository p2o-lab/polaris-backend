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
import {NextFunction, Request, Response, static as expressStatic} from 'express';
import {catServer} from '../logging/logging';
import {coreRouter} from './router/coreRouter';
import {moduleRouter} from './router/moduleRouter';
import {playerRouter} from './router/playerRouter';
import {recipeRouter} from './router/recipeRouter';
import {recipeRunRouter} from './router/recipeRunRouter';
import {serviceRouter} from './router/serviceRouter';
import {virtualServiceRouter} from './router/virtualServiceRouter';

export default class Routes {
    public static init(app: express.Application): void {
        app.use('/doc', expressStatic('apidoc'));
        app.use('/api/module', moduleRouter);
        app.use('/api/module', serviceRouter);
        app.use('/api/recipeRun', recipeRunRouter);
        app.use('/api/recipe', recipeRouter);
        app.use('/api/player', playerRouter);
        app.use('/api/virtualService', virtualServiceRouter);
        app.use('/api', coreRouter);

        // Error handling
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            catServer.warn(`Internal server error (HTTP 500): ${err.toString()}`);
            res.status(500).send({ status: 'error', error: err.toString(), stack: err.stack });
        });

    }
}
