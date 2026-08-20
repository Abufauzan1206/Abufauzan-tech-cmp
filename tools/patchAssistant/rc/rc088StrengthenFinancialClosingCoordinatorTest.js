/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC088 - STRENGTHEN FINANCIAL CLOSING COORDINATOR TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testFinancialClosingCoordinator.js",
        mode: "regex",

        search: `console\\.log\\(
    "Audit Action:",
    report\\.audit\\.action
\\);`,

        replace: `console.log(
    "Audit Action:",
    report.audit.action
);

if (report.year !== 2026) {
    throw new Error(
        \`Expected closing year 2026, received \${report.year}\`
    );
}

if (report.status !== "CLOSED") {
    throw new Error(
        \`Expected closing status CLOSED, received \${report.status}\`
    );
}

if (!report.trialBalance || report.trialBalance.balanced !== true) {
    throw new Error(
        "Trial Balance verification failed."
    );
}

if (
    !report.closingJournal ||
    !Array.isArray(report.closingJournal.entries)
) {
    throw new Error(
        "Closing journal was not generated correctly."
    );
}

if (
    !report.closingPosting ||
    report.closingPosting.success !== true
) {
    throw new Error(
        "Closing journal was not posted successfully."
    );
}

if (
    !report.openingBalance ||
    !Array.isArray(report.openingBalance.openingBalances)
) {
    throw new Error(
        "Opening balance generation failed."
    );
}

if (
    !Array.isArray(report.openingEntries) ||
    report.openingEntries.length === 0
) {
    throw new Error(
        "Opening balance entries were not generated."
    );
}

if (
    !report.nextFinancialYear ||
    report.nextFinancialYear.success !== true
) {
    throw new Error(
        "Next financial year was not created."
    );
}

if (
    !report.nextAccountingPeriod ||
    report.nextAccountingPeriod.success !== true
) {
    throw new Error(
        "Next accounting period was not created."
    );
}

if (
    !report.openingPosting ||
    report.openingPosting.success !== true
) {
    throw new Error(
        "Opening balance journal was not posted successfully."
    );
}

if (
    !report.periodLock ||
    report.periodLock.locked !== true
) {
    throw new Error(
        "Accounting period lock verification failed."
    );
}

if (
    !report.financialYear ||
    report.financialYear.status !== "CLOSED"
) {
    throw new Error(
        "Financial year was not persisted as CLOSED."
    );
}

if (
    !report.audit ||
    report.audit.action !== "YEAR_CLOSE"
) {
    throw new Error(
        "YEAR_CLOSE audit action was not recorded."
    );
}

console.log("Year Verification: PASS");
console.log("Closing Journal Generation: PASS");
console.log("Closing Journal Posting: PASS");
console.log("Opening Balance Generation: PASS");
console.log("Opening Entries: PASS");
console.log("Next Financial Year: PASS");
console.log("Next Accounting Period: PASS");
console.log("Opening Journal Posting: PASS");
console.log("Period Lock Verification: PASS");
console.log("Financial Year Close Verification: PASS");
console.log("YEAR_CLOSE Audit Verification: PASS");`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC088 - STRENGTHEN FINANCIAL CLOSING COORDINATOR TEST");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC088 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC088 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC088 PATCH COMPLETE");
    console.log("=========================================");
}

run();
