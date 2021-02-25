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
import {BaseDataAssemblyOptions} from '@p2olab/polaris-interface';
import {getOpModeDAMockupReferenceJSON, OpModeDAMockup} from '../_extensions/opModeDA/OpModeDA.mockup';
import {
    getServiceSourceModeDAMockupReferenceJSON,
    ServiceSourceModeDAMockup
} from '../_extensions/serviceSourceModeDA/ServiceSourceModeDA.mockup';
import {ServiceMtpCommand} from '../../serviceSet/service/enum';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../_extensions/wqcDA/WQCDA.mockup';
import {getDataAssemblyMockupReferenceJSON} from '../DataAssembly.mockup';
import {getOSLevelDAMockupReferenceJSON} from '../_extensions/osLevelDA/OSLevelDA.mockup';

export function getServiceControlMockupReferenceJSON(
    namespace = 1,
    objectBrowseName = `${namespace}`) {
  return (
      {
          ...getDataAssemblyMockupReferenceJSON(namespace,objectBrowseName),
          ...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
          ...getOSLevelDAMockupReferenceJSON(namespace,objectBrowseName),
          ...getServiceSourceModeDAMockupReferenceJSON(namespace,objectBrowseName),
        ...getOpModeDAMockupReferenceJSON(namespace,objectBrowseName),
        CommandOp: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.CommandOp`,
          dataType: 'Int32'
        },
        CommandInt: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.CommandInt`,
          dataType: 'Int32'
        },
        CommandExt: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.CommandExt`,
          dataType: 'Int32'
        },
        CommandEn: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.CommandEn`,
          dataType: 'Int32'
        },
        StateCur: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.StateCur`,
          dataType: 'Int32'
        },
        ProcedureOp: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureOp`,
          dataType: 'Int32'
        },
        ProcedureExt: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureExt`,
          dataType: 'Int32'
        },
        ProcedureInt: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureInt`,
          dataType: 'Int32'
        },
        ProcedureCur: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureCur`,
          dataType: 'Int32'
        },
        ProcedureReq: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureReq`,
          dataType: 'Int32'
        },
        InteractQuestionID: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.InteractQuestionID`,
          dataType: 'Int32'
        },
        InteractAnswerID: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.InteractAnswerID`,
          dataType: 'Int32'
        },
        PosTextID: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.PosTextID`,
          dataType: 'Int32'
        }
      });
}

export abstract class ServiceControlMockup {
    protected tagName = '';
    protected tagDescription = '';
    protected dataAssemblyNode: UAObject;

    protected serviceSourceMode: ServiceSourceModeDAMockup;
    protected operationMode: OpModeDAMockup;
    protected wqc: WQCDAMockup;

    protected commandOp = 0;
    protected commandInt = 0;
    protected commandExt = 0;

    protected procedureOp = 0;
    protected procedureInt = 0;
    protected procedureExt = 0;

    protected stateCur = 0;
    protected commandEn = 0;
    protected procedureCur = 0;
    protected procedureReq = 0;
    protected posTextID = 0;

  protected constructor(namespace: Namespace, rootNode: UAObject, variableName: string, tagName?: string, tagDescription?: string) {
    this.tagName = tagName || 'No TagName available!';
    this.tagDescription = tagDescription || 'No TagDescription available!';
    this.dataAssemblyNode = namespace.addObject({
      organizedBy: rootNode,
      browseName: variableName,
    });

      this.operationMode = new OpModeDAMockup(namespace, this.dataAssemblyNode, variableName);
      this.serviceSourceMode = new ServiceSourceModeDAMockup(namespace, this.dataAssemblyNode, variableName);
      this.wqc = new WQCDAMockup(namespace, this.dataAssemblyNode, variableName);

      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.CommandOp`,
          browseName: `${variableName}.CommandOp`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.commandOp});
              },
              set: (variant: Variant) => {
                  const reqCommandOp = parseInt(variant.value, 10);
                  if(!Object.values(ServiceMtpCommand).includes(reqCommandOp)) {
                      return StatusCodes.BadInvalidArgument;
                  }
                  if(this.operationMode.stateOpAct){
                      if((reqCommandOp & this.commandEn)===reqCommandOp){
                          this.commandOp = reqCommandOp;
                          return StatusCodes.Good;
                      }
                  }
                  this.commandOp = ServiceMtpCommand.UNDEFINED;
                  return StatusCodes.BadInvalidArgument;
              },
          },
      });
      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.CommandInt`,
          browseName: `${variableName}.CommandInt`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.commandInt});
              },
          },
      });
      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.CommandExt`,
          browseName: `${variableName}.CommandExt`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.commandExt});
              },
              set: (variant: Variant) => {
                  const reqCommandExt = parseInt(variant.value, 10);
                  if(!Object.values(ServiceMtpCommand).includes(reqCommandExt)) {
                      return StatusCodes.BadInvalidArgument;
                  }
                  if(this.operationMode.stateAutAct && this.serviceSourceMode.srcExtAct){
                      if((reqCommandExt & this.commandEn)===reqCommandExt){
                          this.commandExt = reqCommandExt;
                          return StatusCodes.Good;
                      }
                  }
                  this.commandExt = ServiceMtpCommand.UNDEFINED;
                  return StatusCodes.BadInvalidArgument;
              },
          },
      });

      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.ProcedureOp`,
          browseName: `${variableName}.ProcedureOp`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.procedureOp});
              },
              set: (variant: Variant) => {
                  const reqProcedureOp = parseInt(variant.value, 10);
                  if(this.operationMode.stateOpAct){
                      // TODO: check if procedure is valid
                      this.procedureOp = reqProcedureOp;
                      return StatusCodes.Good;
                  }
                  return StatusCodes.BadInvalidArgument;
              },
          },
      });
      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.ProcedureInt`,
          browseName: `${variableName}.ProcedureInt`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.procedureInt});
              },
          },
      });

      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.ProcedureExt`,
          browseName: `${variableName}.ProcedureExt`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.procedureExt});
              },
              set: (variant: Variant) => {
                  const reqProcedureExt = parseInt(variant.value, 10);
                  if(this.operationMode.stateAutAct && this.serviceSourceMode.srcExtAct){
                      // TODO: check if procedure is valid
                      this.procedureExt = reqProcedureExt;
                      return StatusCodes.Good;
                  }
                  return false;
              },
          },
      });

      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.StateCur`,
          browseName: `${variableName}.StateCur`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.stateCur});
              },
          },
      });

      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.CommandEn`,
          browseName: `${variableName}.CommandEn`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.commandEn});
              },
          },
      });

      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.ProcedureCur`,
          browseName: `${variableName}.ProcedureCur`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.procedureCur});
              },
          },
      });

      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.ProcedureReq`,
          browseName: `${variableName}.ProcedureReq`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.procedureReq});
              },
          },
      });

      namespace.addVariable({
          componentOf: this.dataAssemblyNode,
          nodeId: `ns=${namespace};s=${variableName}.PosTextID`,
          browseName: `${variableName}.PosTextID`,
          dataType: 'UInt32',
          value: {
              get: (): Variant => {
                  return new Variant({dataType: DataType.UInt32, value: this.posTextID});
              },
          },
      });

  }

  public getServiceControlInstanceMockupJSON(): BaseDataAssemblyOptions{
    return getServiceControlMockupReferenceJSON(
        this.dataAssemblyNode.namespaceIndex,
        this.dataAssemblyNode.browseName.name || 'UnqualifiedName');
  }
}
