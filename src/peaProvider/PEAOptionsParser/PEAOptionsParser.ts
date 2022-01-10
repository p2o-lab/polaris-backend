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
 
import {DataAssemblyModel, DataItemModel, PEAModel,  ProcedureModel, ServiceModel} from '@p2olab/pimad-interface';
import {DataAssemblyOptions,  PEAOptions, ServiceControlOptions, ServiceOptions} from '@p2olab/polaris-interface';
import {ProcedureOptions} from '@p2olab/polaris-interface';
import {IDProvider} from '../../modularPlantManager/_utils/idProvider/IDProvider';

export interface PEAOptionsParserInterface{
     dataAssemblyOptionsArray: DataAssemblyOptions[];
     serviceOptionsArray: ServiceOptions[];
}

/**
 * This class helps parsing the PEAModel coming from PiMAd for creating PEAOptions
 */
export class PEAOptionsParser {

    /**
     * transformation of PEAModel to PEAOptions
     * @return {Promise<PEAOptions>}
     * @param peaModel
     */
    public static async createPEAOptions(peaModel: PEAModel): Promise<PEAOptions>{
        const parsedOptions = PEAOptionsParser.createOptionsArrays(peaModel);
        const endpoint = peaModel.endpoint[0].value;

        return {
            name: peaModel.name,
            id: IDProvider.generateIdentifier(),
            pimadIdentifier: peaModel.pimadIdentifier,
            services: parsedOptions.serviceOptionsArray,
            username: '',
            password: '',
            hmiUrl: '',
            opcuaServerUrl: endpoint,
            dataAssemblies: parsedOptions.dataAssemblyOptionsArray
        };
    }

    /**
     * create DataAssemblyOptionsArray and ServiceOptionsArray, which are necessary for PEAOptions
     * @param peaModel{PEAModel}
     * @private
     * @return {PEAOptionsParserInterface}
     */
    private static createOptionsArrays(peaModel: PEAModel): PEAOptionsParserInterface {
        const dataAssemblyOptionsArray = this.createDataAssemblyOptionsArray(peaModel.dataAssemblies);
        const servicesOptionsArray = this.createServiceOptionsArray(peaModel.services);
        return {dataAssemblyOptionsArray: dataAssemblyOptionsArray, serviceOptionsArray: servicesOptionsArray};
    }

    /**
     * @param dataAssemblyModels {DataAssemblyModel[]}
     * @return {DataAssemblyOptions[]}
     * @private
     */
    private static createDataAssemblyOptionsArray(dataAssemblyModels: DataAssemblyModel[]): DataAssemblyOptions[]{
        const dataAssemblyOptionsArray: DataAssemblyOptions[]=[];
        dataAssemblyModels.forEach(dataAssemblyModel => {
            const dataAssemblyOptions = PEAOptionsParser.createDataAssemblyOptions(dataAssemblyModel);
            dataAssemblyOptionsArray.push(dataAssemblyOptions);
        });
        return(dataAssemblyOptionsArray);
    }

    /**
     * @return {ServiceOptions[]}
     * @private
     * @param serviceModels
     */
    private static createServiceOptionsArray(serviceModels: ServiceModel[]): ServiceOptions[]{
        const servicesOptionsArray: ServiceOptions[] = [];
        serviceModels.forEach(serviceModel=> {
            const procedureOptionsArray = this.createProcedureOptionsArray(serviceModel.procedures);
            const serviceDataAssemblyOptions = PEAOptionsParser.createDataAssemblyOptions(serviceModel.dataAssembly as DataAssemblyModel);
            const parameters = PEAOptionsParser.createDataAssemblyOptionsArray(serviceModel.parameters);

            const serviceOptions: ServiceOptions = {
                name: serviceModel.name,
                communication: serviceDataAssemblyOptions.dataItems as unknown as ServiceControlOptions,
                procedures: procedureOptionsArray,
                parameters: parameters,
            };

            servicesOptionsArray.push(serviceOptions);
        });
        return servicesOptionsArray;
    }

    /**
     * @return {DataAssemblyOptions[]}
     * @private
     * @param procedureModels
     */
    private static createProcedureOptionsArray(procedureModels: ProcedureModel[]): ProcedureOptions[] {
        const procedureOptionsArray: ProcedureOptions[] = [];
        procedureModels.forEach(procedure =>{
            const procedureName = procedure.name;
            let isDefault = false;
            let isSelfCompleting = false;
            let procedureID = '';
            
            procedure.attributes.forEach((attribute: { name: string; value: string}) =>{
                switch(attribute.name){
                    case ('IsSelfCompleting'):
                        isSelfCompleting = JSON.parse(attribute.value.toLocaleLowerCase());
                        break;
                    case ('IsDefault'):
                        isDefault = JSON.parse(attribute.value.toLocaleLowerCase());
                        break;
                    case ('ProcedureID'):
                        procedureID = JSON.parse(attribute.value.toLocaleLowerCase());
                        break;
                }
            });

            //healthStateView
            const procedureDataAssemblyOptions = [PEAOptionsParser.createDataAssemblyOptions(procedure.dataAssembly as DataAssemblyModel)];

            const procedureParameters = PEAOptionsParser.createDataAssemblyOptionsArray(procedure.parameters);
            const reportValues = PEAOptionsParser.createDataAssemblyOptionsArray(procedure.reportValues);
            const processValuesIn = PEAOptionsParser.createDataAssemblyOptionsArray(procedure.processValuesIn);
            const processValuesOut = PEAOptionsParser.createDataAssemblyOptionsArray(procedure.processValuesOut);

            const procedureOptions: ProcedureOptions = {
                id: procedureID,
                name: procedureName,
                isDefault : isDefault,
                isSelfCompleting: isSelfCompleting,
                dataAssembly: procedureDataAssemblyOptions,
                parameters: procedureParameters,
                reportParameters: reportValues,
                processValuesIn: processValuesIn,
                processValuesOut: processValuesOut
            };

            procedureOptionsArray.push(procedureOptions);
        });
        return procedureOptionsArray;
    }

    /**
     *
     * @param dataAssemblyModel {DataAssemblyModel}
     * @private
     * @return {DataAssemblyOptions}
     */
    private static createDataAssemblyOptions(dataAssemblyModel: DataAssemblyModel): DataAssemblyOptions {
        // Initializing baseDataAssemblyOptions, which will be filled during an iteration below
            const baseDataAssemblyOptions:
                {
                    [k: string]: unknown;
                    TagName: string;
                    TagDescription: string;
                } =
                {
                    TagName: '',
                    TagDescription: ''
                };

            // Initializing dataAssemblyName, dataAssemblyInterfaceClass
            const dataAssemblyName =dataAssemblyModel.name;
            const dataAssemblyInterfaceClass= dataAssemblyModel.metaModelRef;
            const dataItems = dataAssemblyModel.dataItems;
            dataItems.map((dataItem: DataItemModel)=>{
                // Initializing dataAssemblies, which will be assigned later
                let namespaceIndex ='', nodeId='', value: undefined | string;
                const dataType=dataItem.dataType;
                const cIData = dataItem.cIData;
                if(cIData){ //dynamic
                    nodeId= cIData.nodeId.identifier;
                    namespaceIndex = cIData.nodeId.namespaceIndex;
                   // namespaceIndex = namespaceUri; // for testing
                    baseDataAssemblyOptions[dataItem.name as string] = {
                        nodeId: nodeId,
                        namespaceIndex: namespaceIndex,
                        dataType: dataType,
                    };
                } else { // static
                    value = dataItem.value;
                    baseDataAssemblyOptions[dataItem.name as string] = value;
                }
            });
            
        return {
            name: dataAssemblyName,
            metaModelRef: dataAssemblyInterfaceClass,
            dataItems: baseDataAssemblyOptions
        };
    }

}
