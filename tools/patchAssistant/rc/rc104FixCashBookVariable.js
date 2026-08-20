/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC104-FIX - CORRECT CASH BOOK TEST VARIABLE
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: `console\\.log\\("Cash Book Generation Verification: PASS"\\);[\\s\\S]*?console\\.log\\("Transaction Integration: PASS"\\);`,
        replace: (match) =>
            match.replace(/\bcashBook\b/g, "result")
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC104-FIX - CORRECT CASH BOOK TEST VARIABLE");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC104-FIX TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC104-FIX PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC104-FIX PATCH COMPLETE");
    console.log("=========================================");
}

run();
