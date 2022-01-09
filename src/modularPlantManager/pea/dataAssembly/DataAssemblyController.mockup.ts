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
import {DataAssemblyOptions} from '@p2olab/polaris-interface';
import {IDProvider} from '../../_utils/idProvider/IDProvider';

function getDataAssemblySpecificDataItemOptions(tagName?: string, tagDescription?: string): object {
    return ({
        TagName: {value: tagName || IDProvider.generateIdentifier()},
        TagDescription: {value: tagDescription || 'Not provided'},
    });
}

export function getDataAssemblyDataItemOptions(tagName?: string, tagDescription?: string): object {
    return ({
        ...getDataAssemblySpecificDataItemOptions(tagName, tagDescription)
    });
}

export function getDataAssemblyOptions(name?: string, tagName?: string, tagDescription?: string): DataAssemblyOptions {
    return ({
            name: name || 'Not provided',
            metaModelRef: 'MTPDataObjectSUCLib/DataAssembly',
            dataItems: {...getDataAssemblyDataItemOptions(tagName, tagDescription)} as any
        }
    );
}

export class DataAssemblyControllerMockup {
    public readonly name: string;

    protected tagName = '';
    protected tagDescription = '';
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

    public getDataAssemblyOptions(): DataAssemblyOptions {
        return getDataAssemblyOptions(this.name, this.tagName, this.tagDescription);
    }

    public getDataItemOptions(): object {
        return getDataAssemblyDataItemOptions(this.tagName, this.tagDescription);
    }
}
