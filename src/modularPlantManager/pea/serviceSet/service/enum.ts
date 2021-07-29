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

import {CommandEnableInterface} from '@p2olab/polaris-interface';

export enum ServiceState {
	UNDEFINED = 1 << 0, // 1
	STOPPED = 1 << 2, // 4,
	STARTING = 1 << 3, // 8,
	IDLE = 1 << 4, // 16,
	PAUSED = 1 << 5, // 32,
	EXECUTE = 1 << 6, // 64,
	STOPPING = 1 << 7, // 128,
	ABORTING = 1 << 8, // 256,
	ABORTED = 1 << 9, // 512,
	HOLDING = 1 << 10, // 1024,
	HELD = 1 << 11, // 2048,
	UNHOLDING = 1 << 12, // 4096,
	PAUSING = 1 << 13, // 8192,
	RESUMING = 1 << 14, // 16384,
	RESETTING = 1 << 15, // 32768,
	COMPLETING = 1 << 16, // 65536,
	COMPLETED = 1 << 17, // 131072
}

export enum ServiceControlEnable {
	UNDEFINED = 1 << 0, // 0,
	RESET = 1 << 1, // 2,
	START = 1 << 2, // 4,
	STOP = 1 << 3, // 8,
	HOLD = 1 << 4, // 16,
	UNHOLD = 1 << 5, // 32,
	PAUSE = 1 << 6, // 64,
	RESUME = 1 << 7, // 128,
	ABORT = 1 << 8, // 256,
	RESTART = 1 << 9, // 512,
	COMPLETE = 1 << 10, // 1024
}

export function controlEnableToJson(controlEnable: ServiceControlEnable): CommandEnableInterface {
	return {
		start: (controlEnable & ServiceControlEnable.START) !== 0,
		restart: (controlEnable & ServiceControlEnable.RESTART) !== 0,
		pause: (controlEnable & ServiceControlEnable.PAUSE) !== 0,
		resume: (controlEnable & ServiceControlEnable.RESUME) !== 0,
		complete: (controlEnable & ServiceControlEnable.COMPLETE) !== 0,
		unhold: (controlEnable & ServiceControlEnable.UNHOLD) !== 0,
		hold: (controlEnable & ServiceControlEnable.HOLD) !== 0,
		stop: (controlEnable & ServiceControlEnable.STOP) !== 0,
		abort: (controlEnable & ServiceControlEnable.ABORT) !== 0,
		reset: (controlEnable & ServiceControlEnable.RESET) !== 0
	};
}

export enum ServiceMtpCommand {
	UNDEFINED = 1 << 0,
	RESET = 1 << 1,
	START = 1 << 2,
	STOP = 1 << 3,
	HOLD = 1 << 4,
	UNHOLD = 1 << 5,
	PAUSE = 1 << 6,
	RESUME = 1 << 7,
	ABORT = 1 << 8,
	RESTART = 1 << 9,
	COMPLETE = 1 << 10
}
export enum ServiceStateString {
	UNDEFINED   =  'UNDEFINED',
	STOPPED     =  'STOPPED',
	STARTING    =  'STARTING',
	IDLE        =  'IDLE',
	PAUSED      =  'PAUSED',
	EXECUTE     =  'EXECUTE',
	STOPPING    =  'STOPPING',
	ABORTING    =  'ABORTING',
	ABORTED     =  'ABORTED',
	HOLDING     =  'HOLDING',
	HELD        =  'HELD',
	UNHOLDING   =  'UNHOLDING',
	PAUSING     =  'PAUSING',
	RESUMING    =  'RESUMING',
	RESETTING   =  'RESETTING',
	COMPLETING  =  'COMPLETING',
	COMPLETED   =  'COMPLETED',
}
export enum ServiceMtpCommandString {
	UNDEFINED = 'UNDEFINED',
	RESET     = 'RESET',
	START     = 'START',
	STOP      = 'STOP',
	UNHOLD    = 'UNHOLD',
	HOLD      = 'HOLD',
	PAUSE     = 'PAUSE',
	RESUME    = 'RESUME',
	ABORT     = 'ABORT',
	RESTART   = 'RESTART',
	COMPLETE  = 'COMPLETE'
}

export type ControlEnable = Map<keyof typeof ServiceMtpCommand, boolean>;
