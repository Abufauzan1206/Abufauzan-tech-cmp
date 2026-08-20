/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC112 - REPAIR RC105 REGEX ESCAPING
 * =====================================================
 *
 * Purpose:
 * Correct the over-escaped regex expressions inside
 * RC105 so the Patch Engine can match both the obsolete
 * cashBook contract and the current result contract.
 *
 * Target file modified ONLY through Patch Engine.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "const patches = \\[[\\s\\S]*?\\];",
        replace: String.raw`const patches = [
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`import \\\\{ generateCashBook \\\\} from "\\\\.\\\\/js\\\\/business\\\\/(?:resultEngine|cashBookEngine)\\\\.js";\`,
        replace: \`import { generateCashBook } from "./js/business/cashBookEngine.js";\`
    },
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`(?:cashBook|result)\\.success\`,
        replace: \`result.success\`
    },
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`(?:cashBook|result)\\.account\`,
        replace: \`result.account\`
    },
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`(?:cashBook|result)\\.receipts\`,
        replace: \`result.receipts\`
    },
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`(?:cashBook|result)\\.payments\`,
        replace: \`result.payments\`
    },
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`(?:cashBook|result)\\.totalReceipts\`,
        replace: \`result.totalReceipts\`
    },
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`(?:cashBook|result)\\.totalPayments\`,
        replace: \`result.totalPayments\`
    },
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`(?:cashBook|result)\\.closingBalance\`,
        replace: \`result.closingBalance\`
    },
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: \`(?:cashBook|result)\\.totalTransactions\`,
        replace: \`result.totalTransactions\`
    }
];`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC112 - REPAIR RC105 REGEX ESCAPING");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC112 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC112 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC112 PATCH COMPLETE");
    console.log("=========================================");
}

run();
