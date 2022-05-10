/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

import {BackendNotification} from '@p2olab/polaris-interface';
import {ModularPlantManager} from '../modularPlantManager';
import Middleware from './middleware';
import Routes from './routes';
import * as serverHandlers from './serverHandlers';

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {AddressInfo} from 'ws';
import {catServer} from '../logging';

export class Server {

	public readonly app: express.Application;
	public wss?: WebSocket.Server;
	private httpServer?: http.Server;
	private interval?: NodeJS.Timeout;

	constructor(manager: ModularPlantManager) {
		this.app = express();
		Middleware.init(this.app, manager);
		Routes.init(this.app);

		manager.on('notify', (notification) => {
			this.notifyClients(notification);
		});
	}

	/**
	 * Method to start a http-Server on specified port
	 * @param port - port of http-Server
	 */
	public startHttpServer(port: number | string | boolean): void {
		this.httpServer = http.createServer(this.app);
		this.app.set('port', port);
		this.httpServer.listen(port);
		this.httpServer.on('error', (error) => serverHandlers.onError(error, port));
		this.httpServer.on('listening', () => {
			if (!this.httpServer){
				throw new Error('http.Server undefined!');
			}
			const addr: (AddressInfo | string | null) = this.httpServer.address();
			if(addr != null) {
				const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
				catServer.info(`Listening on ${bind}`);
			}
		});
	}
	/**
	 * Method for the initialization of a new socket on http-webserver.
	 */
	public initSocketServer(): void {
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

	/**
	 * Method for notification of all clients via websockets about a data refresh
	 * @param notification - {@link BackendNotification} to be sent to all clients within websocket
	 */
	private notifyClients(notification: BackendNotification): void {
		catServer.trace(`WS refresh published: ${JSON.stringify(notification)}`);
		if (this.wss) {
			this.wss.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(notification));
				}
			});
		}
	}
	/**
	 * Method to stop the server and close all related websockets
	 */
	public async stop(): Promise<void> {
		if (this.interval) {
			global.clearInterval(this.interval);
		}
		this.httpServer?.close();
		this.httpServer = undefined;
		await this.wss?.close();
		this.wss = undefined;
	}
}
