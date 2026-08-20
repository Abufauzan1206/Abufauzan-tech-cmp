/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC109 - FIX RC105 IMPORT CONTRACT
 * =====================================================
 *
 * Purpose:
 * Repair the stale RC105 import search contract.
 *
 * Current target test already uses:
 *   ./js/business/cashBookEngine.js
 *
 * RC105 must therefore accept both the obsolete
 * resultEngine import and the current cashBookEngine import.
 *
 * Patch Engine only.
 * No manual target-file editing.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: `resultEngine`,
        replace: `(?:resultEngine|cashBookEngine)`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC109 - FIX RC105 IMPORT CONTRACT");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC109 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC109 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC109 PATCH COMPLETE");
    console.log("=========================================");
}

run();
