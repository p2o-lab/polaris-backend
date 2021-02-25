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

export function getScaleSettingDAMockupReferenceJSON<T extends 'Float' | 'Int32' >(
    namespace = 1,
    objectBrowseName = 'P2OGalaxy',
    type: T) {

  return ({
    VSclMin: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VSclMin`,
      dataType: type
    },
    VSclMax: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.VSclMax`,
      dataType: type
    }
  });
}

export class ScaleSettingDAMockup<T extends DataType.Double | DataType.Int32> {
  public readonly vSclMin = 0;
  public readonly vSclMax = 0;
  private readonly type: DataType;
  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string,  type: T) {
    this.type = type;

    this.mockupNode = namespace.addObject({
      organizedBy: rootNode,
      browseName: variableName,
    });

    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace};s=${variableName}.VSclMin`,
      browseName: `${variableName}.VSclMin`,
      dataType: this.type,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.type, value: this.vSclMin});
        },
      },
    });

    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace};s=${variableName}.VSclMax`,
      browseName: `${variableName}.VSclMax`,
      dataType: this.type,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.type, value: this.vSclMax});
        },
      },
    });
    }

  public getScaleSettingDAInstanceMockupJSON() {
    return getScaleSettingDAMockupReferenceJSON(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name || 'UnqualifiedName',
        (this.type === DataType.Double)? 'Float' : 'Int32'
        );
  }
}
