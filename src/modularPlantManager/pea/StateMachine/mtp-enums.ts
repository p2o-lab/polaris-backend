/* tslint:disable:no-bitwise */

export enum ServiceState {
    UNDEFINED   =  1,
    STOPPED     =  4,
    STARTING    =  8,
    IDLE        =  16,
    PAUSED      =  32,
    EXECUTE     =  64,
    STOPPING    =  128,
    ABORTING    =  256,
    ABORTED     =  512,
    HOLDING     =  1024,
    HELD        =  2048,
    UNHOLDING   =  4096,
    PAUSING     =  8192,
    RESUMING    =  16384,
    RESETTING   =  32768,
    COMPLETING  =  65536,
    COMPLETED   =  131072,
}

export enum ServiceStateString {
  UNDEFINED   =  "UNDEFINED",
  STOPPED     =  "STOPPED",
  STARTING    =  "STARTING",
  IDLE        =  "IDLE",
  PAUSED      =  "PAUSED",
  EXECUTE     =  "EXECUTE",
  STOPPING    =  "STOPPING",
  ABORTING    =  "ABORTING",
  ABORTED     =  "ABORTED",
  HOLDING     =  "HOLDING",
  HELD        =  "HELD",
  UNHOLDING   =  "UNHOLDING",
  PAUSING     =  "PAUSING",
  RESUMING    =  "RESUMING",
  RESETTING   =  "RESETTING",
  COMPLETING  =  "COMPLETING",
  COMPLETED   =  "COMPLETED",
}

export enum ServiceMtpCommand {
  UNDEFINED = 0,
  RESET     = 2,
  START     = 4,
  STOP      = 8,
  HOLD      = 16,
  UNHOLD    = 32,
  PAUSE     = 64,
  RESUME    = 128,
  ABORT     = 256,
  RESTART   = 512,
  COMPLETE  = 1024
}

export enum ServiceMtpCommandString {
  UNDEFINED = "UNDEFINED",
  RESET     = "RESET",
  START     = "START",
  STOP      = "STOP",
  UNHOLD    = "UNHOLD",
  HOLD      = "HOLD",
  PAUSE     = "PAUSE",
  RESUME    = "RESUME",
  ABORT     = "ABORT",
  RESTART   = "RESTART",
  COMPLETE  = "COMPLETE"
}

export type ControlEnable = Map<keyof typeof ServiceMtpCommand, boolean>;

export enum OpMode {
  stateLiOp   = 1 << 0, // 1,
  stateOffLi  = 1 << 1, // 2,
  stateOffOp  = 1 << 2, // 4,
  stateManLi  = 1 << 3, // 8,
  stateManOp  = 1 << 4, // 16,
  stateAutLi  = 1 << 5, // 32,
  stateAutOp  = 1 << 6, // 64,
  stateManAct = 1 << 7, // 128,
  stateAutAct = 1 << 8, // 256,
  srcLiOp     = 1 << 9, // 512,
  srcExtLi    = 1 << 10, // 1024,
  srcIntLi    = 1 << 11, // 2048,
  srcIntOp    = 1 << 12, // 4096,
  srcExtOp    = 1 << 13, // 8192,
  srcIntAct   = 1 << 14 // 16384
}

export enum OperationMode {
  Offline = "offline",
  Operator = "operator",
  Automatic = "automatic",
}

export enum SourceMode {
    Manual = "manual",
    Intern = "intern"
}
export enum ServiceSourceMode {
    Extern = "extern",
    Intern = "intern"
}
