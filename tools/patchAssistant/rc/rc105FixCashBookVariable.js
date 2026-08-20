/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC105 - FIX CASH BOOK TEST VARIABLE
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testCashBookTransactionIntegration.js",
        mode: "regex",
        search: "\\bcashBook\\b",
        replace: "result",
        flags: "g"
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC105 - FIX CASH BOOK TEST VARIABLE");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC105 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
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
