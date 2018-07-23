import {ConditionType} from "../enum";

export type ConditionOptions = AndConditionOptions | TimeConditionOptions | OrConditionOptions |
    TimeConditionOptions | StateConditionOptions | VariableConditionOptions | NotConditionOptions;

export interface BaseConditionOptions {
    type: ConditionType;
}


export interface AndConditionOptions extends BaseConditionOptions {
    conditions: ConditionOptions[];
}

export interface OrConditionOptions extends BaseConditionOptions {
    conditions: ConditionOptions[];
}

export interface NotConditionOptions extends BaseConditionOptions {
    condition: ConditionOptions;
}

export interface StateConditionOptions extends BaseConditionOptions {
    module: string;
    service: string;
    serviceName: string;
    state: string;
}

export interface TimeConditionOptions extends BaseConditionOptions {
    duration: number;
}

export interface VariableConditionOptions extends BaseConditionOptions {
    module: string;
    variable: string;
    value: string | number;
    operator: string;
}

