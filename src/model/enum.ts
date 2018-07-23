export enum RECIPE_STATE {
    IDLE,
    RUNNING,
    STOPPED,
    COMPLETED
}


export enum SERVICE_STATE {
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

export enum SERVICE_COMMAND {
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

export enum ConditionType {
    not = "not",
    time = "time",
    state = "state",
    variable = "variable",
    and = "and",
    or = "or"
}