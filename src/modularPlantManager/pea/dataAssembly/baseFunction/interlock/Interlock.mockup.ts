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

import {DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';
import {DataType, Namespace, UAObject, Variant} from 'node-opcua';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';


function getInterlockSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

  const result: DataItemModel[] = [];
  let dataItem: DataItemModel = getEmptyDataItemModel();
  dataItem.name = 'PermEn';
  dataItem.dataType = 'Boolean';
  let ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.PermEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'Permit';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.Permit`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'IntlEn';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.IntlEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'Interlock';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.Interlock`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'ProtEn';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.ProtEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'Protect';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.Protect`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

return result;
}


export function getInterlockDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
  return getInterlockSpecificDataItemModels(namespace, objectBrowseName);
}

export class InterlockMockup {

  public varPermEn = false;
  public varPermit = false;
  public varIntlEn = false;
  public varInterlock = false;
  public varProtEn = false;
  public varProtect = false;

  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

    this.mockupNode = rootNode;

    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.PermEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.Permit`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.IntlEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.Interlock`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.ProtEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.Protect`,
      browseName: `${variableName}.Protect`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varProtect});
        },
      },
    });
  }

  public getDataItemModel(): DataItemModel[] {
    return getInterlockDataItemModel(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name as string);
  }
}
