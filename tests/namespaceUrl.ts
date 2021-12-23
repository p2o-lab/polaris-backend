import {PEAOptions} from '@p2olab/polaris-interface';

/**
 * Set NamespaceUrl for testing purpose
 */
const namespaceUrl = 'urn:' + require('os').hostname() + ':NodeOPCUA-Server';

export function iterateDataItemsAndSetNameSpaceUrl(array: any){
    array.forEach((object: any) =>{
        for (const key in object.dataItems as any) {
            //skip static values
            if((typeof(object.dataItems as any)[key] != 'string')){
                (object.dataItems as any)[key].namespaceIndex = namespaceUrl;
            }
        }
        for (const key in object.communication as any) {
            //skip static values
            if((typeof(object.communication as any)[key] != 'string')){
                (object.communication as any)[key].namespaceIndex = namespaceUrl;
            }
        }
    });
}

export function setNamespaceUrl(peaOptions: PEAOptions){
    iterateDataItemsAndSetNameSpaceUrl(peaOptions.dataAssemblies);
    iterateDataItemsAndSetNameSpaceUrl(peaOptions.services);
    peaOptions.services.forEach(service => {
        if(service.parameters) iterateDataItemsAndSetNameSpaceUrl(service.parameters);
        service.procedures.forEach(procedure => {
            if(procedure.parameters) iterateDataItemsAndSetNameSpaceUrl(procedure.parameters);
            if(procedure.reportParameters) iterateDataItemsAndSetNameSpaceUrl(procedure.reportParameters);
            if(procedure.processValuesIn) iterateDataItemsAndSetNameSpaceUrl(procedure.processValuesIn);
            if(procedure.processValuesOut) iterateDataItemsAndSetNameSpaceUrl(procedure.processValuesOut);
            if(procedure.dataAssembly) iterateDataItemsAndSetNameSpaceUrl(procedure.dataAssembly);
        });
    });
}

