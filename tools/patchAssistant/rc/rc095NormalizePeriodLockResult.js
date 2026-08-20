/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC095 - NORMALIZE PERIOD LOCK RESULT
 * =====================================================
 */

import { transaction } from "../patchEngine.js";

const patches = [
    {
        path: "js/business/accountingPeriodEngine.js",
        mode: "regex",

        search:
`return \\{\\s*success:\\s*true,\\s*locked:\\s*true,\\s*message:\\s*"Accounting period locked successfully\\."\\s*\\};`,

        replace:
`return {
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
    console.log("RC095 - NORMALIZE PERIOD LOCK RESULT");
    console.log("=========================================");

    const result = await transaction(patches);

    console.log("RC095 TRANSACTION RESULT:");
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
        process.exitCode = 1;

        console.log("=========================================");
        console.log("RC095 PATCH FAIL");
        console.log("=========================================");

        return;
    }

    console.log("=========================================");
    console.log("RC095 PATCH COMPLETE");
    console.log("=========================================");
}

run();
