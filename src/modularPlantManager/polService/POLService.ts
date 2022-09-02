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
	CommandEnableInfo,
	ParameterInfo,
	ParameterOptions,
	POLServiceInfo
} from '@p2olab/polaris-interface';
import {BaseService} from '../pea';
import {ServiceState} from '../pea/dataAssembly';
import {Parameter} from '../recipe';

import {catPOLService} from '../../logging';

/**
 * A generic function block following the service state machine
 */
export abstract class POLService extends BaseService {

	public static type: string;
	protected procedureParameters: ParameterInfo[] = [];
	protected processValuesIn: ParameterInfo[] = [];
	protected processValuesOut: ParameterInfo[] = [];
	protected reportParameters: ParameterInfo[] = [];

	protected constructor(name: string) {
		super();
		this._name = name;
		this._controlEnable = {
			start: true,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: false,
			unhold: false
		};
	}

	protected _controlEnable: CommandEnableInfo;

	public get commandEnable(): CommandEnableInfo {
		return this._controlEnable;
	}

	protected _state: ServiceState = ServiceState.IDLE;

	public get state(): ServiceState {
		return this._state;
	}

	// Public methods

	public json(): POLServiceInfo {
		return {
			id: this.id,
			requestedProcedure: 0,
			name: this.name,
			type: this.constructor.name,
			procedures: [{
				id: 'not-supported',
				procedureId: 1,
				name: 'default',
				isSelfCompleting: this.selfCompleting,
				procedureParameters: this.procedureParameters,
				processValuesIn: this.processValuesIn,
				processValuesOut: this.processValuesOut,
				reportParameters: this.reportParameters
			}],
			currentProcedure: 0,
			configurationParameters: [],
			state: ServiceState[this.state],
			commandEnable: this.commandEnable,
			lastChange: (new Date().getTime() - this.lastStatusChange.getTime()) / 1000
		};
	}

	public async setParameters(parameters: Array<Parameter | ParameterOptions>): Promise<void> {
		catPOLService.info(`Set parameter: ${JSON.stringify(parameters)}`);
		parameters.forEach((pNew) => {
			let pOld = this.procedureParameters.find((p) => p?.name === pNew.name);
			if (!pOld) {
				pOld = this.procedureParameters.find((p) => p?.name === pNew.name);
			}
			if (!pOld) {
				throw new Error('tried to write a non-existent variable');
			}
			Object.assign(pOld, pNew);
		});
	}


	public async start(): Promise<void> {
		if (this._controlEnable.start) {
			await this.gotoStarting();
		}
	}

	public async restart(): Promise<void> {
		if (this._controlEnable.restart) {
			await this.gotoRestarting();
		}
	}

	public async pause(): Promise<void> {
		if (this._controlEnable.pause) {
			await this.gotoPausing();
		}
	}

	public async resume(): Promise<void> {
		if (this._controlEnable.resume) {
			await this.gotoResuming();
		}
	}

	public async complete(): Promise<void> {
		if (this._controlEnable.complete) {
			await this.gotoCompleting();
		}
	}

	public async stop(): Promise<void> {
		if (this._controlEnable.stop) {
			await this.gotoStopping();
		}
	}

	public async abort(): Promise<void> {
		if (this._controlEnable.abort) {
			await this.gotoAborting();
		}
	}

	public async reset(): Promise<void> {
		if (this._controlEnable.reset) {
			await this.gotoResetting();
		}
	}

	public async hold(): Promise<void> {
		if (this._controlEnable.unhold) {
			await this.gotoHolding();
		}
	}

	public async unhold(): Promise<void> {
		if (this._controlEnable.unhold) {
			await this.gotoUnholding();
		}
	}

	// Allow user to inject own functionality after reaching each state
	/**
	 * initialize parameters during construction and when resetting
	 */
	protected abstract initParameter(): void;

	protected async onStarting(): Promise<void> {
		catPOLService.info(`[${this.name}] onStarting`);
	}

	protected async onRestarting(): Promise<void> {
		catPOLService.info(`[${this.name}] onRestarting`);
	}

	protected async onExecute(): Promise<void> {
		catPOLService.debug(`[${this.name}] onExecute`);
	}

	protected async onPausing(): Promise<void> {
		catPOLService.debug(`[${this.name}] onPausing`);
	}

	protected async onPaused(): Promise<void> {
		catPOLService.debug(`[${this.name}] onPaused`);
	}

	protected async onResuming(): Promise<void> {
		catPOLService.debug(`[${this.name}] onResuming`);
	}

	protected async onCompleting(): Promise<void> {
		catPOLService.debug(`[${this.name}] onCompleting`);
	}

	protected async onCompleted(): Promise<void> {
		catPOLService.debug(`[${this.name}] onCompleted`);
	}

	protected async onResetting(): Promise<void> {
		catPOLService.debug(`[${this.name}] onResetting`);
	}

	protected async onAborting(): Promise<void> {
		catPOLService.debug(`[${this.name}] onAborting`);
	}

	protected async onAborted(): Promise<void> {
		catPOLService.debug(`[${this.name}] onAborted`);
	}

	protected async onStopping(): Promise<void> {
		catPOLService.debug(`[${this.name}] onStopping`);
	}

	protected async onStopped(): Promise<void> {
		catPOLService.debug(`[${this.name}] onStopped`);
	}

	protected async onIdle(): Promise<void> {
		catPOLService.debug(`[${this.name}] onIdle`);
	}

	protected async onHolding(): Promise<void> {
		catPOLService.debug(`[${this.name}] onHolding`);
	}

	protected async onHeld(): Promise<void> {
		catPOLService.debug(`[${this.name}] onHeld`);
	}

	protected async onUnholding(): Promise<void> {
		catPOLService.debug(`[${this.name}] onUnholding`);
	}

	// Internal
	private setState(newState: ServiceState): void {
		catPOLService.info(`[${this.name}] state changed to ${ServiceState[newState]}`);
		this._state = newState;
		this.emit('state', newState);
	}

	private setControlEnable(commandEnable: CommandEnableInfo): void {
		this._controlEnable = commandEnable;
		this.emit('commandEnable', commandEnable);
	}

	private async gotoStarting(): Promise<void> {
		this.setState(ServiceState.STARTING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: true,
			unhold: false
		});
		await this.onStarting();
		this.gotoExecute().then();
	}

	private async gotoRestarting(): Promise<void> {
		this.setState(ServiceState.STARTING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: true,
			unhold: false
		});
		await this.onRestarting();
		this.gotoExecute().then();
	}

	private async gotoExecute(): Promise<void> {
		this.setState(ServiceState.EXECUTE);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: this.selfCompleting || true,
			pause: true,
			reset: false,
			restart: true,
			resume: false,
			stop: true,
			hold: true,
			unhold: false
		});
		await this.onExecute();
	}

	private async gotoPausing(): Promise<void> {
		this.setState(ServiceState.PAUSING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: true,
			unhold: false
		});
		await this.onPausing();
		this.gotoPaused().then();
	}

	private async gotoPaused(): Promise<void> {
		this.setState(ServiceState.PAUSED);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: true,
			stop: true,
			hold: true,
			unhold: false
		});
		await this.onPaused();
	}

	private async gotoResuming(): Promise<void> {
		this.setState(ServiceState.RESUMING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: true,
			unhold: false
		});
		await this.onResuming();
		this.gotoExecute().then();
	}

	private async gotoCompleting(): Promise<void> {
		this.setState(ServiceState.COMPLETING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: true,
			unhold: false
		});
		await this.onCompleting();
		this.gotoCompleted().then();
	}

	private async gotoCompleted(): Promise<void> {
		this.setState(ServiceState.COMPLETED);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: true,
			restart: false,
			resume: false,
			stop: true,
			hold: false,
			unhold: false
		});
		await this.onCompleted();
	}

	private async gotoStopping(): Promise<void> {
		this.setState(ServiceState.STOPPING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: false,
			hold: false,
			unhold: false
		});
		await this.onStopping();
		this.gotoStopped().then();
	}

	private async gotoStopped(): Promise<void> {
		this.setState(ServiceState.STOPPED);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: true,
			restart: false,
			resume: false,
			stop: false,
			hold: false,
			unhold: false
		});
		await this.onStopped();
	}

	private async gotoAborting(): Promise<void> {
		this.setState(ServiceState.ABORTING);
		this.setControlEnable({
			start: false,
			abort: false,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: false,
			hold: false,
			unhold: false
		});
		await this.onAborting();
		this.gotoAborted().then();
	}

	private async gotoAborted(): Promise<void> {
		this.setState(ServiceState.ABORTED);
		this.setControlEnable({
			start: false,
			abort: false,
			complete: false,
			pause: false,
			reset: true,
			restart: false,
			resume: false,
			stop: false,
			hold: false,
			unhold: false
		});
		await this.onAborted();
	}

	private async gotoResetting(): Promise<void> {
		this.setState(ServiceState.RESETTING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: false,
			unhold: false
		});
		await this.onResetting();
		this.initParameter();
		this.gotoIdle().then();
	}

	private async gotoIdle(): Promise<void> {
		this.setState(ServiceState.IDLE);
		this.setControlEnable({
			start: true,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: false,
			unhold: false
		});
		await this.onIdle();
	}

	private async gotoHolding(): Promise<void> {
		this.setState(ServiceState.HOLDING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: false,
			unhold: false
		});
		await this.onHolding();
		this.gotoHeld().then();
	}

	private async gotoHeld(): Promise<void> {
		this.setState(ServiceState.HELD);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: false,
			unhold: false
		});
		await this.onHeld();
	}

	private async gotoUnholding(): Promise<void> {
		this.setState(ServiceState.UNHOLDING);
		this.setControlEnable({
			start: false,
			abort: true,
			complete: false,
			pause: false,
			reset: false,
			restart: false,
			resume: false,
			stop: true,
			hold: true,
			unhold: false
		});
		await this.onUnholding();
		this.gotoExecute().then();
	}
}
