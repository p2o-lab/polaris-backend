import * as express from 'express';
import Routes from './routes';
import Middleware from '../config/middleware';
import * as WebSocket from 'ws';
import {manager} from '../model/Manager';
import {catServer} from "../config/logging";

export class Server {

    public app: express.Application;
    public wss: WebSocket.Server;

    constructor() {
        this.app = express();
        Middleware.init(this);
        Routes.init(this);
    }

    initSocketServer(server) {
        this.wss = new WebSocket.Server({server});
        this.wss.on('connection', (ws: WebSocket) => {
            catServer.info("WS Client connected");
        });


        manager.eventEmitter.on('refresh', (data, action) => {
            catServer.info(`WS refresh published ${data} ${action}`);
            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({msg: 'refresh', data: data, action: action}));
                }
            });
        });
    }
}
