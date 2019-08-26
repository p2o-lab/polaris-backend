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

import {OpModeOptions} from '@p2olab/polaris-interface';
import {catDataAssembly} from '../../../config/logging';
import {isAutomaticState, isExtSource, isManualState, isOffState, OpMode} from '../../core/enum';
import {BaseDataAssemblyRuntime, DataAssembly} from '../DataAssembly';
import {OpcUaDataItem} from '../DataItem';
import {Constructor} from './mixins';

export type OpModeRuntime = BaseDataAssemblyRuntime & {
    OpMode: OpcUaDataItem<number>;
};

// tslint:disable-next-line:variable-name
export function OpModeDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {
    return class extends Base {
        public communication: OpModeRuntime;

        constructor(...args: any[]) {
            super(...args);
            const a = args[0] as { communication: OpModeOptions };

            this.communication.OpMode = OpcUaDataItem.fromOptions(a.communication.OpMode, 'write');
        }

        /**
         * Get current opMode of DataAssembly from reading its state from the PEA.
         */
        public getOpMode(): OpMode {
            return this.communication.OpMode.value as OpMode;
        }

        public async waitForOpModeToPassSpecificTest(testFunction: (opMode: OpMode) => boolean) {
            if (!this.subscriptionActive) {
                await this.subscribe();
            }
            return new Promise((resolve) => {
                if (testFunction(this.communication.OpMode.value)) {
                    resolve();
                } else {
                    this.on('OpMode', function test(data) {
                        if (testFunction(data.value)) {
                            this.removeListener('OpMode', test);
                            resolve();
                        }
                    });
                }
            });
        }

        /**
         * Set data assembly to automatic operation mode and source to external source
         * @returns {Promise<void>}
         */
        public async setToAutomaticOperationMode(): Promise<void> {
            catDataAssembly.debug(`[${this.name}] Current opMode = ${this.communication.OpMode.value}`);
            if (isOffState(this.communication.OpMode.value)) {
                catDataAssembly.trace('First go to Manual state');
                this.writeOpMode(OpMode.stateManOp);
                await this.waitForOpModeToPassSpecificTest(isManualState);
            }

            if (isManualState(this.communication.OpMode.value)) {
                catDataAssembly.trace('Then to automatic');
                this.writeOpMode(OpMode.stateAutOp);
                await this.waitForOpModeToPassSpecificTest(isAutomaticState);
            }

            if (!isExtSource(this.communication.OpMode.value)) {
                catDataAssembly.trace('Finally to Ext');
                this.writeOpMode(OpMode.srcExtOp);
                await this.waitForOpModeToPassSpecificTest(isExtSource);
            }
        }

        public async setToManualOperationMode(): Promise<void> {
            const opMode = await this.getOpMode();
            if (opMode && !isManualState(opMode)) {
                this.writeOpMode(OpMode.stateManOp);
                await this.waitForOpModeToPassSpecificTest(isManualState);
            }
        }

        /**
         * Write OpMode to service
         * @param {OpMode} opMode
         * @returns {boolean}
         */
        public async writeOpMode(opMode: OpMode): Promise<void> {
            catDataAssembly.debug(`[${this.name}] Write opMode: ${opMode as number}`);
            const result = await this.module.writeDataItem(this.communication.OpMode, opMode);
            catDataAssembly.debug(`[${this.name}] Setting opMode ${JSON.stringify(result)}`);
            if (result.value !== 0) {
                catDataAssembly.warn(`[${this.name}] Error while setting opMode to ${opMode}`);
                return Promise.reject();
            } else {
                return Promise.resolve();
            }
        }
    };
}
