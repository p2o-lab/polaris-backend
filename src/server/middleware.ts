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

import * as cors from 'cors';
import * as express from 'express';
import {Request} from 'express';
import {Response} from 'express';
import {NextFunction} from 'express';
import {catServer} from '../logging/logging';
import {Manager} from '../model/Manager';

export default class Middleware {
    public static init(app: express.Application, manager: Manager): void {

        // express middleware
        app.use(express.json({limit: '10mb'}));
        app.use(express.urlencoded({
            extended: true,
            limit: '10mb'
        }));
        app.use(cors());

        // cors
        app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With,' +
                ' Content-Type, Accept,' +
                ' Authorization,' +
                ' Access-Control-Allow-Credentials'
            );
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });

        // Provide manager in all requests
        app.set('manager', manager);
        // Logging all requests
        app.use((req: Request, res: Response, next: NextFunction) => {
            catServer.info(`${req.method} ${req.url}`);
            next();
        });
    }
}
