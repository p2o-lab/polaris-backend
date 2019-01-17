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

import * as http from 'http';
import {Server} from './server/server';
import * as serverHandlers from './server/serverHandlers';
import * as commandLineArgs from 'command-line-args';
import * as fs from 'fs';
import {manager} from './model/Manager';
import {ExternalTrigger} from './server/ExternalTrigger';
import commandLineUsage = require('command-line-usage');
import {catModule} from "./config/logging";
import {fixReactor} from "./server/automaticMode";

const optionDefinitions = [
    {
        name: 'module',
        alias: 'm',
        type: String,
        multiple: true,
        typeLabel: '{underline modulePath[]}',
        description: 'path to module.json which should be loaded at startup'
    },
    {
        name: 'recipe',
        alias: 'r',
        type: String,
        multiple: true,
        typeLabel: '{underline recipePath[]}',
        description: 'path to recipe.json which should be loaded at startup'
    },
    {
        name: 'fixReactor',
        alias: 'f',
        type: Boolean,
        default: false,
        description: 'fix operation mode of reactor in ACHEMA module at startup'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide.'
    },
    {
        name: 'externalTrigger',
        alias: 'e',
        type: String,
        multiple: true,
        typeLabel: '{underline opcuaEndpoint} {underline opcuaNodeid}',
        description: 'Monitors an OPC UA node (specified via {underline opcuaNodeId}) on the OPC UA server (specified by {underline opcuaEndpoint}. If the node changes to true or is true when the player completes, the player start from the first recipe.'
    }
];
const sections = [
    {
        header: 'pfe-ree-node',
        content: 'Starts recipe execution engine for controlling services of modules.'
    },
    {
        header: 'Synopsis',
        content: [
            '$ node build/index.js [{bold --module} {underline modulePath}] [{bold --recipe} {underline recipePath}] [{bold --externalTrigger} {underline opcuaEndpoint} {underline opcuaNodeid}]'
        ]
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    },
    {
        header: 'Examples',
        content: [
            {
                desc: 'Watching a OPC UA server',
                example: '$ node src/index.js --externalTrigger opc.tcp://127.0.0.1:53530/OPCUA/SimulationServer "ns=3;s=BooleanDataItem"'
            }]
    }
];

let options;
try {
    options = commandLineArgs(optionDefinitions);
} catch (err) {
    console.log('Error: Could not parse command line arguments', err.toString());
    console.log(commandLineUsage(sections));
}
if (options) {
    if (options.help) {
        console.log(commandLineUsage(sections));
    } else {
        const port: number | string | boolean = serverHandlers.normalizePort(process.env.PORT || 3000);

        const appServer = new Server();
        appServer.app.set('port', port);

        const server: http.Server = http.createServer(appServer.app);

        // initialize the WebSocket server instance
        appServer.initSocketServer(server);

        server.listen(port);
        server.on('error', error => serverHandlers.onError(error, port));
        server.on('listening', serverHandlers.onListening.bind(server));

        /** Load some configuration at startup */
        if (options.module && options.module.length > 0) {
            console.log(`Load modules from ${options.module}`);
            options.module.forEach((module) => {
                const modulesOptions = JSON.parse(fs.readFileSync(module).toString());
                manager.loadModule(modulesOptions, true);
            });
            manager.modules.forEach(module =>
                module.connect()
                    .catch(reason =>
                        catModule.warn(`Could not connect to module ${module.id}: ${reason}`)
                        )
            );
        }

        if (options.recipe && options.recipe.length > 0) {
            console.log(`Load recipe from ${options.recipe}`);
            options.recipe.forEach((recipe) => {
                const recipeOptions = JSON.parse(fs.readFileSync(recipe).toString());
                manager.loadRecipe(recipeOptions, true);
            });
        }

        if (options.fixReactor) {
            fixReactor();
        }

        /* Start OPC UA external trigger */
        if (options.externalTrigger) {
            console.log('External Trigger:', options.watch);
            const endpoint = options.externalTrigger[0];
            const nodeId = options.externalTrigger[1];

            const et = new ExternalTrigger(endpoint, nodeId);
            et.startMonitoring();
            // directly restart recipe if external trigger is still active when recipe finishes
            manager.on('recipeFinished', async () => {
                const value = await et.getValue();
                console.log('external trigger', value);
                if (value) {
                    manager.player.start();
                }
            });
        }
    }
}