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


export interface OpcUaNode {
    /** despite its current name this variable contains the *namespace url* of the node*/
    namespace_index: string;
    /** node id of the node as string (e.g. 's=sdfdsf' or 'i=12') */
    node_id: string;
    /** data type of OPC UA node */
    data_type?: string;
    /** recent value */
    value?: number| string| boolean;
    /** timestamp of last update of value */
    timestamp?: Date;
}

export interface ServiceParameter {
    name: string;
    interface_class: string;
    communication: {
        VExt: OpcUaNode,
        VOut: OpcUaNode,
        VMin: OpcUaNode,
        VMax: OpcUaNode,
        VSclMax: OpcUaNode,
        VSclMin: OpcUaNode,
        VRbk: OpcUaNode,
        VUnit: OpcUaNode,
        WQC: OpcUaNode,
        OSLevel: OpcUaNode
    };
}

export interface Strategy {
    id: string;
    name: string;
    default: boolean;
    sc: boolean;
    parameters: ServiceParameter[];
}
