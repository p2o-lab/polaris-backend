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
  ActionFunctionMap, ConditionPredicate, interpret, Interpreter, Machine, MachineConfig,
  MachineOptions, StateMachine, StateSchema,
} from 'xstate';
import {
  ControlEnable,
  ServiceMtpCommand,
  ServiceMtpCommandString,
  ServiceState,
  ServiceStateString
} from '../serviceSet/service/enum';

export type UserContext = any;

export interface InternalMtpCommand {
  type: keyof typeof ServiceMtpCommand | 'SC' | 'HOLD';
}

export interface ServiceStateSchema {
  states: {
    [key in keyof typeof ServiceState]: StateSchema<any>;
  };
}
export interface StaticGuard extends Record<string, ConditionPredicate<UserContext, InternalMtpCommand>> {
  startingEnabledStatic: () => boolean;
}
export interface StaticActions extends ActionFunctionMap<UserContext, InternalMtpCommand> {
  onStartingStatic: () => void;
  onResettingStatic: () => void;
}

export interface StaticServiceConfiguration extends Partial<MachineOptions<UserContext, InternalMtpCommand>> {
  guards: StaticGuard;
  actions: StaticActions;
}

export interface UserDefinedGuard extends Record<string, ConditionPredicate<UserContext, InternalMtpCommand>> {
  startingEnabled: () => boolean;
  restartingEnabled: () => boolean;
  executeEnabled: () => boolean;
  completingEnabled: () => boolean;
  pausingEnabled: () => boolean;
  holdingEnabled: () => boolean;
  unholdingEnabled: () => boolean;
}

export interface UserDefinedActions extends ActionFunctionMap<UserContext, InternalMtpCommand> {
  onIdle: () => void;
  onStarting: () => void;
  onExecute: () => void;
  onCompleting: () => void;
  onCompleted: () => void;
  onResetting: () => void;
  onPausing: () => void;
  onPaused: () => void;
  onResuming: () => void;
  onStopping: () => void;
  onStopped: () => void;
  onAborting: () => void;
  onAborted: () => void;
}

export interface UserDefinedServiceConfiguration extends Partial<MachineOptions<UserContext, InternalMtpCommand>> {
  guards: UserDefinedGuard;
  actions: UserDefinedActions;
}

export class MtpStateMachine {

  public stateMachineService: Interpreter<UserContext, ServiceStateSchema, InternalMtpCommand> | undefined ;
  public stateMachine: StateMachine<UserContext, ServiceStateSchema, InternalMtpCommand>;
  public readonly name: string;
  private varProcedureCur = 0;
  private varProcedureReq = 1;

  constructor(name: string, userDefinedGuards: UserDefinedGuard, userDefinedActions: UserDefinedActions) {
    this.name = name;
    this.stateMachine = Machine<UserContext, ServiceStateSchema, InternalMtpCommand>(
        MtpStateMachine.level4Config, this.defaultOptions);

    this.reconfigure(userDefinedGuards, userDefinedActions);
  }

  public static readonly level1Config: MachineConfig<UserContext, any, InternalMtpCommand> = {
    id: 'level1',
    initial: ServiceStateString.STARTING,
    states: {
      STARTING: {
        entry: ['onStartingStatic','onStarting'],
        on: {
          SC: {
            target: 'EXECUTE',
          },
        },
      },
      EXECUTE: {
        entry: 'onExecute',
        on: {
          SC: {
            target: 'COMPLETING',
          },
          RESTART: {
            target: 'STARTING',
            cond: 'restartingEnabled',
          },
          COMPLETE: {
            target: 'COMPLETING',
            cond: 'completingEnabled',
          },
          PAUSE: {
            target: 'PAUSING',
            cond: 'pausingEnabled',
          }
        },
      },
      COMPLETING: {
        entry: 'onCompleting',
        on: {
          SC: {
            target: 'final',
          },
        },
      },
      final: {
        type: 'final',
      },
      PAUSING: {
        entry: 'onPausing',
        on: {
          SC: {
            target: 'PAUSED',
          },
        },
      },
      PAUSED: {
        entry: 'onPaused',
        on: {
          RESUME: {
            target: 'RESUMING',
            cond: 'executeEnabled',
          },
        },
      },
      RESUMING: {
        entry: 'onResuming',
        on: {
          SC: {
            target: 'EXECUTE',
          },
        },
      },
      UNHOLDING: {
        entry: 'onUnholding',
        on: {
          SC: {
            target: 'EXECUTE',
          },
        },
      },
    },
  };

  public static readonly level2Config: MachineConfig<UserContext, any, InternalMtpCommand> = {
    initial: 'IDLE',
    states: {
      IDLE: {
        entry: 'onIdle',
        on: {
          START: {
            target: 'level1.STARTING',
            // TODO: implement a single conditionCheckMethod calling two functions, with option to just overwrite user-defined functions
            cond: 'startingEnabled',
          },
        },
      },
      level1: {
        ...MtpStateMachine.level1Config,
        onDone: {
          target: 'COMPLETED',
        },
        on: {
          HOLD: {
            target: 'HOLDING',
            cond: 'holdingEnabled',
          },
        },
      },
      HOLDING: {
        entry: 'onHolding',
        on: {
          SC: {
            target: 'HELD',
          },
        },
      },
      HELD: {
        entry: 'onHeld',
        on: {
          UNHOLD: {
            target: 'level1.UNHOLDING',
            cond: 'unholdingEnabled',
          },
        },
      },
      COMPLETED: {
        entry: 'onCompleted',
        on: {
          RESET: {
            target: 'RESETTING',
          },
        },
      },
      RESETTING: {
        entry: ['onResettingStatic','onResetting'],
        on: {
          SC: {
            target: 'IDLE',
          },
        },
      },
    },
  };

  public static readonly level3Config: MachineConfig<UserContext, any, InternalMtpCommand> = {
  id: 'level3',
  initial: 'level2',
  states: {
    level2: {
      ...MtpStateMachine.level2Config,
      on: {
        STOP: {
          target: 'STOPPING',
        },
      },
    },
    STOPPING: {
      entry: 'onStopping',
      on: {
        SC: {
          target: 'STOPPED',
        },
      },
    },
    STOPPED: {
      entry: 'onStopped',
      on: {
        RESET: {
          target: 'level2.RESETTING',
        },
      },
    },
  },
};

  public static readonly level4Config: MachineConfig<UserContext, any, InternalMtpCommand> = {
  id: 'level4',
  context: {},
  initial: 'level3',
  states: {
    level3: {
      ...MtpStateMachine.level3Config,
      on: {
        ABORT: {
          target: 'ABORTING',
        },
      },
    },
    ABORTING: {
      entry: 'onAborting',
      on: {
        SC: {
          target: 'ABORTED',
        },
      },
    },
    ABORTED: {
      entry: 'onAborted',
      on: {
        RESET: {
          target: 'level3.level2.RESETTING',
        },
      },
    },
  },
};

  public readonly defaultOptions: UserDefinedServiceConfiguration = {
    guards: {
      startingEnabled: (): boolean => true,
      restartingEnabled: (): boolean => true,
      executeEnabled: (): boolean => true,
      completingEnabled: (): boolean => true,
      pausingEnabled: (): boolean => true,
      holdingEnabled: (): boolean => false,
      unholdingEnabled: (): boolean => true,
    },
    actions: {
      onIdle: (): void => { return; },
      onStarting: (): void  => this.goToNextState(),
      onExecute: (): void  => { return; },
      onCompleting: (): void  => this.goToNextState(),
      onCompleted: (): void  => { return; },
      onResetting: (): void  => this.goToNextState(),
      onPausing: (): void  => this.goToNextState(),
      onPaused: (): void  => { return; },
      onResuming: (): void  => this.goToNextState(),
      onStopping: (): void  => this.goToNextState(),
      onStopped: (): void  => { return; },
      onAborting: (): void  => this.goToNextState(),
      onAborted: (): void  => { return; },
    },
  };

  private staticOptions: StaticServiceConfiguration = {
    guards: { startingEnabledStatic: (): boolean => true},
    actions: {
      onStartingStatic: (): void  => {this.updateProcedureCur();},
      onResettingStatic: (): void  => {return;}
    }
  };

  public reconfigure(updatedGuards: Partial<UserDefinedGuard>, updatedActions: Partial<UserDefinedActions>): void {
    const guards: UserDefinedGuard =
      { ...this.staticOptions.guards,...this.defaultOptions.guards, ...updatedGuards} as UserDefinedGuard;
    const actions: UserDefinedActions =
      { ...this.staticOptions.actions,...this.defaultOptions.actions, ...updatedActions} as UserDefinedActions;
    this.stateMachine = this.stateMachine.withConfig({guards, actions});
  }

  public setProcedureReq(procedureReq: number): void{
    this.varProcedureReq = procedureReq;
  }

  private updateProcedureCur(): void{
    this.varProcedureCur = this.getProcedureReq();
  }
  private resetProcedureCur(): void{
    this.varProcedureCur = 0;
  }

  public getProcedureReq(): number {return this.varProcedureReq;}
  public getProcedureCur(): number {return this.varProcedureCur;}


  /* Start ServiceStateMachine
  */
  public start(): void {
    this.stateMachineService = interpret(this.stateMachine);
    this.stateMachineService.onTransition(() => console.log(`[STATEMACHINE] FSM (${this.name}): ${this.getState()}`))
      .start();
  }

  public getCommandEnabled(): ControlEnable {
    const enabled: ControlEnable = new Map();
    if (this.stateMachineService && this.stateMachineService.initialized) {
      for (const e in Object.keys(ServiceMtpCommandString)) {
        enabled.set(
          e as ServiceMtpCommandString,
          this.stateMachineService.nextState(e as ServiceMtpCommandString).changed as boolean);
      }
    }
    return enabled;
  }

  public triggerEvent(event: ServiceMtpCommand): boolean {
    if(this.stateMachineService) {
      const oldState = this.stateMachineService.state.value;
      const newState = this.stateMachineService.send({type: ServiceMtpCommand[event] as ServiceMtpCommandString});
      return oldState !== newState.value;
    }
    else throw Error('StateMachine not initialized.');
  }

  public goToNextState(): void {
    if(this.stateMachineService) this.stateMachineService.send('SC');
  }

  public getState(): ServiceStateString {
    if (this.stateMachineService && this.stateMachineService.initialized) {
      const lastStateString = this.stateMachineService.state.toStrings().pop();
      if (lastStateString) {
        return lastStateString.split('.').pop() as ServiceStateString;
      }
    }
    return ServiceStateString.UNDEFINED;
  }
}
