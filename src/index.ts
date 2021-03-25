/*
 * MIT License
 *
 * Copyright (c) 2021 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

/* tslint:disable:no-console */
import {ModularPlantManager} from './modularPlantManager';
import {ExternalTrigger, Server} from './server';
import * as serverHandlers from './server/serverHandlers';

import * as commandLineArgs from 'command-line-args';
import * as commandLineUsage from 'command-line-usage';
import * as fs from 'fs';
import {catPEA} from './logging';

const optionDefinitions = [
	{
		name: 'pea',
		alias: 'm',
		type: String,
		multiple: true,
		typeLabel: '{underline peaPath[]}',
		description: 'path to pea.json which should be loaded at startup'
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
		name: 'virtualService',
		alias: 'v',
		type: String,
		multiple: true,
		typeLabel: '{underline virtualServicePath[]}',
		description: 'path to virtualService.json which should be loaded at startup'
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
		description: 'Monitors an OPC UA node (specified via {underline opcuaNodeId}) on the OPC UA server ' +
			'(specified by {underline opcuaEndpoint}. If the node changes to true or is true when the player completes, ' +
			'the player start from the first recipe.'
	}
];
const sections = [
	{
		header: 'polaris-backend',
		content: 'Starts polaris backend engine for controlling services of PEAs.'
	},
	{
		header: 'Synopsis',
		content: [
			'$ ./bin/polaris-backend' +
			'[{bold --pea} {underline peaPath}] ' +
			'[{bold --recipe} {underline recipePath}] ' +
			'[{bold --virtualService} {underline virtualServicePath}] ' +
			'[{bold --externalTrigger} {underline opcuaEndpoint} {underline opcuaNodeid}]'
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
				desc: 'Run Polaris backend and starts recipe when ' +
					'specified OPC UA server has a change in a specified node',
				example: '$ ./bin/polaris-backend ' +
					'--externalTrigger opc.tcp://127.0.0.1:53530/OPCUA/SimulationServer "ns=3;s=BooleanDataItem"'
			}]
	}
];

let options;
try {
	options = commandLineArgs(optionDefinitions);
} catch (err) {
	console.log('Error: Could not parse commandNode line arguments', err.toString());
	console.log(commandLineUsage(sections));
}
if (options) {
	if (options.help) {
		console.log(commandLineUsage(sections));
	} else {
		const manager = new ModularPlantManager();
		const appServer = new Server(manager);

		const port = serverHandlers.normalizePort(process.env.PORT || 3000);
		appServer.startHttpServer(port);
		appServer.initSocketServer();

		/** Load some configuration at startup */
		if (options.peas && options.peas.length > 0) {
			console.log(`Load PEAs from ${options.peas}`);
			options.peas.forEach((pea: string) => {
				const peasOptions = JSON.parse(fs.readFileSync(pea).toString());
				manager.load(peasOptions, true);
			});
			manager.peas.forEach((p) =>
				p.connect()
					.catch((reason) =>
						catPEA.warn(`Could not connect to PEA ${p.id}: ${reason}`)
					)
			);
		}

		if (options.recipe && options.recipe.length > 0) {
			console.log(`Load recipe from ${options.recipe}`);
			options.recipe.forEach((recipe: string) => {
				const recipeOptions = JSON.parse(fs.readFileSync(recipe).toString());
				manager.loadRecipe(recipeOptions, true);
			});
		}

		if (options.virtualService && options.virtualService.length > 0) {
			console.log(`Load virtual service from ${options.virtualService}`);
			options.virtualService.forEach((vs: string) => {
				const vsOptions = JSON.parse(fs.readFileSync(vs).toString());
				manager.instantiatePOLService(vsOptions);
			});
		}

		/* Start OPC UA external trigger */
		if (options.externalTrigger) {
			console.log('External Trigger:', options.externalTrigger);
			const endpoint = options.externalTrigger[0];
			const nodeId = options.externalTrigger[1];

			const et = new ExternalTrigger(endpoint, nodeId, () => manager.player.start());
			et.startMonitoring()
				.catch((err) => {
					console.log('Could not start monitoring of external trigger', err.toString());
					process.exit(err);
				});
			// directly restart recipe if external trigger is still active when recipe finishes
			manager.on('recipeFinished', async () => {
				const value = await et.getValue();
				console.log('External trigger:', value);
				if (value) {
					await manager.player.start();
				}
			});
		}
	}
}
