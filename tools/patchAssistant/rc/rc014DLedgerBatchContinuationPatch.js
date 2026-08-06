/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 *
 * RC Patch #014D (Continuation)
 *
 * File: rc014DLedgerBatchContinuationPatch.js
 * Version: 1.0.0
 *
 * Inject sandboxId into Ledger Batch
 * =====================================================
 */

import { patch } from "../patchEngine.js";

const TARGET_FILE =
    "js/business/ledgerBatchPostingEngine.js";

async function run() {

    console.log(
        "========================================="
    );

    console.log(
        "ABUFAUZAN TECH CMP"
    );

    console.log(
        "RC014D - LEDGER BATCH CONTINUATION"
    );

    console.log(
        "========================================="
    );

    try {

        await patch({

            path: TARGET_FILE,

            search: `const batch = {
        batchNumber,
        entries,
        totalDebit,
        totalCredit,
        createdBy,
        status: "POSTED",
        createdAt: new Date().toISOString()
    };`,

            replace: `const batch = {
        batchNumber,
        entries,

        ...(options.sandboxId
            ? {
                sandboxId:
                    options.sandboxId
            }
            : {}),

        totalDebit,
        totalCredit,
        createdBy,
        status: "POSTED",
        createdAt: new Date().toISOString()
    };`

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
