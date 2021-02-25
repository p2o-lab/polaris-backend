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
import {BaseDataAssemblyOptions} from '@p2olab/polaris-interface';

export function getDataAssemblyMockupJSON(): {TagName: {}; TagDescription: {}} {
  return ({
    TagName: {
      value: 'Sample TagName'
    },
    TagDescription: {
      value: 'Sample TagDescription'
    }
  });
}

export function getDataAssemblyMockupReferenceJSON(
    namespace = 1,
    objectBrowseName = 'P2OGalaxy'): BaseDataAssemblyOptions {

  return ({
    TagName:   {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.TagName`,
      dataType: 'String'
    },
    TagDescription: {
      namespaceIndex: `${namespace}`,
      nodeId: `${objectBrowseName}.TagDescription`,
      dataType: 'String'
    }
  });
}

export class DataAssemblyMockup {
  public tagName = '';
  public tagDescription = '';
  protected dataAssemblyNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string, tagName?: string, tagDescription?: string) {
    this.tagName = tagName || 'No TagName available!';
    this.tagDescription = tagDescription || 'No TagDescription available!';


    this.dataAssemblyNode = namespace.addObject({
      organizedBy: rootNode,
      browseName: variableName,
    });

    namespace.addVariable({
      componentOf: this.dataAssemblyNode,
      nodeId: `ns=${namespace};s=${variableName}.TagName`,
      browseName: `${variableName}.TagName`,
      dataType: DataType.String,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.String, value: this.tagName});
        }
      },
    });

    namespace.addVariable({
      componentOf: this.dataAssemblyNode,
      nodeId: `ns=${namespace};s=${variableName}.TagDescription`,
      browseName: `${variableName}.TagDescription`,
      dataType: DataType.String,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.String, value: this.tagDescription});
        },
      },
    });
  }

  public getDataAssemblyInstanceMockupJSON(): BaseDataAssemblyOptions{
    return getDataAssemblyMockupReferenceJSON(
        this.dataAssemblyNode.namespaceIndex,
        this.dataAssemblyNode.browseName.name || 'UnqualifiedName');
  }
}
