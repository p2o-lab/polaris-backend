import {DataAssemblyModel, DataAssemblyOptions, DataItemModel, OpcUaNodeOptions} from '@p2olab/polaris-interface';

//TODO: maybe outsource more from MPM to this class
/**
 * This class helps parsing the PEAModel coming from PiMAd for creating PEAOptions
 */
export class PiMAdParser {

    static createDataAssemblyOptions(dataAssembly: DataAssemblyModel): DataAssemblyOptions {
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
            const dataAssemblyName =dataAssembly.name;
            const dataAssemblyInterfaceClass= dataAssembly.metaModelRef;
            const dataItems = dataAssembly.dataItems;
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
