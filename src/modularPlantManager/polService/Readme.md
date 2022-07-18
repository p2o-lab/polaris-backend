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
 
Virtual Services / POL Services
===============================

*Virtual Services* or *POL services* are services which run on the POL level and not on the PEAController level. They can be
configured at runtime in order to provide a mechanism to dynamically add functionality beyond the predefined services of
the PEAController manufacturers.

## Aggregated Services

*Aggregated Services* can be called like any other service. They can control several other services (both PEAController services
and POL services) from several PEAs. However, they cannot control the field devices inside the PEAs.

|                                  | (PEAController-)Service                                        | Aggregated Service                                               |
|----------------------------------|----------------------------------------------------------------|------------------------------------------------------------------|
| Place of Execution               | PEAController                                                  | POL                                                              |
| Creator                          | PEAController manufacturer                                     | plant operator                                                   |
| Adaptability                     | predefined by service paramaters                               | can be freely configured at runtime                              |
| External runtime  interface      | State machine according to VDI/VDE 2658-4                      | State machine according to VDI/VDE 2658-4                        |
| Control                          | PEAController internal field devices or PEAController-services | PEAController-services from different PEAs or other POL-Services |
| Static description/configuration | MTP                                                            | Polaris specific solution                                        |

![Polaris component diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/p2o-lab/polaris-backend/develop/doc/virtualService/aggregated-service-context.puml)
