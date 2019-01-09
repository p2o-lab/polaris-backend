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

export enum ServiceState {
    UNDEFINED = 1,
    STOPPED = 4,
    STARTING = 8,
    IDLE = 16,
    PAUSED = 32,
    RUNNING = 64,
    STOPPING = 128,
    ABORTING = 256,
    ABORTED = 512,
    HOLDING = 1024,
    HELD = 2048,
    UNHOLDING = 4096,
    PAUSING = 8192,
    RESUMING = 16384,
    RESETTING = 32768,
    COMPLETING = 65536,
    COMPLETED = 131072
}
export type ServiceControlEnable = ServiceMtpCommand;

export enum ServiceMtpCommand {
    UNDEFINED = 0,
    RESET = 2,
    START = 4,
    STOP = 8,
    UNHOLD = 32,
    PAUSE = 64,
    RESUME = 128,
    ABORT = 256,
    RESTART = 512,
    COMPLETE = 1024
}

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
    srcExtAct = 16384
}

export function isOffState(opMode: OpMode): boolean {
    return (opMode & (OpMode.stateAutAct | OpMode.stateManAct)) === 0;
}

export function isAutomaticState(opMode: OpMode): boolean {
    return (opMode & OpMode.stateAutAct) === OpMode.stateAutAct;
}

export function isManualState(opMode: OpMode): boolean {
    return (opMode & OpMode.stateManAct) === OpMode.stateManAct;
}

export function isExtSource(opMode: OpMode): boolean {
    return (opMode & OpMode.srcExtAct) === OpMode.srcExtAct;
}

export function isIntSource(opMode: OpMode): boolean {
    return (opMode & OpMode.srcExtAct) === 0;
}
