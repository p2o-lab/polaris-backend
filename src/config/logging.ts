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

import {
    Category,
    CategoryConfiguration,
    CategoryLogFormat,
    CategoryServiceFactory,
    LoggerType,
    LogLevel,
    RuntimeSettings
} from 'typescript-logging';
import {CustomLogger} from './CustomLogger';

// Create categories, they will autoregister themselves
export const catRecipe = new Category('recipe');
export const catParameter = new Category('parameter', catRecipe);
export const catScopeItem = new Category('scopeItem', catRecipe);
export const catCondition = new Category('condition', catRecipe);
export const catOperation = new Category('operation', catRecipe);
export const catPlayer = new Category('player');
export const catModule = new Category('module');
export const catService = new Category('service');

export const catManager = new Category('manager');
export const catOpc = new Category('opcua');
export const catServer = new Category('server');
export const catTestServer = new Category('testserver');

export const catVirtualService = new Category('VirtualService');
export const catTimer = new Category('Timer', catVirtualService);

// Custom logging
export const messages: string[] = [];


let logLevel = LogLevel.Info;
switch ((process.env.LOGLEVEL||'').toUpperCase()) {
    case 'ERROR':
        logLevel = LogLevel.Error;
        break;
    case 'WARN':
        logLevel = LogLevel.Warn;
        break;
    case 'INFO':
        logLevel = LogLevel.Info;
        break;
    case 'DEBUG':
        logLevel = LogLevel.Debug;
        break;
    case 'TRACE':
        logLevel = LogLevel.Trace;
        break;
}

// Configure to use our custom logger, note the callback which returns our CustomLogger from above.


const config = new CategoryConfiguration(
    logLevel, LoggerType.Custom, new CategoryLogFormat(),
    (category: Category, runtimeSettings: RuntimeSettings) => new CustomLogger(category, runtimeSettings, messages)
);
CategoryServiceFactory.setDefaultConfiguration(config);
