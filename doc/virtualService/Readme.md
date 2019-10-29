Virtual Services / POL Services
===============================

*Virtual Services* or *POL services* are services which run on the POL level and not on the PEA level. They can be configured at runtime in order to provide a mechanism to dynamically add functionality beyond the predefined services of the PEA manufacturers.  



## Aggregated Services
*Aggregated Services* can be called like any other service. They can control several other services (both PEA services and POL services) from several PEAs. However, they cannot control the field devices inside the PEAs.


|                                  | (PEA-)Service                              | Aggregated Service                                     |
|----------------------------------|--------------------------------------------|--------------------------------------------------------|
| Place of Execution               | PEA                                        | POL                                                    |
| Creator                          | PEA manufacturer                           | plant operator                                         |
| Adaptability                     | predefined by service paramaters           | can be freely configured at runtime                    |
| External runtime  interface      | State machine according to VDI/VDE 2658-4  | State machine according to VDI/VDE 2658-4              |
| Control                          | PEA internal field devices or PEA-services | PEA-services from different PEAs or other POL-Services |
| Static description/configuration | MTP                                        | Polaris specific solution                              |

![Polaris component diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/p2o-lab/polaris-backend/develop/doc/virtualService/aggregated-service-context.puml)
