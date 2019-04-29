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
import {Service} from '../src/model/core/Service';
import { timeout } from 'promise-timeout';

/**
 * resolve when service changes to expectedState
 * rejects after ms milliseconds
 * @param {Service} service     service to be waited for
 * @param {string} expectedState
 * @param {number} ms           max time before promise is rejected
 * @returns {Promise<void>}
 */
export function waitForStateChange(service: Service, expectedState: string, ms=500): Promise<void> {
    return timeout(new Promise((resolve) => {
        function test(data) {
            if (ServiceState[data.state] === expectedState) {
                service.removeListener('state', test);
                resolve();
            }
        }
        service.on('state', test);
    }), ms);
}
