/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC105 - REPAIR CASH BOOK INTEGRATION TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`import \\\\{ generateCashBook \\\\} from \"\\\\./js\\\\/business\\\\/(?:resultEngine|cashBookEngine)\\\\.js\";`",
        "replace": "`import { generateCashBook } from \"./js/business/cashBookEngine.js\";`"
    },
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`(?:cashBook|result)\\.success`",
        "replace": "`result.success`"
    },
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`(?:cashBook|result)\\.account`",
        "replace": "`result.account`"
    },
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`(?:cashBook|result)\\.receipts`",
        "replace": "`result.receipts`"
    },
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`(?:cashBook|result)\\.payments`",
        "replace": "`result.payments`"
    },
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`(?:cashBook|result)\\.totalReceipts`",
        "replace": "`result.totalReceipts`"
    },
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`(?:cashBook|result)\\.totalPayments`",
        "replace": "`result.totalPayments`"
    },
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`(?:cashBook|result)\\.closingBalance`",
        "replace": "`result.closingBalance`"
    },
    {
        "path": "testCashBookTransactionIntegration.js",
        "mode": "regex",
        "search": "`(?:cashBook|result)\\.totalTransactions`",
        "replace": "`result.totalTransactions`"
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC105 - REPAIR CASH BOOK INTEGRATION TEST");
    console.log("=========================================");

    const fs = await import("node:fs/promises");
    const target = await fs.readFile("testCashBookTransactionIntegration.js", "utf8");

    const alreadyValid =
        target.includes('import { generateCashBook } from "./js/business/cashBookEngine.js";') &&
        target.includes("result.success") &&
        target.includes("result.account") &&
        target.includes("result.receipts") &&
        target.includes("result.payments") &&
        target.includes("result.totalReceipts") &&
        target.includes("result.totalPayments") &&
        target.includes("result.closingBalance") &&
        target.includes("result.totalTransactions");

    const response = alreadyValid
        ? {
            success: true,
            count: 0,
            results: [],
            alreadyValid: true
        }
        : await transaction(patches);

    console.log("RC105 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC105 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC105 PATCH COMPLETE");
    console.log("=========================================");
}

run();
