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

import {
	AnaDrv, AnaMan, AnaManInt, AnaMon, AnaProcessValueIn, AnaServParam, AnaView, AnaVlv,
	BinDrv, BinMan, BinManInt, BinMon, BinProcessValueIn, BinServParam, BinView, BinVlv,
		DataAssembly, DIntMan, DIntManInt, DIntMon, DIntProcessValueIn, DIntServParam, DIntView,
	HealthStateView,
	LockView16, LockView4, LockView8,
	MonAnaDrv, MonAnaVlv, MonBinDrv, MonBinVlv,
	PIDCtrl,
	ServiceControl, StringServParam, StringView
} from './index';
import {catDataAssembly} from '../../../logging';
import {DataAssemblyModel} from '@p2olab/pimad-interface';
import {ConnectionHandler} from '../connectionHandler/ConnectionHandler';

export class DataAssemblyFactory {
	public static create(options: DataAssemblyModel, connectionHandler: ConnectionHandler): DataAssembly {
		catDataAssembly.debug(`Create DataAssembly ${options.name} (${options.metaModelRef})`);
		const types = {
			'DataAssembly': DataAssembly,

			'ServiceControl': ServiceControl,
			// Active Elements
			'PIDCtrl': PIDCtrl,
			// >Drives
			'BinDrv': BinDrv,
			'MonBinDrv': MonBinDrv,
			'AnaDrv': AnaDrv,
			'MonAnaDrv': MonAnaDrv,
			// >Valves
			'BinVlv': BinVlv,
			'MonBinVlv': MonBinVlv,
			'AnaVlv': AnaVlv,
			'MonAnaVlv': MonAnaVlv,

			// Diagnostic Elements
			'HealthStateView': HealthStateView,
			// >LockView
			'LockView4': LockView4,
			'LockView8': LockView8,
			'LockView16': LockView16,

			// Indicator Elements
			'AnaMon': AnaMon,
			'AnaView': AnaView,
			'BinMon': BinMon,
			'BinView': BinView,
			'DIntMon': DIntMon,
			'DIntView': DIntView,
			'StringView': StringView,

			// Input Elements
			// >ProcessValueIn
			'AnaProcessValueIn': AnaProcessValueIn,
			'BinProcessValueIn': BinProcessValueIn,
			'DIntProcessValueIn': DIntProcessValueIn,

			// Operation Elements
			// >Man
			'AnaMan': AnaMan,
			'AnaManInt': AnaManInt,
			'BinMan': BinMan,
			'BinManInt': BinManInt,
			'DIntMan': DIntMan,
			'DIntManInt': DIntManInt,
			// >ServParam
			'AnaServParam': AnaServParam,
			'BinServParam': BinServParam,
			'DIntServParam': DIntServParam,
			'StringServParam': StringServParam
		};
		let type = types[options.metaModelRef.split('/').pop() as keyof typeof types];
		if (!type) {
			if (!options.metaModelRef) {
				catDataAssembly.debug(`No Interface Class specified for DataAssembly ${options.name}. ` +
					'Fallback to standard DataAssembly.');
			} else {
				catDataAssembly.warn(`No DataAssembly implemented for ${options.metaModelRef} ` +
					`of ${options.name}. Fallback to standard DataAssembly.`);
			}
			type = DataAssembly;
		}

		return new type(options, connectionHandler, true);
	}
}
