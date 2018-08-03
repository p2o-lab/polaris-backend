export interface OpcUaNode {
    namespace_index: string;
    node_id: string;
}

export interface ServiceParameter {
    name: string,
    communication: {
        VExt: OpcUaNode
    }
}

export interface Parameter {
    name: string;
    variable: string;
    value: any;
}

export interface Strategy {
    id: string;
    name: string;
    default: boolean;
    sc: boolean;
    parameters: ServiceParameter[];
}