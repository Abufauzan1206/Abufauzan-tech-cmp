/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #009
 *
 * File: rc009BalanceSheetDebugOutputPatch.js
 * Version: 1.0.0
 *
 * Balance Sheet Debug Output Patch
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
        "RC009 - BALANCE SHEET DEBUG OUTPUT"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`    const result =
        await generateBalanceSheet();`,

            replace:
`    const result =
        await generateBalanceSheet();

    console.log(
        "BALANCE SHEET RESULT:",
        result
    );`
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
