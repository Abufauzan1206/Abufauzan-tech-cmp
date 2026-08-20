/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC102 - STRENGTHEN STATEMENT OF CHANGES IN EQUITY TEST
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testStatementOfChangesInEquity.js",
        mode: "regex",
        search: `if \\(report\\.currentSurplus !== 10000\\)[\\s\\S]*?console\\.log\\("STATEMENT OF CHANGES IN EQUITY TEST: PASS"\\);`,
        replace: `if (report.openingEquity !== 50000) {
    throw new Error(
        "Opening equity verification failed."
    );
}

if (report.memberCapital !== 10000) {
    throw new Error(
        "Member capital verification failed."
    );
}

if (report.currentSurplus !== 10000) {
    throw new Error(
        "Current surplus verification failed."
    );
}

if (report.adjustments !== 0) {
    throw new Error(
        "Adjustments verification failed."
    );
}

if (report.closingEquity !== 70000) {
    throw new Error(
        "Closing equity verification failed."
    );
}

const expectedClosingEquity =
    report.openingEquity +
    report.memberCapital +
    report.currentSurplus +
    report.adjustments;

if (report.closingEquity !== expectedClosingEquity) {
    throw new Error(
        "Closing equity calculation is incorrect."
    );
}

console.log("");
console.log("Opening Equity Verification: PASS");
console.log("Member Capital Verification: PASS");
console.log("Current Surplus Verification: PASS");
console.log("Adjustments Verification: PASS");
console.log("Closing Equity Verification: PASS");
console.log("Closing Equity Calculation Verification: PASS");
console.log("Statement of Changes in Equity Verification: PASS");`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC102 - STRENGTHEN STATEMENT OF CHANGES IN EQUITY TEST");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC102 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC102 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC102 PATCH COMPLETE");
    console.log("=========================================");
}

run();
