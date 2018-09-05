import {
    AttributeIds,
    ClientMonitoredItem,
    ClientSession,
    ClientSubscription,
    coerceNodeId,
    DataType,
    OPCUAClient,
    VariantArrayType
} from 'node-opcua-client';


var session;

async function fixModule(endpoint: string, nodeids: string[] = undefined, values = undefined) {

    const client: OPCUAClient = new OPCUAClient({
        endpoint_must_exist: false
    });

    console.log("Connect to", endpoint);
    await client.connect(endpoint);

    session = await client.createSession();
    if (nodeids) {
        let tasks = nodeids.map(value => setOpModeToAutomatic(value));

        Promise.all(tasks).then(() => {
            console.log("all OpModes set");
        }).catch((reason) => {
            console.log("something happened", reason);
        }).then(() => {
            client.disconnect();
        })
    }

    if (values) {
        values.forEach(async item => {
            let result = await session.writeSingleNode(
                item[0],
                {
                    dataType: DataType.Float,
                    value: item[1],
                    arrayType: VariantArrayType.Scalar,
                    dimensions: null
                }
            );
        });
    }
}


async function wait() {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    })
}


async function setOpModeToAutomatic(nodeid) {

    let result = await session.readVariableValue(nodeid);
    console.log("Read OpMode", nodeid.toString(), result.value);

    result = await session.writeSingleNode(
        nodeid,
        {
            dataType: DataType.UInt32,
            value: 16,
            arrayType: VariantArrayType.Scalar,
            dimensions: null
        }
    );
    console.log("Write OpMode", nodeid.toString(), 16, result);

    await wait();

    result = await session.writeSingleNode(
        nodeid,
        {
            dataType: DataType.UInt32,
            value: 64,
            arrayType: VariantArrayType.Scalar,
            dimensions: null
        }
    );
    console.log("Write OpMode", nodeid.toString(), 64, result);


    await wait();


    result = await session.readVariableValue(nodeid);
    console.log("Read OpMode", nodeid.toString(), result.value);
}


let nodeidsReactor = [
    'ns=3;s="AEM01"."MTP_AnaDrv"."OpMode"',
    'ns=3;s="MFH01"."MTP_BinVlv"."OpMode"',
    'ns=3;s="MFH02"."MTP_BinVlv"."OpMode"',
    'ns=3;s="MFH03"."MTP_BinVlv"."OpMode"'];

let valuesReactor = [
    ['ns=3;s="Fill_Level_Max"."MTP"."VExt"', 1.5],
    ['ns=3;s="Stir_Level_Min"."MTP"."VExt"', 0.5],
];

// reactor
//fixModule("opc.tcp://192.168.2.35:4840", nodeidsReactor);
fixModule("opc.tcp://10.6.51.22:4840", nodeidsReactor, valuesReactor);

let nodeids_dosierer = [
    "ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.P001.OpMode.binary",
    "ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.P001_PID.OpMode.binary",
    "ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.V001.OpMode.binary",
    "ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.V002.OpMode.binary",
    "ns=4;s=|var|WAGO 750-8202 PFC200 CS 2ETH RS.App_Dosing.Aktoren.V003.OpMode.binary"
];

// dosierer
//fixModule("opc.tcp://192.168.2.110:4840", nodeids_dosierer);
//fixModule("opc.tcp://10.6.51.21:4840", nodeids_dosierer);




