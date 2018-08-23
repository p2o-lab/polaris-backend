import * as debug from 'debug';
import * as http from 'http';
import {Server} from './server/server';
import * as serverHandlers from './server/serverHandlers';
import * as commandLineArgs from 'command-line-args';
import * as fs from "fs";
import {manager} from "./model/Manager";

const optionDefinitions = [
    {
        name: 'module', alias: 'm', type: String, multiple: true, defaultOption: true,
        typeLabel: '{underline modulePath[]}', description: 'path to module.json which should be loaded at startup'
    },
    {
        name: 'recipe',
        alias: 'r',
        type: String,
        typeLabel: '{underline recipePath}',
        description: 'path to recipe.json which should be loaded at startup'
    },
    {name: 'help', alias: 'h', type: Boolean, description: 'Print this usage guide.'}
];
const options = commandLineArgs(optionDefinitions);
if (options.help) {

    const commandLineUsage = require('command-line-usage');

    const sections = [
        {
            header: 'pfe-ree-node',
            content: 'Starts recipe execution engine for controlling services of modules.'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        }
    ];
    const usage = commandLineUsage(sections);
    console.log(usage);
} else {
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
    if (options.module) {
        options.module.forEach((module) => {
            const modulesOptions = JSON.parse(fs.readFileSync(module).toString());
            manager.loadModule(modulesOptions);
        });
    }

    if (options.recipe) {
        const recipeOptions = JSON.parse(fs.readFileSync(options.recipe).toString());
        manager.loadRecipe(recipeOptions);
    }
}