/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #010
 *
 * File: rc010BalanceSheetDebugReportPatch.js
 * Version: 1.0.0
 *
 * Balance Sheet Debug Report Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "testBalanceSheetEngine.html";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC010 - BALANCE SHEET DEBUG REPORT"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`    if (!result.balanced) {

        throw new Error(
            "Balance sheet is not balanced."
        );

    }`,

            replace:
`    report +=
        JSON.stringify(
            result,
            null,
            4
        );

    report +=
        "\\n\\n";

    if (!result.balanced) {

        throw new Error(
            "Balance sheet is not balanced."
        );

    }`
        });

        console.log(
            "PATCH: PASS"
        );
    }

    catch (error) {

        console.log(
            "PATCH FAIL"
        );

        console.log(
            error.message
        );

    }

}

run();
