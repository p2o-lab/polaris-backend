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

import {DataType, Namespace, StatusCodes, UAObject, Variant} from 'node-opcua';
import {DataItemModel} from '@p2olab/pimad-interface';
import {getEmptyCIDataModel, getEmptyDataItemModel} from '../../dataItem/DataItem.mockup';
import {Access} from '@p2olab/pimad-types';

function getLimitMonitoringSpecificDataItemModels<T extends 'Ana' | 'DInt'>(namespace: number, objectBrowseName: string, type: T): DataItemModel[] {

  const result: DataItemModel[] = [];
  let dataItem: DataItemModel = getEmptyDataItemModel();
  dataItem.name = 'VAHEn';
  dataItem.dataType = 'Boolean';
  let ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VAHEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VAHLim';
  dataItem.dataType = (type === 'Ana')? 'Float': 'Int32';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VAHLim`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VAHAct';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VAHAct`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  //VWH
  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VWHEn';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VWHEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VWHLim';
  dataItem.dataType = (type === 'Ana')? 'Float': 'Int32';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VWHLim`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VWHAct';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VWHAct`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  //VTH
  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VTHEn';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VTHEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VTHLim';
  dataItem.dataType = (type === 'Ana')? 'Float': 'Int32';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VTHLim`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VTHAct';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VTHAct`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  //VAL
  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VALEn';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VALEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VALLim';
  dataItem.dataType = (type === 'Ana')? 'Float': 'Int32';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VALLim`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VALAct';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VALAct`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  //VWL
  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VWLEn';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VWLEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VWLLim';
  dataItem.dataType = (type === 'Ana')? 'Float': 'Int32';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VWLLim`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VWLAct';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VWLAct`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  //VTL
  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VTLEn';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VTLEn`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VTLLim';
  dataItem.dataType = (type === 'Ana')? 'Float': 'Int32';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VTLLim`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  dataItem = getEmptyDataItemModel();
  dataItem.name = 'VTLAct';
  dataItem.dataType = 'Boolean';
  ciOptions = getEmptyCIDataModel();
  ciOptions.nodeId.access = Access.ReadWriteAccess;
  ciOptions.nodeId.identifier = `${objectBrowseName}.VTLAct`;
  ciOptions.nodeId.namespaceIndex = `${namespace}`;
  dataItem.cIData = ciOptions;
  result.push(dataItem);

  return result;
}


export function getLimitMonitoringDataItemModel<T extends 'Ana' | 'DInt'>(namespace: number, objectBrowseName: string, type: T): DataItemModel[] {
  return getLimitMonitoringSpecificDataItemModels(namespace, objectBrowseName, type);
}

export class LimitMonitoringMockup<T extends 'Ana' | 'DInt'>{
  private readonly type: 'Ana' | 'DInt';
  private readonly dataType: DataType;

  public varAHEn = false;
  public varAHLim = 0;
  public varAHAct = false;
  public varWHEn = false;
  public varWHLim = 0;
  public varWHAct = false;
  public varTHEn = false;
  public varTHLim = 0;
  public varTHAct = false;

  public varTLEn = false;
  public varTLLim = 0;
  public varTLAct = false;
  public varWLEn = false;
  public varWLLim = 0;
  public varWLAct = false;
  public varALEn = false;
  public varALLim = 0;
  public varALAct = false;
  protected mockupNode: UAObject;

  constructor(namespace: Namespace, rootNode: UAObject, variableName: string, type: T) {
    this.type = type;
    this.dataType = (type === 'Ana')? DataType.Double : DataType.Int32;
    this.mockupNode = rootNode;

    namespace.addVariable({
      componentOf: rootNode,
      nodeId: `ns=${namespace.index};s=${variableName}.VAHEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VAHLim`,
      browseName: `${variableName}.VAHLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varAHLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
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
      nodeId: `ns=${namespace.index};s=${variableName}.VAHAct`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VWHEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VWHLim`,
      browseName: `${variableName}.VWHLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varWHLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
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
      nodeId: `ns=${namespace.index};s=${variableName}.VWHAct`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VTHEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VTHLim`,
      browseName: `${variableName}.VTHLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varTHLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
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
      nodeId: `ns=${namespace.index};s=${variableName}.VTHAct`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VTLEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VTLLim`,
      browseName: `${variableName}.VTLLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varTLLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
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
      nodeId: `ns=${namespace.index};s=${variableName}.VTLAct`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VWLEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VWLLim`,
      browseName: `${variableName}.VWLLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varWLLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
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
      nodeId: `ns=${namespace.index};s=${variableName}.VWLAct`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VALEn`,
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
      nodeId: `ns=${namespace.index};s=${variableName}.VALLim`,
      browseName: `${variableName}.VALLim`,
      dataType: this.dataType,
      value: {
        get: (): Variant => {
          return new Variant({dataType: this.dataType, value: this.varALLim});
        },

        set: (variant: Variant): StatusCodes => {
          switch (this.dataType) {
            case DataType.Double:
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
      nodeId: `ns=${namespace.index};s=${variableName}.VALAct`,
      browseName: `${variableName}.VALAct`,
      dataType: DataType.Boolean,
      value: {
        get: (): Variant => {
          return new Variant({dataType: DataType.Boolean, value: this.varALAct});
        },
      },
    });
  }

  public getDataItemModel(): DataItemModel[] {
    return getLimitMonitoringDataItemModel(
        this.mockupNode.namespaceIndex,
        this.mockupNode.browseName.name as string,
        this.type);
  }
}
