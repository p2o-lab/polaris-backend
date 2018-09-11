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

import {AbstractCategoryLogger, Category, CategoryLogMessage, RuntimeSettings} from "typescript-logging";

export class CustomLogger extends AbstractCategoryLogger {

    private messages: string[] = [];

    // The first two parameters are required, the 3rd is our parameter
    // where we give this logger an array and log all messages to that array.
    constructor(category: Category, runtimeSettings: RuntimeSettings, messages: string[]) {
        super(category, runtimeSettings);
        this.messages = messages;
    }

    // This is the only thing you really need to implement. In this case
    // we just write the complete message to the array.
    protected doLog(msg: CategoryLogMessage): void {
        // Note: we use createDefaultLogMessage() to spit it out formatted and all
        // however you're free to print in any way you like, the data is all
        // present on the message.
        const message = this.createDefaultLogMessage(msg);
        this.messages.push(message);
        console.log(message);
    }
}
