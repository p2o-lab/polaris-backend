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

import {ScopeOptions} from '@p2olab/polaris-interface';
import {PEAController, Procedure, Service} from '../pea';
import {DataItem} from '../pea/connection';
import {DataAssembly, ServiceState} from '../pea/dataAssembly';

import {Expression, Parser} from 'expr-eval';
import {catScopeItem} from '../../logging';

export class ScopeItem {

	/** name of variable which should be replaced in value */
	public readonly name: string;
	public readonly dataAssembly: DataAssembly;
	public readonly pea: PEAController;
	public readonly variableName: string;
	public readonly dataItem: DataItem<any>;

	constructor(name: string, pea: PEAController, dataAssembly: DataAssembly, variableName = '') {
		this.name = name;
		this.pea = pea;
		this.dataAssembly = dataAssembly;
		this.variableName = variableName;
		this.dataItem = this.dataAssembly.communication[variableName as keyof typeof dataAssembly.communication] ||
			this.dataAssembly.defaultReadDataItem;
	}

	/**
	 *
	 * @param {string} expression
	 * @param peas PEAs to be searched in for variable names (default: all PEAs in manager)
	 * @param {string[]} ignoredNames don't try to find scopeItems for this variable names
	 */
	public static extractFromExpressionString(expression: string, peas: PEAController[], ignoredNames: string[] = []): { expression: Expression; scopeItems: ScopeItem[] } {
		const parser: Parser = new Parser({allowMemberAccess: true});
		const value = expression.replace(new RegExp('\\\\.', 'g'), '__')
			.replace('@', '');
		const expressionObject = parser.parse(value);
		const scopeItems = expressionObject
			.variables({withMembers: true})
			.filter((variable) => !ignoredNames.find((n) => n === variable))
			.map((variable) => ScopeItem.extractFromExpressionVariable(variable, peas))
			.filter(Boolean);
		return {expression: expressionObject, scopeItems: scopeItems};
	}

	/**
	 *
	 * @param {ScopeOptions} item
	 * @param {PEAController[]} peas to be searched in for variable names (default: all PEAs in manager)
	 * @returns {ScopeItem}
	 */
	public static extractFromScopeOptions(item: ScopeOptions, peas: PEAController[]): ScopeItem {
		const pea = peas.find((peaObj) => peaObj.id === item.pea);
		if (!pea){
			throw new Error(`PEA "${item.pea}" couldn't be found`);
		}
		const dataAssembly = pea.variables.find((v) => v.name === item.dataAssembly);
		if (!dataAssembly){
			throw new Error(`DataAssembly "${item.dataAssembly}" couldn't be found within PEA "${item.pea}"`);
		}
		return new ScopeItem(item.name, pea, dataAssembly, item.variable);
	}

	/**
	 * Extract scope item from expression variable
	 *
	 * @param {string} variable
	 * @param {PEAController[]} peas to be searched in for variable names
	 * @returns {ScopeItem}
	 */
	public static extractFromExpressionVariable(variable: string, peas: PEAController[]): ScopeItem {
		catScopeItem.debug(`Extract ScopeItem from "${variable}"`);
		let dataAssembly: DataAssembly | undefined;
		const components = variable.split('.').map((tokenT: string) => tokenT.replace(new RegExp('__', 'g'), '.'));
		let token = components.shift();

		// find PEAController
		let pea = peas.find((p) => p.id === token);
		if (pea === undefined) {
			if (peas.length === 1) {
				pea = peas[0];
			} else {
				throw new Error(`Could not evaluate variable "${variable}": PEA "${token}" not found in ` +
					`${JSON.stringify(peas.map((p) => p.id))}`);
			}
		} else {
			token = components.shift();
		}
		catScopeItem.debug(`Found PEA "${pea.id}" for expression "${variable}"`);

		// find service
		const service: Service | undefined = pea.services.find((s) => s.name === token);
		let procedure: Procedure | undefined;
		if (service) {
			catScopeItem.debug(`Found service "${service.name}" for expression "${variable}"`);
			procedure = service.getCurrentProcedure();
			if (!procedure) {
				procedure = service.getDefaultProcedure();
				if (!procedure){
					throw new Error(`Neither a default nor current procedure was found for service "${service.name}"`);
				}
			}
			token = components.shift();

			dataAssembly = service.parameters.find((p: DataAssembly) => p.name === token);
			if (!dataAssembly) {
				procedure.parameters.find((p: DataAssembly) => p.name === token);
			}
			if (!dataAssembly) {
				procedure.processValuesIn.find((p: DataAssembly) => p.name === token);
			}
			if (!dataAssembly) {
				procedure.processValuesOut.find((p: DataAssembly) => p.name === token);
			}
			if (!dataAssembly) {
				procedure.reportParameters.find((p: DataAssembly) => p.name === token);
			}

			if (!dataAssembly) {
				if (token === 'state') {
					return new ScopeItem(variable, pea, service.serviceControl, 'State');
				} else {
					catScopeItem.warn(`Could not evaluate variable "${variable}": ` +
						`Token "${token}" not found as service parameter ` +
						`in Service ${service.qualifiedName}.${procedure.name}`);
				}
			}
		} else {
			// find DataAssembly in ProcessValues
			if (pea.variables.find((v) => v.name === token)) {
				dataAssembly = pea.variables.find((v) => v.name === token);
			} else {
				catScopeItem.warn(`Could not evaluate variable "${variable}": ` +
					`Token "${token}" not found as dataAssembly ` +
					`in PEA ${pea.id}: ${pea.variables.map((v) => v.name)}`);
			}
		}
		if (!dataAssembly) {
			throw new Error(`Could not evaluate variable "${variable}": ` +
				`Token "${token}" not found as dataAssembly ` +
				`in PEA ${pea.id}: ${pea.variables.map((v) => v.name)}`);
		}

		// find DataAssembly variable
		token = components.shift();

		return new ScopeItem(variable, pea, dataAssembly, token);
	}

	/**
	 * Returning an nested object following the name construction. The leaf contains the current value
	 * as object suitable for expr-eval.evaluate()
	 */
	public getScopeValue(): object {
		let value = this.dataItem.value;
		if (this.variableName === 'State') {
			value = ServiceState[value as ServiceState];
		}
		if (value === undefined) {
			throw new Error(`Could not evaluate ScopeItem ${this.name} since it seems not connected`);
		}
		return this.name.split('.').reduceRight((previous, current) => {
			const a: any = {};
			a[current] = previous;
			return a;
		}, value);
	}

}
