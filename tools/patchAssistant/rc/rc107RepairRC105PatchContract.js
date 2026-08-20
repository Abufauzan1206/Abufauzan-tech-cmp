/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC107 - REPAIR RC105 PATCH CONTRACT
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`import \\\\{ generateCashBook \\\\} from "\\\\./js/business/resultEngine\\\\.js";\`,`,
        replace: `search: \`import \\\\{ generateCashBook \\\\} from "\\\\./js/business/cashBookEngine\\\\.js";\`,`
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`cashBook\\\\\\.success\`,`,
        replace: `search: \`result\\\\\\.success\`,`
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`cashBook\\\\\\.account\`,`,
        replace: `search: \`result\\\\\\.account\`,`
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`cashBook\\\\\\.receipts\`,`,
        replace: `search: \`result\\\\\\.receipts\`,`
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`cashBook\\\\\\.payments\`,`,
        replace: `search: \`result\\\\\\.payments\`,`
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`cashBook\\\\\\.totalReceipts\`,`,
        replace: `search: \`result\\\\\\.totalReceipts\`,`
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`cashBook\\\\\\.totalPayments\`,`,
        replace: `search: \`result\\\\\\.totalPayments\`,`
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`cashBook\\\\\\.closingBalance\`,`,
        replace: `search: \`result\\\\\\.closingBalance\`,`
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`cashBook\\\\\\.totalTransactions\`,`,
        replace: `search: \`result\\\\\\.totalTransactions\`,`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC107 - REPAIR RC105 PATCH CONTRACT");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC107 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC107 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC107 PATCH COMPLETE");
    console.log("=========================================");
}

run();
