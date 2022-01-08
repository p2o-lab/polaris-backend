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

import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {SourceMode} from '@p2olab/polaris-interface';
import {OpcUaNodeOptions} from '@p2olab/polaris-interface/dist/core/options';
import {getWQCDataItemOptions} from '../wqc/WQC.mockup';


function getSourceModeSpecificDataItemOptions(namespace: number, objectBrowseName: string): object {
  return ({
    SrcChannel: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.SrcChannel`,
      dataType: 'Boolean'
    },
    SrcIntAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.SrcIntAct`,
      dataType: 'Boolean'
    },
    SrcIntAut: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.SrcIntAut`,
      dataType: 'Boolean'
    },
    SrcIntOp: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.SrcIntOp`,
      dataType: 'Boolean'
    },
    SrcManAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.SrcManAct`,
      dataType: 'Boolean'
    },
    SrcManAut: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.SrcManAut`,
      dataType: 'Boolean'
    },
    SrcManOp: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.SrcManOp`,
      dataType: 'Boolean'
    }
  });
}


export function getSourceModeDataItemOptions(namespace: number, objectBrowseName: string): object {
  return getSourceModeSpecificDataItemOptions(namespace, objectBrowseName);
}


export class SourceModeMockup {
  srcMode: SourceMode = SourceMode.Intern;
  public srcChannel = false;
  protected srcManAut = false;
  protected srcIntAut = false;
  protected srcIntOp = false;
  protected srcManOp = false;
  protected mockupNode: UAObject;
  constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

    this.mockupNode = rootNode;

      namespace.addVariable({
        componentOf: rootNode,
        nodeId: `ns=${namespace.index};s=${variableName}.SrcChannel`,
        browseName: `${variableName}.SrcChannel`,
        dataType: DataType.Boolean,
        value: {
          get: (): Variant => {
            return new Variant({dataType: DataType.Boolean, value: this.srcChannel});
          },
        },
      });

      namespace.addVariable({
        componentOf: rootNode,
        nodeId: `ns=${namespace.index};s=${variableName}.SrcManAut`,
        browseName: `${variableName}.SrcManAut`,
        dataType: DataType.Boolean,
        value: {
          get: (): Variant => {
            return new Variant({dataType: DataType.Boolean, value: this.srcManAut});
          },
        },
      });
      namespace.addVariable({
        componentOf: rootNode,
        nodeId: `ns=${namespace.index};s=${variableName}.SrcIntAut`,
        browseName: `${variableName}.SrcIntAut`,
        dataType: DataType.Boolean,
        value: {
          get: (): Variant => {
            return new Variant({dataType: DataType.Boolean, value: this.srcIntAut});
          },
        },
      });
      namespace.addVariable({
        componentOf: rootNode,
        nodeId: `ns=${namespace.index};s=${variableName}.SrcIntOp`,
        browseName: `${variableName}.SrcIntOp`,
        dataType: DataType.Boolean,
        value: {
          get: (): Variant => {
            return new Variant({dataType: DataType.Boolean, value: this.srcIntOp});
          },
          set: (variant: Variant): StatusCodes => {
            this.srcIntOp = variant.value;
            if (this.srcIntOp) {
              if (!this.srcChannel) {
                this.srcMode = SourceMode.Intern;
              }
            }
            this.srcIntOp = false;
            return StatusCodes.Good;
          },
        },
      });


      namespace.addVariable({
        componentOf: rootNode,
        nodeId: `ns=${namespace.index};s=${variableName}.SrcManOp`,
        browseName: `${variableName}.SrcManOp`,
        dataType: DataType.Boolean,
        value: {
          get: (): Variant => {
            return new Variant({dataType: DataType.Boolean, value: this.srcManOp});
          },
          set: (variant: Variant): StatusCodes => {
            this.srcManOp = variant.value;
            if (this.srcManOp) {
              if (!this.srcChannel) {
                this.srcMode = SourceMode.Manual;
              }
            }
            this.srcManOp = false;
            return StatusCodes.Good;
          },
        },
      });

      namespace.addVariable({
        componentOf: rootNode,
        nodeId: `ns=${namespace.index};s=${variableName}.SrcIntAct`,
        browseName: `${variableName}.SrcIntAct`,
        dataType: DataType.Boolean,
        value: {
          get: (): Variant => {
            return new Variant({dataType: DataType.Boolean, value: this.srcIntAct});
          },

        },
      });
      namespace.addVariable({
        componentOf: rootNode,
        nodeId: `ns=${namespace.index};s=${variableName}.SrcManAct`,
        browseName: `${variableName}.SrcManAct`,
        dataType: DataType.Boolean,
        value: {
          get: (): Variant => {
            return new Variant({dataType: DataType.Boolean, value: this.srcManAct});
          },

        },
      });
    }

  public get srcManAct(): boolean {
    return this.srcMode === SourceMode.Manual;
  }

  public get srcIntAct(): boolean {
    return this.srcMode === SourceMode.Intern;
  }

  public getDataItemOptions(): object {
    return getSourceModeDataItemOptions(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name as string);
  }
}
