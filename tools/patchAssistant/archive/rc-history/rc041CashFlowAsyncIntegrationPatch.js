/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: rc041CashFlowAsyncIntegrationPatch.js
 * Version: 1.0.0
 *
 * RC041 - Cash Flow Async Trial Balance Integration
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/cashFlowEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC041 - CASH FLOW ASYNC INTEGRATION"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                search:
`import { CMPTrialBalanceEngine } from "./trialBalanceEngine.js";`,

                replace:
`import {
    generateTrialBalance
} from "./trialBalanceEngine.js";`

            });

        console.log(
            "IMPORT PATCH: PASS"
        );

        console.log(result);

    }
    catch (error) {

        console.log(
            "IMPORT PATCH: FAIL"
        );

        console.log(
            error.message
        );

        process.exitCode = 1;

    }

}

run();
