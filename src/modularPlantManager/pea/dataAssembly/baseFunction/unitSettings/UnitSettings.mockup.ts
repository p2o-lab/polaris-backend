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
import {DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';
import {Access} from '@p2olab/pimad-types';


function getUnitSettingsSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

  const result: DataItemModel[] = [];
  const dataItem: DataItemModel = getEmptyDataItemModel();
  dataItem.name = 'VUnit';
  dataItem.dataType = 'Int16';
  const ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VUnit`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  return result;
}


export function getUnitSettingsDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
  return getUnitSettingsSpecificDataItemModels(namespace, objectBrowseName);
}


export class UnitSettingsMockup {

  public unit = 0;

  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

    this.mockupNode = rootNode;

      namespace.addVariable({
        componentOf: rootNode,
        nodeId: `ns=${namespace.index};s=${variableName}.VUnit`,
        browseName: `${variableName}.VUnit`,
        dataType: DataType.Int16,
        value: {
          get: (): Variant => {
            return new Variant({dataType: DataType.Int16, value: this.unit});
          },
        },
      });
    }

  public getDataItemModel(): DataItemModel[] {
    return getUnitSettingsDataItemModel(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name as string);
  }
}
