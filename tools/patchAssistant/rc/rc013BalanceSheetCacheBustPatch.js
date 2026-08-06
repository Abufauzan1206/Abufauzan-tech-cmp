/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #013
 *
 * File: rc013BalanceSheetCacheBustPatch.js
 * Version: 1.0.0
 *
 * Balance Sheet Cache Bust Patch
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
        "RC013 - BALANCE SHEET CACHE BUST"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`from "./js/business/balanceSheetEngine.js";`,

            replace:
`from "./js/business/balanceSheetEngine.js?v=rc013";`
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
