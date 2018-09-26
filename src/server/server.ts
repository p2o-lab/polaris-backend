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
import Routes from './routes';
import Middleware from '../config/middleware';
import * as WebSocket from 'ws';
import { manager } from '../model/Manager';
import { catServer } from '../config/logging';
import {fixReactor} from "../automaticMode";

export class Server {

    public app: express.Application;
    public wss: WebSocket.Server;

    constructor() {
        this.app = express();
        fixReactor();
        Middleware.init(this);
        Routes.init(this);
    }

    initSocketServer(server) {
        this.wss = new WebSocket.Server({ server });
        this.wss.on('connection', (ws: WebSocket) => {
            catServer.info('WS Client connected');
        });

        manager.eventEmitter.on('refresh', (data, action) => {
            catServer.trace(`WS refresh published ${data} ${action}`);
            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ msg: 'refresh', data, action }));
                }
            });
        });
    }
}
