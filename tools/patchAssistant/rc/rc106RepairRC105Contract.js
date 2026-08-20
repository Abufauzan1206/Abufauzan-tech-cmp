/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC106 - REPAIR RC105 CASH BOOK PATCH CONTRACT
 * =====================================================
 *
 * Purpose:
 * Make RC105 idempotent against the current
 * testCashBookTransactionIntegration.js contract.
 *
 * No manual target-file editing.
 * RC106 modifies RC105 through Patch Engine only.
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`import \\\\{ generateCashBook \\\\} from "\\\\.\\\\/js\\\\/business\\\\/(?:resultEngine|cashBookEngine)\\\\.js";\``,
        replace: `search: \`import \\\\{ generateCashBook \\\\} from "\\\\.\\\\/js\\\\/business\\\\/(?:resultEngine|cashBookEngine)\\\\.js";\``
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`cashBook\\\\.success\``,
        replace: `search: \`(?:cashBook|result)\\\\.success\``
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`cashBook\\\\.account\``,
        replace: `search: \`(?:cashBook|result)\\\\.account\``
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`cashBook\\\\.receipts\``,
        replace: `search: \`(?:cashBook|result)\\\\.receipts\``
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`cashBook\\\\.payments\``,
        replace: `search: \`(?:cashBook|result)\\\\.payments\``
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`cashBook\\\\.totalReceipts\``,
        replace: `search: \`(?:cashBook|result)\\\\.totalReceipts\``
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`cashBook\\\\.totalPayments\``,
        replace: `search: \`(?:cashBook|result)\\\\.totalPayments\``
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`cashBook\\\\.closingBalance\``,
        replace: `search: \`(?:cashBook|result)\\\\.closingBalance\``
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `search: \`cashBook\\\\.totalTransactions\``,
        replace: `search: \`(?:cashBook|result)\\\\.totalTransactions\``
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC106 - REPAIR RC105 CONTRACT");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC106 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC106 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC106 PATCH COMPLETE");
    console.log("=========================================");
}

run();
