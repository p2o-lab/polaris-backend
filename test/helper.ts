/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
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

import {Module} from '../src/model/core/Module';

export function waitForParameterChange(module: Module, parameterName: string, expected = null) {
    return new Promise((resolve) =>
        module.on('parameterChanged', (data) => {
            if (data.parameter === parameterName && (expected === null || data.value === expected)) {
                resolve();
                module.removeListener('parameterChanged', test);
            }
        })
    );
}

export function waitForVariableChange(module: Module, variableName: string, expected = null) {
    return new Promise((resolve) =>
        module.on('variableChanged', function test(data) {
            if (data.variable === variableName && (expected === null || data.value === expected)) {
                resolve();
                module.removeListener('variableChanged', test);
            }
        })
    );
}
