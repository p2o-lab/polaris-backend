import {RecipeOptions} from "./Recipe";

export interface OpcUaNode {
    namespace_index: string;
    node_id: string;
}

export interface ServiceParameter {
    name: string,
    communication: {
        VExt: OpcUaNode,
        VOut: OpcUaNode,
        VMin: OpcUaNode,
        VMax: OpcUaNode,
        VSclMax: OpcUaNode,
        VSclMin: OpcUaNode,
        VRbk: { value: any },
        VUnit: { value: any },
        WQC: { value: any },
        OSLevel: { value: any }
    }
}

export interface Strategy {
    id: string;
    name: string;
    default: boolean;
    sc: boolean;
    parameters: ServiceParameter[];
}

export interface RecipeManagerInterface {
    recipe_status: string;
    service_states: object[];
    current_step: string;
    options: RecipeOptions;
}