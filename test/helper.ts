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

import {ServiceState} from '../src/model/core/enum';

/** wait
 *
 * @param {number} delay in milliseconds
 * @returns {Promise<any>}
 */
export function later(delay: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

/**
 * resolve when service changes to expectedState
 * rejects after ms milliseconds
 * @param {Service} service     service to be waited for
 * @param {string} expectedState
 * @param {number] ms           max time before promise is rejected
 * @returns {Promise<void>}
 */
export async function waitForStateChange(service, expectedState: string, ms=1000): Promise<void> {
    return new Promise((resolve, reject) => {
        function test(data) {
            if (ServiceState[data.state] === expectedState) {
                clearTimeout(id);
                service.removeListener('state', test);
                resolve();
            }
        }
        service.on('state', test);
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(`Service ${service.name} failed to reach state ${expectedState} within 1000ms`);
        }, ms);
    });
}
