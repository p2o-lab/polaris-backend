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

import {promiseTimeout} from '../src/timeout-promise';
import * as assert from "assert";
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
 * test if listener changes to expectedState within 1 second
 * @param listener
 * @param {string} expectedState
 * @returns {Promise<void>}
 */
export async function testForStateChange(listener, expectedState: string) {
    try {
        await promiseTimeout(1000, new Promise((resolve) => {
            listener.on('state', ({state, serverTimestamp}) => {
                if (ServiceState[state] === expectedState) {
                    resolve();
                }
            });
        }));
    } catch (err) {
        assert.fail(`Failed to reach ${expectedState} within 1000ms`);
    }
}
