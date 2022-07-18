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

import { Namespace, UAObject} from 'node-opcua';
import {catMockupServer} from '../../../logging';
import {DataAssemblyModel, DataItemModel} from '@p2olab/pimad-interface';
import {IDProvider} from '../../_utils';
import {getEmptyDataItemModel} from './dataItem/DataItem.mockup';

const metaModelReference = 'MTPDataObjectSUCLib/DataAssembly';

function getDataAssemblySpecificDataItemModels(tagName?: string, tagDescription?: string): DataItemModel[] {
    const result: DataItemModel[] = [];
    const tagNameDataItem = getEmptyDataItemModel();
    tagNameDataItem.name = 'TagName';
    tagNameDataItem.defaultValue = tagName || IDProvider.generateIdentifier();
    tagNameDataItem.value = tagName || IDProvider.generateIdentifier();
    result.push(tagNameDataItem);

    const tagDescriptionDataItem = getEmptyDataItemModel();
    tagDescriptionDataItem.name = 'TagDescription';
    tagDescriptionDataItem.defaultValue = tagDescription || IDProvider.generateIdentifier();
    tagDescriptionDataItem.value = tagDescription || IDProvider.generateIdentifier();
    result.push(tagDescriptionDataItem);

    return result;
}

export function getDataAssemblyDataItemModels(tagName?: string, tagDescription?: string): DataItemModel[] {
    return getDataAssemblySpecificDataItemModels(tagName, tagDescription);
}

export function getDataAssemblyModel(metaModelRef: string, name?: string, tagName?: string, tagDescription?: string): DataAssemblyModel {
    const result = getEmptyDataAssemblyModel();
    result.name = name || 'DataAssembly';
    result.metaModelRef = metaModelRef;
    const dataItems = getDataAssemblyDataItemModels(tagName, tagDescription);
    dataItems.forEach(item => result.dataItems.push(item));
    return result;
}

export function getEmptyDataAssemblyModel(): DataAssemblyModel {
    return {dataItems: [], dataSourceIdentifier: '', description: '', metaModelRef: '', name: '', pimadIdentifier: ''};
}

export class DataAssemblyMockup {
    public readonly name: string;

    public tagName = '';
    public tagDescription = '';
    protected mockupNode: UAObject;
    protected logger = catMockupServer;

    constructor(namespace: Namespace, rootNode: UAObject, variableName: string, tagName?: string, tagDescription?: string) {

        this.tagName = tagName || IDProvider.generateIdentifier();
        this.tagDescription = tagDescription || 'No TagDescription available!';
        this.name = variableName;
        this.mockupNode = namespace.addObject({
            organizedBy: rootNode,
            browseName: this.name
        });
    }

    public getDataAssemblyModel(metaModelReferenceOption?: string): DataAssemblyModel {
        return getDataAssemblyModel(metaModelReferenceOption || metaModelReference, this.name, this.tagName, this.tagDescription);
    }

    public getDataItemModel(): DataItemModel[] {
        return getDataAssemblyDataItemModels(this.tagName, this.tagDescription);
    }
}
