/*
 * MIT License
 *
 * Copyright (c) 2020 P2O-Lab <p2o-lab@mailbox.tu-dresden.de>,
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

export function getLimitMonitoringDAMockupReferenceJSON(
    namespace = 1,
    objectBrowseName = 'P2OGalaxy') {
  return ({
    VAHEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VAHEn`,
      dataType: 'Boolean'
    },
    VAHLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VAHLim`,
      dataType: 'Float'
    },
    VAHAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VAHAct`,
      dataType: 'Boolean'
    },
    VWHEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWHEn`,
      dataType: 'Boolean'
    },
    VWHLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWHLim`,
      dataType: 'Float'
    },
    VWHAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWHAct`,
      dataType: 'Boolean'
    },
    VTHEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTHEn`,
      dataType: 'Boolean'
    },
    VTHLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTHLim`,
      dataType: 'Float'
    },
    VTHAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTHAct`,
      dataType: 'Boolean'
    },
    VALEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VALEn`,
      dataType: 'Boolean'
    },
    VALLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VALLim`,
      dataType: 'Float'
    },
    VALAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VALAct`,
      dataType: 'Boolean'
    },
    VWLEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWLEn`,
      dataType: 'Boolean'
    },
    VWLLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWLLim`,
      dataType: 'Float'
    },
    VWLAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VWLAct`,
      dataType: 'Boolean'
    },
    VTLEn: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTLEn`,
      dataType: 'Boolean'
    },
    VTLLim: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTLLim`,
      dataType: 'Float'
    },
    VTLAct: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VTLAct`,
      dataType: 'Boolean'
    }
  });
}

export class LimitMonitoringDAMockup {
  protected varAHEn = false;
  protected varAHLim: string | number | DataType | undefined = undefined;
  protected varAHAct = false;
  protected varWHEn = false;
  protected varWHLim: string | number | DataType | undefined = undefined;
  protected varWHAct = false;
  protected varTHEn = false;
  protected varTHLim: string | number | DataType | undefined = undefined;
  protected varTHAct = false;

  protected varTLEn = false;
  protected varTLLim: string | number | DataType | undefined = undefined;
  protected varTLAct = false;
  protected varWLEn = false;
  protected varWLLim: string | number | DataType | undefined = undefined;
  protected varWLAct = false;
  protected varALEn = false;
  protected varALLim: string | number | DataType | undefined = undefined;
  protected varALAct = false;
  protected mockupNode: UAObject;

  constructor(namespace: Namespace,
                        rootNode: UAObject,
                        variableName: string,
                        limDataType: string | number | DataType | undefined ) {

    this.mockupNode = namespace.addObject({
      organizedBy: rootNode,
      browseName: variableName,
    });

    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.VAHEn`,
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
      nodeId: `ns=${namespace};s=${variableName}.VAHLim`,
      browseName: `${variableName}.VAHLim`,
      dataType: limDataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: limDataType, value: this.varAHLim});
        },

        set: (variant: Variant) => {
          switch (typeof this.varAHLim) {
            case 'undefined':
              return StatusCodes.BadTypeDefinitionInvalid;
            case DataType.Double.toString():
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
      nodeId: `ns=${namespace};s=${variableName}.VAHAct`,
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
      nodeId: `ns=${namespace};s=${variableName}.VWHEn`,
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
      nodeId: `ns=${namespace};s=${variableName}.VWHLim`,
      browseName: `${variableName}.VWHLim`,
      dataType: limDataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: limDataType, value: this.varWHLim});
        },

        set: (variant: Variant) => {
          switch (typeof this.varWHLim) {
            case 'undefined':
              return StatusCodes.BadTypeDefinitionInvalid;
            case DataType.Double.toString():
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
      nodeId: `ns=${namespace};s=${variableName}.VWHAct`,
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
      nodeId: `ns=${namespace};s=${variableName}.VTHEn`,
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
      nodeId: `ns=${namespace};s=${variableName}.VTHLim`,
      browseName: `${variableName}.VTHLim`,
      dataType: limDataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: limDataType, value: this.varTHLim});
        },

        set: (variant: Variant) => {
          switch (typeof this.varTHLim) {
            case 'undefined':
              return StatusCodes.BadTypeDefinitionInvalid;
            case DataType.Double.toString():
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
      nodeId: `ns=${namespace};s=${variableName}.VTHAct`,
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
      nodeId: `ns=${namespace};s=${variableName}.VTLEn`,
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
      nodeId: `ns=${namespace};s=${variableName}.VTLLim`,
      browseName: `${variableName}.VTLLim`,
      dataType: limDataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: limDataType, value: this.varTLLim});
        },

        set: (variant: Variant) => {
          switch (typeof this.varTLLim) {
            case 'undefined':
              return StatusCodes.BadTypeDefinitionInvalid;
            case DataType.Double.toString():
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
      nodeId: `ns=${namespace};s=${variableName}.VTLAct`,
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
      nodeId: `ns=${namespace};s=${variableName}.VWLEn`,
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
      nodeId: `ns=${namespace};s=${variableName}.VWLLim`,
      browseName: `${variableName}.VWLLim`,
      dataType: limDataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: limDataType, value: this.varWLLim});
        },

        set: (variant: Variant) => {
          switch (typeof this.varWLLim) {
            case 'undefined':
              return StatusCodes.BadTypeDefinitionInvalid;
            case DataType.Double.toString():
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
      nodeId: `ns=${namespace};s=${variableName}.VWLAct`,
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
      nodeId: `ns=${namespace};s=${variableName}.VALEn`,
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
      nodeId: `ns=${namespace};s=${variableName}.VALLim`,
      browseName: `${variableName}.VALLim`,
      dataType: limDataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: limDataType, value: this.varALLim});
        },

        set: (variant: Variant) => {
          switch (typeof this.varALLim) {
            case 'undefined':
              return StatusCodes.BadTypeDefinitionInvalid;
            case DataType.Double.toString():
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
      nodeId: `ns=${namespace};s=${variableName}.VALAct`,
      browseName: `${variableName}.VALAct`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varALAct});
        },
      },
    });



    }

  public getLimitMonitoringDAInstanceMockupJSON() {
    return getLimitMonitoringDAMockupReferenceJSON(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name || 'UnqualifiedName');
  }
}
