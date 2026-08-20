/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC093 - NORMALIZE PERIOD LOCK RESULT
 *
 * Ensure lockPeriod() returns the same LOCKED status
 * already persisted to the accounting period.
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/accountingPeriodEngine.js",
        mode: "exact",

        search:
`    return {
        success: true,
        locked: true,
        message:
            "Accounting period locked successfully."
    };`,

        replace:
`    return {
        success: true,
        locked: true,
        status: "LOCKED",
        periodId: id,
        message:
            "Accounting period locked successfully."
    };`
    }
];

async function run() {
    console.log("=========================================");
    console.log("ABUFAUZAN TECH CMP");
    console.log("RC093 - NORMALIZE PERIOD LOCK RESULT");
    console.log("=========================================");

    const result =
        await transaction(patches);

    console.log("RC093 TRANSACTION RESULT:");

    console.log(
        JSON.stringify(result, null, 2)
    );

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC093 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC093 PATCH COMPLETE");
    console.log("=========================================");
}

run();
