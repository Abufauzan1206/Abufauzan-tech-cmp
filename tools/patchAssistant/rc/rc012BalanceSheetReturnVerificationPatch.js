/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #012
 *
 * File: rc012BalanceSheetReturnVerificationPatch.js
 * Version: 1.0.0
 *
 * Balance Sheet Return Verification Patch
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
        "RC012 - BALANCE SHEET RETURN VERIFY"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`        incomeReport,`,

            replace:
`        incomeReport,

        debugMarker:
            "RC012_ACTIVE",`
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
