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

import {DataType, Namespace, UAObject, Variant} from 'node-opcua';
import {DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';
import {Access} from '@p2olab/pimad-types';

function getScaleSettingsSpecificDataItemModels<T extends 'Ana' | 'DInt'>(namespace: number, objectBrowseName: string, type: T): DataItemModel[] {

  const result: DataItemModel[] = [];
  let dataItem: DataItemModel = getEmptyDataItemModel();
  dataItem.name = 'VSclMin';
  dataItem.dataType = (type === 'Ana')? 'Float': 'Int32';
  let ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VSclMin`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VSclMax';
  dataItem.dataType = (type === 'Ana')? 'Float': 'Int32';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VSclMax`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);


  return result;
}


export function getScaleSettingsDataItemModel<T extends 'Ana' | 'DInt'>(namespace: number, objectBrowseName: string, type: T): DataItemModel[] {
  return getScaleSettingsSpecificDataItemModels(namespace, objectBrowseName, type);
}


export class ScaleSettingMockup<T extends 'Ana' | 'DInt'> {

  public vSclMin = 0;
  public vSclMax = 0;

  private readonly type: 'Ana' | 'DInt';
  private readonly dataType: DataType;
  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string,  type: T) {
    this.type = type;
    this.dataType = (type === 'Ana')? DataType.Double : DataType.Int32;
    this.mockupNode = rootNode;

    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VSclMin`,
      browseName: `${variableName}.VSclMin`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.vSclMin});
        },
      },
    });

    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VSclMax`,
      browseName: `${variableName}.VSclMax`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.vSclMax});
        },
      },
    });
    }

  public getDataItemModel(): DataItemModel[] {
    return getScaleSettingsDataItemModel(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name as string,
        this.type);
  }
}
