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

// Custom logging
export const messages: string[] = [];

const logLevelMapping: { [key: string]: LogLevel } = {
	'ERROR': LogLevel.Error,
	'WARN': LogLevel.Warn,
	'INFO': LogLevel.Info,
	'DEBUG': LogLevel.Debug,
	'TRACE': LogLevel.Trace
};

const logLevel: LogLevel = process.env.LOGLEVEL ? logLevelMapping[(process.env.LOGLEVEL).toUpperCase()] : LogLevel.Info;

// Configure to use our custom logger, note the callback which returns our CustomLogger from above.
const config = new CategoryConfiguration(
	logLevel, LoggerType.Custom, new CategoryLogFormat(),
	(category: Category, runtimeSettings: RuntimeSettings) => new CustomLogger(category, runtimeSettings, messages)
);
CategoryServiceFactory.setDefaultConfiguration(config);
