/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC108 - REPAIR RC105 CASH BOOK PATCH CONTRACT
 * =====================================================
 *
 * Purpose:
 * Repair RC105 so it recognizes both the obsolete
 * and current Cash Book integration test contract.
 *
 * RC105 is repaired through Patch Engine.
 * The Cash Book test itself is NOT manually modified.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "search: `cashBook\\\\\\\\.success`",
        replace: "search: `(?:cashBook|result)\\\\\\\\.success`"
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "search: `cashBook\\\\\\\\.account`",
        replace: "search: `(?:cashBook|result)\\\\\\\\.account`"
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "search: `cashBook\\\\\\\\.receipts`",
        replace: "search: `(?:cashBook|result)\\\\\\\\.receipts`"
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "search: `cashBook\\\\\\\\.payments`",
        replace: "search: `(?:cashBook|result)\\\\\\\\.payments`"
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "search: `cashBook\\\\\\\\.totalReceipts`",
        replace: "search: `(?:cashBook|result)\\\\\\\\.totalReceipts`"
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "search: `cashBook\\\\\\\\.totalPayments`",
        replace: "search: `(?:cashBook|result)\\\\\\\\.totalPayments`"
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "search: `cashBook\\\\\\\\.closingBalance`",
        replace: "search: `(?:cashBook|result)\\\\\\\\.closingBalance`"
    },
    {
        path: "tools/patchAssistant/rc/rc105RepairCashBookIntegrationTest.js",
        mode: "regex",
        search: "search: `cashBook\\\\\\\\.totalTransactions`",
        replace: "search: `(?:cashBook|result)\\\\\\\\.totalTransactions`"
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC108 - REPAIR RC105 CASH BOOK PATCH CONTRACT");
    console.log("=========================================");

    const response = await transaction(patches);

    console.log("RC108 TRANSACTION RESULT:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC108 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC108 PATCH COMPLETE");
    console.log("=========================================");
}

run();
