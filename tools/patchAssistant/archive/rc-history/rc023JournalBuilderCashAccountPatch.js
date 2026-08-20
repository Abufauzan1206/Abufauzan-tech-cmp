/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #023
 *
 * File: rc023JournalBuilderCashAccountPatch.js
 * Version: 1.0.0
 *
 * Canonical Cash Account Name
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const file =
    "js/business/journalBuilderEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC023 - JOURNAL BUILDER CASH ACCOUNT"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: file,

            search:
`                            account: "Cash",`,

            replace:
`                            account: "Cash Account",`

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
