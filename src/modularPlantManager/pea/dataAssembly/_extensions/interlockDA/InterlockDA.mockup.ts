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

import {DataType, Namespace, UAObject, Variant} from 'node-opcua';

export function getInterlockDAMockupReferenceJSON(
    namespace = 1,
    objectBrowseName = 'P2OGalaxy') {

  return ({
        PermEn: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.PermEn`,
          dataType: 'Boolean'
        },
        Permit: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.Permit`,
          dataType: 'Boolean'
        },
        IntlEn: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.IntlEn`,
          dataType: 'Boolean'
        },
        Interlock: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.Interlock`,
          dataType: 'Boolean'
        },
        ProtEn: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProtEn`,
          dataType: 'Boolean'
        },
        Protect: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.Protect`,
          dataType: 'Boolean'
        }
      }
  );
}

export class InterlockDAMockup {
  protected varPermEn = false;
  protected varPermit = false;
  protected varIntlEn = false;
  protected varInterlock = false;
  protected varProtEn = false;
  protected varProtect = false;
  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

    this.mockupNode = namespace.addObject({
      organizedBy: rootNode,
      browseName: variableName,
    });

    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.PermEn`,
      browseName: `${variableName}.PermEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varPermEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.Permit`,
      browseName: `${variableName}.Permit`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varPermit});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.IntlEn`,
      browseName: `${variableName}.IntlEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varIntlEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.Interlock`,
      browseName: `${variableName}.Interlock`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varInterlock});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.ProtEn`,
      browseName: `${variableName}.ProtEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varProtEn});
        },
      },
    });
    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace};s=${variableName}.Protect`,
      browseName: `${variableName}.Protect`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varProtect});
        },
      },
    });
  }

  public getInterlockDAInstanceMockupJSON() {
    return getInterlockDAMockupReferenceJSON(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name || 'UnqualifiedName');
  }
}
