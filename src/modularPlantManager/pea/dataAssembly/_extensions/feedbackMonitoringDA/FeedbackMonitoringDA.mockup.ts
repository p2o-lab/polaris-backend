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

export function getFeedbackMonitoringDAMockupReferenceJSON(
    namespace = 1,
    objectBrowseName = 'P2OGalaxy') {
  return ({
        MonEn: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.MonEn`,
          dataType: 'Boolean'
        },
        MonSafePos: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.MonSafePos`,
          dataType: 'Boolean'
        },
        MonStatErr: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.MonStatErr`,
          dataType: 'Boolean'
        },
        MonDynErr: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.MonDynErr`,
          dataType: 'Boolean'
        },
        MonStatTi: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.MonStatTi`,
          dataType: 'Float'
        },
        MonDynTi: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.MonDynTi`,
          dataType: 'Float'
        }
      }
  );
}

export class FeedbackMonitoringDAMockup {
  protected varMonEn = false;
  protected varMonSafePos = false;
  protected varMonStatErr = false;
  protected varMonDynErr = false;
  protected varMonStatTi = 0;
  protected varMonDynTi = 0;
  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

    this.mockupNode = namespace.addObject({
      organizedBy: rootNode,
      browseName: variableName,
    });

    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.MonEn`,
      browseName: `${variableName}.MonEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varMonEn});
        },
        set: (variant: Variant) => {
          this.varMonEn = variant.value;
          return StatusCodes.Good;
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.MonSafePos`,
      browseName: `${variableName}.MonSafePos`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varMonSafePos});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.MonStatErr`,
      browseName: `${variableName}.MonStatErr`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varMonStatErr});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.MonDynErr`,
      browseName: `${variableName}.MonDynErr`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varMonDynErr});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.MonStatTi`,
      browseName: `${variableName}.MonStatTi`,
      dataType: DataType.Double,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Double, value: this.varMonStatTi});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.MonDynTi`,
      browseName: `${variableName}.MonDynTi`,
      dataType: DataType.Double,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Double, value: this.varMonDynTi});
        },
      },
    });
    }

  public getFeedbackMonitoringDAInstanceMockupJSON() {
    return getFeedbackMonitoringDAMockupReferenceJSON(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name || 'UnqualifiedName');
  }
}
