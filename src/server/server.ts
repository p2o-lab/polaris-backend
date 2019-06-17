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
import * as http from 'http';
import * as WebSocket from 'ws';
import {catServer} from '../config/logging';
import Middleware from '../config/middleware';
import {Manager} from '../model/Manager';
import Routes from './routes';
import * as serverHandlers from './serverHandlers';

export class Server {

    public readonly app: express.Application;
    public wss: WebSocket.Server;
    private httpServer: http.Server;
    private interval: NodeJS.Timeout;

    constructor(manager: Manager) {
        this.app = express();
        Middleware.init(this.app);
        Routes.init(this.app, manager);

        manager.on('notify', (message, data) => this.notifyClients(message, data));
    }

    public startHttpServer(port: number | string | boolean) {
        this.httpServer = http.createServer(this.app);

        this.app.set('port', port);
        this.httpServer.listen(port);
        this.httpServer.on('error', (error) => serverHandlers.onError(error, port));
        this.httpServer.on('listening', () => {
            const addr: any = this.httpServer.address();
            const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
            catServer.info(`Listening on ${bind}`);
        });
    }

    public async stop() {
        global.clearInterval(this.interval);
        await this.httpServer.close();
        this.httpServer = null;
        await this.wss.close();
        this.wss = null;
    }

    public initSocketServer() {
        if (this.httpServer) {
            this.wss = new WebSocket.Server({server: this.httpServer});
            this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
                catServer.info(`WS Client connected: ${req.connection.remoteAddress}`);
                this.interval = global.setInterval(function ping() {
                    ws.send(JSON.stringify({message: 'ping'}));
                }, 3000);
            });
        } else {
            throw new Error('Running HTTP server is required');
        }
    }

    /** Notify all clients via websockets about refresh of data
     *
     * @param message "module", "recipes", "player", "action"
     * @param data
     */
    private notifyClients(message: string, data: any) {
        catServer.trace(`WS refresh published ${message}`);
        if (this.wss) {
            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({message, data}));
                }
            });
        }
    }
}
