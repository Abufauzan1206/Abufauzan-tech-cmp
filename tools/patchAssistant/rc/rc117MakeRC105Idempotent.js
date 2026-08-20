/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC117 - MAKE RC105 IDEMPOTENT
 * =====================================================
 *
 * RC105 must not fail when the Cash Book integration
 * test has already been repaired.
 *
 * Target file modified ONLY through Patch Engine.
 * The Cash Book integration test is NOT modified.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: 'const response = await transaction\\(patches\\);',
        replace: `const fs = await import("node:fs/promises");
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
        : await transaction(patches);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC117 - MAKE RC105 IDEMPOTENT");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC117 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC117 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC117 PATCH COMPLETE");
    console.log("=========================================");
}

run();
