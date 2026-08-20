/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC110 - FIX RC105 REGEX ESCAPING
 * =====================================================
 *
 * Purpose:
 * Correct over-escaped regex expressions inside RC105.
 *
 * Current RC105 contains:
 *   \\\\.
 *
 * Required Patch Engine regex:
 *   \\.
 *
 * The target Cash Book integration test is already valid.
 * This patch modifies ONLY the RC105 patch definition.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: String.raw`\\\\\.(success|account|receipts|payments|totalReceipts|totalPayments|closingBalance|totalTransactions)`,
        replace: String.raw`\\.$1`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC110 - FIX RC105 REGEX ESCAPING");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC110 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC110 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC110 PATCH COMPLETE");
    console.log("=========================================");
}

run();
