import * as debug from 'debug';
import * as http from 'http';
import {Server} from './server/server';
import * as serverHandlers from './server/serverHandlers';
import {recipe_manager} from "./model/RecipeManager";

debug('ts-express:server');

const port: number | string | boolean = serverHandlers.normalizePort(process.env.PORT || 3000);

const app = new Server().app;
app.set('port', port);
console.log(`Server listening on port ${port}`);

const server: http.Server = http.createServer(app);

server.listen(port);
server.on('error', error => serverHandlers.onError(error, port));
server.on('listening', serverHandlers.onListening.bind(server));

recipe_manager.loadRecipeFromPath('test/recipes/recipe_p2o_cif_testmodule.json');
recipe_manager.connect();
