/**
 * =====================================================
 * ABUFAUZAN TECH CMP
 *
 * RC Patch #022
 *
 * Balance Sheet Test Cache Verification Patch
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
        "RC022 - BALANCE SHEET TEST CACHE"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`from "./js/business/balanceSheetEngine.js?v=rc013";`,

            replace:
`from "./js/business/balanceSheetEngine.js?v=rc022";`

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
