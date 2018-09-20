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
import { Server } from './server/server';
import * as serverHandlers from './server/serverHandlers';
import * as commandLineArgs from 'command-line-args';
import * as fs from 'fs';
import { manager } from './model/Manager';

const optionDefinitions = [
    {
        name: 'module',
        alias: 'm',
        type: String,
        multiple: true,
        defaultOption: true,
        typeLabel: '{underline modulePath[]}',
        description: 'path to module.json which should be loaded at startup'
    },
    {
        name: 'recipe',
        alias: 'r',
        type: String,
        multiple: true,
        typeLabel: '{underline recipePath}',
        description: 'path to recipe.json which should be loaded at startup'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide.'
    }
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
    const port: number | string | boolean = serverHandlers.normalizePort(process.env.PORT || 3000);

    const appServer = new Server();
    appServer.app.set('port', port);
    console.log(`Server listening on port ${port}`);

    const server: http.Server = http.createServer(appServer.app);

    // initialize the WebSocket server instance
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
        options.recipe.forEach((recipe) => {
            const recipeOptions = JSON.parse(fs.readFileSync(recipe).toString());
            manager.loadRecipe(recipeOptions);
        });
    }
}
