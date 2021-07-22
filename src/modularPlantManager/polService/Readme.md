Virtual Services / POL Services
===============================

*Virtual Services* or *POL services* are services which run on the POL level and not on the PEAController level. They can be
configured at runtime in order to provide a mechanism to dynamically add functionality beyond the predefined services of
the PEAController manufacturers.

## Aggregated Services

*Aggregated Services* can be called like any other service. They can control several other services (both PEAController services
and POL services) from several PEAs. However, they cannot control the field devices inside the PEAs.

|                                  | (PEAController-)Service                              | Aggregated Service                                     |
|----------------------------------|--------------------------------------------|--------------------------------------------------------|
| Place of Execution               | PEAController                                        | POL                                                    |
| Creator                          | PEAController manufacturer                           | plant operator                                         |
| Adaptability                     | predefined by service paramaters           | can be freely configured at runtime                    |
| External runtime  interface      | State machine according to VDI/VDE 2658-4  | State machine according to VDI/VDE 2658-4              |
| Control                          | PEAController internal field devices or PEAController-services | PEAController-services from different PEAs or other POL-Services |
| Static description/configuration | MTP                                        | Polaris specific solution                              |

![Polaris component diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/p2o-lab/polaris-backend/develop/doc/virtualService/aggregated-service-context.puml)
