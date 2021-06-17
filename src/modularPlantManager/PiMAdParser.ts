import {
    DataAssemblyModel,
    DataAssemblyOptions,
    DataItemModel,
    OpcUaNodeOptions,
    PEAModel, ProcedureModel, ServiceControlOptions, ServiceModel, ServiceOptions
} from '@p2olab/polaris-interface';
import {ProcedureOptions} from '@p2olab/polaris-interface/dist/service/options';

export interface PiMAdParserInteface{
     dataAssemblyOptionsArray: DataAssemblyOptions[];
     serviceOptionsArray: ServiceOptions[];
}

/**
 * This class helps parsing the PEAModel coming from PiMAd for creating PEAOptions
 */
export class PiMAdParser {

    static createOptionsArrays(peaModel: PEAModel): PiMAdParserInteface {
        const dataAssemblyOptionsArray = this.createDataAssemblyOptionsArray(peaModel.dataAssemblies);
        const servicesOptionsArray = this.createServiceOptionsArray(peaModel.services);
        return {dataAssemblyOptionsArray: dataAssemblyOptionsArray, serviceOptionsArray: servicesOptionsArray};
    }

    static createDataAssemblyOptionsArray(dataAssemblyModels: DataAssemblyModel[]): DataAssemblyOptions[]{
        const dataAssemblyOptionsArray: DataAssemblyOptions[]=[];
        dataAssemblyModels.forEach(dataAssemblyModel => {
            const dataAssemblyOptions = PiMAdParser.createDataAssemblyOptions(dataAssemblyModel);
            dataAssemblyOptionsArray.push(dataAssemblyOptions);
        });
        return(dataAssemblyOptionsArray);
    }

    static createServiceOptionsArray(serviceModels: ServiceModel[]): ServiceOptions[]{
        const servicesOptionsArray: ServiceOptions[] = [];
        serviceModels.forEach(serviceModel=> {
            const procedureOptionsArray = this.createProcedureOptionsArray(serviceModel.procedures);
            const serviceDataAssemblyOptions = PiMAdParser.createDataAssemblyOptions(serviceModel.dataAssembly as DataAssemblyModel);

            const serviceOptions: ServiceOptions = {
                name: serviceModel.name,
                communication: serviceDataAssemblyOptions.dataItems as unknown as ServiceControlOptions,
                procedures: procedureOptionsArray
            };

            servicesOptionsArray.push(serviceOptions);
        });
        return servicesOptionsArray;
    }

    private static createProcedureOptionsArray(procedureModels: ProcedureModel[]): ProcedureOptions[] {
        const procedureOptionsArray: ProcedureOptions[] = [];
        procedureModels.forEach(procedure =>{
            const procedureName = procedure.name;
            let isDefault: any, isSelfCompleting: any, procedureID='';
            procedure.attributes.forEach(attribute =>{
                switch(attribute.name){
                    case ('IsSelfCompleting'):
                        isSelfCompleting = JSON.parse(attribute.value);
                        break;
                    case ('IsDefault'):
                        isDefault = JSON.parse(attribute.value);
                        break;
                    case ('ProcedureID'):
                        procedureID = JSON.parse(attribute.value);
                        break;
                }
            });

            const procedureDataAssemblyOptionsArray = [PiMAdParser.createDataAssemblyOptions(procedure.dataAssembly as DataAssemblyModel)];
            const procedureOptions: ProcedureOptions = {
                id: procedureID,
                name: procedureName,
                isDefault : isDefault as boolean,
                isSelfCompleting: isSelfCompleting as boolean,
                parameters: procedureDataAssemblyOptionsArray,
            };
            procedureOptionsArray.push(procedureOptions);
        });
        return procedureOptionsArray;
    }

    static createDataAssemblyOptions(dataAssemblyModel: DataAssemblyModel): DataAssemblyOptions {
        // Initializing baseDataAssemblyOptions, which will be filled during an iteration below
            const baseDataAssemblyOptions:
                {
                    [k: string]: any;
                    TagName: OpcUaNodeOptions;
                    TagDescription: OpcUaNodeOptions;
                } =
                {
                    TagName: {} as OpcUaNodeOptions,
                    TagDescription: {} as OpcUaNodeOptions
                };

            // Initializing dataAssemblyName, dataAssemblyInterfaceClass
            const dataAssemblyName =dataAssemblyModel.name;
            const dataAssemblyInterfaceClass= dataAssemblyModel.metaModelRef;
            const dataItems = dataAssemblyModel.dataItems;
            dataItems.map((dataItem: DataItemModel)=>{
                // Initializing variables, which will be assigned later
                let namespaceIndex ='', nodeId='', value: undefined | string;
                const dataType=dataItem.dataType;
                const cIData = dataItem.cIData;
                if(cIData){
                    nodeId= cIData.nodeId.identifier;
                    namespaceIndex = cIData.nodeId.namespaceIndex;
                   // namespaceIndex='urn:DESKTOP-6QLO5BB:NodeOPCUA-Server';
                } else {
                    value = dataItem.value;
                }

                const opcUaNodeOptions: OpcUaNodeOptions = {
                    nodeId: nodeId,
                    namespaceIndex: namespaceIndex,
                    dataType: dataType,
                    value: value
                };

                baseDataAssemblyOptions[dataItem.name as string] = opcUaNodeOptions;
            });

            // create dataAssemblyOptions with information collected above
             const dataAssemblyOptions = {
                name: dataAssemblyName,
                metaModelRef: dataAssemblyInterfaceClass,
                dataItems: baseDataAssemblyOptions
            };
        return dataAssemblyOptions;
    }
}
