import {DataAssemblyModel, DataAssemblyOptions, DataItemModel, OpcUaNodeOptions} from '@p2olab/polaris-interface';

export class PiMAdParser {

    static createDataAssemblyOptions(dataAssembly: DataAssemblyModel): DataAssemblyOptions {
        let dataAssemblyOptions: DataAssemblyOptions ={ name:'', dataItems:{
                TagName: {} as OpcUaNodeOptions,
                TagDescription: {} as OpcUaNodeOptions
            }, metaModelRef:''};


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
                    namespaceIndex='urn:DESKTOP-6QLO5BB:NodeOPCUA-Server';
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
            dataAssemblyOptions = {
                name: dataAssemblyName,
                metaModelRef: dataAssemblyInterfaceClass,
                dataItems: baseDataAssemblyOptions
            };

        return dataAssemblyOptions;

    }
}
