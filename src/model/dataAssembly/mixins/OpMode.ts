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

import {OpModeInterface} from '@p2olab/polaris-interface';
import {catDataAssembly} from '../../../config/logging';
import {BaseDataAssemblyRuntime, DataAssembly} from '../DataAssembly';
import {OpcUaDataItem} from '../DataItem';
import {Constructor} from './mixins';

export enum OpMode {
    stateLiOp = 1,
    stateOffLi = 2,
    stateOffOp = 4,
    stateManLi = 8,
    stateManOp = 16,
    stateAutLi = 32,
    stateAutOp = 64,
    stateManAct = 128,
    stateAutAct = 256,
    srcLiOp = 512,
    srcExtLi = 1024,
    srcIntLi = 2048,
    srcIntOp = 4096,
    srcExtOp = 8192,
    srcIntAct = 16384
}

export type OpModeRuntime = BaseDataAssemblyRuntime & {
    OpMode: OpcUaDataItem<number>;
};

// tslint:disable-next-line:variable-name
export function OpModeDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {
    return class extends Base {
        public communication: OpModeRuntime;

        constructor(...args: any[]) {
            super(...args);
            this.createDataItem(args[0], 'OpMode', 'write');
        }

        public getOpMode(): OpMode {
            return this.communication.OpMode.value as OpMode;
        }

        public isOpMode(expectedOpMode: 'Off' | 'Automatic' | 'External' | 'Manual') {
            switch (expectedOpMode) {
                case 'Automatic':
                    return this.isAutomaticState();
                    break;
                case 'Manual':
                    return this.isManualState();
                    break;
                case 'External':
                    return this.isExtSource();
                    break;
                case 'Off':
                    return this.isOffState();
                    break;
            }
        }

        public async waitForOpModeToPassSpecificTest(expectedOpMode: 'Off' | 'Automatic' | 'External' | 'Manual') {
            if (!this.subscriptionActive) {
                await this.subscribe();
            }
            return new Promise((resolve) => {
                if (this.isOpMode(expectedOpMode)) {
                    resolve();
                } else {
                    const da = this;
                    this.on('OpMode', function test() {
                        if (da.isOpMode(expectedOpMode)) {
                            this.removeListener('OpMode', test);
                            resolve();
                        }
                    });
                }
            });
        }

        /**
         * Set data assembly to automatic operation mode and source to external source
         */
        public async setToAutomaticOperationMode(): Promise<void> {
            catDataAssembly.debug(`[${this.name}] Current opMode = ${this.communication.OpMode.value}`);
            if (this.isOffState()) {
                catDataAssembly.trace(`[${this.name}] First go to Manual state`);
                this.writeOpMode(OpMode.stateManOp);
                await this.waitForOpModeToPassSpecificTest('Manual');
            }

            if (this.isManualState()) {
                catDataAssembly.trace(`[${this.name}] Then to automatic`);
                this.writeOpMode(OpMode.stateAutOp);
                await this.waitForOpModeToPassSpecificTest('Automatic');
            }

            if (!this.isExtSource()) {
                catDataAssembly.trace(`[${this.name}] Finally to Ext`);
                this.writeOpMode(OpMode.srcExtOp);
                await this.waitForOpModeToPassSpecificTest('External');
            }
        }

        public async setToManualOperationMode() {
            if (this.isManualState()) {
                this.writeOpMode(OpMode.stateManOp);
                await this.waitForOpModeToPassSpecificTest('Manual');
            }
        }

        public async writeOpMode(opMode: OpMode) {
            catDataAssembly.debug(`[${this.name}] Write opMode: ${opMode as number}`);
            await this.communication.OpMode.write(opMode);
            catDataAssembly.debug(`[${this.name}] Setting opMode successfully`);
        }

        public isOffState(): boolean {
            return (this.getOpMode() & (OpMode.stateAutAct | OpMode.stateManAct)) === 0;
        }

        public isAutomaticState(): boolean {
            return (this.getOpMode() & OpMode.stateAutAct) === OpMode.stateAutAct;
        }

        public isManualState(): boolean {
            return (this.getOpMode() & OpMode.stateManAct) === OpMode.stateManAct;
        }

        public isExtSource(): boolean {
            return (this.getOpMode() & OpMode.srcIntAct) === 0;
        }

        public isIntSource(): boolean {
            return (this.getOpMode() & OpMode.srcIntAct) === OpMode.srcIntAct;
        }

        public opModeToJson(): OpModeInterface {
            let source: 'external' | 'internal';
            let state;
            if (this.isManualState()) {
                state = 'manual';
            } else if (this.isAutomaticState()) {
                state = 'automatic';
                source = this.isExtSource() ? 'external' : 'internal';
            } else if (this.isOffState()) {
                state = 'off';
            }
            return {state: state, source: source};
        }
    };
}
