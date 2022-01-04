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
import {getOpModeMockupReferenceJSON, OpModeMockup} from '../_extensions/opMode/OpMode.mockup';
import {
    getServiceSourceModeMockupReferenceJSON,
    ServiceSourceModeMockup
} from '../_extensions/serviceSourceMode/ServiceSourceMode.mockup';
import {ServiceMtpCommand, ServiceState, ServiceStateString} from '../../serviceSet/service/enum';
import {getWQCDAMockupReferenceJSON, WQCDAMockup} from '../_extensions/wqcDA/WQCDA.mockup';
import {getOSLevelMockupReferenceJSON} from '../_extensions/osLevel/OSLevel.mockup';
import {DataAssemblyControllerMockup} from '../DataAssemblyController.mockup';
import {MtpStateMachine, UserDefinedActions, UserDefinedGuard} from '../../StateMachine/MtpStateMachine';

export function getServiceControlMockupReferenceJSON(
    namespace: number,
    objectBrowseName: string): object {
  return (
      {
          
          ...getWQCDAMockupReferenceJSON(namespace,objectBrowseName),
          ...getOSLevelMockupReferenceJSON(namespace,objectBrowseName),
          ...getServiceSourceModeMockupReferenceJSON(namespace,objectBrowseName),
        ...getOpModeMockupReferenceJSON(namespace,objectBrowseName),
        CommandOp: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.CommandOp`,
          dataType: 'UInt32'
        },
        CommandInt: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.CommandInt`,
          dataType: 'UInt32'
        },
        CommandExt: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.CommandExt`,
          dataType: 'UInt32'
        },
        CommandEn: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.CommandEn`,
          dataType: 'UInt32'
        },
        StateCur: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.StateCur`,
          dataType: 'UInt32'
        },
        ProcedureOp: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureOp`,
          dataType: 'UInt32'
        },
        ProcedureExt: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureExt`,
          dataType: 'UInt32'
        },
        ProcedureInt: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureInt`,
          dataType: 'UInt32'
        },
        ProcedureCur: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureCur`,
          dataType: 'UInt32'
        },
        ProcedureReq: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.ProcedureReq`,
          dataType: 'UInt32'
        },
        InteractQuestionID: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.InteractQuestionID`,
          dataType: 'UInt32'
        },
        InteractAnswerID: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.InteractAnswerID`,
          dataType: 'UInt32'
        },
        PosTextID: {
          namespaceIndex: `${namespace}`,
          nodeId: `${objectBrowseName}.PosTextID`,
          dataType: 'UInt32'
        }
      });
}

export class ServiceControlMockup extends DataAssemblyControllerMockup{
    public serviceSourceMode: ServiceSourceModeMockup;
    public operationMode: OpModeMockup;
    protected wqc: WQCDAMockup;

    protected commandOp = 0;
    protected commandInt = 0;
    protected commandExt = 0;
    protected procedureExt = 0;
    commandEn = 268;

    protected posTextID = 0;
    protected interactAnswerID = 0;
    protected interactQuestionID = 0;

    protected stateMachine: MtpStateMachine;
    private procedureOp = 0;
    private procedureInt = 0;

    public get state(): ServiceStateString {
        return this.stateMachine.getState();
    }

    constructor(namespace: Namespace, rootNode: UAObject, variableName: string){
          super(namespace, rootNode, variableName);
          this.operationMode = new OpModeMockup(namespace, this.mockupNode, variableName);
          this.serviceSourceMode = new ServiceSourceModeMockup(namespace, this.mockupNode, variableName);
          this.wqc = new WQCDAMockup(namespace, this.mockupNode, variableName);

          this.stateMachine = new MtpStateMachine(variableName, {} as UserDefinedGuard, {} as UserDefinedActions);
          this.stateMachine.start();

          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.CommandOp`,
              browseName: `${variableName}.CommandOp`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.commandOp});
                  },
                  set: (variant: Variant): StatusCodes => {
                      const reqCommandOp = parseInt(variant.value, 10);
                      if(!Object.values(ServiceMtpCommand).includes(reqCommandOp)) {
                          return StatusCodes.BadInvalidArgument;
                      }
                      if(this.operationMode.stateOpAct){
                          if(this.commandEn===reqCommandOp){
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
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.CommandInt`,
              browseName: `${variableName}.CommandInt`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.commandInt});
                  },
              },
          });
          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.CommandExt`,
              browseName: `${variableName}.CommandExt`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.commandExt});
                  },
                  set: (variant: Variant): StatusCodes => {
                      const reqCommandExt = parseInt(variant.value, 10);
                      if(!Object.values(ServiceMtpCommand).includes(reqCommandExt)) {
                          return StatusCodes.BadInvalidArgument;
                      }
                      if(this.operationMode.stateAutAct && this.serviceSourceMode.srcExtAct){
     /*                     if(this.commandEn===reqCommandExt){
                              this.commandExt = reqCommandExt;
                              return StatusCodes.Good;
                          }*/
                          this.logger.info(`Set service CommandExt (${this.name}): ${ServiceMtpCommand[reqCommandExt]} (${reqCommandExt})`);
                          const result = this.stateMachine.triggerEvent(reqCommandExt);
                          if (result) {
                              return StatusCodes.Good;
                          }
                      }
                      this.commandExt = ServiceMtpCommand.UNDEFINED;
                      return StatusCodes.BadInvalidArgument;
                  },
              },
          });

          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.ProcedureOp`,
              browseName: `${variableName}.ProcedureOp`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.procedureOp});
                  },
                  set: (variant: Variant): StatusCodes => {
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
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.ProcedureInt`,
              browseName: `${variableName}.ProcedureInt`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.procedureInt});
                  },
              },
          });

          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.ProcedureExt`,
              browseName: `${variableName}.ProcedureExt`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.procedureExt});
                  },
                  set: (variant: Variant): StatusCodes => {
                      const reqProcedureExt = parseInt(variant.value, 10);
                      if(this.operationMode.stateAutAct && this.serviceSourceMode.srcExtAct){
                          // TODO: check if procedure is valid
                          this.stateMachine.setProcedureReq(reqProcedureExt);
                          this.logger.info(
                              `Set ProcedureReq by ProcedureExt (${this.name}): ProcedureReq: ${this.stateMachine.getProcedureReq()}`);

                          return StatusCodes.Good;
                      }
                      return StatusCodes.BadInvalidArgument;
                  },
              },
          });

          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.StateCur`,
              browseName: `${variableName}.StateCur`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      const stateCur: ServiceState = ServiceState[this.state];
                      return new Variant({dataType: DataType.UInt32, value: stateCur});
                  },
              },
          });

          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.CommandEn`,
              browseName: `${variableName}.CommandEn`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      let enabled = 0;
                      for (const [key, value] of this.stateMachine.getCommandEnabled()) {
                          if (value) {
                              enabled += ServiceMtpCommand[key];
                          }
                      }
                      return new Variant({dataType: DataType.UInt32, value: enabled});
                  },
              },
          });

          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.ProcedureCur`,
              browseName: `${variableName}.ProcedureCur`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.procedureCur});
                  },
              },
          });

          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.ProcedureReq`,
              browseName: `${variableName}.ProcedureReq`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.procedureReq});
                  },
              },
          });

          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.PosTextID`,
              browseName: `${variableName}.PosTextID`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.posTextID});
                  },
              },
          });
          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.InteractQuestionID`,
              browseName: `${variableName}.InteractQuestionID`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.interactQuestionID});
                  },
              },
          });
          namespace.addVariable({
              componentOf: this.mockupNode,
              nodeId: `ns=${namespace.index};s=${variableName}.InteractAnswerID`,
              browseName: `${variableName}.InteractAnswerID`,
              dataType: 'UInt32',
              value: {
                  get: (): Variant => {
                      return new Variant({dataType: DataType.UInt32, value: this.interactAnswerID});
                  },
              },
          });
    }
/*
    public set procedureInt(procedureInt: number) {
        const procedure = Math.trunc(procedureInt);
        if(this.operationMode.stateAutAct && this.serviceSourceMode.isIntSource) {
            this.stateMachine.setProcedureReq(procedure);
            this.logger.info(
                `Set ProcedureReq by ProcedureInt (${this.name}): ProcedureReq: ${this.stateMachine.getProcedureReq()}`);
        }
    }

    public set procedureOp(procedureOp: number) {
        const procedure = Math.trunc(procedureOp);
        if(this.operationMode.stateOpAct && this.osLevel === 0){
            // TODO: check if procedure is valid
            this.stateMachine.setProcedureReq(procedure);
            this.logger.info(
                `Set ProcedureReq by ProcedureOp (${this.name}): ProcedureReq: ${this.stateMachine.getProcedureReq()}`);
        }
    }
*/

    public get procedureCur(): number {
        return this.stateMachine.getProcedureCur();
    }

    public get procedureReq(): number {
        return this.stateMachine.getProcedureReq();
    }

    public getServiceControlInstanceMockupJSON(): object {
        return getServiceControlMockupReferenceJSON(
            this.mockupNode.namespaceIndex,
            this.mockupNode.browseName.name as string);
    }
}
