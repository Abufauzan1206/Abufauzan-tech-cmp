/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC101 - STRENGTHEN INCOME & EXPENDITURE TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testIncomeExpenditure.js",
        mode: "regex",
        search: `if \\(\\s*report\\.netSurplus[\\s\\S]*$`,
        replace: `const contributionIncome = report.incomeAccounts.find(
    account => account.account === "Contribution Income"
);

if (!contributionIncome) {
    throw new Error(
        "Contribution Income missing from Income & Expenditure Statement."
    );
}

if (
    contributionIncome.credit !== 10000 ||
    contributionIncome.debit !== 0
) {
    throw new Error(
        "Contribution Income values are incorrect."
    );
}

if (report.totalIncome !== 10000) {
    throw new Error(
        "Total income is incorrect."
    );
}

if (report.totalExpenses !== 0) {
    throw new Error(
        "Total expenditure is incorrect."
    );
}

if (report.netSurplus !== 10000) {
    throw new Error(
        "Net surplus is incorrect."
    );
}

if (report.netDeficit !== 0) {
    throw new Error(
        "Net deficit is incorrect."
    );
}

console.log("");
console.log("Income Classification Verification: PASS");
console.log("Contribution Income Verification: PASS");
console.log("Total Income Verification: PASS");
console.log("Total Expenditure Verification: PASS");
console.log("Net Surplus Verification: PASS");
console.log("Net Deficit Verification: PASS");
console.log("Income & Expenditure Verification: PASS");
console.log("=========================================");`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC101 - STRENGTHEN INCOME & EXPENDITURE TEST");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC101 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC101 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC101 PATCH COMPLETE");
    console.log("=========================================");
}

run();
