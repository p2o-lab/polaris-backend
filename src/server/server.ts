import * as express from 'express';
import Routes from './routes';
import Middleware from '../config/middleware';
import * as WebSocket from 'ws';
import {recipe_manager} from '../model/RecipeManager';
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
            // this.sockets.push(ws);
        });


        recipe_manager.eventEmitter.on('refresh', (data) => {
            catServer.trace(`WS refresh published ${data}`);
            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('refresh');
                }
            });
        });

        recipe_manager.eventEmitter.on('recipeCompleted', () => {
            this.wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('recipeCompleted');
                }
            });
        });
    }
}
