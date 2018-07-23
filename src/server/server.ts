import * as express from 'express';
import Routes from './routes';
import Middleware from '../config/middleware';

export class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        Middleware.init(this);
        Routes.init(this);
    }
}
