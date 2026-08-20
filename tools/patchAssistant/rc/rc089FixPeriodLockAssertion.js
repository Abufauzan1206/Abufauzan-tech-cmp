/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC089 - FIX PERIOD LOCK ASSERTION
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "testFinancialClosingCoordinator.js",
        mode: "exact",

        search: `if (
    !report.periodLock ||
    report.periodLock.locked !== true
) {
    throw new Error(
        "Accounting period lock verification failed."
    );
}`,

        replace: `if (
    !report.periodLock ||
    report.periodLock.status !== "LOCKED"
) {
    throw new Error(
        "Accounting period lock verification failed."
    );
}`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC089 - FIX PERIOD LOCK ASSERTION");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC089 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC089 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC089 PATCH COMPLETE");
    console.log("=========================================");
}

run();
