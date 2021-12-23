import {
    DataAssemblyModel,
    DataAssemblyOptions,
    DataItemModel,
    OpcUaNodeOptions,
    PEAModel, PEAOptions, ProcedureModel, ServiceControlOptions, ServiceModel, ServiceOptions
} from '@p2olab/polaris-interface';
import {ProcedureOptions} from '@p2olab/polaris-interface/dist/service/options';
import {ModularPlantManager} from '../../ModularPlantManager';

export interface PiMAdParserInterface{
     dataAssemblyOptionsArray: DataAssemblyOptions[];
     serviceOptionsArray: ServiceOptions[];
}

/**
 * This class helps parsing the PEAModel coming from PiMAd for creating PEAOptions
 */
export class PiMAdParser {

    /**
     * parent function, which will be called in ModularPlantManager
     * @param pimadIdentifier {string} uuid4
     * @param manager {ModularPlantManager}
     * @return {Promise<PEAOptions>}
     */
    public static async createPEAOptions(pimadIdentifier: string, manager: ModularPlantManager): Promise<PEAOptions>{
        const peaModel: PEAModel = await manager.getPEAFromPimadPool(pimadIdentifier);
        const pimadParserObject = PiMAdParser.createOptionsArrays(peaModel);
        const endpoint = peaModel.endpoint[0].value;
        // create PEAOptions
        const peaOptions: PEAOptions = {
            name: peaModel.name,
            id: manager.generateUniqueIdentifier(),
            pimadIdentifier: pimadIdentifier,
            services: pimadParserObject.serviceOptionsArray,
            username: '',
            password: '',
            hmiUrl: '',
            opcuaServerUrl: endpoint,
            dataAssemblies: pimadParserObject.dataAssemblyOptionsArray
        };
        return peaOptions;
    }

    /**
     * create DataAssemblyOptionsArray and ServiceOptionsArray, which are neccessary for PEAOptions
     * @param peaModel{PEAModel}
     * @private
     * @return {PiMAdParserInterface}
     */
    private static createOptionsArrays(peaModel: PEAModel): PiMAdParserInterface {
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
            const dataAssemblyOptions = PiMAdParser.createDataAssemblyOptions(dataAssemblyModel);
            dataAssemblyOptionsArray.push(dataAssemblyOptions);
        });
        return(dataAssemblyOptionsArray);
    }

    /**
     * @param dataAssemblyModels {ServiceModelModel[]}
     * @return {ServiceOptions[]}
     * @private
     */
    private static createServiceOptionsArray(serviceModels: ServiceModel[]): ServiceOptions[]{
        const servicesOptionsArray: ServiceOptions[] = [];
        serviceModels.forEach(serviceModel=> {
            const procedureOptionsArray = this.createProcedureOptionsArray(serviceModel.procedures);
            const serviceDataAssemblyOptions = PiMAdParser.createDataAssemblyOptions(serviceModel.dataAssembly as DataAssemblyModel);
            const parameters = PiMAdParser.createDataAssemblyOptionsArray(serviceModel.parameters);

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
     * @param dataAssemblyModels {DataAssemblyModel[]}
     * @return {DataAssemblyOptions[]}
     * @private
     */
    private static createProcedureOptionsArray(procedureModels: ProcedureModel[]): ProcedureOptions[] {
        const procedureOptionsArray: ProcedureOptions[] = [];
        procedureModels.forEach(procedure =>{
            const procedureName = procedure.name;
            let isDefault: any, isSelfCompleting: any, procedureID='';
            procedure.attributes.forEach((attribute: { name: any; value: string}) =>{
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

            //healthstateview
            const procedureDataAssemblyOptions = [PiMAdParser.createDataAssemblyOptions(procedure.dataAssembly as DataAssemblyModel)];

            const procedureParameters = PiMAdParser.createDataAssemblyOptionsArray(procedure.parameters);
            const reportValues = PiMAdParser.createDataAssemblyOptionsArray(procedure.reportValues);
            const processValuesIn = PiMAdParser.createDataAssemblyOptionsArray(procedure.processValuesIn);
            const processValuesOut = PiMAdParser.createDataAssemblyOptionsArray(procedure.processValuesOut);

            const procedureOptions: ProcedureOptions = {
                id: procedureID,
                name: procedureName,
                isDefault : isDefault as boolean,
                isSelfCompleting: isSelfCompleting as boolean,
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
                    [k: string]: any;
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
                // Initializing variables, which will be assigned later
                let namespaceIndex ='', nodeId='', value: undefined | string;
                const dataType=dataItem.dataType;
                const cIData = dataItem.cIData;
                if(cIData){ //dynamic
                    nodeId= cIData.nodeId.identifier;
                    namespaceIndex = cIData.nodeId.namespaceIndex;
                   // namespaceIndex = namespaceUri; // for testing
                    const opcUaNodeOptions: OpcUaNodeOptions = {
                        nodeId: nodeId,
                        namespaceIndex: namespaceIndex,
                        dataType: dataType,
                    };
                    baseDataAssemblyOptions[dataItem.name as string] = opcUaNodeOptions;
                } else { // static
                    value = dataItem.value;
                    baseDataAssemblyOptions[dataItem.name as string] = value;
                }
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
