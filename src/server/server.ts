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
import {Manager} from '../model/Manager';
import { catServer } from '../config/logging';
import {IncomingMessage} from 'http';

export class Server {

    public app: express.Application;
    public wss: WebSocket.Server;

    constructor(manager: Manager) {
        this.app = express();
        Middleware.init(this);
        Routes.init(this, manager);
        manager.on('notify', (message, data) => this.notifyClients(message, data));
    }

    initSocketServer(server) {
        this.wss = new WebSocket.Server({ server });
        this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            catServer.info(`WS Client connected: ${req.connection.remoteAddress}`);
        });
    }

    /** Notify all clients via websockets about refresh of data
     *
     * @param message "module", "recipes", "player", "action"
     * @param data
     */
    private notifyClients(message: string, data: any) {
        catServer.trace(`WS refresh published ${message} ${data}`);
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ message, data }));
            }
        });
    }
}
