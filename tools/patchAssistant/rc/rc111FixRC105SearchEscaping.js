/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC111 - FIX RC105 SEARCH ESCAPING
 * =====================================================
 *
 * Corrects the eight RC105 search expressions from
 * four source-level backslashes to two.
 *
 * Target test is already valid.
 * Only RC105 is modified through Patch Engine.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`search: \`(?:cashBook|result)\\{4}\.(success|account|receipts|payments|totalReceipts|totalPayments|closingBalance|totalTransactions)\``,
        replace: String.raw`search: \`(?:cashBook|result)\\.$1\``
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC111 - FIX RC105 SEARCH ESCAPING");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC111 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;
        console.log("=========================================");
        console.log("RC111 PATCH FAIL");
        console.log("=========================================");
        return;
    }

    console.log("=========================================");
    console.log("RC111 PATCH COMPLETE");
    console.log("=========================================");
}

run();
