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

import {ParameterOptions} from '@p2olab/polaris-interface';

import {EventEmitter} from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import {Category} from 'typescript-logging';
import {catParameter, catScopeItem} from '../../../logging';
import {DataAssembly} from './DataAssembly';
import {PEA} from '../PEA';
import {Procedure, Service} from '../serviceSet';
import {ServiceState} from '../serviceSet/service/enum';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const assign = require('assign-deep');
import {ScopeOptions} from '@p2olab/polaris-interface';

import {Expression, Parser} from 'expr-eval';
import {BaseDataItem} from './dataItem/DataItem';
import {MTPDataTypes} from '@p2olab/pimad-types';

class ScopeItem {

	/** name of variable which should be replaced in value */
	public readonly name: string;
	public readonly dataAssembly: DataAssembly;
	public readonly pea: PEA;
	public readonly variableName: string;
	public readonly dataItem: BaseDataItem<string |number| boolean>;

	constructor(name: string, pea: PEA, dataAssembly: DataAssembly, variableName = '') {
		this.name = name;
		this.pea = pea;
		this.dataAssembly = dataAssembly;
		this.variableName = variableName;
		this.dataItem = (this.dataAssembly.dataItems[variableName as keyof typeof dataAssembly.dataItems] ||
			this.dataAssembly.defaultReadDataItem) as BaseDataItem<any>;
	}

	/**
	 *
	 * @param {string} expression
	 * @param peas PEAs to be searched in for variable names (default: all PEAs in manager)
	 * @param {string[]} ignoredNames don't try to find scopeItems for this variable names
	 */
	public static extractFromExpressionString(expression: string, peas: PEA[], ignoredNames: string[] = []): { expression: Expression; scopeItems: ScopeItem[] } {
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
	 * @param {PEA[]} peas to be searched in for variable names (default: all PEAs in manager)
	 * @returns {ScopeItem}
	 */
	public static extractFromScopeOptions(item: ScopeOptions, peas: PEA[]): ScopeItem {
		const pea = peas.find((peaObj) => peaObj.id === item.pea);
		if (!pea){
			throw new Error(`PEA "${item.pea}" couldn't be found`);
		}
		const dataAssembly = pea.dataAssemblies.find((v) => v.name === item.dataAssembly);
		if (!dataAssembly){
			throw new Error(`DataAssembly "${item.dataAssembly}" couldn't be found within PEA "${item.pea}"`);
		}
		return new ScopeItem(item.name, pea, dataAssembly, item.variable);
	}

	/**
	 * Extract scope item from expression variable
	 *
	 * @param {string} variable
	 * @param {PEA[]} peas to be searched in for variable names
	 * @returns {ScopeItem}
	 */
	public static extractFromExpressionVariable(variable: string, peas: PEA[]): ScopeItem {
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

			procedure = service.currentProcedure;
			if (!procedure) {
				throw new Error(`Current procedure not found for service "${service.name}"`);
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
			if (pea.dataAssemblies.find((v) => v.name === token)) {
				dataAssembly = pea.dataAssemblies.find((v) => v.name === token);
			} else {
				catScopeItem.warn(`Could not evaluate variable "${variable}": ` +
					`Token "${token}" not found as dataAssembly ` +
					`in PEA ${pea.id}: ${pea.dataAssemblies.map((v) => v.name)}`);
			}
		}
		if (!dataAssembly) {
			throw new Error(`Could not evaluate variable "${variable}": ` +
				`Token "${token}" not found as dataAssembly ` +
				`in PEA ${pea.id}: ${pea.dataAssemblies.map((v) => v.name)}`);
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
		}, value) as unknown as object;
	}

}


/**
 * Events emitted by {@link ParameterRequest}
 */
interface ParameterRequestEvents {
	/**
	 * when changes
	 * @event changed
	 */
	changed:  number | boolean;
}

type ParameterRequestEmitter = StrictEventEmitter<EventEmitter, ParameterRequestEvents>;

/**
 * Static or Dynamic Parameter. Dynamic Parameters can depend on dataAssemblies of the same or
 * other PEAs. These can also be continuously updated (specified via continuous property)
 */
export class ParameterRequest extends (EventEmitter as new() => ParameterRequestEmitter) {

	/**
	 * name of parameter which should be updated
	 */
	public readonly name: string;
	/**
	 * Expression to be calculated and used as value.
	 * Can contain dataAssemblies, which can be declared inside scopeArray or by using correct variable names
	 * following this syntax "[pea].[processValue].[variable]". PEAController can be omitted if only one PEAController
	 * is loaded. TestServerVariable can be omitted. Then "V" is used as variable.
	 * "." in the name of PEAs or processVariables can be escaped with "\\."
	 * @example
	 * "PEATestServer.Sensoren\.L001.V"
	 */
	public readonly value: string | number | boolean;
	public readonly scopeArray: ScopeItem[];

	/**
	 * should parameter continuously be updated
	 */
	public readonly continuous: boolean;
	private readonly options: ParameterOptions;
	private readonly expression: Expression;
	private readonly logger: Category;
	private active = false;

	/**
	 *
	 * @param {ParameterOptions} parameterOptions
	 * @param peas PEAs where expression can be matched
	 *
	 */
	constructor(parameterOptions: ParameterOptions, peas: PEA[] = []) {
		super();

		catParameter.info(`Create Parameter: ${JSON.stringify(parameterOptions)}`);

		this.options = parameterOptions;
		this.name = parameterOptions.name;
		this.value = parameterOptions.value || 0;
		this.continuous = parameterOptions.continuous || false;

		this.logger = catParameter;

		// evaluate scopeArray
		this.scopeArray = (parameterOptions.scope || [])
			.map((item: ScopeOptions) => ScopeItem.extractFromScopeOptions(item, peas));
		// evaluate additional dataAssemblies from expression
		try {
			const extraction = ScopeItem.extractFromExpressionString(
				this.value.toString(), peas, this.scopeArray.map((scope) => scope.name)
			);
			this.expression = extraction.expression;
			this.scopeArray.push(...extraction.scopeItems);
		} catch (err: any) {
			throw new Error('Parsing error for Parameter ' + err.toString());
		}
		this.logger.debug(`Scope array: ${this.scopeArray.map((s) => s.dataAssembly.name)}`);

		this.notify = this.notify.bind(this);
	}

	public listenToScopeArray(): void {
		if (this.active) {
			this.logger.info('Provide existent emitter');
		} else {
			this.logger.info(`Listening to parameter ${this.name}; ` +
				`subscribe to changes of ${this.scopeArray.map((s) => s.dataAssembly.name)}`);
			this.active = true;
			this.scopeArray.forEach((item) => {
				item.dataAssembly.on('changed', this.notify);
			});
		}
	}

	public unlistenToScopeArray(): void {
		if (this.active) {
			this.scopeArray.forEach((item) => {
				item.dataAssembly.removeListener('changed', this.notify);
			});
			this.active = false;
		}
	}

	/**
	 * calculate value from current scopeArray
	 * @returns number | boolean
	 */
	public getValue(): number | boolean {
		// get current dataAssemblies
		const tasks = this.scopeArray.map((item) => item.getScopeValue());

		const scope = assign(...tasks);
		const result = this.expression.evaluate(scope);
		catParameter.debug(`Specific parameters: ${this.name} = ${this.value} (${JSON.stringify(scope)}) = ${result}`);
		return result;
	}

	private notify(): void {
		const newValue = this.getValue();
		this.logger.debug(`Parameter has updated due to dependant variable to: ${newValue}`);
		this.emit('changed', newValue);
	}

}
