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

// tslint:disable:max-classes-per-file

import {
    AnaMonOptions,
    OpModeOptions, ParameterInterface,
    ScaleSettingsDataAssemblyOptions,
    UnitDataAssemblyOptions, ValueLimitationOptions
} from '@p2olab/polaris-interface';
import {catDataAssembly, catParameter} from '../../config/logging';
import {isAutomaticState, isExtSource, isManualState, isOffState, OpMode} from '../core/enum';
import {UNIT} from '../core/Unit';
import {BaseDataAssemblyRuntime, DataAssembly} from './DataAssembly';
import {OpcUaDataItem} from './DataItem';
import {BaseDataAssemblyOptions} from '@p2olab/polaris-interface/src/core/dataAssembly';
import {ValueLimitationRuntime} from './AnaOp';

type Constructor<T = {}> = new (...args: any[]) => T;

export interface UnitDataAssemblyRuntime extends BaseDataAssemblyRuntime {
    VUnit: OpcUaDataItem<number>;
}

// tslint:disable-next-line:variable-name
export function UnitDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {

    return class extends Base {
        public communication: UnitDataAssemblyRuntime;

        constructor(...args: any[]) {
            super(...args);
            const a = args[0] as { communication: UnitDataAssemblyOptions };

            this.communication.VUnit = OpcUaDataItem.fromOptions(a.communication.VUnit, 'read');
        }

        public getUnit(): string {
            const unit = UNIT.find((item) => item.value === this.communication.VUnit.value);
            return unit ? unit.unit : '';
        }

        public toJson(): ParameterInterface {
            return {
                ...super.toJson(),
                unit: this.getUnit()
            };
        }
    };
}

export interface ScaleSettingsRuntime extends BaseDataAssemblyRuntime {
    VSclMin: OpcUaDataItem<number>;
    VSclMax: OpcUaDataItem<number>;
}

// tslint:disable-next-line:variable-name
export function ScaleSettingsDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {

    return class extends Base {
        public communication: ScaleSettingsRuntime;

        constructor(...args: any[]) {
            super(...args);
            const options = args[0] as { communication: ScaleSettingsDataAssemblyOptions };
            if (!options.communication.VSclMin) {
                throw new Error(`No VSclMin in ${this.name}`);
            }
            if (!options.communication.VSclMax) {
                throw new Error(`No VSclMax in ${this.name}`);
            }
            this.communication.VSclMax = OpcUaDataItem.fromOptions(options.communication.VSclMax, 'read');
            this.communication.VSclMin = OpcUaDataItem.fromOptions(options.communication.VSclMin, 'read');
        }

        public toJson(): ParameterInterface {
            return {
                ...super.toJson(),
                max: this.communication.VSclMax.value,
                min: this.communication.VSclMin.value
            };
        }
    };
}


// tslint:disable-next-line:variable-name
export function ValueLimitationDA<TBase extends Constructor<DataAssembly>>(Base: TBase) {

    return class extends Base {
        public communication: ValueLimitationRuntime;

        constructor(...args: any[]) {
            super(...args);
            const options = args[0] as { communication: ValueLimitationOptions };
            if (!options.communication.VMin) {
                throw new Error(`No VMin in ${this.name}`);
            }
            if (!options.communication.VMax) {
                throw new Error(`No VMax in ${this.name}`);
            }
            this.communication.VMax = OpcUaDataItem.fromOptions(options.communication.VMax, 'read');
            this.communication.VMin = OpcUaDataItem.fromOptions(options.communication.VMin, 'read');
        }

        public toJson(): ParameterInterface {
            return {
                ...super.toJson(),
                max: this.communication.VMax.value,
                min: this.communication.VMin.value
            };
        }
    };
}

// tslint:disable-next-line:variable-name
export function MonitorSettings<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        public communication: AnaMonOptions;

        constructor(...args: any[]) {
            super(...args);
            const a = args[0] as { communication: AnaMonOptions };
            try {
                this.communication.VAHEn.value = !!a.communication.VAHEn.value;
                this.communication.VAHLim.value = parseInt(a.communication.VAHLim.value.toString(), 10);
                this.communication.VAHAct.value = !!a.communication.VAHAct.value;
            } catch (e) {
                catDataAssembly.debug(`No value for dataAssembly ${JSON.stringify(a)}`);
            }
        }
    };
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
            const a = args[0] as { communication: OpModeOptions };

            this.communication.OpMode = OpcUaDataItem.fromOptions(a.communication.OpMode, 'write');
        }

        /**
         * Get current opMode of DataAssembly from reading its state from the PEA.
         */
        public async getOpMode(): Promise<OpMode> {
            const result = await this.module.readVariableNode(this.communication.OpMode);
            return result.value.value as OpMode;
        }

        public async waitForOpModeToPassSpecificTest(testFunction: (opMode: OpMode) => boolean) {
            return new Promise((resolve) => {
                if (testFunction(this.communication.OpMode.value)) {
                    resolve();
                } else {
                    this.on('OpMode', function test(data) {
                        if (testFunction(data.value)) {
                            this.removeListener('changed', test);
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
            catParameter.debug(`[${this.name}] Current opMode = ${this.communication.OpMode.value}`);
            if (isOffState(this.communication.OpMode.value)) {
                catParameter.trace('First go to Manual state');
                this.writeOpMode(OpMode.stateManOp);
                await this.waitForOpModeToPassSpecificTest(isManualState);
            }

            if (isManualState(this.communication.OpMode.value)) {
                catParameter.trace('Then to automatic');
                this.writeOpMode(OpMode.stateAutOp);
                await this.waitForOpModeToPassSpecificTest(isAutomaticState);
            }

            if (!isExtSource(this.communication.OpMode.value)) {
                catParameter.trace('Finally to Ext');
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
            catParameter.debug(`[${this.name}] Write opMode: ${opMode as number}`);
            const result = await this.module.writeNode(this.communication.OpMode, opMode);
            catParameter.debug(`[${this.name}] Setting opMode ${JSON.stringify(result)}`);
            if (result.value !== 0) {
                catParameter.warn(`[${this.name}] Error while setting opMode to ${opMode}: ${JSON.stringify(result)}`);
                return Promise.reject();
            } else {
                return Promise.resolve();
            }
        }
    };
}
