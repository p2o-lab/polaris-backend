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
        VUnit: OpcUaNode,
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


