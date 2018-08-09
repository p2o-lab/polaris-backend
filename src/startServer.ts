import * as debug from 'debug';
import * as http from 'http';
import {Server} from './server/server';
import * as serverHandlers from './server/serverHandlers';
import {recipe_manager} from "./model/RecipeManager";
import * as fs from "fs";

debug('ts-express:server');

const port: number | string | boolean = serverHandlers.normalizePort(process.env.PORT || 3000);

const appServer = new Server();
appServer.app.set('port', port);
console.log(`Server listening on port ${port}`);

const server: http.Server = http.createServer(appServer.app);

//initialize the WebSocket server instance
appServer.initSocketServer(server);

server.listen(port);
server.on('error', error => serverHandlers.onError(error, port));
server.on('listening', serverHandlers.onListening.bind(server));


let modulesOptions = JSON.parse(fs.readFileSync('test/modules/modules_achema.json').toString());
recipe_manager.loadModule(modulesOptions);

modulesOptions = JSON.parse(fs.readFileSync('test/modules/module_cif.json').toString());
recipe_manager.loadModule(modulesOptions);

//recipe_manager.loadRecipeFromPath('test/recipes/recipe_time_local.json');
recipe_manager.loadRecipeFromPath('test/recipes/recipe_p2o_cif_testmodule.json');

recipe_manager.connect();
