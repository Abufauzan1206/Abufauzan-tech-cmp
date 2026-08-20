/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #025
 *
 * File: rc025BalanceSheetTrialBalanceCachePatch.js
 * Version: 1.0.0
 *
 * Balance Sheet Trial Balance Cache Bust
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
        "RC025 - BALANCE SHEET TRIAL BALANCE CACHE"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`    generateTrialBalance
} from "./trialBalanceEngine.js";`,

            replace:
`    generateTrialBalance
} from "./trialBalanceEngine.js?rc024a";`

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
