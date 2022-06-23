import { PEAModel } from '@p2olab/pimad-interface';

export const options: PEAModel = {
  'dataAssemblies': [
    {
      'dataItems': [
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:string',
          'name': 'TagName',
          'value': 'Variable2',
          'defaultValue': 'Variable2',
          'description': 'TagName Field',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:string',
          'name': 'TagDescription',
          'value': 'SimulatedNumericVar',
          'defaultValue': 'SimulatedNumericVar',
          'description': 'TagDescription Field',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'WQC',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable2.WQC'
            }
          },
          'dataSourceIdentifier': '9ba9df50-36fd-46bd-bff4-cb74b16e65b9',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '255',
          'description': 'Worst Quality Code variable',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'V',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable2.V'
            }
          },
          'dataSourceIdentifier': '4dec0370-8786-4564-9b5c-cd4133eb3a3a',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '0',
          'description': 'Value',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'VSclMin',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable2.VSclMin'
            }
          },
          'dataSourceIdentifier': '670c5518-d802-4dd5-8aa9-6c20c9c16ebd',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '0',
          'description': 'Low Limit value',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'VSclMax',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable2.VSclMax'
            }
          },
          'dataSourceIdentifier': '28c7cc38-c98c-440c-a644-b7c86daa3a7a',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '0',
          'description': 'High Limit value',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'VUnit',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable2.VUnit'
            }
          },
          'dataSourceIdentifier': '991d4055-f6c9-4397-bd8a-f2489439f07a',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '0',
          'description': 'Enumeration value of the unit list',
          'pimadIdentifier': 'TODO'
        }
      ],
      'dataSourceIdentifier': 'b11d75a2-52de-42fd-8117-0c650057125f',
      'description': 'inline TODO above',
      'name': 'Variable2',
      'initialized': true,
      'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
      'pimadIdentifier': '9a19b022-f9f6-4945-b5c2-7c4302057c71',
      'responseVendor': {
        'errorResponseFactory': {},
        'dummyResponseFactory': {},
        'successResponseFactory': {},
        'warningResponseFactory': {}
      },
      'responseHandler': {
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        }
      }
    },
    {
      'dataItems': [
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:string',
          'name': 'TagName',
          'value': 'Variable1',
          'defaultValue': 'Variable1',
          'description': 'TagName Field',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:string',
          'name': 'TagDescription',
          'value': 'SimulatedNumericVar',
          'defaultValue': 'SimulatedNumericVar',
          'description': 'TagDescription Field',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'WQC',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable1.WQC'
            }
          },
          'dataSourceIdentifier': 'd2d598b4-04a9-4fcc-8113-bc4fbbc8b25b',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '255',
          'description': 'Worst Quality Code variable',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'V',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable1.V'
            }
          },
          'dataSourceIdentifier': 'a93b391b-e1e8-462f-b128-f7c0ada74ff8',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '15',
          'description': 'Value',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'VSclMin',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable1.VSclMin'
            }
          },
          'dataSourceIdentifier': 'b64badf8-f705-4dad-b3c5-f7d1a354fabd',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '0',
          'description': 'Low Limit value',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'VSclMax',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable1.VSclMax'
            }
          },
          'dataSourceIdentifier': '885f34b9-d398-462b-95f0-20f3bac30e05',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '30',
          'description': 'High Limit value',
          'pimadIdentifier': 'TODO'
        },
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'dataType': 'xs:IDREF',
          'name': 'VUnit',
          'cIData': {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'nodeId': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
              'identifier': 'Variable1.VUnit'
            }
          },
          'dataSourceIdentifier': 'c501e12e-9502-4d14-b8b5-b2fc44f765bc',
          'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
          'defaultValue': '1038',
          'description': 'Enumeration value of the unit list',
          'pimadIdentifier': 'TODO'
        }
      ],
      'dataSourceIdentifier': '2052a502-2437-4f18-964b-56f81375a953',
      'description': 'inline TODO above',
      'name': 'Variable1',
      'initialized': true,
      'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
      'pimadIdentifier': '2b3115ec-babb-4c08-857b-d9f65a2f28eb',
      'responseVendor': {
        'errorResponseFactory': {},
        'dummyResponseFactory': {},
        'successResponseFactory': {},
        'warningResponseFactory': {}
      },
      'responseHandler': {
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        }
      }
    }
  ],
  'dataModel': 'MTPSUCLib/ModuleTypePackage',
  'dataModelVersion': {
    'major': -1,
    'minor': -1,
    'patch': -1,
    'initialized': false
  },
  'feas': [],
  'name': 'Calculator',
  'endpoint': [
    {
      'initialized': true,
      'responseHandler': {
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        }
      },
      'dataType': 'xs:string',
      'name': 'Endpoint',
      'value': 'opc.tcp://localhost:4334',
      'defaultValue': 'opc.tcp://localhost:4334',
      'description': "Endpoint URL of the server - like 'opc.tcp://192.186.2.1:5555",
      'pimadIdentifier': 'TODO'
    }
  ],
  'pimadIdentifier': '69b270f8-b826-49e7-8682-a25b5a5a0a57',
  'responseHandler': {
    'responseVendor': {
      'errorResponseFactory': {},
      'dummyResponseFactory': {},
      'successResponseFactory': {},
      'warningResponseFactory': {}
    }
  },
  'responseVendor': {
    'errorResponseFactory': {},
    'dummyResponseFactory': {},
    'successResponseFactory': {},
    'warningResponseFactory': {}
  },
  'services': [
    {
      'initialized': true,
      'responseHandler': {
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        }
      },
      'attributes': [],
      'dataAssembly': {
        'dataItems': [
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:string',
            'name': 'TagName',
            'value': 'Integral2',
            'defaultValue': 'Integral2',
            'description': 'TagName Field',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:string',
            'name': 'TagDescription',
            'value': 'Service for math operation Integral',
            'defaultValue': 'Service for math operation Integral',
            'description': 'TagDescription Field',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateChannel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateChannel'
              }
            },
            'dataSourceIdentifier': '36859cce-040c-4015-8488-44d3a70504e0',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Selection of the active Operation Mode interaction channel',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateOffAut'
              }
            },
            'dataSourceIdentifier': '237a1f2f-bd71-43ce-a6b4-465dee937190',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Offline by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateOpAut'
              }
            },
            'dataSourceIdentifier': '5dc952fa-b89d-499a-b82b-35aa451c39da',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Operator by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateAutAut'
              }
            },
            'dataSourceIdentifier': '0d243fcb-9c04-4749-8158-cfeafe724f20',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Automatic by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateOffOp'
              }
            },
            'dataSourceIdentifier': '28a2bffa-2f35-49c1-b30d-355fac54d399',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Offline by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateOpOp'
              }
            },
            'dataSourceIdentifier': '340b3715-56c3-46fc-9d88-8c07cccf5dac',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Operator by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateAutOp'
              }
            },
            'dataSourceIdentifier': '96cee496-4f2c-4758-a226-1ce7aa98cb9d',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Automatic by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateOpAct'
              }
            },
            'dataSourceIdentifier': '61eba7a4-87df-400a-9267-7ad6c6bcbf40',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Operator Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateAutAct'
              }
            },
            'dataSourceIdentifier': '8450c317-f6f6-4947-92b3-74e3fe4f041b',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Automatic Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateOffAct'
              }
            },
            'dataSourceIdentifier': 'a5040ee6-0ef4-4078-9b66-c0bf871e19e4',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Offline Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcChannel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.SrcChannel'
              }
            },
            'dataSourceIdentifier': 'a8ac2d14-a2c5-4780-8936-f00065f3a1fe',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Selection of the active Service Source Mode interaction channel',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.SrcExtAut'
              }
            },
            'dataSourceIdentifier': '5d512761-2d90-4298-b1f1-cbb4492f07db',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to External by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.SrcIntAut'
              }
            },
            'dataSourceIdentifier': '1f687f54-15fc-4803-9a1d-1081c45a86ea',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to Internal by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.SrcIntOp'
              }
            },
            'dataSourceIdentifier': '3b5851b0-1c48-4438-93f4-3c2ec87af62a',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to Intern by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.SrcExtOp'
              }
            },
            'dataSourceIdentifier': '7ecfcbf3-4b55-46d3-b974-ea8ccac4abb3',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to External by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.SrcExtAct'
              }
            },
            'dataSourceIdentifier': '3a56b20b-f1d8-44dc-9d9d-2783a134787f',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'External Source Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.SrcIntAct'
              }
            },
            'dataSourceIdentifier': '7c3fbc55-de1a-4d45-99ab-a935166cc09e',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Internal Source Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'OSLevel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.OSLevel'
              }
            },
            'dataSourceIdentifier': 'b45bdbf4-084e-49fc-9bb9-76f110387348',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'WQC',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.WQC'
              }
            },
            'dataSourceIdentifier': '734b907b-4679-49b6-b01b-122bff5884f0',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '255',
            'description': 'Worst Quality Code variable',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.CommandOp'
              }
            },
            'dataSourceIdentifier': 'bb052761-8d8e-433c-805a-8659b01a9c81',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Operator',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandInt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.CommandInt'
              }
            },
            'dataSourceIdentifier': '2552f157-012a-4a4c-924c-a73444ff9b63',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Automatic-Intern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandExt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.CommandExt'
              }
            },
            'dataSourceIdentifier': '52df1427-cbdb-42d7-a612-3f6dd4f5f7d3',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Automatic-Extern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.ProcedureOp'
              }
            },
            'dataSourceIdentifier': 'f4b14fa4-62f1-4aba-8b63-ff1fe362ae80',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Operator',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureInt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.ProcedureInt'
              }
            },
            'dataSourceIdentifier': '234f26f2-590c-4921-8acc-1470e28cc552',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Automatic-Intern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureExt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.ProcedureExt'
              }
            },
            'dataSourceIdentifier': '6aaab343-b813-46d1-a349-f6a0a38c4495',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Automatic-Extern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandEn',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.CommandEn'
              }
            },
            'dataSourceIdentifier': '59a605ff-0e60-4456-acaa-8559100cb8aa',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Transition Clearance from the Current State',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateCur',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.StateCur'
              }
            },
            'dataSourceIdentifier': '5b3edc0f-21ce-4423-8688-06f68a1b439d',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Current State',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureCur',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.ProcedureCur'
              }
            },
            'dataSourceIdentifier': '7b2b2c77-5ee6-4f8d-9fa5-b21a8d5c0d3f',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Current Procedure',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureReq',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.ProcedureReq'
              }
            },
            'dataSourceIdentifier': '73b9a6b4-1744-42b5-8bbb-ce52657162b7',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Requested Procedure',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'InteractQuestionID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.InteractQuestionID'
              }
            },
            'dataSourceIdentifier': '87c09c1c-96f5-4ea2-bcc7-ef238a3dd23f',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Operator Request Question ID',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'InteractAnswerID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.InteractAnswerID'
              }
            },
            'dataSourceIdentifier': '27a6830b-9bc4-4cce-88a5-4ab6443e417b',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Operator Request Answer ID',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'PosTextID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral2.PosTextID'
              }
            },
            'dataSourceIdentifier': '808d4969-c6ef-4efd-a5c9-7d325f88f89d',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Service Information Text ID',
            'pimadIdentifier': 'TODO'
          }
        ],
        'dataSourceIdentifier': '6e2f7e66-f7af-4642-b5c3-ad4975859e6b',
        'description': 'inline TODO above',
        'name': 'Integral2',
        'initialized': true,
        'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/ServiceControl',
        'pimadIdentifier': 'e66e2191-e484-4685-a03d-907d0b04d902',
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        },
        'responseHandler': {
          'responseVendor': {
            'errorResponseFactory': {},
            'dummyResponseFactory': {},
            'successResponseFactory': {},
            'warningResponseFactory': {}
          }
        }
      },
      'metaModelRef': 'MTPServiceSUCLib/Service',
      'name': 'Integral2',
      'parameters': [
        {
          'dataItems': [
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:string',
              'name': 'TagName',
              'value': 'AnaConfParam_Integral2_updateRate',
              'defaultValue': 'AnaConfParam_Integral2_updateRate',
              'description': 'TagName Field',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:string',
              'name': 'TagDescription',
              'value': 'UpdateRate during execute',
              'defaultValue': 'UpdateRate during execute',
              'description': 'TagDescription Field',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'OSLevel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.OSLevel'
                }
              },
              'dataSourceIdentifier': 'f1cf1618-80a5-4f93-857c-e5849c315fd0',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'WQC',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.WQC'
                }
              },
              'dataSourceIdentifier': 'b20064e7-e880-439b-89fd-59af0b91acd2',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'WQC',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateChannel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateChannel'
                }
              },
              'dataSourceIdentifier': '58eeee2f-9f6b-4f56-9094-7c23e7d2a769',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Selection of the active Operation Mode interaction channel',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateOffAut'
                }
              },
              'dataSourceIdentifier': '7dd14497-92ee-4915-abaa-3b703aaeb35c',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Offline by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateOpAut'
                }
              },
              'dataSourceIdentifier': 'b6ba32ad-3371-4f56-8333-b3725882660f',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Operator by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateAutAut'
                }
              },
              'dataSourceIdentifier': '538d53c8-d710-472f-98dd-57823d3613b7',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Automatic by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateOffOp'
                }
              },
              'dataSourceIdentifier': '858695f3-c455-4fa7-aedb-f6ff3114d343',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Offline by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateOpOp'
                }
              },
              'dataSourceIdentifier': 'a531beae-58c0-47f3-987d-4e69eb1d0ca9',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Operator by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateAutOp'
                }
              },
              'dataSourceIdentifier': '2a314b13-cde1-4f9a-a3d2-3df654518a68',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Automatic by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateOpAct'
                }
              },
              'dataSourceIdentifier': 'c02b53c6-165a-4f2a-854a-dd0d30eb3e12',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Operator Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateAutAct'
                }
              },
              'dataSourceIdentifier': '7119cdea-1fb1-4918-9010-1410eb9d229b',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Automatic Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.StateOffAct'
                }
              },
              'dataSourceIdentifier': '10c22f29-f4d3-4adb-b1ca-a744fd805ca1',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Offline Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcChannel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.SrcChannel'
                }
              },
              'dataSourceIdentifier': 'fa119c58-4622-4fe2-978e-71ae1ebd6485',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Selection of the active Service Source Mode interaction channel',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.SrcExtAut'
                }
              },
              'dataSourceIdentifier': '1fcbfd06-ebf6-4bda-9a93-3fb80b16c725',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to External by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.SrcIntAut'
                }
              },
              'dataSourceIdentifier': 'f0c72a03-03f7-4e82-8489-fdd2fad1d5ed',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to Internal by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.SrcIntOp'
                }
              },
              'dataSourceIdentifier': '57f7da79-4cf2-4be3-990e-ffa5abc5d467',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to Intern by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.SrcExtOp'
                }
              },
              'dataSourceIdentifier': '7551cfe7-8a69-4600-b1e2-7b18dc43b976',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to External by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.SrcExtAct'
                }
              },
              'dataSourceIdentifier': '3d747cba-747f-4f51-a7ff-fcf6b7261c14',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'External Source Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.SrcIntAct'
                }
              },
              'dataSourceIdentifier': '8a47c591-1107-4883-addf-73e33c4ab12e',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Internal Source Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VExt',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VExt'
                }
              },
              'dataSourceIdentifier': '5d896635-763d-48e4-b33f-bf913ae0513f',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Extern Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VOp'
                }
              },
              'dataSourceIdentifier': '5a85c4e4-6806-412b-962e-abfd6aca7d10',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Manual Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VInt',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VInt'
                }
              },
              'dataSourceIdentifier': '3530d1a9-393f-45af-921e-320a72b7c7a2',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Intern Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VReq',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VReq'
                }
              },
              'dataSourceIdentifier': '66566b61-69c9-4bab-803e-c4a17f517862',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Request Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VFbk',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VFbk'
                }
              },
              'dataSourceIdentifier': '5674bafe-adf6-42e9-a07f-d8905106da1a',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Feedback Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VOut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VOut'
                }
              },
              'dataSourceIdentifier': 'f5337387-967d-470c-bad7-b331314b9edd',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Output Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VSclMin',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VSclMin'
                }
              },
              'dataSourceIdentifier': 'f888ab0a-76f7-423b-a1e7-7871abb91101',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Low Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VSclMax',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VSclMax'
                }
              },
              'dataSourceIdentifier': '9136a9a2-9660-4d2e-9b30-b953390c7be1',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'High Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VMin',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VMin'
                }
              },
              'dataSourceIdentifier': 'ad83d8e3-a0b6-4061-aac3-2508ad085913',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Low Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VMax',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VMax'
                }
              },
              'dataSourceIdentifier': 'dcc442da-b0d9-450d-9442-3abf4fc3cf18',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'High Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VUnit',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.VUnit'
                }
              },
              'dataSourceIdentifier': 'b45fad2e-cf27-4818-964f-d4fd24a84d7e',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Enumeration value of the unit list',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'Sync',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral2.AnaConfParam_Integral2_updateRate.Sync'
                }
              },
              'dataSourceIdentifier': 'd386af0f-6d1a-4e44-9404-af9cf5e19e27',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Synchronization Mode',
              'pimadIdentifier': 'TODO'
            }
          ],
          'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam',
          'name': 'AnaConfParam_Integral2_updateRate',
          'initialized': true,
          'responseVendor': {
            'errorResponseFactory': {},
            'dummyResponseFactory': {},
            'successResponseFactory': {},
            'warningResponseFactory': {}
          }
        }
      ],
      'reportValues': [],
      'processValuesIn': [],
      'processValuesOut': [],
      'procedures': [
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'attributes': [
            {
              'dataType': 'xs:boolean',
              'name': 'IsSelfCompleting',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': 'false'
            },
            {
              'dataType': 'xs:unsignedLong',
              'name': 'ProcedureID',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': '1'
            },
            {
              'dataType': 'xs:boolean',
              'name': 'IsDefault',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': 'true'
            }
          ],
          'dataAssembly': {
            'dataItems': [
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:string',
                'name': 'TagName',
                'value': 'Integral2_default',
                'defaultValue': 'Integral2_default',
                'description': 'TagName Field',
                'pimadIdentifier': 'TODO'
              },
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:string',
                'name': 'TagDescription',
                'value': 'Default Procedure of Integral2',
                'defaultValue': 'Default Procedure of Integral2',
                'description': 'TagDescription Field',
                'pimadIdentifier': 'TODO'
              },
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:IDREF',
                'name': 'WQC',
                'cIData': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'nodeId': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                    'identifier': 'Integral2.Integral2_default.WQC'
                  }
                },
                'dataSourceIdentifier': '003f2f4a-4e8e-4327-9542-56b275ffa6e7',
                'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                'defaultValue': '255',
                'description': 'Worst Quality Code variable',
                'pimadIdentifier': 'TODO'
              }
            ],
            'dataSourceIdentifier': '4fa9c4ab-0817-4156-b3ff-fa08038548bf',
            'description': 'inline TODO above',
            'name': 'Integral2_default',
            'initialized': true,
            'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/DiagnosticElement/HealthStateView',
            'pimadIdentifier': '57661ed8-3dc3-449f-bdba-c7935f72a9bd',
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            },
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          },
          'metaModelRef': 'MTPServiceSUCLib/ServiceProcedure',
          'name': 'Integral2_default',
          'parameters': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcParam_Integral2_factor',
                  'defaultValue': 'AnaProcParam_Integral2_factor',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Factor for scaling',
                  'defaultValue': 'Factor for scaling',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'OSLevel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.OSLevel'
                    }
                  },
                  'dataSourceIdentifier': '419459ca-cf87-43e2-8f8d-c32393f529f6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.WQC'
                    }
                  },
                  'dataSourceIdentifier': 'e5fcdbc2-9e82-47e5-bfc9-6ba1cf1f8c3a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateChannel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateChannel'
                    }
                  },
                  'dataSourceIdentifier': '723cf814-9b3a-49dd-bc94-a5c7aa1d49de',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Selection of the active Operation Mode interaction channel',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateOffAut'
                    }
                  },
                  'dataSourceIdentifier': '04196e7a-ca95-4dbf-add2-9870ff5edb9c',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Offline by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateOpAut'
                    }
                  },
                  'dataSourceIdentifier': '4f421daa-aadc-4fec-9408-f33213521b0b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Operator by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateAutAut'
                    }
                  },
                  'dataSourceIdentifier': 'c22f0041-6671-48e4-bd41-69deeac89c75',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Automatic by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateOffOp'
                    }
                  },
                  'dataSourceIdentifier': 'e8cad0c4-f958-4dfa-a942-bac2778958bb',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Offline by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateOpOp'
                    }
                  },
                  'dataSourceIdentifier': 'd2f94f5c-5393-4886-b878-b0c16d74f714',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Operator by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateAutOp'
                    }
                  },
                  'dataSourceIdentifier': '87f6fb09-2dd1-4434-bd36-6920cbf61725',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Automatic by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateOpAct'
                    }
                  },
                  'dataSourceIdentifier': '537c35ed-b12f-4aba-9cb4-3385591dd365',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Operator Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateAutAct'
                    }
                  },
                  'dataSourceIdentifier': 'b0e453e9-e4c9-422b-a331-c006747bf9f6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Automatic Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.StateOffAct'
                    }
                  },
                  'dataSourceIdentifier': 'e2472195-f6c6-4a84-86ad-f6f53008cc40',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Offline Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcChannel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.SrcChannel'
                    }
                  },
                  'dataSourceIdentifier': '94944c30-4df2-4710-8137-24f216ec19fc',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Selection of the active Service Source Mode interaction channel',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.SrcExtAut'
                    }
                  },
                  'dataSourceIdentifier': '2aaa7694-85eb-4ff1-9884-f8539ca488e6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to External by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.SrcIntAut'
                    }
                  },
                  'dataSourceIdentifier': '96f2996d-71b0-4a8c-94e1-4b99bbaac9bb',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to Internal by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.SrcIntOp'
                    }
                  },
                  'dataSourceIdentifier': '248d589d-07dd-4be8-8a80-4f55a635cb28',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to Intern by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.SrcExtOp'
                    }
                  },
                  'dataSourceIdentifier': 'efecf20f-ef31-47ee-9be0-ca0ad7a39676',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to External by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.SrcExtAct'
                    }
                  },
                  'dataSourceIdentifier': 'dea522f1-b4d5-4b9e-af3d-ed8c4a54f7fa',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'External Source Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.SrcIntAct'
                    }
                  },
                  'dataSourceIdentifier': 'c2898154-84ef-4ad6-85e7-15263bee5d20',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Internal Source Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VExt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VExt'
                    }
                  },
                  'dataSourceIdentifier': 'a817a683-9d0f-457d-a084-c6dd6be5c28f',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Extern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VOp'
                    }
                  },
                  'dataSourceIdentifier': 'a334f67b-671c-45ab-ac15-33b2000876fa',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Manual Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VInt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VInt'
                    }
                  },
                  'dataSourceIdentifier': '33cc2e3f-4e38-433b-afac-b6a1af6e125d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Intern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VReq',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VReq'
                    }
                  },
                  'dataSourceIdentifier': 'fa14d23c-7ad2-4f99-a78b-d56d71e74610',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Request Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VFbk',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VFbk'
                    }
                  },
                  'dataSourceIdentifier': '24bba4e8-0d9d-4d1b-8860-2ac1a3569c21',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Feedback Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VOut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VOut'
                    }
                  },
                  'dataSourceIdentifier': 'bc25438c-6415-4d0e-b8a5-c8e3bb3c9381',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Output Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'b33b0479-4065-4f8a-8ec2-f9dc23f98a48',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'bd229f9b-8c1d-4312-abca-49712440253d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VMin'
                    }
                  },
                  'dataSourceIdentifier': 'abc33835-fb88-43e7-aa29-5af6dd0ca046',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VMax'
                    }
                  },
                  'dataSourceIdentifier': '13d8606c-f39b-4546-a8c2-122e4528dc1a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '70b58588-c434-4f1a-af73-21cb1e694b1d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'Sync',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_factor.Sync'
                    }
                  },
                  'dataSourceIdentifier': '2c53068a-56ed-4ae3-9dcf-82b66b87168a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Synchronization Mode',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam',
              'name': 'AnaProcParam_Integral2_factor',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcParam_Integral2_offset',
                  'defaultValue': 'AnaProcParam_Integral2_offset',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Offset for scaling',
                  'defaultValue': 'Offset for scaling',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'OSLevel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.OSLevel'
                    }
                  },
                  'dataSourceIdentifier': '44bf7aa0-7cd0-4aee-b1cb-ede6b2550a2c',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral2_offset.WQC'
                    }
                  },
                  'dataSourceIdentifier': '3c988bc3-3d4a-4438-a689-700e19c801df',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'WQC',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateChannel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateChannel'
                    }
                  },
                  'dataSourceIdentifier': '09ebd2ab-9d7b-40e2-9f79-d5b02bf7372c',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Selection of the active Operation Mode interaction channel',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateOffAut'
                    }
                  },
                  'dataSourceIdentifier': '0171dc75-5537-449f-9874-dd64deb20a41',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Offline by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateOpAut'
                    }
                  },
                  'dataSourceIdentifier': '17508edf-b390-47de-9531-1ad6a2aff59b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Operator by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateAutAut'
                    }
                  },
                  'dataSourceIdentifier': 'f1ca391b-d5ec-4460-acc2-43c255b5efaa',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Automatic by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateOffOp'
                    }
                  },
                  'dataSourceIdentifier': 'd6db3aa9-500d-40d6-86e2-87dcb8f30cae',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Offline by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateOpOp'
                    }
                  },
                  'dataSourceIdentifier': '0655399a-768b-4af7-9cb6-7370413e9dbf',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Operator by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateAutOp'
                    }
                  },
                  'dataSourceIdentifier': '5ea80b8e-39fa-4cb7-a858-6890c5c1fce0',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Automatic by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateOpAct'
                    }
                  },
                  'dataSourceIdentifier': '0f2e0551-825c-4889-be8b-235a4c475727',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Operator Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateAutAct'
                    }
                  },
                  'dataSourceIdentifier': '27e69bda-0cb7-4515-a026-59558fad598e',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Automatic Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.StateOffAct'
                    }
                  },
                  'dataSourceIdentifier': 'a7f8c767-ed0b-49cd-aee3-16a81f7b63b3',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Offline Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcChannel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.SrcChannel'
                    }
                  },
                  'dataSourceIdentifier': '91d45ff2-d92e-46fd-aa14-1dc3009da62d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Selection of the active Service Source Mode interaction channel',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.SrcExtAut'
                    }
                  },
                  'dataSourceIdentifier': 'b54267d0-2b9c-41a2-bb27-c9d29cc3a6ea',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to External by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.SrcIntAut'
                    }
                  },
                  'dataSourceIdentifier': 'c7bc0379-5054-4c87-8dc9-c2a5c385b438',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to Internal by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.SrcIntOp'
                    }
                  },
                  'dataSourceIdentifier': '41315b53-b410-4b5c-82aa-56f9557bdd41',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to Intern by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.SrcExtOp'
                    }
                  },
                  'dataSourceIdentifier': '274afa69-4024-40e0-80cc-61ced280756b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to External by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.SrcExtAct'
                    }
                  },
                  'dataSourceIdentifier': '3b9f42f1-0118-44b7-99f8-a129cd7c3d86',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'External Source Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.SrcIntAct'
                    }
                  },
                  'dataSourceIdentifier': 'e27fc5a3-55fd-4160-8cd8-d6512aabb939',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Internal Source Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VExt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VExt'
                    }
                  },
                  'dataSourceIdentifier': '9e22c5fe-9511-45f5-aee6-f7ea89731c28',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Extern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VOp'
                    }
                  },
                  'dataSourceIdentifier': 'cebe0a8e-03c6-4af0-96bd-8fe72096377e',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Manual Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VInt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VInt'
                    }
                  },
                  'dataSourceIdentifier': '49352186-ed2f-4426-b2ac-dc300bcd99c0',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Intern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VReq',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VReq'
                    }
                  },
                  'dataSourceIdentifier': 'c2b211c4-1048-43ee-adf9-ddfe7190daf5',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Request Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VFbk',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VFbk'
                    }
                  },
                  'dataSourceIdentifier': '14ddfb51-776f-40d1-b97f-cc0e9f28f126',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Feedback Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VOut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VOut'
                    }
                  },
                  'dataSourceIdentifier': 'edd85074-4b26-47a5-a616-1ebf3ecc0eaa',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Output Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '8d581659-70c1-425a-964d-7261cf24b576',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': '1d107ec6-279a-41fc-aa0b-0b3bf3810b46',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VMin'
                    }
                  },
                  'dataSourceIdentifier': '59932c84-6a29-4d8c-9c3b-2fe360791b0a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VMax'
                    }
                  },
                  'dataSourceIdentifier': '17908b55-ffc2-4171-9ee0-876771ce9977',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '29e455a3-f01f-4211-ab39-7e8f82b4557a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'Sync',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral2_offset.Sync'
                    }
                  },
                  'dataSourceIdentifier': 'a809100f-4e9b-4b5d-afbc-bac6d706a80c',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Synchronization Mode',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam',
              'name': 'AnaProcParam_Integral2_offset',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'reportValues': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaReportValue_Integral2_rvTime',
                  'defaultValue': 'AnaReportValue_Integral2_rvTime',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Final integration time',
                  'defaultValue': 'Final integration time',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvTime.WQC'
                    }
                  },
                  'dataSourceIdentifier': 'dff7c3c0-41b6-4b07-9216-7f83989fc9bb',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'Text',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvTime.Text'
                    }
                  },
                  'dataSourceIdentifier': '36a4f4ca-b103-4147-b383-75108dc0c143',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/StringView',
              'name': 'AnaReportValue_Integral2_rvTime',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaReportValue_Integral2_rvOutScaled',
                  'defaultValue': 'AnaReportValue_Integral2_rvOutScaled',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Final scaled value out',
                  'defaultValue': 'Final scaled value out',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutScaled.WQC'
                    }
                  },
                  'dataSourceIdentifier': '3d3f955e-a245-460c-af83-50f913cdc873',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutScaled.V'
                    }
                  },
                  'dataSourceIdentifier': 'a338e730-e168-4ad8-be3a-68204a88baec',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutScaled.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '832a4e5c-1863-4013-861e-4df53da5ed28',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutScaled.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': '1d4e0484-7a64-4be9-8020-d65e073b6188',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutScaled.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '6c2069c8-8d92-44e0-815c-ebf39d3faf1b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'AnaReportValue_Integral2_rvOutScaled',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaReportValue_Integral2_rvOutIntegral',
                  'defaultValue': 'AnaReportValue_Integral2_rvOutIntegral',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Final integral value out',
                  'defaultValue': 'Final integral value out',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutIntegral.WQC'
                    }
                  },
                  'dataSourceIdentifier': '020acbfd-b72e-4aad-8595-8f77bc8e7f30',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutIntegral.V'
                    }
                  },
                  'dataSourceIdentifier': '296c6341-365c-4482-858b-6c21fd9d2ea6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutIntegral.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'da8b7608-3ee8-4aef-b87d-89652b71f98a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutIntegral.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'e3703f7b-c628-4891-9d66-d010fa46cbdc',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaReportValue_Integral2_rvOutIntegral.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '41783124-ac62-43dc-86db-2beeddaf2700',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'AnaReportValue_Integral2_rvOutIntegral',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'processValuesIn': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcessValueIn_Integral2_pv',
                  'defaultValue': 'AnaProcessValueIn_Integral2_pv',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Analog Process Value Input',
                  'defaultValue': 'Analog Process Value Input',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueIn_Integral2_pv.WQC'
                    }
                  },
                  'dataSourceIdentifier': 'f8b81ba9-48ad-4756-aa75-013d8aef2a6a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VExt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueIn_Integral2_pv.VExt'
                    }
                  },
                  'dataSourceIdentifier': '71c8e066-47cc-4b6b-8ae3-59858a3ca8d6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Extern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueIn_Integral2_pv.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'a2161285-d243-4b6a-9cd6-e147f788a8ec',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueIn_Integral2_pv.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'ccde48e2-05b6-48a3-9ab0-00d62baa641c',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '10',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueIn_Integral2_pv.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '4e613dcd-8b59-4dd1-af10-0dbe7ca4718d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '1353',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/InputElement/AnaProcessValueIn',
              'name': 'AnaProcessValueIn_Integral2_pv',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'processValuesOut': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcessValueOut_Integral2_pvOutIntegral',
                  'defaultValue': 'AnaProcessValueOut_Integral2_pvOutIntegral',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Integral of pv',
                  'defaultValue': 'Integral of pv',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutIntegral.WQC'
                    }
                  },
                  'dataSourceIdentifier': '5b67098e-9195-4385-a1b2-713f5e566eaf',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutIntegral.V'
                    }
                  },
                  'dataSourceIdentifier': '5889e4c9-4ff4-443d-af80-8c872d745d74',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutIntegral.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '7c7a8463-cd66-4090-a12d-163cb2702a83',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutIntegral.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'ea5db5c7-9d0d-450e-b86c-9051553c537f',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutIntegral.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '0d390f30-2d24-4bab-985c-004419d861d0',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'AnaProcessValueOut_Integral2_pvOutIntegral',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcessValueOut_Integral2_pvOutScaled',
                  'defaultValue': 'AnaProcessValueOut_Integral2_pvOutScaled',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'scaled value of pv',
                  'defaultValue': 'scaled value of pv',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutScaled.WQC'
                    }
                  },
                  'dataSourceIdentifier': '5dfdf0af-ebb3-490c-a9c6-ae09a8542814',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutScaled.V'
                    }
                  },
                  'dataSourceIdentifier': '76377315-ef78-470d-9f80-107aa0d1acb5',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutScaled.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'bc7efe4b-17df-4130-8229-c6af703dd420',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutScaled.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'b7e5fdfc-709a-4891-bf7c-d20ff8d5fd34',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcessValueOut_Integral2_pvOutScaled.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '3dd554a5-b73e-491b-98be-af1323d0bf3d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'AnaProcessValueOut_Integral2_pvOutScaled',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'dataSourceIdentifier': '178bef2d-160a-4d5b-abb5-bba03a4474d0',
          'pimadIdentifier': 'TODO'
        }
      ],
      'dataSourceIdentifier': '820f9268-c2cb-4535-bcbf-6cf9f3253748',
      'pimadIdentifier': 'a36a672a-57ac-4782-acc5-5daf1e56342e'
    },
    {
      'initialized': true,
      'responseHandler': {
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        }
      },
      'attributes': [],
      'dataAssembly': {
        'dataItems': [
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:string',
            'name': 'TagName',
            'value': 'Trigonometry',
            'defaultValue': 'Trigonometry',
            'description': 'TagName Field',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:string',
            'name': 'TagDescription',
            'value': 'Service for math operation Integral',
            'defaultValue': 'Service for math operation Integral',
            'description': 'TagDescription Field',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateChannel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateChannel'
              }
            },
            'dataSourceIdentifier': '6ac10825-7aba-4786-8298-f03ef101d314',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Selection of the active Operation Mode interaction channel',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateOffAut'
              }
            },
            'dataSourceIdentifier': '6b9b0fee-9d7f-42aa-9507-e8ed014ddf3f',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Offline by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateOpAut'
              }
            },
            'dataSourceIdentifier': '963f2f22-5019-4dae-a567-7e1df8475cf2',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Operator by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateAutAut'
              }
            },
            'dataSourceIdentifier': '729aceef-3f07-4504-a2b3-84212f57a099',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Automatic by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateOffOp'
              }
            },
            'dataSourceIdentifier': 'e1b1b876-8697-47f3-aec6-f8a9e2daf9cf',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Offline by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateOpOp'
              }
            },
            'dataSourceIdentifier': '77e1550c-c8e3-4d9e-a349-89ddac272f8b',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Operator by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateAutOp'
              }
            },
            'dataSourceIdentifier': '333bc326-21a1-4ca1-a30c-b43e6c2e4991',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Automatic by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateOpAct'
              }
            },
            'dataSourceIdentifier': '6e2c2e95-1cf5-4a9c-bd34-932560ef7edc',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Operator Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateAutAct'
              }
            },
            'dataSourceIdentifier': '4d923aea-c199-4b3d-a9e3-061057ecb63a',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Automatic Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateOffAct'
              }
            },
            'dataSourceIdentifier': '179a7aa8-bd4c-45f3-8465-7ea3a672a5d7',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Offline Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcChannel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.SrcChannel'
              }
            },
            'dataSourceIdentifier': '335d1428-c9a8-4e2a-bddf-3008774eae21',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Selection of the active Service Source Mode interaction channel',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.SrcExtAut'
              }
            },
            'dataSourceIdentifier': '7a4ecba9-0a5d-4256-8f64-91f786960ba0',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to External by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.SrcIntAut'
              }
            },
            'dataSourceIdentifier': '90b6d4eb-54b1-406a-8bfa-d7162dd9b8d3',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to Internal by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.SrcIntOp'
              }
            },
            'dataSourceIdentifier': 'cbc7ea94-0d84-40c3-bd58-72401f00b971',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to Intern by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.SrcExtOp'
              }
            },
            'dataSourceIdentifier': 'c25e4c17-a13c-4373-a561-9964ac7324dd',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to External by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.SrcExtAct'
              }
            },
            'dataSourceIdentifier': '2209ac24-065d-4e3c-b1ff-9ee64003289a',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'External Source Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.SrcIntAct'
              }
            },
            'dataSourceIdentifier': '843d52c2-72cc-4374-9738-03eee1d60f59',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Internal Source Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'OSLevel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.OSLevel'
              }
            },
            'dataSourceIdentifier': 'c55af549-7386-48a1-bd6f-dc0fca4064d8',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'WQC',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.WQC'
              }
            },
            'dataSourceIdentifier': 'c6339f15-a556-4d56-992c-4b4e2b06b750',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '255',
            'description': 'Worst Quality Code variable',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.CommandOp'
              }
            },
            'dataSourceIdentifier': 'b21d9073-9234-451c-ae0b-849bcd40ca07',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Operator',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandInt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.CommandInt'
              }
            },
            'dataSourceIdentifier': '523881ce-1a38-448a-a042-823bf524f91e',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Automatic-Intern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandExt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.CommandExt'
              }
            },
            'dataSourceIdentifier': 'bdc42497-009f-4c18-b32e-a4846c9d3221',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Automatic-Extern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.ProcedureOp'
              }
            },
            'dataSourceIdentifier': 'ace4372b-ca4d-44a9-af05-3c1dde0fdbb4',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Operator',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureInt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.ProcedureInt'
              }
            },
            'dataSourceIdentifier': '5020f836-bba0-4bd7-b4f1-451c8d0d1329',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Automatic-Intern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureExt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.ProcedureExt'
              }
            },
            'dataSourceIdentifier': 'b4ecac86-bf44-4dc8-b3c5-7f7dffc92da0',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Automatic-Extern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandEn',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.CommandEn'
              }
            },
            'dataSourceIdentifier': 'd0734477-9918-4458-a49c-73338b3fc1a9',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Transition Clearance from the Current State',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateCur',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.StateCur'
              }
            },
            'dataSourceIdentifier': '74dd75d1-8c49-49c8-8097-3594e9c038fa',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Current State',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureCur',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.ProcedureCur'
              }
            },
            'dataSourceIdentifier': '2d83db14-7046-4250-99c2-f718f2dd3305',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Current Procedure',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureReq',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.ProcedureReq'
              }
            },
            'dataSourceIdentifier': 'fa015e55-5505-4cfc-9935-8d8d4369e74a',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Requested Procedure',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'InteractQuestionID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.InteractQuestionID'
              }
            },
            'dataSourceIdentifier': 'c89cfc1f-0f7f-46e5-8cf1-283e246ea409',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Operator Request Question ID',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'InteractAnswerID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.InteractAnswerID'
              }
            },
            'dataSourceIdentifier': '4feb082d-c9f7-4df5-bc09-02a4d8eb1481',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Operator Request Answer ID',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'PosTextID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Trigonometry.PosTextID'
              }
            },
            'dataSourceIdentifier': '5ea5e7c3-0c4c-4b6f-b503-b7f3989e9d8d',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Service Information Text ID',
            'pimadIdentifier': 'TODO'
          }
        ],
        'dataSourceIdentifier': 'b0bc77ca-96a3-485e-87bc-316f428c824d',
        'description': 'inline TODO above',
        'name': 'Trigonometry',
        'initialized': true,
        'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/ServiceControl',
        'pimadIdentifier': 'c26a02b0-3067-487e-915f-259ce1d35551',
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        },
        'responseHandler': {
          'responseVendor': {
            'errorResponseFactory': {},
            'dummyResponseFactory': {},
            'successResponseFactory': {},
            'warningResponseFactory': {}
          }
        }
      },
      'metaModelRef': 'MTPServiceSUCLib/Service',
      'name': 'Trigonometry',
      'parameters': [
        {
          'dataItems': [
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:string',
              'name': 'TagName',
              'value': 'Trigonometry_AnaConfParam_UpdateRate',
              'defaultValue': 'Trigonometry_AnaConfParam_UpdateRate',
              'description': 'TagName Field',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:string',
              'name': 'TagDescription',
              'value': 'UpdateRateDuring Execute',
              'defaultValue': 'UpdateRateDuring Execute',
              'description': 'TagDescription Field',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'OSLevel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.OSLevel'
                }
              },
              'dataSourceIdentifier': '879e3055-332e-4dc0-888a-f54db9db08b3',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'WQC',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.WQC'
                }
              },
              'dataSourceIdentifier': '6e866e49-c445-4c8a-9fd8-99b819189607',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'WQC variable (0: Local HMI, >0: POL HMI)',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateChannel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateChannel'
                }
              },
              'dataSourceIdentifier': '0c80a1f2-64f9-40aa-9257-cb5578b264f7',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Selection of the active Operation Mode interaction channel',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateOffAut'
                }
              },
              'dataSourceIdentifier': '308fd2b9-18a6-403a-a724-d422c6e26ca3',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Offline by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateOpAut'
                }
              },
              'dataSourceIdentifier': 'c318f150-cbb9-4775-848a-49a6fa4d6667',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Operator by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateAutAut'
                }
              },
              'dataSourceIdentifier': '579e840c-f41c-40f8-a843-9246006b5d95',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Automatic by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateOffOp'
                }
              },
              'dataSourceIdentifier': '1c523cb2-a186-4b1d-845b-1a4399018ff6',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Offline by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateOpOp'
                }
              },
              'dataSourceIdentifier': '06f360a5-1be9-4675-950e-bc73f31a0020',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Operator by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateAutOp'
                }
              },
              'dataSourceIdentifier': '4cb7037b-6711-4c10-a53f-ea50d8a7a714',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Automatic by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateOpAct'
                }
              },
              'dataSourceIdentifier': '79f116a8-dd16-4eef-a253-7ff612d23d71',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Operator Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateAutAct'
                }
              },
              'dataSourceIdentifier': 'a84c129b-f977-4c2b-beeb-630f074486ac',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Automatic Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.StateOffAct'
                }
              },
              'dataSourceIdentifier': 'c25c1bf1-3ea0-452c-990f-cec2be9b9ce4',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Offline Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcChannel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.SrcChannel'
                }
              },
              'dataSourceIdentifier': '46303793-b6eb-421a-832c-981bf98b0908',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Selection of the active Service Source Mode interaction channel',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.SrcExtAut'
                }
              },
              'dataSourceIdentifier': '64e18e2e-61a4-478d-a04b-8377b86645f9',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to External by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.SrcIntAut'
                }
              },
              'dataSourceIdentifier': '1e3932ea-5367-4c13-995e-7c1b2b9ab605',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to Internal by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.SrcIntOp'
                }
              },
              'dataSourceIdentifier': '1375219e-eebb-45b5-95b6-e737be6359a8',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to Intern by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.SrcExtOp'
                }
              },
              'dataSourceIdentifier': 'dbf0bb61-b60f-461d-93f4-a12784841444',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to External by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.SrcExtAct'
                }
              },
              'dataSourceIdentifier': '6b906950-9939-4c4b-8380-8130655b1d3e',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'External Source Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.SrcIntAct'
                }
              },
              'dataSourceIdentifier': '15b61594-2e4f-43b6-91b6-1aba690939b2',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Internal Source Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VExt',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VExt'
                }
              },
              'dataSourceIdentifier': '5554d1ed-3047-4e56-81db-712d2a9416f2',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Extern Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VOp'
                }
              },
              'dataSourceIdentifier': '39baaf5d-7854-4f8b-869b-bf3e6eeeb258',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Manual Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VInt',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VInt'
                }
              },
              'dataSourceIdentifier': '5d8850e0-05e8-493d-9645-efe72b5859e3',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Intern Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VReq',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VReq'
                }
              },
              'dataSourceIdentifier': '13c7e323-f3c8-482b-8ad8-fa7899f28e0d',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Request Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VFbk',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VFbk'
                }
              },
              'dataSourceIdentifier': '151821a9-9569-4379-8dfc-84489f97f0a4',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Feedback Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VOut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VOut'
                }
              },
              'dataSourceIdentifier': 'c4eb01fc-4e46-433c-812b-53a247712712',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Output Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VSclMin',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VSclMin'
                }
              },
              'dataSourceIdentifier': '1d753e06-10ef-4da5-bc5f-d6a83ba677e9',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Low Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VSclMax',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VSclMax'
                }
              },
              'dataSourceIdentifier': 'c1bc6f0f-cef8-47ee-b440-3335e0617844',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'High Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VMin',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VMin'
                }
              },
              'dataSourceIdentifier': '46cff096-770f-4df7-8a71-168d370f2d8d',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Low Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VMax',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VMax'
                }
              },
              'dataSourceIdentifier': '1d47e001-fc4c-4413-a447-4a4f9e7ecbcc',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'High Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VUnit',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.VUnit'
                }
              },
              'dataSourceIdentifier': 'e5986493-2ff9-44f0-be10-9f760fe505c9',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '1054',
              'description': 'Enumeration value of the unit list',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'Sync',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Trigonometry.Trigonometry_AnaConfParam_UpdateRate.Sync'
                }
              },
              'dataSourceIdentifier': '73b36f25-0049-49c4-949d-f9c015b5b04a',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Synchronization Mode',
              'pimadIdentifier': 'TODO'
            }
          ],
          'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam',
          'name': 'Trigonometry_AnaConfParam_UpdateRate',
          'initialized': true,
          'responseVendor': {
            'errorResponseFactory': {},
            'dummyResponseFactory': {},
            'successResponseFactory': {},
            'warningResponseFactory': {}
          }
        }
      ],
      'reportValues': [],
      'processValuesIn': [],
      'processValuesOut': [],
      'procedures': [
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'attributes': [
            {
              'dataType': 'xs:boolean',
              'name': 'IsSelfCompleting',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': 'false'
            },
            {
              'dataType': 'xs:unsignedLong',
              'name': 'ProcedureID',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': '1'
            },
            {
              'dataType': 'xs:boolean',
              'name': 'IsDefault',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': 'true'
            }
          ],
          'dataAssembly': {
            'dataItems': [
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:string',
                'name': 'TagName',
                'value': 'Trigonometry_default',
                'defaultValue': 'Trigonometry_default',
                'description': 'TagName Field',
                'pimadIdentifier': 'TODO'
              },
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:string',
                'name': 'TagDescription',
                'value': 'Default Procedure of Trigonometry',
                'defaultValue': 'Default Procedure of Trigonometry',
                'description': 'TagDescription Field',
                'pimadIdentifier': 'TODO'
              },
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:IDREF',
                'name': 'WQC',
                'cIData': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'nodeId': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                    'identifier': 'Trigonometry.Trigonometry_default.WQC'
                  }
                },
                'dataSourceIdentifier': 'b749c9e8-2999-42ea-9ccf-652718d857e6',
                'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                'defaultValue': '255',
                'description': 'Worst Quality Code variable',
                'pimadIdentifier': 'TODO'
              }
            ],
            'dataSourceIdentifier': '98768474-c8f6-4108-9861-164741fa3a63',
            'description': 'inline TODO above',
            'name': 'Trigonometry_default',
            'initialized': true,
            'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/DiagnosticElement/HealthStateView',
            'pimadIdentifier': 'b88e5ede-20e5-41cf-941d-a8c6b21de74b',
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            },
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          },
          'metaModelRef': 'MTPServiceSUCLib/ServiceProcedure',
          'name': 'Trigonometry_default',
          'parameters': [],
          'reportValues': [],
          'processValuesIn': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'Trigonometry_AnaProcessValueIn_Angle',
                  'defaultValue': 'Trigonometry_AnaProcessValueIn_Angle',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Angle as input for calculation',
                  'defaultValue': 'Angle as input for calculation',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueIn_Angle.WQC'
                    }
                  },
                  'dataSourceIdentifier': '1bc8da3a-2f7e-4bc1-b78b-847c707f7381',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VExt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueIn_Angle.VExt'
                    }
                  },
                  'dataSourceIdentifier': 'd388a113-6863-4cc3-915c-a7e55d5f8482',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Extern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueIn_Angle.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'dacdea76-8c27-4365-b599-d6d6d56f390d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueIn_Angle.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'a300aeba-55ac-4554-829b-40a95cb5527f',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueIn_Angle.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '3ad1e260-cc40-4e6f-a93f-c09765629598',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '1005',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/InputElement/AnaProcessValueIn',
              'name': 'Trigonometry_AnaProcessValueIn_Angle',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'processValuesOut': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'Trigonometry_AnaProcessValueOut_Tangens',
                  'defaultValue': 'Trigonometry_AnaProcessValueOut_Tangens',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'CalculationResult_Tangens',
                  'defaultValue': 'CalculationResult_Tangens',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Tangens.WQC'
                    }
                  },
                  'dataSourceIdentifier': 'ba514a48-cb7d-4fda-9a9f-a922192f2013',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Tangens.V'
                    }
                  },
                  'dataSourceIdentifier': '241f44fc-d0b4-434e-9d74-b08519a47e76',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Tangens.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '91ec8d6d-fb66-41a5-8f61-0e5cd0c27f24',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Tangens.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'db375215-7533-4b5a-ae72-2c3b7c170e4e',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Tangens.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '015a3bbf-5f06-4e7f-85c6-081d2a2aefce',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'Trigonometry_AnaProcessValueOut_Tangens',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'Trigonometry_AnaProcessValueOut_Cosinus',
                  'defaultValue': 'Trigonometry_AnaProcessValueOut_Cosinus',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'CalculationResult_Cosinus',
                  'defaultValue': 'CalculationResult_Cosinus',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Cosinus.WQC'
                    }
                  },
                  'dataSourceIdentifier': '1a2d3ede-6765-498e-9828-44003a8b994b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Cosinus.V'
                    }
                  },
                  'dataSourceIdentifier': '7b2da736-9565-42cb-a2a1-25489b10afc5',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Cosinus.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'af900db0-ba73-48b0-9895-296c924e17e1',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Cosinus.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'e7646f6d-d2da-41d9-9ec1-e3ea7d7ff7a3',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Cosinus.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '705cd7de-ed57-4ae9-919b-f02b96fb66e7',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'Trigonometry_AnaProcessValueOut_Cosinus',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'Trigonometry_AnaProcessValueOut_Sinus',
                  'defaultValue': 'Trigonometry_AnaProcessValueOut_Sinus',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'CalculationResult_Sinus',
                  'defaultValue': 'CalculationResult_Sinus',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Sinus.WQC'
                    }
                  },
                  'dataSourceIdentifier': '9617898f-faf3-4cf0-9654-9b728711cf3b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Sinus.V'
                    }
                  },
                  'dataSourceIdentifier': '8676015e-a6fb-4aab-bb88-f15a5e194f3d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Sinus.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'c16af405-f073-4da2-b196-118421169ff7',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Sinus.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'edf6ab8a-1441-4062-8f7a-dd7c607914c2',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Trigonometry.Trigonometry_AnaProcessValueOut_Sinus.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '7fc16a94-fb1c-451b-8079-4f9a41ae3fcc',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'Trigonometry_AnaProcessValueOut_Sinus',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'dataSourceIdentifier': 'e4a2e743-af75-4ae2-8115-8f215e4ee89c',
          'pimadIdentifier': 'TODO'
        }
      ],
      'dataSourceIdentifier': '450948b6-e5f0-4cc2-abd4-f974c9d8e7c5',
      'pimadIdentifier': '8b783d44-3891-4922-a248-2fc27b4c90ca'
    },
    {
      'initialized': true,
      'responseHandler': {
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        }
      },
      'attributes': [],
      'dataAssembly': {
        'dataItems': [
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:string',
            'name': 'TagName',
            'value': 'Integral1',
            'defaultValue': 'Integral1',
            'description': 'TagName Field',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:string',
            'name': 'TagDescription',
            'value': 'Service for math operation Integral',
            'defaultValue': 'Service for math operation Integral',
            'description': 'TagDescription Field',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateChannel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateChannel'
              }
            },
            'dataSourceIdentifier': 'ec60b02b-7470-412d-92b2-f5ae0f5ac653',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Selection of the active Operation Mode interaction channel',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateOffAut'
              }
            },
            'dataSourceIdentifier': 'efb006ab-7e8e-4eb4-a1cf-7709eb7efc09',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Offline by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateOpAut'
              }
            },
            'dataSourceIdentifier': '0b869f62-cdae-444b-9778-1d9b7d2c3cfb',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Operator by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateAutAut'
              }
            },
            'dataSourceIdentifier': '67ead1c1-dad3-437b-a60d-f2bf438e889d',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Automatic by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateOffOp'
              }
            },
            'dataSourceIdentifier': '82ea6b26-53cc-41c2-8a5f-cfbb9ffae747',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Offline by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateOpOp'
              }
            },
            'dataSourceIdentifier': 'c79d3d9e-e0a0-479c-b1cc-de62e7e0742f',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Operator by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateAutOp'
              }
            },
            'dataSourceIdentifier': '7eb6e84f-b1f2-4d91-ac7b-3fbe6daa582e',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Operation Mode to Automatic by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOpAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateOpAct'
              }
            },
            'dataSourceIdentifier': 'adca7a0a-543d-446b-a2a5-340a246ea0e3',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Operator Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateAutAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateAutAct'
              }
            },
            'dataSourceIdentifier': 'c4b6cdd0-a455-4225-93d5-39db76dcc8b6',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Automatic Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateOffAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateOffAct'
              }
            },
            'dataSourceIdentifier': 'fa0bb4f5-984c-4b5f-aaf1-721c46216476',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Offline Mode Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcChannel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.SrcChannel'
              }
            },
            'dataSourceIdentifier': '779096b5-9e81-4838-9ebc-d2068bd7bcb7',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Selection of the active Service Source Mode interaction channel',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.SrcExtAut'
              }
            },
            'dataSourceIdentifier': '763899ed-c769-47cb-9643-5ba5fd740981',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to External by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntAut',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.SrcIntAut'
              }
            },
            'dataSourceIdentifier': '2007ef96-0807-4229-8f17-d902fb084a41',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to Internal by automatic interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.SrcIntOp'
              }
            },
            'dataSourceIdentifier': '345e2a6d-981d-4e77-a2f9-cdbc288c4f82',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to Intern by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.SrcExtOp'
              }
            },
            'dataSourceIdentifier': '32b9d496-c51d-4986-b2f9-2506a48a3e98',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Set Source Mode to External by operator interaction',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcExtAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.SrcExtAct'
              }
            },
            'dataSourceIdentifier': '7c368e32-5558-4f17-bd78-5916cab1d6f0',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'External Source Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'SrcIntAct',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.SrcIntAct'
              }
            },
            'dataSourceIdentifier': '5a153ba5-5d01-4d46-a8bb-34c06d5fc813',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': 'false',
            'description': 'Internal Source Active',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'OSLevel',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.OSLevel'
              }
            },
            'dataSourceIdentifier': 'e7ef7e4c-6d74-403f-9ab5-8e5d6d0d73ed',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'WQC',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.WQC'
              }
            },
            'dataSourceIdentifier': '0e71bc46-f7fd-4f1a-9584-9930e641c68f',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '255',
            'description': 'Worst Quality Code variable',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.CommandOp'
              }
            },
            'dataSourceIdentifier': 'ec9811dd-6fb8-4a48-8cf3-0c4e1a661057',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Operator',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandInt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.CommandInt'
              }
            },
            'dataSourceIdentifier': '5a31555e-747c-4103-a14b-9401873452d1',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Automatic-Intern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandExt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.CommandExt'
              }
            },
            'dataSourceIdentifier': '279f4fe2-f974-40d4-a16a-2613bede1fab',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Command Input for Automatic-Extern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureOp',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.ProcedureOp'
              }
            },
            'dataSourceIdentifier': '491ed7e3-6578-415e-893d-1d6b061f167e',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Operator',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureInt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.ProcedureInt'
              }
            },
            'dataSourceIdentifier': 'c311ca8c-0a88-473a-a128-7649f04dac8a',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Automatic-Intern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureExt',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.ProcedureExt'
              }
            },
            'dataSourceIdentifier': '0db208f9-c559-4256-8878-af2f795ce9d1',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Procedure Input for Automatic-Extern',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'CommandEn',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.CommandEn'
              }
            },
            'dataSourceIdentifier': '369c01e8-1359-4eff-9851-56be34054680',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Transition Clearance from the Current State',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'StateCur',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.StateCur'
              }
            },
            'dataSourceIdentifier': 'f0ac1de4-8b97-4ed1-84b0-01ab8c6f8f6b',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Current State',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureCur',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.ProcedureCur'
              }
            },
            'dataSourceIdentifier': '9177416d-96cb-4440-bca0-b942b3fda1ff',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Current Procedure',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'ProcedureReq',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.ProcedureReq'
              }
            },
            'dataSourceIdentifier': 'b9a7fdb8-900b-48ec-baeb-28606c9b71dc',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Requested Procedure',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'InteractQuestionID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.InteractQuestionID'
              }
            },
            'dataSourceIdentifier': '512a56d4-2f7a-411d-b816-3ba663310051',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Operator Request Question ID',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'InteractAnswerID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.InteractAnswerID'
              }
            },
            'dataSourceIdentifier': '780e70d5-432e-48e0-84bc-34186704ad93',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Operator Request Answer ID',
            'pimadIdentifier': 'TODO'
          },
          {
            'initialized': true,
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            'dataType': 'xs:IDREF',
            'name': 'PosTextID',
            'cIData': {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'nodeId': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                'identifier': 'Integral1.PosTextID'
              }
            },
            'dataSourceIdentifier': '24bb08a7-862e-4984-954e-531909f7bea3',
            'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
            'defaultValue': '0',
            'description': 'Service Information Text ID',
            'pimadIdentifier': 'TODO'
          }
        ],
        'dataSourceIdentifier': '643089db-8d3a-4c9d-8e8c-76f695052d98',
        'description': 'inline TODO above',
        'name': 'Integral1',
        'initialized': true,
        'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/ServiceControl',
        'pimadIdentifier': 'f7cd6e22-bce0-4ba5-98e0-c326246a09f5',
        'responseVendor': {
          'errorResponseFactory': {},
          'dummyResponseFactory': {},
          'successResponseFactory': {},
          'warningResponseFactory': {}
        },
        'responseHandler': {
          'responseVendor': {
            'errorResponseFactory': {},
            'dummyResponseFactory': {},
            'successResponseFactory': {},
            'warningResponseFactory': {}
          }
        }
      },
      'metaModelRef': 'MTPServiceSUCLib/Service',
      'name': 'Integral1',
      'parameters': [
        {
          'dataItems': [
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:string',
              'name': 'TagName',
              'value': 'AnaConfParam_Integral1_updateRate',
              'defaultValue': 'AnaConfParam_Integral1_updateRate',
              'description': 'TagName Field',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:string',
              'name': 'TagDescription',
              'value': 'UpdateRate during execute',
              'defaultValue': 'UpdateRate during execute',
              'description': 'TagDescription Field',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'OSLevel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.OSLevel'
                }
              },
              'dataSourceIdentifier': '3ce94b00-5cfa-473c-bb6a-9993bf510231',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'WQC',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.WQC'
                }
              },
              'dataSourceIdentifier': '531ffec8-ca6f-4c38-82da-9ac566817c92',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateChannel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateChannel'
                }
              },
              'dataSourceIdentifier': '8db0f936-49a5-4e57-935a-61fa09fef61d',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Selection of the active Operation Mode interaction channel',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateOffAut'
                }
              },
              'dataSourceIdentifier': '62865e87-989d-45b7-b1ed-06a715201596',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Offline by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateOpAut'
                }
              },
              'dataSourceIdentifier': '083da124-ef0c-4efc-893a-e18e719c9916',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Operator by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateAutAut'
                }
              },
              'dataSourceIdentifier': 'a6479714-86f3-45bd-9304-866d01a1e921',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Automatic by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateOffOp'
                }
              },
              'dataSourceIdentifier': 'f31975bc-8f92-4a95-ba5f-8765d45d95a1',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Offline by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateOpOp'
                }
              },
              'dataSourceIdentifier': '9f4167d2-da2e-42d5-9736-77e66cfa1638',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Operator by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateAutOp'
                }
              },
              'dataSourceIdentifier': '63bc182e-1967-4795-b112-862fd458e87b',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Operation Mode to Automatic by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOpAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateOpAct'
                }
              },
              'dataSourceIdentifier': '7cc23949-be0c-48b3-bad7-4cd744099d10',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Operator Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateAutAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateAutAct'
                }
              },
              'dataSourceIdentifier': 'cb7d9951-4782-4082-ade5-e0edf516ce5f',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Automatic Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'StateOffAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.StateOffAct'
                }
              },
              'dataSourceIdentifier': 'cf1d9f6b-9e09-47e3-bbf2-ef8fdab5ac8d',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Offline Mode Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcChannel',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.SrcChannel'
                }
              },
              'dataSourceIdentifier': '17b5fff2-2ae9-43d8-a236-ac9208aa8815',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Selection of the active Service Source Mode interaction channel',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.SrcExtAut'
                }
              },
              'dataSourceIdentifier': '06633846-1b0f-4f92-8833-f91f79768dc7',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to External by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntAut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.SrcIntAut'
                }
              },
              'dataSourceIdentifier': '4d9bbb12-6054-4180-90a4-166f8888c33a',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to Internal by automatic interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.SrcIntOp'
                }
              },
              'dataSourceIdentifier': '18adcefe-b2b5-49b5-9475-0acf1d717850',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to Intern by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.SrcExtOp'
                }
              },
              'dataSourceIdentifier': '44838fa8-455c-4724-8090-93a229cbf278',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Set Source Mode to External by operator interaction',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcExtAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.SrcExtAct'
                }
              },
              'dataSourceIdentifier': '1d03d8c7-c1ae-4dc3-9b46-1c1b47a0edf4',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'External Source Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'SrcIntAct',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.SrcIntAct'
                }
              },
              'dataSourceIdentifier': 'ccebf746-0ccd-4ca2-835b-21bb4b6ca1de',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Internal Source Active',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VExt',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VExt'
                }
              },
              'dataSourceIdentifier': '5120e34e-261b-44da-8ab9-104a782780b5',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Extern Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VOp',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VOp'
                }
              },
              'dataSourceIdentifier': '2e4b5837-01bc-40a8-8edd-232ca44be724',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Manual Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VInt',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VInt'
                }
              },
              'dataSourceIdentifier': '630cc2b8-46f8-4bd7-8dd0-67c8a687fbb6',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Intern Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VReq',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VReq'
                }
              },
              'dataSourceIdentifier': '9a181067-98d7-4d42-bf63-71f6dca6dd3d',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Request Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VFbk',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VFbk'
                }
              },
              'dataSourceIdentifier': '73a75c0a-fe65-405f-aed4-73f57c7415a3',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Feedback Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VOut',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VOut'
                }
              },
              'dataSourceIdentifier': '50f71869-80cf-4ae5-93c1-aa01e4c3d976',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Output Value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VSclMin',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VSclMin'
                }
              },
              'dataSourceIdentifier': '9bf35683-89ed-4551-9e36-fd39bcd6564e',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Low Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VSclMax',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VSclMax'
                }
              },
              'dataSourceIdentifier': 'c9ffe8b1-1b6e-4c21-82fc-a6342a278ebb',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'High Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VMin',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VMin'
                }
              },
              'dataSourceIdentifier': '1f354d5f-7c53-420b-a40b-5a139a6f3442',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Low Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VMax',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VMax'
                }
              },
              'dataSourceIdentifier': 'd3c73dab-f34e-482c-8fa5-d8338ef2300c',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'High Limit value',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'VUnit',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.VUnit'
                }
              },
              'dataSourceIdentifier': '4aeaea95-3f26-4433-b0c2-6a620f5e716e',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': '0',
              'description': 'Enumeration value of the unit list',
              'pimadIdentifier': 'TODO'
            },
            {
              'initialized': true,
              'responseHandler': {
                'responseVendor': {
                  'errorResponseFactory': {},
                  'dummyResponseFactory': {},
                  'successResponseFactory': {},
                  'warningResponseFactory': {}
                }
              },
              'dataType': 'xs:IDREF',
              'name': 'Sync',
              'cIData': {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'nodeId': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                  'identifier': 'Integral1.AnaConfParam_Integral1_updateRate.Sync'
                }
              },
              'dataSourceIdentifier': 'accc0d5a-066f-4ae1-af3a-89d697e8acde',
              'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
              'defaultValue': 'false',
              'description': 'Synchronization Mode',
              'pimadIdentifier': 'TODO'
            }
          ],
          'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam',
          'name': 'AnaConfParam_Integral1_updateRate',
          'initialized': true,
          'responseVendor': {
            'errorResponseFactory': {},
            'dummyResponseFactory': {},
            'successResponseFactory': {},
            'warningResponseFactory': {}
          }
        }
      ],
      'reportValues': [],
      'processValuesIn': [],
      'processValuesOut': [],
      'procedures': [
        {
          'initialized': true,
          'responseHandler': {
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            }
          },
          'attributes': [
            {
              'dataType': 'xs:boolean',
              'name': 'IsSelfCompleting',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': 'false'
            },
            {
              'dataType': 'xs:unsignedLong',
              'name': 'ProcedureID',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': '1'
            },
            {
              'dataType': 'xs:boolean',
              'name': 'IsDefault',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              },
              'value': 'true'
            }
          ],
          'dataAssembly': {
            'dataItems': [
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:string',
                'name': 'TagName',
                'value': 'Integral1_default',
                'defaultValue': 'Integral1_default',
                'description': 'TagName Field',
                'pimadIdentifier': 'TODO'
              },
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:string',
                'name': 'TagDescription',
                'value': 'Default Procedure of Integral1',
                'defaultValue': 'Default Procedure of Integral1',
                'description': 'TagDescription Field',
                'pimadIdentifier': 'TODO'
              },
              {
                'initialized': true,
                'responseHandler': {
                  'responseVendor': {
                    'errorResponseFactory': {},
                    'dummyResponseFactory': {},
                    'successResponseFactory': {},
                    'warningResponseFactory': {}
                  }
                },
                'dataType': 'xs:IDREF',
                'name': 'WQC',
                'cIData': {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'nodeId': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                    'identifier': 'Integral1.Integral1_default.WQC'
                  }
                },
                'dataSourceIdentifier': '091cb441-e4d3-4777-b6c6-02fd3154dc0b',
                'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                'defaultValue': '255',
                'description': 'Worst Quality Code variable',
                'pimadIdentifier': 'TODO'
              }
            ],
            'dataSourceIdentifier': '91ecc5ec-30f5-42d1-9cdf-fb82b5552982',
            'description': 'inline TODO above',
            'name': 'Integral1_default',
            'initialized': true,
            'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/DiagnosticElement/HealthStateView',
            'pimadIdentifier': '9e1a18c5-c169-48c5-b121-b969a507a83d',
            'responseVendor': {
              'errorResponseFactory': {},
              'dummyResponseFactory': {},
              'successResponseFactory': {},
              'warningResponseFactory': {}
            },
            'responseHandler': {
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          },
          'metaModelRef': 'MTPServiceSUCLib/ServiceProcedure',
          'name': 'Integral1_default',
          'parameters': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcParam_Integral1_factor',
                  'defaultValue': 'AnaProcParam_Integral1_factor',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Factor for scaling',
                  'defaultValue': 'Factor for scaling',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'OSLevel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.OSLevel'
                    }
                  },
                  'dataSourceIdentifier': '16db02fe-5fe8-48c5-af31-e7ffa3c2c355',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral2.AnaProcParam_Integral1_factor.WQC'
                    }
                  },
                  'dataSourceIdentifier': '9d7dcf89-fbad-4c71-b4e9-278d299b69c6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'WQC Level variable (0: Local HMI, >0: POL HMI)',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateChannel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateChannel'
                    }
                  },
                  'dataSourceIdentifier': 'c9df5f34-f1b4-4f24-9d2a-48b77b66a67b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Selection of the active Operation Mode interaction channel',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateOffAut'
                    }
                  },
                  'dataSourceIdentifier': 'b474da12-73de-4b4d-acf2-480b87300890',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Offline by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateOpAut'
                    }
                  },
                  'dataSourceIdentifier': '163015d0-1ac7-478f-8674-728b8bac27a9',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Operator by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateAutAut'
                    }
                  },
                  'dataSourceIdentifier': 'd4b93aa8-6a92-469c-9b7d-86e3f161e540',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Automatic by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateOffOp'
                    }
                  },
                  'dataSourceIdentifier': 'eb050e75-23a5-4e10-9545-b76e9303fa90',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Offline by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateOpOp'
                    }
                  },
                  'dataSourceIdentifier': '5b2f14cd-20cb-4d4f-9304-20b2e169a2e2',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Operator by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateAutOp'
                    }
                  },
                  'dataSourceIdentifier': '018a79db-4872-4486-baff-3e3288d20291',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Automatic by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateOpAct'
                    }
                  },
                  'dataSourceIdentifier': '3d08895d-928d-435d-9558-c9b84ccbf2b3',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Operator Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateAutAct'
                    }
                  },
                  'dataSourceIdentifier': 'e411fb13-b5b8-4a87-b47f-55f5e0658343',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Automatic Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.StateOffAct'
                    }
                  },
                  'dataSourceIdentifier': 'a68c9ca1-f0fd-41fd-90a0-fb92c5cbe120',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Offline Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcChannel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.SrcChannel'
                    }
                  },
                  'dataSourceIdentifier': '736e9a7b-64ec-46e0-aa05-2a089659c104',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Selection of the active Service Source Mode interaction channel',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.SrcExtAut'
                    }
                  },
                  'dataSourceIdentifier': '86734bee-059c-490a-860b-9fd5ddb6b6d9',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to External by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.SrcIntAut'
                    }
                  },
                  'dataSourceIdentifier': '8a31eae8-204a-44f7-9ec0-85a4cd2eddb8',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to Internal by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.SrcIntOp'
                    }
                  },
                  'dataSourceIdentifier': '61f56f61-5e94-493b-b570-c8b0246a8540',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to Intern by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.SrcExtOp'
                    }
                  },
                  'dataSourceIdentifier': '941c223b-0c2a-406c-9db6-3c0e3041b4b5',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to External by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.SrcExtAct'
                    }
                  },
                  'dataSourceIdentifier': 'bd59e034-539e-4bcb-9dd8-b8b3546686bb',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'External Source Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.SrcIntAct'
                    }
                  },
                  'dataSourceIdentifier': 'efff030a-6ee1-40b0-87a5-c5adab264ec8',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Internal Source Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VExt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VExt'
                    }
                  },
                  'dataSourceIdentifier': '9965aa2e-6b25-4763-b488-d95fff44ec22',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Extern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VOp'
                    }
                  },
                  'dataSourceIdentifier': 'f2a34fee-ab2d-41e5-867d-bad97f08d68b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Manual Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VInt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VInt'
                    }
                  },
                  'dataSourceIdentifier': '6e07d969-9ad3-4521-90e6-7abc3efc4ef4',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Intern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VReq',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VReq'
                    }
                  },
                  'dataSourceIdentifier': '6275651b-fc87-425a-a391-b0d835fd8217',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Request Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VFbk',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VFbk'
                    }
                  },
                  'dataSourceIdentifier': 'ef56b2e9-3709-4684-98ff-48168b70f6f6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Feedback Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VOut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VOut'
                    }
                  },
                  'dataSourceIdentifier': 'a01a46cf-0f88-4159-b8f6-c27c362bfa8f',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Output Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'd1b23df4-97eb-4dfa-b6f0-91ead8d74c6a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': '6a72df29-b61d-4d78-aa47-e745632ba7bf',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VMin'
                    }
                  },
                  'dataSourceIdentifier': '9ce181a9-4ebe-46ca-bfd7-d211b374f446',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VMax'
                    }
                  },
                  'dataSourceIdentifier': 'bc7f1c89-01ab-40c4-9b81-96e45d499d7b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '7a28e123-e50f-4198-a293-9d272e7f922b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'Sync',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_factor.Sync'
                    }
                  },
                  'dataSourceIdentifier': 'b068137b-c222-4938-879a-9cb892959534',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Synchronization Mode',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam',
              'name': 'AnaProcParam_Integral1_factor',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcParam_Integral1_offset',
                  'defaultValue': 'AnaProcParam_Integral1_offset',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Offset for scaling',
                  'defaultValue': 'Offset for scaling',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'OSLevel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.OSLevel'
                    }
                  },
                  'dataSourceIdentifier': '92c1c433-e283-4208-8392-d4238a423427',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'OS Level variable (0: Local HMI, >0: POL HMI)',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.WQC'
                    }
                  },
                  'dataSourceIdentifier': 'bfc5fc31-7255-4152-a0f7-ecb8fcffb59a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'WQC variable (0: Local HMI, >0: POL HMI)',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateChannel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateChannel'
                    }
                  },
                  'dataSourceIdentifier': '270bdd95-a70e-4de8-ac4e-0dccf5cabfeb',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Selection of the active Operation Mode interaction channel',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateOffAut'
                    }
                  },
                  'dataSourceIdentifier': '8e0da651-19c7-4b0a-b098-a9f660d95200',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Offline by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateOpAut'
                    }
                  },
                  'dataSourceIdentifier': 'b341a95d-9ad9-427c-80a6-6aca2f275acf',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Operator by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateAutAut'
                    }
                  },
                  'dataSourceIdentifier': '264492c0-5328-42fd-9b38-9ad7997b61fb',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Automatic by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateOffOp'
                    }
                  },
                  'dataSourceIdentifier': '74cd964d-0fc6-4a96-9259-37dcd485ff89',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Offline by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateOpOp'
                    }
                  },
                  'dataSourceIdentifier': '5e91bd2f-358b-4997-93cc-152558b270b7',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Operator by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateAutOp'
                    }
                  },
                  'dataSourceIdentifier': '01b63465-7f65-4ff7-abb6-53ab3964a63c',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Operation Mode to Automatic by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOpAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateOpAct'
                    }
                  },
                  'dataSourceIdentifier': '4e76946f-6247-4956-abf2-aee2c9ebed5a',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Operator Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateAutAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateAutAct'
                    }
                  },
                  'dataSourceIdentifier': 'd3808f09-46cc-462d-a220-6ca382adc3fe',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Automatic Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'StateOffAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.StateOffAct'
                    }
                  },
                  'dataSourceIdentifier': 'f2ef7fca-408b-43f8-9f7d-c80265801591',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Offline Mode Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcChannel',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.SrcChannel'
                    }
                  },
                  'dataSourceIdentifier': '7a2f7363-2f01-4a3f-975f-ea77a2356b3e',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Selection of the active Service Source Mode interaction channel',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.SrcExtAut'
                    }
                  },
                  'dataSourceIdentifier': 'e953d3dc-c765-4c79-9aae-841affd19e64',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to External by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntAut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.SrcIntAut'
                    }
                  },
                  'dataSourceIdentifier': '195cf0c5-0061-44cf-ba31-5c787b106320',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to Internal by automatic interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.SrcIntOp'
                    }
                  },
                  'dataSourceIdentifier': '9b4e1643-1c0e-4d95-b826-d7c54b6eac6c',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to Intern by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.SrcExtOp'
                    }
                  },
                  'dataSourceIdentifier': 'f093a16f-8cf1-475a-9072-23874c5f9e72',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Set Source Mode to External by operator interaction',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcExtAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.SrcExtAct'
                    }
                  },
                  'dataSourceIdentifier': '70a41028-3e3e-4a69-95a3-91649c7d20ba',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'External Source Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'SrcIntAct',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.SrcIntAct'
                    }
                  },
                  'dataSourceIdentifier': '409c2ea6-eeb7-47f3-be0b-a3cfc838655f',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Internal Source Active',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VExt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VExt'
                    }
                  },
                  'dataSourceIdentifier': '7ce51bd1-183c-4035-ab3d-524ab913205b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Extern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VOp',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VOp'
                    }
                  },
                  'dataSourceIdentifier': 'b78b94f2-d7e7-4ff0-a00e-4d4c016241ff',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Manual Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VInt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VInt'
                    }
                  },
                  'dataSourceIdentifier': 'a4827ab9-25f0-4007-85ec-c88e4d176463',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Intern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VReq',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VReq'
                    }
                  },
                  'dataSourceIdentifier': 'ed0d7bb4-5de3-4723-b2be-4f571b5be3e6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Request Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VFbk',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VFbk'
                    }
                  },
                  'dataSourceIdentifier': 'f636f35f-6160-46d4-a21a-9d77c032136f',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Feedback Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VOut',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VOut'
                    }
                  },
                  'dataSourceIdentifier': '369331e6-4dc0-439d-a78c-a47784179a0d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Output Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '6e40a348-a469-402b-99fb-51826d6e627d',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': '16d50516-70bd-4134-8101-d43a6ab67735',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VMin'
                    }
                  },
                  'dataSourceIdentifier': '730890bc-5f6b-4561-8f1d-77d2e9bd6258',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VMax'
                    }
                  },
                  'dataSourceIdentifier': 'fc06efc0-e42a-419b-ab05-d849098ec45f',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '61984f21-a50f-42f7-a127-e06f54bd5b41',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'Sync',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcParam_Integral1_offset.Sync'
                    }
                  },
                  'dataSourceIdentifier': '5d3ff6c7-1349-4a88-bf64-b18084b6bf6b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': 'false',
                  'description': 'Synchronization Mode',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/OperationElement/AnaServParam',
              'name': 'AnaProcParam_Integral1_offset',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'reportValues': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaReportValue_Integral1_rvTime',
                  'defaultValue': 'AnaReportValue_Integral1_rvTime',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Final integration time',
                  'defaultValue': 'Final integration time',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvTime.WQC'
                    }
                  },
                  'dataSourceIdentifier': '0316002c-e0a5-4b34-98b0-6d90bd48f15f',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'Text',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvTime.Text'
                    }
                  },
                  'dataSourceIdentifier': '0fd17274-7cb5-41fe-9a28-d8cd32f03e6b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/StringView',
              'name': 'AnaReportValue_Integral1_rvTime',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaReportValue_Integral1_rvOutScaled',
                  'defaultValue': 'AnaReportValue_Integral1_rvOutScaled',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Final scaled value out',
                  'defaultValue': 'Final scaled value out',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutScaled.WQC'
                    }
                  },
                  'dataSourceIdentifier': '086090b4-508a-47ca-9999-f21626a9fc15',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutScaled.V'
                    }
                  },
                  'dataSourceIdentifier': '505cd811-9a9c-4895-885e-cd9b3f98f19e',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutScaled.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '2bd0dd3f-ccf9-4ad6-b06f-3a811c815911',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutScaled.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'd37a70e8-c3fb-48ac-b4fd-6fec1866edbb',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutScaled.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '77ca4cd3-727f-4e81-9330-019380d7cfc6',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'AnaReportValue_Integral1_rvOutScaled',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaReportValue_Integral1_rvOutIntegral',
                  'defaultValue': 'AnaReportValue_Integral1_rvOutIntegral',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Final integral value out',
                  'defaultValue': 'Final integral value out',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutIntegral.WQC'
                    }
                  },
                  'dataSourceIdentifier': 'b17b4d08-fb56-4f9f-9c3e-e5ee858f832b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutIntegral.V'
                    }
                  },
                  'dataSourceIdentifier': 'f2c14e0e-55b8-48ab-8827-89de8cc163dd',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutIntegral.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '4ccf3b2c-c249-40ff-a411-ac8266c3714e',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutIntegral.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'efa52683-d5ab-40b7-a8da-94ae55f65781',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaReportValue_Integral1_rvOutIntegral.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '51d5812e-1744-4da5-b757-ccb51b25a2b4',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'AnaReportValue_Integral1_rvOutIntegral',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'processValuesIn': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcessValueIn_Integral1_pv',
                  'defaultValue': 'AnaProcessValueIn_Integral1_pv',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Analog Process Value Input',
                  'defaultValue': 'Analog Process Value Input',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueIn_Integral1_pv.WQC'
                    }
                  },
                  'dataSourceIdentifier': 'aa4ac030-e15c-4f61-aed7-ea21c5969b9b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VExt',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueIn_Integral1_pv.VExt'
                    }
                  },
                  'dataSourceIdentifier': '2afd4086-4be1-45bf-b1f3-88650f8de3a0',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Extern Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueIn_Integral1_pv.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '819292f2-9147-4a1d-acfe-bc945455fa91',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueIn_Integral1_pv.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'c038d934-1587-4671-970e-23fb53c5581b',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '10',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueIn_Integral1_pv.VUnit'
                    }
                  },
                  'dataSourceIdentifier': 'e7c88835-b67c-494b-8087-087acd8ce5c4',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '1353',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/InputElement/AnaProcessValueIn',
              'name': 'AnaProcessValueIn_Integral1_pv',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'processValuesOut': [
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcessValueOut_Integral1_pvOutIntegral',
                  'defaultValue': 'AnaProcessValueOut_Integral1_pvOutIntegral',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'Integral of pv',
                  'defaultValue': 'Integral of pv',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutIntegral.WQC'
                    }
                  },
                  'dataSourceIdentifier': '172fbfeb-c44e-49af-9c69-fd6d006f1970',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutIntegral.V'
                    }
                  },
                  'dataSourceIdentifier': '13fd2313-1591-49b6-8deb-66ce9cbd3ea5',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutIntegral.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': 'bc86e1cc-04e2-4bb7-837b-4a60d50f4453',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutIntegral.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': '18c6c2df-efd7-4fd1-9bbd-9cc8ed7c7b60',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutIntegral.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '1bc1e77b-2f70-48e6-ac9b-299b4eda3234',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'AnaProcessValueOut_Integral1_pvOutIntegral',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            },
            {
              'dataItems': [
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagName',
                  'value': 'AnaProcessValueOut_Integral1_pvOutScaled',
                  'defaultValue': 'AnaProcessValueOut_Integral1_pvOutScaled',
                  'description': 'TagName Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:string',
                  'name': 'TagDescription',
                  'value': 'scaled value of pv',
                  'defaultValue': 'scaled value of pv',
                  'description': 'TagDescription Field',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'WQC',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutScaled.WQC'
                    }
                  },
                  'dataSourceIdentifier': '983c914d-f53d-44d4-ac94-c7c2a5bf1998',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '255',
                  'description': 'Worst Quality Code variable',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'V',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutScaled.V'
                    }
                  },
                  'dataSourceIdentifier': '5e6049c3-0e8c-4991-8997-06bdba542439',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMin',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutScaled.VSclMin'
                    }
                  },
                  'dataSourceIdentifier': '6a18a79b-0e4d-465f-9e29-a81c012faa39',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Low Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VSclMax',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutScaled.VSclMax'
                    }
                  },
                  'dataSourceIdentifier': 'a8752e34-bb8e-4c2a-9c7a-b04772277eba',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'High Limit value',
                  'pimadIdentifier': 'TODO'
                },
                {
                  'initialized': true,
                  'responseHandler': {
                    'responseVendor': {
                      'errorResponseFactory': {},
                      'dummyResponseFactory': {},
                      'successResponseFactory': {},
                      'warningResponseFactory': {}
                    }
                  },
                  'dataType': 'xs:IDREF',
                  'name': 'VUnit',
                  'cIData': {
                    'initialized': true,
                    'responseHandler': {
                      'responseVendor': {
                        'errorResponseFactory': {},
                        'dummyResponseFactory': {},
                        'successResponseFactory': {},
                        'warningResponseFactory': {}
                      }
                    },
                    'nodeId': {
                      'initialized': true,
                      'responseHandler': {
                        'responseVendor': {
                          'errorResponseFactory': {},
                          'dummyResponseFactory': {},
                          'successResponseFactory': {},
                          'warningResponseFactory': {}
                        }
                      },
                      'namespaceIndex': 'urn:localhost:NodeOPCUA-Client',
                      'identifier': 'Integral1.AnaProcessValueOut_Integral1_pvOutScaled.VUnit'
                    }
                  },
                  'dataSourceIdentifier': '9af23247-c0c9-4b02-a901-1c65c00ecf27',
                  'metaModelRef': 'MTPCommunicationICLib/DataItem/OPCUAItem',
                  'defaultValue': '0',
                  'description': 'Enumeration value of the unit list',
                  'pimadIdentifier': 'TODO'
                }
              ],
              'metaModelRef': 'MTPDataObjectSUCLib/DataAssembly/IndicatorElement/AnaView',
              'name': 'AnaProcessValueOut_Integral1_pvOutScaled',
              'initialized': true,
              'responseVendor': {
                'errorResponseFactory': {},
                'dummyResponseFactory': {},
                'successResponseFactory': {},
                'warningResponseFactory': {}
              }
            }
          ],
          'dataSourceIdentifier': '26ab2481-e3b1-48b0-9619-de2f985b8156',
          'pimadIdentifier': 'TODO'
        }
      ],
      'dataSourceIdentifier': '5cbfb281-add2-4cc6-87a6-51887937dc5e',
      'pimadIdentifier': '5cbdd210-2ef1-4bac-aeb4-d21f23a1e5ec'
    }
  ],
  'initialized': true
};
