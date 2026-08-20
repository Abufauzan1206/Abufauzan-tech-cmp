/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC108 - VERIFY CASH BOOK INTEGRATION CONTRACT
 * =====================================================
 *
 * Purpose:
 * Verify that RC068 Cash Book integration test already
 * conforms to the current Cash Book Engine contract.
 *
 * This is intentionally a verification patch.
 * It does NOT modify an already-correct test.
 */

import fs from "fs";

const target = "testCashBookTransactionIntegration.js";

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC108 - VERIFY CASH BOOK CONTRACT");
    console.log("=========================================");

    const source = fs.readFileSync(target, "utf8");

    const checks = [
        {
            name: "Cash Book Engine Import",
            test: /import\s*\{\s*generateCashBook\s*\}\s*from\s*["']\.\/js\/business\/cashBookEngine\.js["']/
        },
        {
            name: "Cash Book Generation Result",
            test: /const\s+result\s*=\s*await\s+generateCashBook\s*\(\s*\)/
        },
        {
            name: "Result Success Contract",
            test: /result\.success/
        },
        {
            name: "Canonical Account Contract",
            test: /result\.account/
        },
        {
            name: "Receipts Contract",
            test: /result\.receipts/
        },
        {
            name: "Payments Contract",
            test: /result\.payments/
        },
        {
            name: "Total Receipts Contract",
            test: /result\.totalReceipts/
        },
        {
            name: "Total Payments Contract",
            test: /result\.totalPayments/
        },
        {
            name: "Closing Balance Contract",
            test: /result\.closingBalance/
        },
        {
            name: "Transaction Count Contract",
            test: /result\.totalTransactions/
        }
    ];

    let failed = false;

    for (const check of checks) {
        if (check.test.test(source)) {
            console.log(`${check.name}: PASS`);
        } else {
            console.log(`${check.name}: FAIL`);
            failed = true;
        }
    }

    const obsoleteReferences = [
        /generateCashBook.*resultEngine/,
        /cashBook\.success/,
        /cashBook\.account/,
        /cashBook\.receipts/,
        /cashBook\.payments/,
        /cashBook\.totalReceipts/,
        /cashBook\.totalPayments/,
        /cashBook\.closingBalance/,
        /cashBook\.totalTransactions/
    ];

    const obsoleteFound = obsoleteReferences.some(pattern => pattern.test(source));

    if (obsoleteFound) {
        console.log("Obsolete RC105 Contract References: FAIL");
        failed = true;
    } else {
        console.log("Obsolete RC105 Contract References: PASS");
    }

    console.log("=========================================");

    if (failed) {
        console.log("RC108 CONTRACT VERIFICATION: FAIL");
        console.log("=========================================");
        process.exitCode = 1;
        return;
    }

    console.log("RC108 CONTRACT VERIFICATION: PASS");
    console.log("RC105/RC106/RC107 PATCH CHAIN: OBSOLETE");
    console.log("CURRENT TEST CONTRACT: VALID");
    console.log("=========================================");
}

run();
