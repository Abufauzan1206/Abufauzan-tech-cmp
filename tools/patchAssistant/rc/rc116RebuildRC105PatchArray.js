import { transaction } from "../patchEngine.js";

const BT = String.fromCharCode(96);

const fields = [
    "success",
    "account",
    "receipts",
    "payments",
    "totalReceipts",
    "totalPayments",
    "closingBalance",
    "totalTransactions"
];

const cleanPatchArray = [
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: BT + "import \\\\{ generateCashBook \\\\} from \"\\\\./js\\\\/business\\\\/(?:resultEngine|cashBookEngine)\\\\.js\";" + BT,
        replace: BT + "import { generateCashBook } from \"./js/business/cashBookEngine.js\";" + BT
    },
    ...fields.map((field) => ({
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: BT + "(?:cashBook|result)\\." + field + BT,
        replace: BT + "result." + field + BT
    }))
];

const replacement =
    "const patches = " +
    JSON.stringify(cleanPatchArray, null, 4) +
    ";";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "const patches = \\[[\\s\\S]*?\\];",
        replace: replacement
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC116 - REBUILD RC105 PATCH ARRAY");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC116 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC116 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC116 PATCH COMPLETE");
    console.log("=========================================");
}

run();
