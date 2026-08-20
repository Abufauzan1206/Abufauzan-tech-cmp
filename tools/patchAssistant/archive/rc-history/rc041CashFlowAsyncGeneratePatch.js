/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * Developer Tools
 *
 * File: rc041CashFlowAsyncGeneratePatch.js
 * Version: 1.0.0
 *
 * RC041 - Cash Flow Async Generate Patch
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
        "RC041 - CASH FLOW ASYNC GENERATE"
    );

    console.log(
        "========================================="
    );

    try {

        const result =
            await patch({

                path: file,

                search:
`    static generate() {

        const trialBalance =
            CMPTrialBalanceEngine.generate();`,

                replace:
`    static async generate() {

        const trialBalance =
            await generateTrialBalance();`

            });

        console.log(
            "ASYNC GENERATE PATCH: PASS"
        );

        console.log(result);

    }
    catch (error) {

        console.log(
            "ASYNC GENERATE PATCH: FAIL"
        );

        console.log(
            error.message
        );

        process.exitCode = 1;

    }

}

run();
