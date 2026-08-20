/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 *
 * RC Patch #021
 *
 * Balance Sheet Income Engine Cache Verification Patch
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
        "RC021 - BALANCE SHEET INCOME ENGINE CACHE"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`import {
    generateIncomeExpenditure
} from "./incomeExpenditureEngine.js";`,

            replace:
`import {
    generateIncomeExpenditure
} from "./incomeExpenditureEngine.js?rc020";`

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
