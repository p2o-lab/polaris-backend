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

export function getResetDAMockupReferenceJSON(
    namespace: number,
    objectBrowseName: string): object {

  return ({
    ResetOp: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.ResetOp`,
      dataType: 'Boolean'
    },
    ResetAut: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.ResetAut`,
      dataType: 'Boolean'
    }
  });
}

export class ResetDAMockup {
  protected resetOp = false;
  protected resetAut = false;
  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

    this.mockupNode = namespace.addObject({
      organizedBy: rootNode,
      browseName: variableName,
    });

    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.ResetOp`,
      browseName: `${variableName}.ResetOp`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.resetOp});
        },
        set: (variant: Variant): StatusCodes => {
          this.resetOp = variant.value;
          return StatusCodes.Good;
        },
      },
    });

    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.ResetAut`,
      browseName: `${variableName}.ResetAut`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.resetAut});
        },
      },
    });
    }

  public getResetDAInstanceMockupJSON(): object {
    return getResetDAMockupReferenceJSON(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name as string);
  }
}
