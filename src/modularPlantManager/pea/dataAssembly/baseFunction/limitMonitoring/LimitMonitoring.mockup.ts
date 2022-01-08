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
import {OpcUaNodeOptions} from '../../../connection/DataItemFactory';

function getLimitMonitoringSpecificDataItemOptions<T extends 'Ana' | 'DInt'>(namespace: number, objectBrowseName: string, type: T): object {
  return ({
    VAHEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VAHEn`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VAHLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VAHLim`,
      dataType: (type === 'Ana')? 'Float': 'Int32'
    } as OpcUaNodeOptions,
    VAHAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VAHAct`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VWHEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWHEn`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VWHLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWHLim`,
      dataType: (type === 'Ana')? 'Float': 'Int32'
    } as OpcUaNodeOptions,
    VWHAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWHAct`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VTHEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTHEn`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VTHLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTHLim`,
      dataType: (type === 'Ana')? 'Float': 'Int32'
    } as OpcUaNodeOptions,
    VTHAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTHAct`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VALEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VALEn`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VALLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VALLim`,
      dataType: (type === 'Ana')? 'Float': 'Int32'
    } as OpcUaNodeOptions,
    VALAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VALAct`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VWLEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWLEn`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VWLLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWLLim`,
      dataType: (type === 'Ana')? 'Float': 'Int32'
    } as OpcUaNodeOptions,
    VWLAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWLAct`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VTLEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTLEn`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions,
    VTLLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTLLim`,
      dataType: (type === 'Ana')? 'Float': 'Int32'
    } as OpcUaNodeOptions,
    VTLAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTLAct`,
      dataType: 'Boolean'
    } as OpcUaNodeOptions
  });
}


export function getLimitMonitoringDataItemOptions<T extends 'Ana' | 'DInt'>(namespace: number, objectBrowseName: string, type: T): object {
  return getLimitMonitoringSpecificDataItemOptions(namespace, objectBrowseName, type);
}

export class LimitMonitoringMockup<T extends 'Ana' | 'DInt'>{
  private readonly type: 'Ana' | 'DInt';
  private readonly dataType: DataType;

  protected varAHEn = false;
  protected varAHLim = 0;
  protected varAHAct = false;
  protected varWHEn = false;
  protected varWHLim = 0;
  protected varWHAct = false;
  protected varTHEn = false;
  protected varTHLim = 0
  protected varTHAct = false;

  protected varTLEn = false;
  protected varTLLim = 0;
  protected varTLAct = false;
  protected varWLEn = false;
  protected varWLLim = 0;
  protected varWLAct = false;
  protected varALEn = false;
  protected varALLim = 0;
  protected varALAct = false;
  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string, type: T) {
    this.type = type;
    this.dataType = (type === 'Ana')? DataType.Double : DataType.Int32;
    this.mockupNode = rootNode;

    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VAHEn`,
      browseName: `${variableName}.VAHEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varAHEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VAHLim`,
      browseName: `${variableName}.VAHLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varAHLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
              this.varAHLim = parseFloat(variant.value);
              return StatusCodes.Good;
            default:
              this.varAHLim = parseInt(variant.value,10);
              return StatusCodes.Good;
          }
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VAHAct`,
      browseName: `${variableName}.VAHAct`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varAHAct});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VWHEn`,
      browseName: `${variableName}.VWHEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varWHEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VWHLim`,
      browseName: `${variableName}.VWHLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varWHLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
              this.varWHLim = parseFloat(variant.value);
              return StatusCodes.Good;
            default:
              this.varWHLim = parseInt(variant.value,10);
              return StatusCodes.Good;
          }
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VWHAct`,
      browseName: `${variableName}.VWHAct`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varWHAct});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VTHEn`,
      browseName: `${variableName}.VTHEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varTHEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VTHLim`,
      browseName: `${variableName}.VTHLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varTHLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
              this.varTHLim = parseFloat(variant.value);
              return StatusCodes.Good;
            default:
              this.varTHLim = parseInt(variant.value,10);
              return StatusCodes.Good;
          }
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VTHAct`,
      browseName: `${variableName}.VTHAct`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varTHAct});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VTLEn`,
      browseName: `${variableName}.VTLEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varTLEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VTLLim`,
      browseName: `${variableName}.VTLLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varTLLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
              this.varTLLim = parseFloat(variant.value);
              return StatusCodes.Good;
            default:
              this.varTLLim = parseInt(variant.value,10);
              return StatusCodes.Good;
          }
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VTLAct`,
      browseName: `${variableName}.VTLAct`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varTLAct});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VWLEn`,
      browseName: `${variableName}.VWLEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varWLEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VWLLim`,
      browseName: `${variableName}.VWLLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varWLLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
              this.varWLLim = parseFloat(variant.value);
              return StatusCodes.Good;
            default:
              this.varWLLim = parseInt(variant.value,10);
              return StatusCodes.Good;
          }
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VWLAct`,
      browseName: `${variableName}.VWLAct`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant=> {
          return new Variant({dataType: DataType.Boolean, value: this.varWLAct});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VALEn`,
      browseName: `${variableName}.VALEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varALEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VALLim`,
      browseName: `${variableName}.VALLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varALLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
              this.varALLim = parseFloat(variant.value);
              return StatusCodes.Good;
            default:
              this.varALLim = parseInt(variant.value,10);
              return StatusCodes.Good;
          }
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VALAct`,
      browseName: `${variableName}.VALAct`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varALAct});
        },
      },
    });
  }

  public getDataItemOptions(): object {
    return getLimitMonitoringDataItemOptions(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name as string,
        this.type);
  }
}
