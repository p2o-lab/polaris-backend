import * as debug from 'debug';
import * as http from 'http';
import {Server} from './server/server';
import * as serverHandlers from './server/serverHandlers';

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


/** Load some configuration at startup */

//let modulesOptions = JSON.parse(fs.readFileSync('assets/modules/modules_achema.json').toString());
//recipe_manager.loadModule(modulesOptions);

//modulesOptions = JSON.parse(fs.readFileSync('assets/modules/module_cif.json').toString());
//recipe_manager.loadModule(modulesOptions);

//recipe_manager.loadRecipeFromPath('assets/recipes/recipe_time_local.json');
//recipe_manager.loadRecipeFromPath('assets/recipes/recipe_p2o_cif_testmodule.json');
//recipe_manager.loadRecipeFromPath('assets/recipes/recipe_reactor_only.json');
//recipe_manager.loadRecipeFromPath('assets/recipes/recipe_achema.json');
