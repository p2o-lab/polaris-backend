import * as cors from 'cors';
import * as express from 'express';

export default class Middleware {
    static init(server): void {

        // express middleware
        server.app.use(express.json());
        // server.app.use(express.urlencoded());
        server.app.use(cors());

        // cors
        server.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    }
}

