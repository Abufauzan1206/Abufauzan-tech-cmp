/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #011
 *
 * File: rc011BalanceSheetIncomeDebugPatch.js
 * Version: 1.0.0
 *
 * Balance Sheet Income Debug Patch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/balanceSheetEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC011 - BALANCE SHEET INCOME DEBUG"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`        totalEquity,`,

            replace:
`        totalEquity,

        incomeReport,`
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
