/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC103 - STRENGTHEN BALANCE SHEET TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testBalanceSheet.js",
        mode: "regex",
        search: `console\\.log\\(\\s*report\\.balanced\\s*\\?\\s*"✓ Balance Sheet Balanced"\\s*:\\s*"✗ Balance Sheet NOT Balanced"\\s*\\);`,
        replace: `const cash = report.assets.find(
    account => account.account === "Cash Account"
);

if (!cash) {
    throw new Error(
        "Cash Account missing from Balance Sheet assets."
    );
}

if (cash.balance !== 10000) {
    throw new Error(
        "Cash Account balance is incorrect."
    );
}

if (report.totalAssets !== 10000) {
    throw new Error(
        "Total assets verification failed."
    );
}

if (report.totalLiabilities !== 0) {
    throw new Error(
        "Total liabilities verification failed."
    );
}

if (report.totalEquity !== 10000) {
    throw new Error(
        "Total equity verification failed."
    );
}

const expectedEquity =
    report.totalAssets -
    report.totalLiabilities;

if (report.totalEquity !== expectedEquity) {
    throw new Error(
        "Balance Sheet accounting equation verification failed."
    );
}

if (report.balanced !== true) {
    throw new Error(
        "Balance Sheet should be balanced."
    );
}

console.log("");
console.log("Cash Account Classification Verification: PASS");
console.log("Cash Account Balance Verification: PASS");
console.log("Total Assets Verification: PASS");
console.log("Total Liabilities Verification: PASS");
console.log("Total Equity Verification: PASS");
console.log("Accounting Equation Verification: PASS");
console.log("Balance Sheet Balanced Verification: PASS");
console.log("Balance Sheet Verification: PASS");

console.log("");
console.log(
    report.balanced
        ? "✓ Balance Sheet Balanced"
        : "✗ Balance Sheet NOT Balanced"
);`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC103 - STRENGTHEN BALANCE SHEET TEST");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC103 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC103 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC103 PATCH COMPLETE");
    console.log("=========================================");
}

run();
