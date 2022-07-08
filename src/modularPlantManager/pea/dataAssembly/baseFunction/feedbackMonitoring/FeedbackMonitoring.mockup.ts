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
import {DataItemAccessLevel, DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';


function getFeedbackMonitoringSpecificDataItemModels(namespace: number, objectBrowseName: string): DataItemModel[] {

  const result: DataItemModel[] = [];
  let dataItem: DataItemModel = getEmptyDataItemModel();
  dataItem.name = 'MonEn';
  dataItem.dataType = 'Boolean';
  let ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.MonEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'MonSafePos';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.MonSafePos`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'MonStatErr';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.MonStatErr`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'MonDynErr';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.MonDynErr`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'MonStatTi';
  dataItem.dataType = 'Float';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.MonStatTi`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'MonDynTi';
  dataItem.dataType = 'Float';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = DataItemAccessLevel.ReadWrite;
  ciOptions.nodeId.identifier = `${objectBrowseName}.MonDynTi`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  return result;
}


export function getFeedbackMonitoringDataItemModel(namespace: number, objectBrowseName: string): DataItemModel[] {
  return getFeedbackMonitoringSpecificDataItemModels(namespace, objectBrowseName);
}


export class FeedbackMonitoringMockup {

  public varMonEn = false;
  public varMonSafePos = false;
  public varMonStatErr = false;
  public varMonDynErr = false;
  public varMonStatTi = 0;
  public varMonDynTi = 0;

  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string) {

    this.mockupNode = rootNode;

    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.MonEn`,
      browseName: `${variableName}.MonEn`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varMonEn});
        },
        set: (variant: Variant): StatusCodes => {
          this.varMonEn = variant.value;
          return StatusCodes.Good;
        },
      },
    });
    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.MonSafePos`,
      browseName: `${variableName}.MonSafePos`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varMonSafePos});
        },
      },
    });
    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.MonStatErr`,
      browseName: `${variableName}.MonStatErr`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varMonStatErr});
        },
      },
    });
    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.MonDynErr`,
      browseName: `${variableName}.MonDynErr`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varMonDynErr});
        },
      },
    });
    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.MonStatTi`,
      browseName: `${variableName}.MonStatTi`,
      dataType: DataType.Double,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Double, value: this.varMonStatTi});
        },
      },
    });
    namespace.addVariable({
      componentOf: this.mockupNode,
      nodeId: `ns=${namespace.index};s=${variableName}.MonDynTi`,
      browseName: `${variableName}.MonDynTi`,
      dataType: DataType.Double,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Double, value: this.varMonDynTi});
        },
      },
    });
    }

  public getDataItemModel(): DataItemModel[] {
    return getFeedbackMonitoringDataItemModel(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name as string);
  }
}
