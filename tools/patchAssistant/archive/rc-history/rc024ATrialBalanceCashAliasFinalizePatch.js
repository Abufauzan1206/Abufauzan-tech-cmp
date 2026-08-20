/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #024A
 *
 * File: rc024ATrialBalanceCashAliasFinalizePatch.js
 * Version: 1.0.0
 *
 * Finalize legacy Cash account normalization
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/trialBalanceEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC024A - TRIAL BALANCE CASH ALIAS FINALIZE"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`                accounts[entry.account] = {`,

            replace:
`                accounts[accountName] = {`

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
